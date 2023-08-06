import { Client } from "discord.js";
import { CustomEventStructure } from "./types";

export declare class CustomEventBuilder<C extends Client, I extends {
    [k: string]: any[];
}, K extends keyof I = keyof I> {
    readonly event: CustomEventStructure<C, I, K>['event'];
    readonly once?: CustomEventStructure<C, I, K>['once'];
    readonly run: CustomEventStructure<C, I, K>['run'];
    
    constructor(data: CustomEventStructure<C, I, K>);
}
