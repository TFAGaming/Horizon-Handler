const { Client, Collection } = require('discord.js');
const { CommandsHandler, EventsHandler } = require('horizon-handler');

const client = new Client({
    intents: [
        'Guilds'
    ]
});

const collection = new Collection();

const commandshandler = new CommandsHandler('./commands/');
const eventshandler = new EventsHandler('./events/');

(async () => {
    await commandshandler.load(collection);

    await eventshandler.load(client);
})();

module.exports = {
    client,
    commandshandler,
    eventshandler,
    collection
};

// Change 'TOKEN' to your actual bot token.
client.login('TOKEN');