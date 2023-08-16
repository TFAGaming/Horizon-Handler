import { Client, ClientEvents } from "discord.js";
import { CustomEventStructure, EventStructure } from "../types";
import { HorizonError, importFromDir } from "./utils";
import { EventEmitter } from 'events';

export class EventsHandler<C extends Client, K extends keyof ClientEvents = keyof ClientEvents, I extends { [k: string]: any[] } = { }> extends EventEmitter {
    public readonly path: string;
    public readonly includesDir?: boolean = false;

    /**
     * Creates a new handler for Discord bot client's events.
     * 
     * **Note**: This handler doesn't support custom events names, they all must be from the enum `ClientEvents`.
     * @param {string} path The directory path.
     * @param {boolean | undefined} includesDir Whenever the directory has sub-dirs or not.
     * @typeParam {Client} C The Discord bot Client.
     * @typeParam {keyof ClientEvents} K The client events' keys.
     * @typeParam {{ [k: string]: any[] }} I Custom events names and arguments.
     */
    constructor(path: string, includesDir?: boolean) {
        super({ captureRejections: false });

        if (!path) throw new HorizonError('MissingRequiredParameter', '\'path\' is required for the constructor.');

        if (includesDir && typeof includesDir !== 'boolean') throw new HorizonError('InvalidParameterType', '\'includesDir\' is not type of boolean.');

        this.path = path;
        this.includesDir = includesDir;
    };

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
    public event = class <K extends keyof ClientEvents> {
        public readonly event: EventStructure<C, K>['event'];
        public readonly once?: EventStructure<C, K>['once'];
        public readonly run: EventStructure<C, K>['run'];

        constructor(data: EventStructure<C, K>) {
            this.event = data.event;
            this.once = data.once;
            this.run = data.run;
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
    public customevent = class <K_1 extends keyof I = keyof I> {
        public readonly event: CustomEventStructure<C, I, K_1>['event'];
        public readonly once?: CustomEventStructure<C, I, K_1>['once'];
        public readonly run: CustomEventStructure<C, I, K_1>['run'];
        
        constructor(data: CustomEventStructure<C, I, K_1>) {
            this.event = data.event;
            this.once = data.once;
            this.run = data.run;
        };
    };

    /**
     * Loads all events from the provided path.
     * @param {C} client The Discord bot client to listen to these events.
     */
    public load(client: C): Promise<EventStructure<C, K>[]> {
        if (!client) throw new HorizonError('MissingRequiredParameter', '\'client\' is required for the method.');

        return new Promise(async (resolved, rejected) => {
            try {
                const data = await importFromDir<EventStructure<C, K>>(this.path, {
                    includesDir: this.includesDir
                });

                for (const module of data) {
                    if (!module.event || !module.run) {
                        this.emit('fileSkip', module.event);

                        continue;
                    };

                    if (module.once) {
                        client.once(module.event, (...args) => module.run(client, ...args));
                    } else {
                        client.on(module.event, (...args) => module.run(client, ...args));
                    };

                    this.emit('fileLoad', module.event);
                };

                resolved(data);
            } catch (e) {
                rejected(e);
            };
        });
    };

};