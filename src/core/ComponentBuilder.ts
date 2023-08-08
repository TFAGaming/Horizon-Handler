import {
    Client
} from "discord.js";
import { ComponentStructure } from "../types";

export class ComponentBuilder<C extends Client> {
    public readonly type: ComponentStructure<C>['type'];
    public readonly customId: ComponentStructure<C>['customId'];
    public readonly run: ComponentStructure<C>['run'];
    
    constructor(data: ComponentStructure<C>) {
        this.type = data.type;
        this.customId = data.customId;
        this.run = data.run;
    };
};