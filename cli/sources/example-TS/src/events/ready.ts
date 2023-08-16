import { eventshandler, commandshandler } from '../index';

export default new eventshandler.event({
    event: 'ready',
    once: true,
    run: async (_, client) => {

        console.log(`Logged in as: ` + client.user.displayName);

        await commandshandler.deploy(client);
        
    }
});