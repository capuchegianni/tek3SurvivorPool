import 'reflect-metadata'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

import {
    Collection,
    SlashCommandBuilder,
    AutocompleteInteraction,
    GuildMember,
    PermissionResolvable,
    CommandInteraction,
    Message
} from 'discord.js'
import { glob } from 'glob'

import { TCategory } from '../types/Interaction.js'
import {
    TDiscordEvents,
    TEventType,
    InteractionContextTypes,
    ApplicationIntegrationTypes
} from '../types/DiscordEvents.js'
import { getMetadata } from '../utils/Decorators.js'

import { Bot } from './Bot.js'
import { Logger } from './Logger.js'

const logger = Logger.getInstance('')

export abstract class Module {
    public abstract name: string
    public abstract execute(client: Bot, ...args: any[]): Promise<any>

    public async checkPermissions(command: CommandInteraction | Message, member: GuildMember | null, permissions: PermissionResolvable[]): Promise<boolean> {
        if (!member)
            return true
        for (const permission of permissions) {
            if (!member.permissions.has(permission)) {
                command.reply({
                    content: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action.',
                    ephemeral: true
                })
                return false
            }
        }
        return true
    }
}

export abstract class EventModule extends Module {
    public name: TDiscordEvents = 'raw'
    public eventType!: TEventType

    constructor() {
        super()
        Object.keys(this).forEach(key => {
            const optionKey = key as keyof typeof this
            this[optionKey] = getMetadata(optionKey, this.constructor)
        })
    }
}

export abstract class InteractionModule extends Module {
    public name: string = ''
    public description!: string
    public cooldown!: number
    public category!: TCategory
    public usage!: string
    public integration_types!: InteractionContextTypes[]
    public contexts!: ApplicationIntegrationTypes[]
    public data!: SlashCommandBuilder

    constructor() {
        super()
        Object.keys(this).forEach(key => {
            const optionKey = key as keyof typeof this
            this[optionKey] = getMetadata(optionKey, this.constructor)
        })
    }

    public abstract autoComplete(client: Bot, interaction: AutocompleteInteraction): Promise<void>
}

export class ModuleImports {
    private _interactions: Collection<string, InteractionModule> = new Collection()
    private _events: Collection<string, EventModule> = new Collection()

    public async loadModules() {
        const filePath = fileURLToPath(import.meta.url)
        const srcDirPath = path.join(filePath, '..', '..', '..')
        const modulePaths = await glob(`${srcDirPath}/build/{events,commands,interactions}/**/*.{ts,js}`)

        for (const path of modulePaths) {
            const module = await import(pathToFileURL(path).href)
            if (module.default) {
                const instance: Module = new module.default()

                if (instance instanceof EventModule)
                    this._events.set(instance.name, instance)
                if (instance instanceof InteractionModule)
                    this._interactions.set(instance.name, instance)
            }
        }
    }

    public get interactions(): Collection<string, InteractionModule> {
        return this._interactions
    }

    public get events(): Collection<string, EventModule> {
        return this._events
    }

    public eventListener(client: Bot) {
        for (const [eventName, eventModule] of this._events) {
            if (eventModule.eventType === 'once')
                client.once(eventName, (...args) => eventModule.execute(client, ...args))
            else
                client.on(eventName, (...args) => eventModule.execute(client, ...args))
        }
    }
}