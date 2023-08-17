import {
    AutocompleteInteraction,
    ButtonInteraction,
    ChannelSelectMenuInteraction,
    ChatInputCommandInteraction,
    Client,
    ClientEvents,
    ContextMenuCommandBuilder,
    MentionableSelectMenuInteraction,
    MessageContextMenuCommandInteraction,
    ModalSubmitInteraction,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    RoleSelectMenuInteraction,
    SlashCommandBuilder,
    SlashCommandSubcommandsOnlyBuilder,
    StringSelectMenuInteraction,
    UserContextMenuCommandInteraction,
    UserSelectMenuInteraction
} from "discord.js";

type Awaitable<T> = PromiseLike<T> | T;

// Commands Handler
export enum CommandType {
    ChatInput = 1,
    UserContext = 2,
    MessageContext = 3
}

export type ChatInputCommandBuilder = 
    SlashCommandBuilder |
    Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> |
    SlashCommandSubcommandsOnlyBuilder |
    RESTPostAPIChatInputApplicationCommandsJSONBody;

export interface CommandStructureChatInput<C extends Client<true>, O = {}, A extends any[] = unknown[]> {
    type: 1,
    structure: ChatInputCommandBuilder;
    options?: Partial<O>;
    run: (client: C, interaction: ChatInputCommandInteraction, ...args: A) => Awaitable<void>;
    autocomplete?: (client: C, interaction: AutocompleteInteraction, ...args: A) => Awaitable<void>;
    disabled?: boolean;
}

export interface CommandStructureUserContext<C extends Client<true>, O = {}, A extends any[] = unknown[]> {
    type: 2,
    structure: ContextMenuCommandBuilder;
    options?: Partial<O>;
    run: (client: C, interaction: UserContextMenuCommandInteraction, ...args: A) => Awaitable<void>;
    autocomplete?: never;
    disabled?: boolean;
}

export interface CommandStructureMessageContext<C extends Client<true>, O = {}, A extends any[] = unknown[]> {
    type: 3,
    structure: ContextMenuCommandBuilder;
    options?: Partial<O>;
    run: (client: C, interaction: MessageContextMenuCommandInteraction, ...args: A) => Awaitable<void>;
    autocomplete?: never;
    disabled?: boolean;
}

export type CommandStructure<C extends Client<true>, O = {}, A extends any[] = unknown[]> =
    CommandStructureChatInput<C, O, A> |
    CommandStructureUserContext<C, O, A> |
    CommandStructureMessageContext<C, O, A>;

// Events Handler
export interface EventStructure<C extends Client, K extends keyof ClientEvents> {
    event: K,
    once?: boolean,
    run: (client: C, ...args: ClientEvents[K]) => Awaitable<void>
}

export interface CustomEventStructure<C extends Client, I extends { [k: string]: any[] }, K extends keyof I> {
    event: K,
    once?: boolean,
    run: (client: C, ...args: I[K]) => Awaitable<void>
}

// Components Handler
export enum ComponentType {
    Button = 1,
    StringSelect = 2,
    UserSelect = 3,
    RoleSelect = 4,
    MentionableSelect = 5,
    ChannelSelect = 6,
    Modal = 7
}

export interface ComponentStructureButton<C extends Client<true>> {
    type: 1,
    customId: string,
    run: (client: C, interaction: ButtonInteraction) => Awaitable<void>,
    disabled?: boolean
}

export interface ComponentStructureStringSelect<C extends Client<true>> {
    type: 2,
    customId: string,
    run: (client: C, interaction: StringSelectMenuInteraction) => Awaitable<void>,
    disabled?: boolean
}

export interface ComponentStructureUserSelect<C extends Client<true>> {
    type: 3,
    customId: string,
    run: (client: C, interaction: UserSelectMenuInteraction) => Awaitable<void>,
    disabled?: boolean
}

export interface ComponentStructureRoleSelect<C extends Client<true>> {
    type: 4,
    customId: string,
    run: (client: C, interaction: RoleSelectMenuInteraction) => Awaitable<void>,
    disabled?: boolean
}

export interface ComponentStructureMentionableSelect<C extends Client<true>> {
    type: 5,
    customId: string,
    run: (client: C, interaction: MentionableSelectMenuInteraction) => Awaitable<void>,
    disabled?: boolean
}

export interface ComponentStructureChannelSelect<C extends Client<true>> {
    type: 6,
    customId: string,
    run: (client: C, interaction: ChannelSelectMenuInteraction) => Awaitable<void>,
    disabled?: boolean
}

export interface ComponentStructureModalSubmit<C extends Client<true>> {
    type: 7,
    customId: string,
    run: (client: C, interaction: ModalSubmitInteraction) => Awaitable<void>,
    disabled?: boolean
}

export type ComponentStructure<C extends Client<true>> =
    ComponentStructureButton<C> |
    ComponentStructureStringSelect<C> |
    ComponentStructureUserSelect<C> |
    ComponentStructureRoleSelect<C> |
    ComponentStructureMentionableSelect<C> |
    ComponentStructureChannelSelect<C> |
    ComponentStructureModalSubmit<C>;

// Events
export interface CommandsHandlerEvents {
    deployStart: [],
    deployFinish: [],
    deployError: [error: any],
    fileSkip: [command: ChatInputCommandBuilder | ContextMenuCommandBuilder],
    fileLoad: [command: ChatInputCommandBuilder | ContextMenuCommandBuilder]
}

export interface EventsHandlerEvents {
    fileSkip: [event: string],
    fileLoad: [event: string]
}

export interface ComponentsHandlerEvents {
    fileSkip: [event: string],
    fileLoad: [event: string]
}

export enum Events {
    DeployStart = 'deployStart',
    DeployFinish = 'deployFinish',
    DeployError = 'deployError',
    FileSkip = 'fileSkip',
    FileLoad = 'fileLoad'
}
