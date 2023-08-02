import {
    ChatInputCommandInteraction,
    Client,
    ClientEvents,
    ContextMenuCommandBuilder,
    MessageContextMenuCommandInteraction,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    SlashCommandBuilder,
    SlashCommandSubcommandsOnlyBuilder,
    UserContextMenuCommandInteraction
} from "discord.js";

// Commands
export declare enum CommandType {
    ChatInput = 1,
    UserContext = 2,
    MessageContext = 3
};

export type ChatInputCommandBuilder = 
    SlashCommandBuilder |
    Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> |
    SlashCommandSubcommandsOnlyBuilder |
    RESTPostAPIChatInputApplicationCommandsJSONBody;

export interface CommandStructureChatInput<C extends Client, O = {}, A extends unknown = unknown> {
    type: 1,
    structure: ChatInputCommandBuilder;
    options?: O;
    run: (client: C, interaction: ChatInputCommandInteraction, args?: A) => void;
};

export interface CommandStructureUserContext<C extends Client, O = {}, A extends unknown = unknown> {
    type: 2,
    structure: ContextMenuCommandBuilder;
    options?: O;
    run: (client: C, interaction: UserContextMenuCommandInteraction, args?: A) => void;
};

export interface CommandStructureMessageContext<C extends Client, O = {}, A extends unknown = unknown> {
    type: 3,
    structure: ContextMenuCommandBuilder;
    options?: O;
    run: (client: C, interaction: MessageContextMenuCommandInteraction, args?: A) => void;
};

export type CommandStructure<C extends Client, O = {}, A extends unknown = unknown> =
    CommandStructureChatInput<C, O, A> |
    CommandStructureUserContext<C, O, A> |
    CommandStructureMessageContext<C, O, A>;

// Events
export interface EventStructure<C extends Client, K extends keyof ClientEvents> {
    event: K,
    once?: boolean,
    run: (client: C, ...args: ClientEvents[K]) => void
};