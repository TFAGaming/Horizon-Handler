import { Client, Collection, REST, RESTOptions } from "discord.js";
import { CommandStructure, CommandsHandlerEvents } from "./types";
import { EventEmitter } from 'events';

export declare class CommandsHandler<C extends Client, O = {}, A extends any[] = unknown[]> extends EventEmitter {
    readonly collection: Collection<string, CommandStructure<C, O, A>>;
    readonly path: string;
    readonly includesDir?: boolean;

    /**
     * Creates a new handler for Discord API interaction application commands.
     * @param {string} path The directory path.
     * @param {boolean | undefined} includesDir Whenever the directory has sub-dirs or not.
     * @typeParam {Client} C The Discord bot Client.
     * @typeParam {{}} O Custom options.
     * @typeParam {any[]} A Custom run arguments.
     */
    constructor(path: string, includesDir?: boolean);

    /**
     * Deploy application commands to Discord API using `REST` client.
     * @param {Client<true>} client The Discord bot client, must be ready.
     * @param {{ REST?: RESTOptions, guildId?: string }} options
     * @returns
     */
    deploy(client: Client<true>, options?: {
        REST?: RESTOptions;
        guildId?: string;
    }): Promise<REST>;

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
    command: {
        new (data: CommandStructure<C, O, A>): {
            readonly type: 2 | 1 | 3;
            readonly structure: import("@discordjs/builders").ContextMenuCommandBuilder | import("./types").ChatInputCommandBuilder;
            readonly options?: Partial<Partial<O> | undefined>;
            readonly run: ((client: C, interaction: import("discord.js").ChatInputCommandInteraction<import("discord.js").CacheType>, ...args: A) => void | PromiseLike<void>) | ((client: C, interaction: import("discord.js").UserContextMenuCommandInteraction<import("discord.js").CacheType>, ...args: A) => void | PromiseLike<void>) | ((client: C, interaction: import("discord.js").MessageContextMenuCommandInteraction<import("discord.js").CacheType>, ...args: A) => void | PromiseLike<void>);
            readonly autocomplete?: (() => never) | (() => never) | ((client: C, interaction: import("discord.js").AutocompleteInteraction<import("discord.js").CacheType>, ...args: A) => void | PromiseLike<void>) | undefined;
            readonly disabled?: boolean;

            toJSON(): CommandStructure<C, O, A>;
        };
    };

    /**
     * Loads all commands from the provided path.
     */
    load(): Promise<CommandStructure<C, O, A>[]>;

    /**
     * Reloads all commands from the provided path.
     */
    reload(): Promise<CommandStructure<C, O, A>[]>;

    addCommands(...commands: CommandStructure<C, O, A>[]): this;
    setCommands(...commands: CommandStructure<C, O, A>[]): this;

    on<Z extends keyof CommandsHandlerEvents>(event: Z, listener: (...args: CommandsHandlerEvents[Z]) => void): this;
    on<S extends string | symbol>(
        event: Exclude<S, keyof CommandsHandlerEvents>,
        listener: (...args: any[]) => void,
    ): this;

    once<Z extends keyof CommandsHandlerEvents>(event: Z, listener: (...args: CommandsHandlerEvents[Z]) => void): this;
    once<S extends string | symbol>(
        event: Exclude<S, keyof CommandsHandlerEvents>,
        listener: (...args: any[]) => void,
    ): this;

    emit<Z extends keyof CommandsHandlerEvents>(event: Z, ...args: CommandsHandlerEvents[Z]): boolean;
    emit<S extends string | symbol>(event: Exclude<S, keyof CommandsHandlerEvents>, ...args: unknown[]): boolean;

    off<Z extends keyof CommandsHandlerEvents>(event: Z, listener: (...args: CommandsHandlerEvents[Z]) => void): this;
    off<S extends string | symbol>(
        event: Exclude<S, keyof CommandsHandlerEvents>,
        listener: (...args: any[]) => void,
    ): this;

    removeAllListeners<Z extends keyof CommandsHandlerEvents>(event?: Z): this;
    removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof CommandsHandlerEvents>): this;
}
