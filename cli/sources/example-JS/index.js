const { Client } = require('discord.js');
const { CommandsHandler, EventsHandler } = require('horizon-handler');

const client = new Client({
    intents: [
        'Guilds'
    ]
});

const commandshandler = new CommandsHandler('./commands/');
const eventshandler = new EventsHandler('./events/');

(async () => {
    await commandshandler.load();

    await eventshandler.load(client);
})();

module.exports = {
    client,
    commandshandler,
    eventshandler
};

client.login('TOKEN');