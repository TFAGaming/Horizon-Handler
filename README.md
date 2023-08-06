# Horizon Handler
A powerful Discord bot commands and events handler, fully written in TypeScript and has many typings features. Horizon Handler provides simple Discord application commands handler, supports custom options and custom arguments for listeners.

## Install
### Requirements
- Node.js v^16.9.0
- discord.js v^14.12.0
- typescript v^5.1.0

After you meet all the requirements, you can install the package.

```sh-session
npm install horizon-handler
yarn add horizon-handler
pnpm add horizon-handler
```

## Table of Contents

- [Horizon Handler](#horizon-handler)
- [Install](#install)
    - [Requiremens](#requirements)
- [Table of Contents](#table-of-contents)
- [Example usage](#example-usage)
- [Guide](#guide)
    - [Class: CommandsHandler](#class-commandshandler)
    - [Class: EventsHandler](#class-eventshandler)
- [Examples](#examples)
    - [Using custom options for commands](#using-custom-options-for-commands)
    - [Custom events for Discord bot Client](#custom-events-for-discord-bot-client)
- [Support](#support)
- [License](#license)

## Example usage
Tree of the project example:

> **Note**: In `tsconfig.json`, make sure that the out directory is called "dist" for this example usage, you can change it at anytime.

```
Example Bot
├─── src
│    ├─── index.ts
│    ├─── events
│    │   └─── ready.ts
│    │   └─── interactionCreate.ts
│    └─── commands
│         └─── Utility
│              └─── ping.ts
├─── package.json
└─── tsconfig.json
```

Create a new Discord bot client: (`index.ts`)
```ts
import { Client } from 'discord.js';

const client = new Client({
    intents: [
        'Guilds'
    ]
});

client.login('Your bot token goes here');
```

Define a new commands & events handler and load all the files: (`index.ts`)
```ts
import {
    CommandsHandler,
    EventsHandler,
    CommandStructure
} from 'horizon-handler';

export const cmdshandler = new CommandsHandler<Client>('./dist/commands/', true);

export const eventshandler = new EventsHandler<Client>('./dist/events/');

export const collection = new Collection<string, CommandStructure<Client>>();

(async () => {
    await cmdshandler.load(collection);

    await eventshandler.load(client);
})();
```

Create a new simple command: (`ping.ts`)

```ts
import { CommandType } from 'horizon-handler';
import { cmdshandler } from '../../index';

export default new cmdshandler.command({
    type: CommandType.ChatInput,
    structure: {
        name: 'ping',
        description: 'Replies with pong!'
    },
    run: async (client, interaction) => {
        await interaction.reply({
            content: 'Pong!'
        });
    }
});
```

Create a new event to log whenever the client is ready or not and deploy the application commands to Discord API: (`ready.ts`)

```ts
import { eventshandler, cmdshandler } from '../../index';

export default new eventshandler.event({
    event: 'ready',
    once: true,
    run: (_, client) => {
        console.log(`Logged in as: ` + client.user.displayName)

        // The client must be ready to deploy application commands to Discord API.
        await cmdshandler.deploy(client);
    }
});
```

Create a new event to handle application commands: (`interactionCreate.ts`)

```ts
import { eventshandler, collection } from '../../index';

export default new eventshandler.event({
    event: 'interactionCreate',
    run: (client, interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const command = collection.get(interaction.commandName);

        if (!command || command.type !== 1) return;

        try {
            command.run(client, interaction);
        } catch (e) {
            console.error(e);
        };
    }
});
```

[↑ Table of Contents](#table-of-contents)

## Guide
### Class: CommandsHandler (extends `EventEmitter`)
#### Type parameters:
| Parameter | Type | Default | Description |
| -------- | -------- | -------- | -------- |
| C | **Client** | - | The Discord bot client. |
| O | { [k: **string**]: **any**; } | **{ }** | The custom options for commands. |
| A | **any** | **unknown** | The custom arguments for the **run** property of each command. |

### Constructor:
| Parameter | Type | Default | Description |
| -------- | -------- | -------- | -------- |
| path | **string** | - | The path of the directory. |
| includesDir? | **boolean** | **false** | Whenever the directory has sub-dirs or not. |

### Methods:
| Method | Params | Returns | Async? | Description |
| -------- | -------- | -------- | -------- | -------- |
| deploy | client: **Client**, options?: **object** | **Promise** **REST** | Yes | Load all application commands to Discord API. |
| load | collection?: **Collection**, consolemessage?: **(file: string, path: string) => string** | **Promise** **Collection** | Yes | Load all commands from the provided path. |
| reload | collection?: **Collection** | **Promise** **Collection** | Yes | Clears the collection, and then reload all commands from the provided path. |

### Properties:
| Property | Readonly? | Type | Default value |
| -------- | -------- | -------- | -------- |
| collection | Yes | **Collection** | Collection(0) [Map] {} |
| path | Yes | **string** | - |
| includesDir? | Yes | **boolean** | undefined |

[↑ Table of Contents](#table-of-contents)

### Class: EventsHandler (extends `EventEmitter`)
#### Type parameters:
| Parameter | Type | Default | Description |
| -------- | -------- | -------- | -------- |
| C | **Client** | - | The Discord bot client. |
| K | keyof **ClientEvents** | - | Key of client events from discord.js. |
| I | { [k: **string**]: **any**[] } | - | The custom events if needed. |

### Constructor:
| Parameter | Type | Default | Description |
| -------- | -------- | -------- | -------- |
| path | **string** | - | The path of the directory. |
| includesDir? | **boolean** | **false** | Whenever the directory has sub-dirs or not. |

### Methods:
| Method | Params | Returns | Async? | Description |
| -------- | -------- | -------- | -------- | -------- |
| load | client: **Client** | **Promise** **Collection** | Yes | Load all events from the provided path. |

### Properties:
| Property | Readonly? | Type | Default value |
| -------- | -------- | -------- | -------- |
| path | Yes | **string** | - |
| includesDir? | Yes | **boolean** | undefined |

[↑ Table of Contents](#table-of-contents)

## Examples
### Using custom options for commands:
```ts
interface Options {
    option1: string,
    option2: number,
    option3: (string | number)[],
    option4: (...args: any[]) => void,
    option5: { suboption: string }
};

new CommandsHandler<Client, Options>(...);
```

### Custom events for Discord bot Client:
```ts
new EventsHandler
    <Client, { key: [value: string, ...], ... }>
    (...);

export default new [handler].customevent(...);
```

[↑ Table of Contents](#table-of-contents)

## Support
Need any help? Join our Discord server, report to us the problem, and we will solve it for you!

<a href="https://discord.gg/E6VFACWu5V">
    <img src="https://discord.com/api/guilds/918611797194465280/widget.png?style=banner3">
</a>

[↑ Table of Contents](#table-of-contents)

## License
The **MIT** License.