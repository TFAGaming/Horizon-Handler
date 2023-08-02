import { join, extname, resolve } from 'path';
import { promises as fspromises } from 'fs';

export const importFromDir = async <T>(path: string, includesDir?: boolean) => {
    const data: T[] = [];

    const main = async (directoryPath: string) => {
        try {
            if (includesDir) {
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

                            console.log(url)

                            const fileData = require(url).default;

                            data.push(fileData);
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

                        console.log(url)

                        const fileData = require(url).default;

                        data.push(fileData);
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