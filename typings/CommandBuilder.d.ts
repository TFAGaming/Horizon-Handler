import { Client } from "discord.js";
import { CommandStructure } from "./types";

export declare class CommandBuilder<C extends Client, O = {}, A extends any[] = unknown[]> {
    readonly type: CommandStructure<C, O, A>['type'];
    readonly structure: CommandStructure<C, O, A>['structure'];
    readonly options?: Partial<CommandStructure<C, O, A>['options']>;
    readonly run: CommandStructure<C, O, A>['run'];
    readonly autocomplete?: CommandStructure<C, O, A>['autocomplete'];

    constructor(data: CommandStructure<C, O, A>);
    
    toJSON(): CommandStructure<C, O, A>;
}
