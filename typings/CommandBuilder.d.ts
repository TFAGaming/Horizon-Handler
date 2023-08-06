import { Client } from "discord.js";
import { CommandStructure } from "./types";

export declare class CommandBuilder<C extends Client, O = {}, A extends unknown = unknown> {
    readonly type: CommandStructure<C, O, A>['type'];
    readonly structure: CommandStructure<C, O, A>['structure'];
    readonly options?: CommandStructure<C, O, A>['options'];
    readonly run: CommandStructure<C, O, A>['run'];
    
    constructor(data: CommandStructure<C, O, A>);
}
