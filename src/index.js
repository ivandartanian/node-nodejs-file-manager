import * as fs from 'fs'
import * as os from 'os';
import * as zlib from 'zlib';
import { createHash } from 'crypto';

const { promises } = fs;

const getUserName = () => process.argv.slice(2)[0].slice(11);
const currentDirMessage = () => process.stdout.write(`You are currently in ${process.cwd()}\n`);
const byeMessage = () => process.stdout.write(`Thank you for using File Manager, ${userName}, goodbye!\n`);

const userName = getUserName();

process.stdout.write(`Welcome to the File Manager, ${userName}!\n`);
currentDirMessage();
process.stdout.write(`Enter command: `);

const echoInput = async (chunk) => {
    try {
        let isFail = true;
        const chunkStringified = chunk.toString().trim();
        const chunkArr = chunkStringified.split(' ');

        if (chunkStringified === '.exit') {
            currentDirMessage();
            byeMessage();
            process.exit(0);

            isFail = false;
        };
        if (chunkStringified === 'up') {
            process.chdir('../');
            isFail = false;
        };
        if (chunkArr[0] === 'cd' && chunkArr[1]) {
            process.chdir(chunkArr[1]);
            isFail = false;
        };
        if (chunkStringified === 'ls') {
            const filesArr = [];

            const files = await promises.readdir(process.cwd());
            for await (const file of files) {
                const stat = await promises.stat(file);
                filesArr.push({ Name: file, Type: stat.isFile() ? 'file' : 'directory' });
            }
            console.table(filesArr);
            isFail = false;
        };

        if (chunkArr[0] === 'cat' && chunkArr[1]) {
            const readStream = fs.createReadStream(chunkArr[1], { encoding: 'utf-8' });
            for await (const row of readStream) {
                process.stdout.write(`${row}\n`)
            };
            isFail = false;
        };

        if (chunkArr[0] === 'add' && chunkArr[1]) {
            fs.createWriteStream(chunkArr[1], { encoding: 'utf8' })
            isFail = false;
        };

        if (chunkArr[0] === 'rn' && chunkArr[1] && chunkArr[2]) {
            if (!fs.existsSync(chunkArr[1])) {
                throw new Error();
            };
            fs.rename(chunkArr[1], chunkArr[2], () => { })
            isFail = false;
        };

        if (chunkArr[0] === 'cp' && chunkArr[1] && chunkArr[2]) {
            if (!fs.existsSync(chunkArr[1])) {
                throw new Error();
            };
            const rs = fs.createReadStream(chunkArr[1], { encoding: 'utf8' });
            const ws = fs.createWriteStream(chunkArr[2], { encoding: 'utf8' });
            rs.pipe(ws);
            isFail = false;
        };

        if (chunkArr[0] === 'mv' && chunkArr[1] && chunkArr[2]) {
            if (!fs.existsSync(chunkArr[1])) {
                throw new Error();
            };
            const rs = fs.createReadStream(chunkArr[1], { encoding: 'utf8' });
            const ws = fs.createWriteStream(chunkArr[2], { encoding: 'utf8' });
            rs.pipe(ws);
            fs.rm(chunkArr[1], () => { })
            isFail = false;
        };

        if (chunkArr[0] === 'rm' && chunkArr[1]) {
            if (!fs.existsSync(chunkArr[1])) {
                throw new Error();
            };
            fs.rm(chunkArr[1], () => { })
            isFail = false;
        };

        if (chunkArr?.[0] === 'os' && chunkArr[1] === '--EOL') {
            process.stdout.write(`${os.EOL}\n`);
            isFail = false;
        };

        if (chunkArr?.[0] === 'os' && chunkArr[1] === '--cpus') {
            process.stdout.write(`Amount of CPUS: ${os.cpus().length}\n`);
            os.cpus().forEach(cpu => process.stdout.write(`Model: ${cpu.model}; Clock rate: ${cpu.speed / 1000}GHz\n`));
            isFail = false;
        };

        if (chunkArr?.[0] === 'os' && chunkArr[1] === '--homedir') {
            process.stdout.write(`${os.homedir}\n`);
            isFail = false;
        };

        if (chunkArr?.[0] === 'os' && chunkArr[1] === '--username') {
            process.stdout.write(`${os.userInfo().username}\n`);
            isFail = false;
        };

        if (chunkArr?.[0] === 'os' && chunkArr[1] === '--architecture') {
            process.stdout.write(`${os.arch()}\n`);
            isFail = false;
        };

        if (chunkArr?.[0] === 'hash' && chunkArr[1]) {
            const fileBuffer = fs.readFileSync(chunkArr[1], () => { });
            process.stdout.write(`${createHash('sha256').update(fileBuffer).digest('hex')}\n`);
            isFail = false;
        };

        if (chunkArr?.[0] === 'compress' && chunkArr[1] && chunkArr[2]) {
            if (!fs.existsSync(chunkArr[1])) {
                throw new Error();
            };
            const gzip = zlib.createGzip();
            const r = fs.createReadStream(chunkArr[1]);
            const w = fs.createWriteStream(chunkArr[2]);
            r.pipe(gzip).pipe(w);
            isFail = false;
        };

        if (chunkArr?.[0] === 'decompress' && chunkArr[1] && chunkArr[2]) {
            if (!fs.existsSync(chunkArr[1])) {
                throw new Error();
            };
            const gunzip = zlib.createGunzip();
            const r = fs.createReadStream(chunkArr[1]);
            const w = fs.createWriteStream(chunkArr[2]);
            r.pipe(gunzip).pipe(w);
            isFail = false;
        };

        if (isFail) {
            process.stdout.write('Invalid input\n')
        }
    } catch (error) {
        process.stdout.write('Operation failed\n');
    };

    currentDirMessage();
    process.stdout.write(`Enter command: `);

};

process.stdin.on('data', echoInput);
process.on('SIGINT', () => {
    process.stdout.write(`\n`);
    currentDirMessage();
    byeMessage();
    process.exit(0);
}
);



