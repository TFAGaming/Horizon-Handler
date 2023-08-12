# Horizon Handler
A powerful Discord bot commands, events, and components handler, fully written in TypeScript and has many typings features. Horizon Handler provides simple Discord application commands handler, supports custom options and custom arguments for listeners.

> **Important**
> This package is not a part of [discord.js](https://npmjs.com/package/discord.js) and it's completely a separate 3ʳᵈ party package.

## Features
- Supports all type of application commands on Discord: **Chat Input** (Slash), **User context**, and **Message context**.
- Three available handlers:
    - Commands: Handles Discord API application commands and it's interactions.
    - Events: Handles Gateway events from discord.js.
    - Components: Handles components by their custom ID from discord.js.
        - Select menus (any type).
        - Buttons.
        - Modal submits.
- Autocomplete interactions supported.
- Built-in files handler, loads sub-dirs if enabled.
- **99.9%** Promise-based.
- Easy and simple to use.

## Table of Contents

- [Horizon Handler](#horizon-handler)
- [Features](#features)
- [Table of Contents](#table-of-contents)
- [Install](#install)
- [Documentation](#documentation)
- [Example usage](#example-usage)
- [Other Examples](#other-examples)
    - [Using custom options for commands](#using-custom-options-for-commands)
    - [Custom events for Events handler](#custom-events-for-events-handler)
    - [Custom arguments for Commands handler](#custom-arguments-for-commands-handler)
    - [Handle Autocomplete interaction](#handle-autocomplete-interaction)
- [Support](#support)
- [License](#license)

## Install
### Required platforms
- [Node.js](https://nodejs.org/en) v16.9.0 or newer (**recommended**: v18 LTS)

### Required packages
- [discord.js](https://npmjs.com/package/discord.js) v14.12.1 or newer

> **Warning**
> If you're using TypeScript, you must install the package [typescript](https://npmjs.com/package/typescript) v5.1.6 or newer.

After you meet all the requirements, you can install the package.

```sh-session
npm install horizon-handler
yarn add horizon-handler
pnpm add horizon-handler
```

[↑ Table of Contents](#table-of-contents)

## Documentation

Visit the documentation website: [Click here!](https://tfagaming.github.io/Horizon-Handler/)

[↑ Table of Contents](#table-of-contents)

## Example Usage

This is an example usage written in TypeScript.

### Tree of the project

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

### tsconfig.json compiler options

> **Note** 
> For this example, the out directory name is **dist**. You can change it at anytime, but make sure that the path directory name from **CommandsHandler**, **EventsHandler**, and/or **ComponentsHandler** constructor parameter are also renamed to the new one.

```json
{
    "compilerOptions": {
        "target": "ES2020",
        "module": "CommonJS",
        "outDir": "dist",
        "strict": true,
    },
    "include": [
        "src"
    ],
    "exclude": [
        "node_modules",
        "dist"
    ]
}
```

### Create a new Discord bot client: (`index.ts`)
```ts
import { Client } from 'discord.js';

const client = new Client({
    intents: [
        'Guilds'
    ]
});

client.login('Your bot token goes here');
```

### Define a new commands & events handler and load all the files: (`index.ts`)
```ts
import {
    CommandsHandler,
    EventsHandler,
    CommandStructure
} from 'horizon-handler';

export const cmdshandler = new CommandsHandler<Client>('./dist/commands/', true);

cmdshandler.on('fileLoad', (command) => console.log(`Loaded new command: ` + command.name));

export const eventshandler = new EventsHandler<Client>('./dist/events/');

eventshandler.on('fileLoad', (event) => console.log(`Loaded new event: ` + event));

export const collection = new Collection<string, CommandStructure<Client>>();

(async () => {
    await cmdshandler.load(collection);

    await eventshandler.load(client);
})();
```

### Create a new simple command: (`ping.ts`)

```ts
import { SlashCommandBuilder } from 'discord.js';
import { CommandType } from 'horizon-handler';
import { cmdshandler } from '../../index';

export default new cmdshandler.command({
    type: CommandType.ChatInput,
    structure: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    run: async (client, interaction) => {
        await interaction.reply({
            content: 'Pong!'
        });
    }
});
```

### Create a new event to log whenever the client is ready or not and deploy the application commands to Discord API: (`ready.ts`)

```ts
import { eventshandler, cmdshandler } from '../index';

export default new eventshandler.event({
    event: 'ready',
    once: true,
    run: async (_, client) => {
        console.log(`Logged in as: ` + client.user.displayName);

        await cmdshandler.deploy(client);
    }
});
```

### Create a new event to handle application commands: (`interactionCreate.ts`)

```ts
import { eventshandler, collection } from '../index';

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

[↑ Table of Contents](#usage)

## Other Examples
### Using custom options for commands:

By default, the handler will make all properties in `O` (Type parameter for custom options) optional.

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

[↑ Table of Contents](#table-of-contents)

### Custom events for Events handler:
```ts
type Events = {
    a: [x: string, y: number],
    b: [z: { }, w: any, string],
    c: [string, number, any, { }, void, unknown, []]
};

new EventsHandler<Client, keyof ClientEvents, Events>(...);

export default new [handler].customevent(...);
```

[↑ Table of Contents](#table-of-contents)

### Custom arguments for Commands handler:

```ts
type Args = [
    x: string,
    y: number,
    z?: any // ← Optional
];

new CommandsHandler<Client, { }, Args>(...);
```

[↑ Table of Contents](#table-of-contents)

### Handle Autocomplete interactions:

> **Note**
> This example is continued with the Example usage: [Click here](#example-usage)

Create a new `interactionCreate` event file for autocomplete interactions:

```ts
import { eventshandler, collection } from "../index";

export default new eventshandler.event({
    event: 'interactionCreate',
    run: async (client, interaction) => {
        if (!interaction.isAutocomplete()) return;

        const command = collection.get(interaction.commandName);

        if (!command || command.type !== 1) return;

        try {
            if (command.autocomplete) command.autocomplete(client, interaction);
        } catch (e) {
            console.error(e);
        };
    }
});
```

Create a command example with autocomplete option:

```ts
import { SlashCommandBuilder } from 'discord.js';
import { CommandType } from 'horizon-handler';
import { cmdshandler } from '../../index';

export default new cmdshandler.command({
    type: CommandType.ChatInput,
    structure: new SlashCommandBuilder()
        .setName('autocomplete')
        .setDescription('An autocomplete interaction command!')
        .addStringOption((opt) =>
            opt.setName('guild')
                .setDescription('Choose a server.')
                .setAutocomplete(true)
                .setRequired(true)
        ),
    run: async (client, interaction) => {
        const guild = interaction.options.getString('guild', true);

        await interaction.reply({
            content: 'You choosed: ' + guild
        });
    },
    autocomplete: async (client, interaction) => {
        const focused = interaction.options.getFocused();

		const guilds = client.guilds.cache.map((g) => g.name);

		const filtered = guilds.filter((choice) => choice.startsWith(focused));

		await interaction.respond(
			filtered.map((choice) => ({ name: choice, value: choice })),
		);
    }
});
```

[↑ Table of Contents](#table-of-contents)

## Support
Need any help? Join our Discord server, report to us the problem, and we will solve it for you!

<a href="https://discord.gg/E6VFACWu5V">
    <img src="https://discord.com/api/guilds/918611797194465280/widget.png?style=banner3">
</a>

[↑ Table of Contents](#table-of-contents)

## License
The **MIT** License. ([View here](./LICENSE))