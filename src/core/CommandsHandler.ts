import { Client, Collection, REST, RESTOptions, Routes } from "discord.js";
import { CommandBuilder } from "./CommandBuilder";
import { CommandStructure } from "../types";
import { HorizonError, importFromDir } from "./utils";
import { EventEmitter } from 'events';

export class CommandsHandler<C extends Client, O = {}, A extends any[] = unknown[]> extends EventEmitter {
    public readonly collection: Collection<string, CommandStructure<C, O, A>> = new Collection();
    public readonly path: string;
    public readonly includesDir?: boolean = false;

    /**
     * Creates a new handler for Discord API interaction application commands.
     * @param {string} path The directory path.
     * @param {boolean | undefined} includesDir Whenever the directory has sub-dirs or not.
     * @typeParam {Client} C The Discord bot Client.
     * @typeParam {{}} O Custom options.
     * @typeParam {any[]} A Custom run arguments.
     */
    constructor(path: string, includesDir?: boolean) {
        super({ captureRejections: false });

        if (!path) throw new HorizonError('MissingRequiredParameter', '\'path\' is required for the constructor.');

        if (includesDir && typeof includesDir !== 'boolean') throw new HorizonError('InvalidParameterType', '\'includesDir\' is not type of boolean.');

        this.path = path;
        this.includesDir = includesDir;
    };

    /**
     * Deploy application commands to Discord API using `REST` client.
     * @param {Client<true>} client The Discord bot client, must be ready.
     * @param {{ REST?: RESTOptions, guildId?: string }} options 
     * @returns 
     */
    public deploy(client: Client<true>, options?: { REST?: RESTOptions, guildId?: string }): Promise<REST> {
        if (!client) throw new HorizonError('MissingRequiredParameter', '\'client\' is required for the method.');
        
        if (!client.isReady()) throw new HorizonError('DiscordClientError', 'The client is not ready yet.');

        return new Promise(async (resolved, rejected) => {
            try {
                const rest = new REST(options?.REST).setToken(client.token);

                this.emit('deployStart');

                if (options?.guildId && client.guilds.cache.get(options.guildId)) {
                    await rest.put(
                        Routes.applicationGuildCommands(client.user.id, options.guildId),
                        {
                            body: [...this.collection.values()].map((command) => command.structure)
                        }
                    );

                    this.emit('deployFinish');
                } else {
                    await rest.put(
                        Routes.applicationCommands(client.user.id),
                        {
                            body: [...this.collection.values()].map((command) => command.structure)
                        }
                    );

                    this.emit('deployFinish');
                };

                resolved(rest);
            } catch (e) {
                this.emit('deployError', e);

                rejected(e);
            };
        });
    };

    /**
     * Creates a new command.
     * 
     * **Warning**: Make sure that you have exported it as `default`.
     * 
     * ```ts
     * // TypeScript
     * export default new [handler].command(...);
     * 
     * // JavaScript (CommonJS)
     * module.exports = new [handler].command(...);
     * ```
     */
    public command = class extends CommandBuilder<C, O, A> {
        constructor(data: CommandStructure<C, O, A>) {
            super(data);
        };
    };

    /**
     * Loads all commands from the provided path.
     */
    public load(): Promise<CommandStructure<C, O, A>[]> {
        return new Promise(async (resolved, rejected) => {
            try {
                const data = await importFromDir<CommandStructure<C, O, A>>(this.path, {
                    includesDir: this.includesDir
                });

                for (const command of data) {
                    if (!command.structure || !command.run || !command.type || command.disabled) {
                        this.emit('fileSkip', command.structure);

                        continue;
                    };

                    this.collection.set(command.structure.name, command);

                    this.emit('fileLoad', command.structure);
                };

                resolved(data);
            } catch (e) {
                rejected(e);
            };
        });
    };

    /**
     * Reloads all commands from the provided path.
     */
    public reload(): Promise<CommandStructure<C, O, A>[]> {
        return new Promise(async (resolved, rejected) => {
            try {
                this.collection.clear();

                const output = await this.load();

                resolved(output);
            } catch (e) {
                rejected(e);
            };
        });
    };

    public addCommands(...commands: CommandStructure<C, O, A>[]) {
        for (const command of commands) {
            if (!command || !command.structure || !command.run || !command.type) continue;

            this.collection.set(command.structure.name, command);
        };

        return this;
    };

    public setCommands(...commands: CommandStructure<C, O, A>[]) {
        this.collection.clear();

        for (const command of commands) {
            if (!command || !command.structure || !command.run || !command.type) continue;

            this.collection.set(command.structure.name, command);
        };

        return this;
    };
};
