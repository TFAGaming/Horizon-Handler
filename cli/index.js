#! /usr/bin/env node

const { Command } = require('commander');
const { version: pkgversion } = require('../package.json');
const fs = require('fs-extra');

const program = new Command();

program
    .name('Horizon Handler')
    .version(pkgversion)
    .description('A powerful Discord bot commands, events, and components handler.');

program.command('js-example')
    .description('Create a Discord bot using Horizon Handler, written in JavaScript.')
    .argument('<path>', 'The path of the new project.')
    .action(async (path, options) => {

        try {
            if (!fs.existsSync(path)) {
                console.error(`error: '${path}' does not exist.`);
                process.exit(1);
            };

            const dateBefore = Date.now();

            await fs.copy('./cli/sources/example-JS/', path, {
                preserveTimestamps: true,
                dereference: true
            });

            const dateNow = Date.now();

            const arr = [
                'Initialize a new package: npm init',
                'Install all dependencies: npm install',
                'Change the string \'TOKEN\' to your actual bot token in index.js.',
                'Start the project: node .'
            ];

            console.log(`Done, your new project is ready to use. Follow the steps below to start your bot:\n\n${arr.map((v, i) => `${i + 1}. ${v}`).join('\n')}\n\nTook: ${dateNow - dateBefore}ms`);
        } catch (err) {
            console.error('Something went wrong while executing the command.\n', err);
            process.exit(1);
        };

    });

program.command('ts-example')
    .description('Create a Discord bot using Horizon Handler, written in TypeScript.')
    .argument('<path>', 'The path of the new project.')
    .action(async (path, options) => {

        try {
            if (!fs.existsSync(path)) {
                console.error(`error: '${path}' path does not exist.`);
                process.exit(1);
            };

            const dateBefore = Date.now();

            await fs.copy('./cli/sources/example-TS/', path, {
                preserveTimestamps: true,
                dereference: true
            });

            const dateNow = Date.now();

            const arr = [
                'Initialize a new package: npm init',
                'Install all dependencies: npm install',
                'Change the string \'TOKEN\' to your actual bot token in index.ts.',
                'Compile the TypeScript files to JavaScript files: npm run compile',
                'Start the project: node .'
            ];

            console.log(`Done, your new project is ready to use. Follow the steps below to start your bot:\n\n${arr.map((v, i) => `${i + 1}. ${v}`).join('\n')}\n\nTook: ${dateNow - dateBefore}ms`);
        } catch (err) {
            console.error('error: Something went wrong while executing the command.\n', err);
            process.exit(1);
        };

    });

program.command('links')
    .description('View all possible useful and informative links.')
    .action(() => {
        const arr = [
            'npm page: https://npmjs.com/package/horizon-handler',
            'Source (GitHub): https://github.com/TFAGaming/Horizon-Handler',
            'Documentation: https://tfagaming.github.io/Horizon-Handler/',
            'Discord: https://discord.gg/E6VFACWu5V'
        ];

        console.log('Here are some useful website links to visit:\n\n' + arr.join('\n'));
    });

program.command('about')
    .description('About Horizon Handler.')
    .action(() => {
        console.log(`Horizon Handler is a powerful Discord commands, events, and components handler. It uses discord.js as the first and important library for interacting with the Discord API easily. This package provides a simple usage of creating handlers for Discord bots, and it has many typings feature.\n\nThis package is not affiliated with Discord and/or discord.js.\n\nHead developer: T.F.A (https://github.com/TFAGaming)\nLicense: MIT`);
    });

program.parse(process.argv);
