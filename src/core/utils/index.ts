import { join, extname, resolve } from 'path';
import { promises as fspromises } from 'fs';
import { HorizonErrorCodes } from '../../types';

export const importFromDir = async <T>(path: string, options?: { includesDir?: boolean }) => {
    const data: T[] = [];

    const main = async (directoryPath: string) => {
        try {
            if (options?.includesDir) {
                const files = await fspromises.readdir(directoryPath);

                for (const file of files) {
                    const filePath = join(directoryPath, file);
                    const fileStat = await fspromises.stat(filePath);

                    if (fileStat.isDirectory()) {
                        await main(filePath);
                    } else {
                        const fileExtension = extname(file);

                        if (fileExtension === '.js' || fileExtension === '.cjs' || fileExtension === '.ts') {
                            const url = resolve("./", `${filePath}${filePath.endsWith("/") ? "" : "/"}`);

                            const fileData = require(url);

                            data.push(fileData?.default ? fileData.default : fileData);
                        };
                    };
                };
            } else {
                const files = await fspromises.readdir(directoryPath);

                for (const file of files) {
                    const filePath = join(directoryPath, file);
                    const fileExtension = extname(file);

                    if (fileExtension === '.js' || fileExtension === '.cjs' || fileExtension === '.ts') {
                        const url = resolve("./", `${filePath}${filePath.endsWith("/") ? "" : "/"}`);

                        const fileData = require(url);

                        data.push(fileData?.default ? fileData.default : fileData);
                    };
                };
            };
        } catch (err) {
            throw new Error('An error has occured.\n' + err);
        };
    };

    await main(path);

    return data;
};

export class HorizonError<K extends keyof HorizonErrorCodes> extends Error {
    constructor(code: K, ...args: string[]) {
        super(`[Horizon Handler] ${code}: ${args.join('')}`)
    };
};