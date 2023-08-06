import {
    Client
} from "discord.js";
import { CustomEventStructure } from "../types";

export class CustomEventBuilder<C extends Client, I extends { [k: string]: any[] }, K extends keyof I = keyof I> {
    public readonly event: CustomEventStructure<C, I, K>['event'];
    public readonly once?: CustomEventStructure<C, I, K>['once'];
    public readonly run: CustomEventStructure<C, I, K>['run'];
    
    constructor(data: CustomEventStructure<C, I, K>) {
        this.event = data.event;
        this.once = data.once;
        this.run = data.run;
    };
};
