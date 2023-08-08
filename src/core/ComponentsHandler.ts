import { Client } from "discord.js";
import { ComponentStructure } from "../types";
import { importFromDir } from "./functions";
import { EventEmitter } from 'events';
import { ComponentBuilder } from "./ComponentBuilder";

export class ComponentsHandler<C extends Client> extends EventEmitter {
    public readonly path: string;
    public readonly includesDir?: boolean = false;

    /**
     * Creates a new handler for Discord bot client's events.
     * 
     * **Note**: This handler doesn't support custom events names, they all must be from the enum `ClientEvents`.
     * @param {string} path The directory path.
     * @param {boolean | undefined} includesDir Whenever the directory has sub-dirs or not. 
     */
    constructor(path: string, includesDir?: boolean) {
        super({ captureRejections: false });

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
     * @param {C} client The Discord bot client to listen to these events.
     * @param {boolean} defaultListener Whenever the handler should listen to these components.
     */
    public load(client: C, defaultListener?: boolean): Promise<ComponentStructure<C>[]> {
        return new Promise(async (resolved, rejected) => {
            try {
                const data: ComponentStructure<C>[] = await importFromDir(this.path, {
                    includesDir: this.includesDir
                });

                for (const module of data) {
                    if (!module.customId || !module.type || !module.run) {
                        this.emit('fileSkip', module.customId, module.type);

                        continue;
                    };

                    if (defaultListener) client.on('interactionCreate', async (interaction) => {
                        if (interaction.isButton() && module.type === 1 && interaction.customId === module.customId) module.run(client, interaction);

                        if (interaction.isStringSelectMenu() && module.type === 2 && interaction.customId === module.customId) module.run(client, interaction);
                        if (interaction.isUserSelectMenu() && module.type === 3 && interaction.customId === module.customId) module.run(client, interaction);
                        if (interaction.isRoleSelectMenu() && module.type === 4 && interaction.customId === module.customId) module.run(client, interaction);
                        if (interaction.isMentionableSelectMenu() && module.type === 5 && interaction.customId === module.customId) module.run(client, interaction);
                        if (interaction.isChannelSelectMenu() && module.type === 6 && interaction.customId === module.customId) module.run(client, interaction);

                        if (interaction.isModalSubmit() && module.type === 7 && interaction.customId === module.customId) module.run(client, interaction);
                    });

                    this.emit('fileLoad', module.customId, module.type);
                };

                resolved(data);
            } catch (e) {
                rejected(e);
            };
        });
    };

};