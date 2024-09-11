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
    name: 'logout',
    description: 'Logout from your soul-connection account.',
    cooldown: 5,
    category: 'administration',
    usage: 'logout',
    integration_types: [0],
    contexts: [0],
    data: new SlashCommandBuilder()
        .setName('logout')
        .setDescription('Logout from your soul-connection account.')
})
export default class EmployeesInteraction extends InteractionModule {
    public async autoComplete(client: Bot, interaction: AutocompleteInteraction): Promise<void> { }

    public async execute(client: Bot, interaction: ChatInputCommandInteraction): Promise<any> {
        const route = 'http://localhost:5000/api/employees'
        const token = client.userTokens.find(user => user.userId === interaction.user.id)

        if (!token) {
            return interaction.reply({
                content: 'You don\'t have the necessary permissions to execute this command.',
                ephemeral: true
            })
        }
        const res = await fetch(`${route}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.token}`
            },
            credentials: 'include'
        })
        const object = await res.json()

        if (!res.ok)
            throw Error(`${res.status} ${res.statusText}\n${object.details}`)
        client.userTokens = client.userTokens.filter(user => user.userId !== interaction.user.id)
        interaction.reply('Successfully disconnected!')
    }
}