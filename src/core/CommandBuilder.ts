import {
    Client
} from "discord.js";
import { CommandStructure } from "../types";

export class CommandBuilder<C extends Client, O = {}, A extends unknown = unknown> {
    public readonly type: CommandStructure<C, O, A>['type'];
    public readonly structure: CommandStructure<C, O, A>['structure'];
    public readonly options?: CommandStructure<C, O, A>['options'];
    public readonly run: CommandStructure<C, O, A>['run'];
    
    constructor(data: CommandStructure<C, O, A>) {
        this.type = data.type;
        this.structure = data.structure;
        this.options = data.options;
        this.run = data.run;
    };
};