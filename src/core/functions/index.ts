import { join, extname, resolve } from 'path';
import { promises as fspromises } from 'fs';

export const importFromDir = async <T>(path: string, options?: { includesDir?: boolean, onLoadedFile?: (file: string, path: string) => string }) => {
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

                        if (fileExtension === '.js' || fileExtension === '.cjs') {
                            const url = resolve("./", `${filePath}${filePath.endsWith("/") ? "" : "/"}`);

                            const fileData = require(url).default;

                            data.push(fileData);

                            if (options?.onLoadedFile) console.log(options?.onLoadedFile(file, url));
                        };
                    };
                };
            } else {
                const files = await fspromises.readdir(directoryPath);

                for (const file of files) {
                    const filePath = join(directoryPath, file);
                    const fileExtension = extname(file);

                    if (fileExtension === '.js' || fileExtension === '.cjs') {
                        const url = resolve("./", `${filePath}${filePath.endsWith("/") ? "" : "/"}`);

                        const fileData = require(url).default;

                        data.push(fileData);

                        if (options?.onLoadedFile) console.log(options?.onLoadedFile(file, url));
                    };
                };
            };
        } catch (err) {
            console.error('Error while loading files.\n', err);
        };
    };

    await main(path);

    return data;
};