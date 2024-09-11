import {
    AutocompleteInteraction,
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    CommandInteractionOptionResolver,
    AttachmentBuilder,
} from 'discord.js'

import { Bot } from '../../classes/Bot.js'
import { InteractionModule } from '../../classes/ModuleImports.js'
import { InteractionDecorator } from '../../utils/Decorators.js'
import { EmployeeDTO, isEmployee, isEmployees } from '../../types/Employee.js'

@InteractionDecorator({
    name: 'employees',
    description: 'Access the employees routes API.',
    cooldown: 5,
    category: 'administration',
    usage: 'employees <get [id]>',
    integration_types: [0],
    contexts: [0],
    data: new SlashCommandBuilder()
        .setName('employees')
        .setDescription('Access the employees routes API.')
        .addSubcommand(subCommand => subCommand
            .setName('get')
            .setDescription('Get one or multiple employees.')
            .addIntegerOption(option => option
                .setName('id')
                .setDescription('Get an employee by its id.')
            )
        )
})
export default class EmployeesInteraction extends InteractionModule {
    public async autoComplete(client: Bot, interaction: AutocompleteInteraction): Promise<void> { }

    public async execute(client: Bot, interaction: ChatInputCommandInteraction): Promise<any> {
        const options = interaction.options as CommandInteractionOptionResolver
        const route = 'http://localhost:5000/api/employees'

        if (options.getSubcommand(true) === 'get') {
            const id = options.getInteger('id', false)
            const token = client.userTokens.find(user => user.userId === interaction.user.id)
            if (!token) {
                return interaction.reply({
                    content: 'You don\'t have the necessary permissions to execute this command.',
                    ephemeral: true
                })
            }

            if (!id) {
                const res = await fetch(route, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token.token}`
                    },
                    credentials: 'include'
                })
                const object = await res.json()

                if (!res.ok) {
                    return interaction.reply({
                        content: object.details ?? 'Une erreur est survenue.',
                        ephemeral: true
                    })
                }
                if (!isEmployees(object))
                    throw Error(`Wrong data type received:\n${JSON.stringify(object)}`)

                const embed = new EmbedBuilder()
                    .setTitle('List of employees')
                    .setDescription(object.map(employee => {
                        return `${employee.id} - ${employee.name} ${employee.surname}`
                    }).join('\n'))
                    .setTimestamp()

                return interaction.reply({
                    content: 'List of the employees',
                    embeds: [embed]
                })
            } else {
                const res = await fetch(`${route}/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token.token}`
                    },
                    credentials: 'include'
                })
                const object = await res.json()

                if (!res.ok) {
                    return interaction.reply({
                        content: object.details ?? 'Une erreur est survenue.',
                        ephemeral: true
                    })
                }
                if (!isEmployee(object)) {
                    return interaction.reply({
                        content: `Customer ${id} doesn't exist.`,
                        ephemeral: true
                    })
                }

                const image = (await (await fetch(`${route}/${id}/image`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token.token}`
                    },
                    credentials: 'include'
                })).json()).image
                const buffer = Buffer.from(image, 'base64');
                const attachment = new AttachmentBuilder(buffer, { name: 'image.jpg' });

                const embed = new EmbedBuilder()
                    .setTitle(`Employee ${id} informations`)
                    .addFields(
                        { name: 'Prénom', value: object.name, inline: true },
                        { name: 'Nom de famille', value: object.surname, inline: true },
                        { name: 'Email', value: object.email },
                        { name: 'Birth date', value: object.birth_date, inline: true },
                        { name: 'gender', value: object.gender, inline: true },
                        { name: 'Work', value: object.work },
                    )
                    .setThumbnail('attachment://image.jpg')

                return interaction.reply({
                    embeds: [embed],
                    files: [attachment]
                })
            }
        }
    }
}