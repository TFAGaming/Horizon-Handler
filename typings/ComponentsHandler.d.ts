import { Client, Collection } from "discord.js";
import { ComponentStructure, ComponentsHandlerEvents } from "./types";
import { EventEmitter } from 'events';

export declare class ComponentsHandler<C extends Client> extends EventEmitter {
    readonly collection: Collection<string, ComponentStructure<C>>;
    readonly path: string;
    readonly includesDir?: boolean;

    /**
     * Creates a new handler for Discord bot client's interaction components events.
     * @param {string} path The directory path.
     * @param {boolean | undefined} includesDir Whenever the directory has sub-dirs or not.
     * @typeParam {Client} C The Discord bot Client.
     */
    constructor(path: string, includesDir?: boolean);

    /**
     * Creates a new component for the handler.
     *
     * **Warning**: Make sure that you have exported it as `default`.
     *
     * ```ts
     * // TypeScript
     * export default new [handler].component(...);
     *
     * // JavaScript (CommonJS)
     * module.exports = new [handler].component(...);
     * ```
     */
    component: {
        new (data: ComponentStructure<C>): {
            readonly type: 2 | 1 | 3 | 4 | 5 | 6 | 7;
            readonly customId: string;
            readonly run: ((client: C, interaction: import("discord.js").ButtonInteraction<import("discord.js").CacheType>) => void | PromiseLike<void>) | ((client: C, interaction: import("discord.js").StringSelectMenuInteraction<import("discord.js").CacheType>) => void | PromiseLike<void>) | ((client: C, interaction: import("discord.js").UserSelectMenuInteraction<import("discord.js").CacheType>) => void | PromiseLike<void>) | ((client: C, interaction: import("discord.js").RoleSelectMenuInteraction<import("discord.js").CacheType>) => void | PromiseLike<void>) | ((client: C, interaction: import("discord.js").MentionableSelectMenuInteraction<import("discord.js").CacheType>) => void | PromiseLike<void>) | ((client: C, interaction: import("discord.js").ChannelSelectMenuInteraction<import("discord.js").CacheType>) => void | PromiseLike<void>) | ((client: C, interaction: import("discord.js").ModalSubmitInteraction<import("discord.js").CacheType>) => void | PromiseLike<void>);
            readonly disabled?: boolean;

            toJSON(): ComponentStructure<C>;
        };
    };

    /**
     * Loads all components from the provided path.
     * @param {C} defaultListener The options.
     */
    load(defaultListener?: C): Promise<ComponentStructure<C>[]>;

    /**
     * Reloads all components from the provided path.
     */
    reload(): Promise<ComponentStructure<C>[]>;

    addComponents(...components: ComponentStructure<C>[]): this;
    setComponents(...components: ComponentStructure<C>[]): this;

    on<Z extends keyof ComponentsHandlerEvents>(event: Z, listener: (...args: ComponentsHandlerEvents[Z]) => void): this;
    on<S extends string | symbol>(
        event: Exclude<S, keyof ComponentsHandlerEvents>,
        listener: (...args: any[]) => void,
    ): this;

    once<Z extends keyof ComponentsHandlerEvents>(event: Z, listener: (...args: ComponentsHandlerEvents[Z]) => void): this;
    once<S extends string | symbol>(
        event: Exclude<S, keyof ComponentsHandlerEvents>,
        listener: (...args: any[]) => void,
    ): this;

    emit<Z extends keyof ComponentsHandlerEvents>(event: Z, ...args: ComponentsHandlerEvents[Z]): boolean;
    emit<S extends string | symbol>(event: Exclude<S, keyof ComponentsHandlerEvents>, ...args: unknown[]): boolean;

    off<Z extends keyof ComponentsHandlerEvents>(event: Z, listener: (...args: ComponentsHandlerEvents[Z]) => void): this;
    off<S extends string | symbol>(
        event: Exclude<S, keyof ComponentsHandlerEvents>,
        listener: (...args: any[]) => void,
    ): this;

    removeAllListeners<Z extends keyof ComponentsHandlerEvents>(event?: Z): this;
    removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof ComponentsHandlerEvents>): this;
}
