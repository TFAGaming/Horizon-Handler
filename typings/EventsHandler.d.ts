import { Client, ClientEvents } from "discord.js";
import { CustomEventStructure, EventStructure, EventsHandlerEvents } from "./types";
import { EventBuilder } from "./EventBuilder";
import { EventEmitter } from 'events';

export declare class EventsHandler<C extends Client, K extends keyof ClientEvents, I extends { [k: string]: any[] }> extends EventEmitter {
    readonly path: string;
    readonly includesDir?: boolean;

    /**
     * Creates a new handler for Discord bot client's events.
     *
     * **Note**: This handler doesn't support custom events names, they all must be from the enum `ClientEvents`.
     * @param {string} path The directory path.
     * @param {boolean | undefined} includesDir Whenever the directory has sub-dirs or not.
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
        new (data: EventStructure<C, K>): {
            readonly event: K;
            readonly once?: boolean | undefined;
            readonly run: (client: C, ...args: ClientEvents[K]) => void;
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
            readonly run: (client: C, ...args: I[K_1]) => void;
        };
    };

    /**
     * Loads all events from the provided path.
     * @param {C} client The Discord bot client to listen to these events.
     */
    load(client: C): Promise<EventBuilder<C, K>[]>;

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
