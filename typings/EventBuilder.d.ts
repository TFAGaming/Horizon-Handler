import { Client, ClientEvents } from "discord.js";
import { EventStructure } from "./types";

export declare class EventBuilder<C extends Client, K extends keyof ClientEvents> {
    readonly event: EventStructure<C, K>['event'];
    readonly once?: EventStructure<C, K>['once'];
    readonly run: EventStructure<C, K>['run'];
    
    constructor(data: EventStructure<C, K>);

    toJSON(): EventStructure<C, K>
}
