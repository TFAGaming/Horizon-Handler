#! /usr/bin/env node

const { Command } = require('commander');
const { version: pkgversion } = require('../package.json');
const fs = require('fs-extra');
const { join } = require('path');
const { readFileSync, writeFileSync } = require('fs');
require('colors');

const program = new Command();

program
    .name('Horizon Handler'.green)
    .version(pkgversion)
    .description('A powerful Discord bot commands, events, and components handler.');

program.command('js-example')
    .description('Generate an example Discord bot using Horizon Handler, written in JavaScript.')
    .argument('<path>', 'The path of the new project.')
    .option('-s, --token <string>', 'Add bot token automatically.')
    .action(async (path, options) => {

        try {
            if (!fs.existsSync(path)) {
                console.error(`[Error] The path '${path}' does not exist.`.red);
                process.exit(1);
            };

            console.log('[Warning] Started creating new project "JavaScript Example"...'.yellow);

            const dateBefore = Date.now();

            await fs.copy(join(__dirname, './sources/example-JS/'), path || process.cwd(), {
                preserveTimestamps: true,
                dereference: true
            });

            const optionToken = options?.token;

            if (optionToken) {
                const indexPath = join(path || process.cwd(), 'index.js');

                const indexContent = readFileSync(indexPath, 'utf-8');

                

                const indexNewOut = indexContent.replace(/TOKEN/g, optionToken);

                writeFileSync(indexPath, indexNewOut, { encoding: 'utf-8' });
            };

            const dateNow = Date.now();

            let arr = [
                'Initialize a new package: npm init',
                'Install all dependencies: npm install',
                'Change the string \'TOKEN\' to your actual bot token in index.js.',
                'Start the project: node .'
            ];

            if (optionToken) arr.splice(2, 1);

            console.log(`[Success] Done, your new project is ready to use. Follow the steps below to start your bot:\n`.green)
            console.log(`${arr.map((v, i) => `${(i + 1).toString().blue}. ${v}`).join('\n')}\n`)
            console.log(`[Info] Time: ${dateNow - dateBefore}ms, process path: ${process.cwd()}`);

        } catch (err) {
            console.error('[Error] Something went wrong while executing the command.\n'.red, err);
            process.exit(1);
        };

    });

program.command('ts-example')
    .description('Generate an example Discord bot using Horizon Handler, written in TypeScript.')
    .argument('<path>', 'The path of the new project.')
    .option('-s, --token <string>', 'Add bot token automatically.')
    .action(async (path, options) => {

        try {
            if (!fs.existsSync(path)) {
                console.error(`[Error] The path '${path}' does not exist.`.red);
                process.exit(1);
            };

            console.log('[Warning] Started creating new project "TypeScript Example"...'.yellow);

            const dateBefore = Date.now();

            await fs.copy(join(__dirname, './sources/example-TS/'), path || process.cwd(), {
                preserveTimestamps: true,
                dereference: true
            });

            const optionToken = options?.token;

            if (optionToken) {
                const indexPath = join(path || process.cwd(), 'src/index.ts');

                const indexContent = readFileSync(indexPath, 'utf-8');

                const indexNewOut = indexContent.replace(/TOKEN/g, optionToken);

                writeFileSync(indexPath, indexNewOut, { encoding: 'utf-8' });
            };

            const dateNow = Date.now();

            const arr = [
                'Initialize a new package: npm init',
                'Install all dependencies: npm install',
                'Change the string \'TOKEN\' to your actual bot token in index.ts.',
                'Compile the TypeScript files to JavaScript files: npm run compile',
                'Start the project: node .'
            ];

            if (optionToken) arr.splice(2, 1);

            console.log(`[Success] Done, your new project is ready to use. Follow the steps below to start your bot:\n`.green)
            console.log(`${arr.map((v, i) => `${(i + 1).toString().blue}. ${v}`).join('\n')}\n`)
            console.log(`[Info] Time: ${dateNow - dateBefore}ms, process path: ${process.cwd()}`);

        } catch (err) {
            console.error('[Error] Something went wrong while executing the command.\n'.red, err);
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

        console.log('Here are some useful website links to visit:\n'.green);
        console.log(arr.map((v) => {
            const split = v.split(':', 3);

            if (split.length <= 0) return v;

            return `${split[0].cyan}: ${split[1]}:${split[2]}}`;
        }).join('\n'));
    });

program.command('about')
    .description('About Horizon Handler.')
    .action(() => {
        console.log(`Horizon Handler is a powerful Discord commands, events, and components handler. It uses discord.js as the first and important library for interacting with the Discord API easily. This package provides a simple usage of creating handlers for Discord bots, and it has many typings feature.\n\nThis package is not affiliated with Discord and/or discord.js.\n\nHead developer: T.F.A (https://github.com/TFAGaming)\nLicense: MIT`);
    });

program.parse(process.argv);
