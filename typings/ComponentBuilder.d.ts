import { Client } from "discord.js";
import { ComponentStructure } from "./types";

export declare class ComponentBuilder<C extends Client> {
    readonly type: ComponentStructure<C>['type'];
    readonly customId: ComponentStructure<C>['customId'];
    readonly run: ComponentStructure<C>['run'];

    constructor(data: ComponentStructure<C>);

    toJSON(): ComponentStructure<C>
}
