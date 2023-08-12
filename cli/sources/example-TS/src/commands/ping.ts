import { SlashCommandBuilder } from 'discord.js';
import { cmdshandler } from '../index';

export default new cmdshandler.command({
    type: 1,
    structure: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    run: async (client, interaction) => {

        await interaction.reply({
            content: 'Pong!'
        });
        
    }
});