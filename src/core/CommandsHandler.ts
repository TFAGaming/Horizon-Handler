import { Client, Collection, REST, RESTOptions, Routes } from "discord.js";
import { CommandBuilder } from "./CommandBuilder";
import { CommandStructure, CommandType } from "../types";
import { importFromDir } from "./functions";

export class CommandsHandler<C extends Client, O = {}, A extends unknown = unknown> {
    public readonly collection: Collection<string, CommandStructure<C, O, A>> = new Collection();
    public readonly path: string;
    public readonly includesDir?: boolean = false;

    constructor(path: string, includesDir?: boolean) {
        this.path = path;
        this.includesDir = includesDir;
    };

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

    public command = class extends CommandBuilder<C, O, A> {
        constructor(data: CommandStructure<C, O, A>) {
            super(data);
        };
    };

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