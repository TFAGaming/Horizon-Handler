import { Client, Collection } from "discord.js";
import { ComponentStructure } from "../types";
import { HorizonError, importFromDir } from "./utils";
import { EventEmitter } from 'events';
import { ComponentBuilder } from "./ComponentBuilder";

export class ComponentsHandler<C extends Client> extends EventEmitter {
    public readonly collection: Collection<string, ComponentStructure<C>> = new Collection();
    public readonly path: string;
    public readonly includesDir?: boolean = false;

    /**
     * Creates a new handler for Discord bot client's interaction components events.
     * @param {string} path The directory path.
     * @param {boolean | undefined} includesDir Whenever the directory has sub-dirs or not. 
     * @typeParam {Client} C The Discord bot Client.
     */
    constructor(path: string, includesDir?: boolean) {
        super({ captureRejections: false });

        if (!path) throw new HorizonError('MissingRequiredParameter', '\'path\' is required for the constructor.');

        if (includesDir && typeof includesDir !== 'boolean') throw new HorizonError('InvalidParameterType', '\'includesDir\' is not type of boolean.');

        this.path = path;
        this.includesDir = includesDir;
    };

    /**
     * Creates a new component for the handler.
     * 
     * **Warning**: Make sure that you have exported it as `default`.
     * 
     * ```ts
     * // TypeScript
     * export default new [handler].component(...);
     * 
     * // JavaScript (CommonJS)
     * module.exports = new [handler].component(...);
     * ```
     */
    public component = class extends ComponentBuilder<C> {
        constructor(data: ComponentStructure<C>) {
            super(data);
        };
    };

    /**
     * Loads all components from the provided path.
     * @param {C} defaultListener The options.
     */
    public load(defaultListener?: C): Promise<ComponentStructure<C>[]> {
        return new Promise(async (resolved, rejected) => {
            try {
                const data = await importFromDir<ComponentStructure<C>>(this.path, {
                    includesDir: this.includesDir
                });

                for (const module of data) {
                    if (!module.customId || !module.type || !module.run || module.disabled) {
                        this.emit('fileSkip', module.customId, module.type);

                        continue;
                    };

                    if (defaultListener) {
                        const client = defaultListener;

                        if (!(client instanceof Client)) throw new TypeError('client is not instance of Client.');

                        client.on('interactionCreate', async (interaction) => {
                            if (interaction.isButton() && module.type === 1 && interaction.customId === module.customId) module.run(client, interaction);

                            if (interaction.isStringSelectMenu() && module.type === 2 && interaction.customId === module.customId) module.run(client, interaction);
                            if (interaction.isUserSelectMenu() && module.type === 3 && interaction.customId === module.customId) module.run(client, interaction);
                            if (interaction.isRoleSelectMenu() && module.type === 4 && interaction.customId === module.customId) module.run(client, interaction);
                            if (interaction.isMentionableSelectMenu() && module.type === 5 && interaction.customId === module.customId) module.run(client, interaction);
                            if (interaction.isChannelSelectMenu() && module.type === 6 && interaction.customId === module.customId) module.run(client, interaction);

                            if (interaction.isModalSubmit() && module.type === 7 && interaction.customId === module.customId) module.run(client, interaction);
                        });
                    };

                    this.collection.set(module.customId, module);

                    this.emit('fileLoad', module.customId, module.type);
                };

                resolved(data);
            } catch (e) {
                rejected(e);
            };
        });
    };


    /**
     * Reloads all components from the provided path.
     */
    public reload(): Promise<ComponentStructure<C>[]> {
        return new Promise(async (resolved, rejected) => {
            try {
                this.collection.clear();

                const output = await this.load();

                resolved(output);
            } catch (e) {
                rejected(e);
            };
        });
    };

    public addComponents(...components: ComponentStructure<C>[]) {
        for (const component of components) {
            if (!component || !component.customId || !component.type ||!component.run) continue;

            this.collection.set(component.customId, component);
        };

        return this;
    };

    public setComponents(...components: ComponentStructure<C>[]) {
        this.collection.clear();

        for (const component of components) {
            if (!component || !component.customId || !component.type ||!component.run) continue;

            this.collection.set(component.customId, component);
        };

        return this;
    };
};