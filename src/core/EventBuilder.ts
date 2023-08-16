import {
    Client,
    ClientEvents
} from "discord.js";
import { EventStructure } from "../types";

export class EventBuilder<C extends Client, K extends keyof ClientEvents> {
    public readonly event: EventStructure<C, K>['event'];
    public readonly once?: EventStructure<C, K>['once'];
    public readonly run: EventStructure<C, K>['run'];
    
    constructor(data: EventStructure<C, K>) {
        this.event = data.event;
        this.once = data.once;
        this.run = data.run;
    };

    toJSON(): EventStructure<C, K> {
        return {
            event: this.event,
            once: this.once,
            run: this.run
        } as EventStructure<C, K>;
    };
};