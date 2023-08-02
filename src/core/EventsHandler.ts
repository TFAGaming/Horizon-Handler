import { Client, ClientEvents } from "discord.js";
import { EventStructure } from "../types";
import { importFromDir } from "./functions";
import { EventBuilder } from "./EventBuilder";

export class EventsHandler<C extends Client, K extends keyof ClientEvents> {
    public readonly path: string;
    public readonly includesDir?: boolean = false;

    /**
     * Creates a new handler for Discord bot client's events.
     * 
     * **Note**: This handler doesn't support custom events names, they all must be from the enum `ClientEvents`.
     * @param {string} path The directory path.
     * @param {boolean} includesDir Whenever the directory has sub-dirs or not. 
     */
    constructor(path: string, includesDir?: boolean) {
        this.path = path;
        this.includesDir = includesDir;
    };

    /**
     * Creates a new event for the handler.
     * 
     * **Warning**: Make sure that you have exported it as `default`.
     */
    public event = class <C extends Client, K extends keyof ClientEvents> {
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
     * Loads all events from the provided path.
     * @param {C} client The Discord bot client to listen to these events.
     * @param {(file: string, path: string) => string} consolemessage The message to log in console when a file is loaded.
     */
    public load(client: C, consolemessage?: (file: string, path: string) => string): Promise<EventBuilder<C, K>[]> {
        return new Promise(async (resolved, rejected) => {
            try {
                const data: EventBuilder<C, K>[] = await importFromDir(this.path, {
                    includesDir: this.includesDir,
                    onLoadedFile: consolemessage
                });

                for (const module of data) {
                    if (module.once) {
                        client.once(module.event, (...args) => module.run(client, ...args));
                    } else {
                        client.on(module.event, (...args) => module.run(client, ...args));
                    };
                };

                resolved(data);
            } catch (e) {
                rejected(e);
            };
        });
    };
};