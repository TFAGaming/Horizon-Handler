import { eventshandler, commandshandler } from '../index';

export default new eventshandler.event({
    event: 'interactionCreate',
    run: (client, interaction) => {
        
        if (!interaction.isChatInputCommand()) return;

        const command = commandshandler.collection.get(interaction.commandName);

        if (!command || command.type !== 1) return;

        try {
            command.run(client, interaction);
        } catch (e) {
            console.error(e);
        };

    }
});