import {
    Client
} from "discord.js";
import { CommandStructure } from "./types";

export class CommandBuilder<C extends Client, O = {}, A extends any[] = unknown[]> {
    private readonly disabled: CommandStructure<C, O, A>['disabled'];
    public readonly type: CommandStructure<C, O, A>['type'];
    public readonly structure: CommandStructure<C, O, A>['structure'];
    public readonly options?: Partial<CommandStructure<C, O, A>['options']>;
    public readonly run: CommandStructure<C, O, A>['run'];
    public readonly autocomplete?: CommandStructure<C, O, A>['autocomplete']
    
    constructor(data: CommandStructure<C, O, A>);

    toJSON(): CommandStructure<C, O, A>;
}