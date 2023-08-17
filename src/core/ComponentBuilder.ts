import {
    Client
} from "discord.js";
import { ComponentStructure } from "../types";

export class ComponentBuilder<C extends Client> {
    private readonly disabled?: ComponentStructure<C>['disabled'];
    public readonly type: ComponentStructure<C>['type'];
    public readonly customId: ComponentStructure<C>['customId'];
    public readonly run: ComponentStructure<C>['run'];
    
    constructor(data: ComponentStructure<C>) {
        this.type = data.type;
        this.customId = data.customId;
        this.run = data.run;
        this.disabled = data.disabled;
    };

    toJSON(): ComponentStructure<C> {
        return {
            type: this.type,
            customId: this.customId,
            run: this.run,
            disabled: this.disabled
        } as ComponentStructure<C>;
    };
};