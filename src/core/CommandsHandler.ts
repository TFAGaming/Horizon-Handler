import { Client, Collection, REST, RESTOptions, Routes } from "discord.js";
import { CommandBuilder } from "./CommandBuilder";
import { CommandStructure, CommandType } from "../types";
import { importFromDir } from "./functions";

export class CommandsHandler<C extends Client, O = {}, A extends unknown = unknown> {
    public readonly collection: Collection<string, CommandStructure<C, O, A>> = new Collection();
    public readonly path: string;
    public readonly includesDir?: boolean = false;

    /**
     * Creates a new handler for Discord bot client's events.
     * @param {string} path The directory path.
     * @param {boolean} includesDir Whenever the directory has sub-dirs or not.
     */
    constructor(path: string, includesDir?: boolean) {
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
        return new Promise(async (resolved, rejected) => {
            try {
                const rest = new REST(options?.REST).setToken(client.token);

                if (options?.guildId && client.guilds.cache.get(options.guildId)) {
                    await rest.put(
                        Routes.applicationGuildCommands(client.user.id, options.guildId),
                        {
                            body: [...this.collection.values()].map((command) => command.structure)
                        }
                    );
                } else {
                    await rest.put(
                        Routes.applicationCommands(client.user.id),
                        {
                            body: [...this.collection.values()].map((command) => command.structure)
                        }
                    );
                };

                resolved(rest);
            } catch (e) {
                rejected(e);
            };
        });
    };

    /**
     * Creates a new command.
     */
    public command = class extends CommandBuilder<C, O, A> {
        constructor(data: CommandStructure<C, O, A>) {
            super(data);
        };
    };

    /**
     * Loads all events from the provided path.
     * @param {Collection<string, CommandStructure<C, O, A>>} collection The collection for listening and responding to application commands.
     */
    public load(collection?: Collection<string, CommandStructure<C, O, A>>): Promise<Collection<string, CommandStructure<C, O, A>>> {
        return new Promise(async (resolved, rejected) => {
            try {
                const data: CommandStructure<C, O, A>[] = await importFromDir(this.path, this.includesDir);

                for (const command of data) {
                    this.collection.set(command.structure.name, command);

                    if (collection) collection.set(command.structure.name, command);
                };

                resolved(this.collection);
            } catch (e) {
                rejected(e);
            };
        });
    };

    /**
     * Reloads all events from the provided path.
     * @param {Collection<string, CommandStructure<C, O, A>>} collection The collection to clear and to set a new data for listening and responding to application commands.
     */
    public reload(collection?: Collection<string, CommandStructure<C, O, A>>): Promise<Collection<string, CommandStructure<C, O, A>>> {
        return new Promise(async (resolved, rejected) => {
            try {
                this.collection.clear();
                if (collection) collection.clear();

                const output = await this.load();

                resolved(output);
            } catch (e) {
                rejected(e);
            };
        });
    };
};