# <img src="https://raw.githubusercontent.com/TFAGaming/Horizon-Handler/main/assets/icon.png" width=20> Horizon Handler
A powerful Discord bot commands, events, and components handler, fully written in TypeScript and has many typings features. Horizon Handler provides simple Discord application commands handler, supports custom options and custom arguments for listeners.

> **Important**
> This package is not a part of [discord.js](https://npmjs.com/package/discord.js) and it's completely a separate 3ʳᵈ party package.

## Features
- Open-source project.
- Supports all type of application commands from Discord API.
- Three available handlers:
    - Commands: Handles Discord API application commands and it's interactions.
        - Chat Input commands.
        - User context menu commands.
        - Message context menu commands.
    - Events: Handles Gateway events from discord.js Client's events.
    - Components: Handles components by their custom ID.
        - Select menus (any type).
        - Buttons.
        - Modal submits.
- Built-in collections (`Collection` from discord.js).
- Autocomplete interactions supported.
- **99.9%** Promise-based.
- Fully written in TypeScript.
- CLI commands.
- Easy and simple to use.

## Table of Contents

- [Horizon Handler](#horizon-handler)
- [Features](#features)
- [Table of Contents](#table-of-contents)
- [Install](#install)
    - [Required platforms](#required-platforms)
    - [Required packages](#required-packages)
- [Links](#links)
- [Example usage](#example-usage)
- [CLI commands](#cli-commands)
    - [How to use](#how-to-use)
    - [How to fix the error "MODULE_NOT_FOUND"?](#how-to-fix-the-error-module_not_found)
- [Other Examples](#other-examples)
    - [Using custom options for commands](#using-custom-options-for-commands)
    - [Custom events for Events handler](#custom-events-for-events-handler)
    - [Custom arguments for Commands handler](#custom-arguments-for-commands-handler)
    - [Handle Autocomplete interaction](#handle-autocomplete-interaction)
    - [Add components or commands without creating a file](#add-components-or-commands-without-creating-a-file)
- [Support](#support)
- [License](#license)

## Install
### Required platforms
- [Node.js](https://nodejs.org/en) v16.9.0 or newer (**recommended**: v18 LTS)

### Required packages
- [discord.js](https://npmjs.com/package/discord.js) v14.12.0 or newer

> **Warning**
> If you're using TypeScript, you must install the package [typescript](https://npmjs.com/package/typescript) v5.1.6 or newer.

After you meet all the requirements, you can install the package.

```sh-session
npm install horizon-handler
yarn add horizon-handler
pnpm add horizon-handler
```

[↑ Table of Contents](#table-of-contents)

## Links

Documentation: [Click here](https://tfagaming.github.io/Horizon-Handler/)<br>
Source (GitHub): [Click here](https://github.com/TFAGaming/Horizon-Handler/)<br>
Issues: [Click here](https://github.com/TFAGaming/Horizon-Handler/issues)<br>
Pull requests: [Click here](https://github.com/TFAGaming/Horizon-Handler/pulls)<br>

[↑ Table of Contents](#table-of-contents)

## Example Usage

This is an example usage written in TypeScript. To skip this, use the CLI commands: [Click here](#cli-commands)

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
        "strict": true
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
import { CommandsHandler, Events, EventsHandler } from 'horizon-handler';

export const commandshandler = new CommandsHandler<Client>('./dist/commands/', true);

commandshandler.on(Events.FileLoad, (command) => console.log(`Loaded new command: ` + command.name));

export const eventshandler = new EventsHandler<Client>('./dist/events/');

eventshandler.on(Events.FileLoad, (event) => console.log(`Loaded new event: ` + event));

(async () => {
    await commandshandler.load();

    await eventshandler.load(client);
})();
```

### Create a new simple command: (`ping.ts`)

```ts
import { SlashCommandBuilder } from 'discord.js';
import { CommandType } from 'horizon-handler';
import { commandshandler } from '../../index';

export default new commandshandler.command({
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
import { eventshandler, commandshandler } from '../index';

export default new eventshandler.event({
    event: 'ready',
    once: true,
    run: async (_, client) => {
        console.log('Logged in as: ' + client.user.displayName);

        await commandshandler.deploy(client);
    }
});
```

### Create a new event to handle application commands: (`interactionCreate.ts`)

```ts
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
```

[↑ Table of Contents](#usage)

## CLI commands

```
npx horizon-handler
```

### How to use:

```
hhandler [command] [options] <path>
```

| Command | Arguments | Options | Description |
| ------- | ------- | ------- | ------- |
| js-example | path: **string** | --token: **string** | Create a new project for a Discord bot, written in JavaScript. |
| ts-example | path: **string** | --token: **string** | Create a new project for a Discord bot, written in TypeScript. |
| links | - | - | View all possible useful and informative links of this package. |
| about | - | - | About Horizon Handler. |

To set your bot token in the JavaScript or TypeScript example, use the option `--token` with the argument with type of **string**.

```cmd
hhandler [ts-example/js-example] <path> --token 'Your bot token'
```

### How to fix the error "MODULE_NOT_FOUND"?
This package uses three libraries for the CLI commands: **commander**, **fs-extra**, and **colors**. Install them globally:
```
npm install -g commander fs-extra colors
```

[↑ Table of Contents](#table-of-contents)

## Other Examples
### Using custom options for commands:

By default, the handler will make all properties in `O` (Type parameter for custom options) optional.

```ts
import { Client } from 'discord.js';

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

> **Warning** Make sure to emit these events from **Client** using the method **emit(...)** so they will be able to listen.

```ts
import { Client, ClientEvents } from 'discord.js';

type CustomEvents = {
    a: [x: string, y: number],
    b: [z: { }, w: any, string],
    c: [string, number, any, { }, void, unknown, []]
};

new EventsHandler<Client, keyof ClientEvents, CustomEvents>(...);

export default new [handler].customevent(...);
```

[↑ Table of Contents](#table-of-contents)

### Custom arguments for Commands handler:

```ts
import { Client } from 'discord.js';

type Args = [
    x: string,
    y: number,
    z?: any // ← Optional because of the question mark (?)
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
        .setName('autocomplete-command')
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
        
        const guilds = client.guilds.cache.map((guild) => guild.name);
        
        const filtered = guilds.filter((choice) => choice.startsWith(focused));

        await interaction.respond(
			filtered.map(
                (choice) => ({ name: choice, value: choice })
            )
	    );
    }
});
```

[↑ Table of Contents](#table-of-contents)

### Add components or commands without creating a file:

> **Note**
> The difference between **add** and **set** that the first one (**add**) will set more keys in the collection, even overwrites the old key's data. The other one (**set**) will clear the entire collection and then adds the commands/components in the collection.

> **Warning**
> Even if you're not providing files for the handler and using these methods, you **must** at least create one file that actually exist with it's valid directory path.

```ts
[commands handler].addCommands(
    {
        type: ...,
        structure: ...,
        run: (...) => ...
    },
    ...
);

[commands handler].setCommands(
    {
        type: ...,
        structure: ...,
        run: (...) => ...
    },
    ...
);

[components handler].addComponents(
    {
        type: ...,
        customId: ...,
        run: (...) => ...
    },
    ...
);

[components handler].setComponents(
    {
        type: ...,
        customId: ...,
        run: (...) => ...
    },
    ...
);
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

[↑ Table of Contents](#table-of-contents)
