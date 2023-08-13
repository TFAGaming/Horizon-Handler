import { Client, Collection } from 'discord.js';
import { CommandsHandler, EventsHandler, CommandStructure } from 'horizon-handler';

const client = new Client({
    intents: [
        'Guilds'
    ]
});

export const cmdshandler = new CommandsHandler<Client>('./dist/commands/');

export const eventshandler = new EventsHandler<Client>('./dist/events/');

export const collection = new Collection<string, CommandStructure<Client>>();

(async () => {
    await cmdshandler.load(collection);

    await eventshandler.load(client);
})();

client.login('TOKEN');