import {
    AutocompleteInteraction,
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    CommandInteractionOptionResolver,
} from 'discord.js'

import { Bot } from '../../classes/Bot.js'
import { InteractionModule } from '../../classes/ModuleImports.js'
import { InteractionDecorator } from '../../utils/Decorators.js'

@InteractionDecorator({
    name: 'login',
    description: 'Login to your soul-connection account.',
    cooldown: 5,
    category: 'administration',
    usage: 'login <email> <password>',
    integration_types: [0],
    contexts: [0],
    data: new SlashCommandBuilder()
        .setName('login')
        .setDescription('Login to your soul-connection account.')
        .addStringOption(option => option
            .setName('email')
            .setDescription('Your employee account email')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('password')
            .setDescription('Your employee account password')
            .setRequired(true)
        )
})
export default class EmployeesInteraction extends InteractionModule {
    public async autoComplete(client: Bot, interaction: AutocompleteInteraction): Promise<void> { }

    public async execute(client: Bot, interaction: ChatInputCommandInteraction): Promise<any> {
        const options = interaction.options as CommandInteractionOptionResolver
        const route = 'http://localhost:5000/api/employees'
        const email = options.getString('email', true)
        const password = options.getString('password', true)

        const res = await fetch(`${route}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        })
        const object = await res.json()

        if (!res.ok)
            throw Error(`${res.status} ${res.statusText}\n${object.details}`)
        client.userTokens.push({ userId: interaction.user.id, token: object.token })
        interaction.reply('Successfully connected!')
    }
}