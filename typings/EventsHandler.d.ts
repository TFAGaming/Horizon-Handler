import { Client, ClientEvents } from "discord.js";
import { CustomEventStructure, EventStructure, EventsHandlerEvents } from "./types";
import { EventEmitter } from 'events';

export declare class EventsHandler<C extends Client, K extends keyof ClientEvents = keyof ClientEvents, I extends {
    [k: string]: any[];
} = {}> extends EventEmitter {
    readonly path: string;
    readonly includesDir?: boolean;

    /**
     * Creates a new handler for Discord bot client's events.
     * @param {string} path The directory path.
     * @param {boolean | undefined} includesDir Whenever the directory has sub-dirs or not.
     * @typeParam {Client} C The Discord bot Client.
     * @typeParam {keyof ClientEvents} K The client events' keys.
     * @typeParam {{ [k: string]: any[] }} I Custom events names and arguments.
     */
    constructor(path: string, includesDir?: boolean);

    /**
     * Creates a new event for the handler.
     *
     * **Warning**: Make sure that you have exported it as `default`.
     *
     * ```ts
     * // TypeScript
     * export default new [handler].event(...);
     *
     * // JavaScript (CommonJS)
     * module.exports = new [handler].event(...);
     * ```
     */
    event: {
        new <K_1 extends keyof ClientEvents>(data: EventStructure<C, K_1>): {
            readonly event: K_1;
            readonly once?: boolean | undefined;
            readonly run: (client: C, ...args: ClientEvents[K_1]) => void | PromiseLike<void>;

            toJSON(): EventStructure<C, K_1>;
        };
    };

    /**
     * Creates a new custom event for the handler.
     *
     * **Warning**: Make sure that you have exported it as `default`.
     *
     * ```ts
     * // TypeScript
     * export default new [handler].customevent(...);
     *
     * // JavaScript (CommonJS)
     * module.exports = new [handler].customevent(...);
     * ```
     */
    customevent: {
        new <K_1 extends keyof I = keyof I>(data: CustomEventStructure<C, I, K_1>): {
            readonly event: K_1;
            readonly once?: boolean | undefined;
            readonly run: (client: C, ...args: I[K_1]) => void | PromiseLike<void>;

            toJSON(): CustomEventStructure<C, I, K_1>;
        };
    };
    
    /**
     * Loads all events from the provided path.
     * @param {C} client The Discord bot client to listen to these events.
     */
    load(client: C): Promise<EventStructure<C, K>[]>;

    on<Z extends keyof EventsHandlerEvents>(event: Z, listener: (...args: EventsHandlerEvents[Z]) => void): this;
    on<S extends string | symbol>(
        event: Exclude<S, keyof EventsHandlerEvents>,
        listener: (...args: any[]) => void,
    ): this;

    once<Z extends keyof EventsHandlerEvents>(event: Z, listener: (...args: EventsHandlerEvents[Z]) => void): this;
    once<S extends string | symbol>(
        event: Exclude<S, keyof EventsHandlerEvents>,
        listener: (...args: any[]) => void,
    ): this;

    emit<Z extends keyof EventsHandlerEvents>(event: Z, ...args: EventsHandlerEvents[Z]): boolean;
    emit<S extends string | symbol>(event: Exclude<S, keyof EventsHandlerEvents>, ...args: unknown[]): boolean;

    off<Z extends keyof EventsHandlerEvents>(event: Z, listener: (...args: EventsHandlerEvents[Z]) => void): this;
    off<S extends string | symbol>(
        event: Exclude<S, keyof EventsHandlerEvents>,
        listener: (...args: any[]) => void,
    ): this;

    removeAllListeners<Z extends keyof EventsHandlerEvents>(event?: Z): this;
    removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof EventsHandlerEvents>): this;
}
