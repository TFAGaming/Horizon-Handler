import { Client, ClientEvents } from "discord.js";
import { EventStructure } from "../types";
import { importFromDir } from "./functions";
import { EventBuilder } from "./EventBuilder";

export class EventsHandler<C extends Client, K extends keyof ClientEvents> {
    public readonly path: string;
    public readonly includesDir?: boolean = false;

    constructor(path: string, includesDir?: boolean) {
        this.path = path;
        this.includesDir = includesDir;
    };

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

    public load(client: C): Promise<EventBuilder<C, K>[]> {
        return new Promise(async (resolved, rejected) => {
            try {
                const data: EventBuilder<C, K>[] = await importFromDir(this.path, this.includesDir);

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