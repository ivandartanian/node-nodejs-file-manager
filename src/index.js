import * as path from 'path';
import * as fs from 'fs'

const {promises} = fs;

const getUserName = () => process.argv.slice(2)[0].slice(11);
const currentDirMessage = () => process.stdout.write(`You are currently in ${process.cwd()}\n`);
const byeMessage = () => process.stdout.write('Thank you for using File Manager, Username, goodbye!\n');

const userName = getUserName();
const rootDir = process.cwd();
// const rootDir = path.resolve('./');
// const prevRootDir = path.resolve('../');

process.stdout.write(`Welcome to the File Manager, ${userName}!\n`);
currentDirMessage();

const echoInput = async (chunk) => {
    const chunkStringified = chunk.toString().trim();
    const chunkArr = chunkStringified.split(' ');
    if (chunkStringified === '.exit') {
        byeMessage();
        process.exit(0);
    };
    if(chunkStringified === 'up' /* && prevRootDir !== path.resolve('../') */) {
        process.chdir('../');
    };
    if(chunkArr[0] === 'cd' && chunkArr[1]) {
        process.chdir(chunkArr[1]);
    };
    if(chunkStringified === 'ls') {
        const filesArr = [];

        const files = await promises.readdir(process.cwd());
        for await (const file of files) {
            const stat = await promises.stat(file);
            filesArr.push({Name: file, Type: stat.isFile() ? 'file' : 'directory'});
        }
        console.table(filesArr);
    }
         
    currentDirMessage();
}; 

process.stdin.on('data', echoInput);
process.on('SIGINT', () => {
    currentDirMessage();
    byeMessage();
    process.exit(0);
}
);



