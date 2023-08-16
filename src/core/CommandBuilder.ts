import {
    Client
} from "discord.js";
import { CommandStructure } from "../types";

export class CommandBuilder<C extends Client, O = {}, A extends any[] = unknown[]> {
    public readonly type: CommandStructure<C, O, A>['type'];
    public readonly structure: CommandStructure<C, O, A>['structure'];
    public readonly options?: Partial<CommandStructure<C, O, A>['options']>;
    public readonly run: CommandStructure<C, O, A>['run'];
    public readonly autocomplete?: CommandStructure<C, O, A>['autocomplete']
    
    constructor(data: CommandStructure<C, O, A>) {
        this.type = data.type;
        this.structure = data.structure;
        this.options = data.options;
        this.run = data.run;
        this.autocomplete = data.autocomplete;
    };

    toJSON(): CommandStructure<C, O, A> {
        return {
            type: this.type,
            structure: this.structure,
            options: this.options,
            run: this.run,
            autocomplete: this.autocomplete
        } as CommandStructure<C, O, A>;
    };
};