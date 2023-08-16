import { Client } from 'discord.js';
import { CommandsHandler, EventsHandler } from 'horizon-handler';

const client = new Client({
    intents: [
        'Guilds'
    ]
});

export const commandshandler = new CommandsHandler<Client>('./dist/commands/');

export const eventshandler = new EventsHandler<Client>('./dist/events/');

(async () => {
    await commandshandler.load();

    await eventshandler.load(client);
})();

client.login('TOKEN');