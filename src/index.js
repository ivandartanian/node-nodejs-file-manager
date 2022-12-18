import * as path from 'path';
import { fileURLToPath } from 'url';

const getUserName = () => process.argv.slice(2)[0].slice(11);

const userName = getUserName();
process.stdout.write(`Welcome to the File Manager, ${userName}!\n`);
process.stdout.write(`You are currently in ${path.dirname(fileURLToPath(import.meta.url))}\n`);

const echoInput = (chunk) => {
    const chunkStringified = chunk.toString();
    process.stdout.write(`You are currently in ${path.dirname(fileURLToPath(import.meta.url))}\n`);
    if (chunkStringified.includes('.exit')) {
        process.stdout.write('Thank you for using File Manager, Username, goodbye!');
        process.exit(0);
    };
};

process.stdin.on('data', echoInput);
process.on('SIGINT', () => {
    process.stdout.write(`You are currently in ${path.dirname(fileURLToPath(import.meta.url))}\n`);
    process.stdout.write('Thank you for using File Manager, Username, goodbye!');
    process.exit(0);
}
);

