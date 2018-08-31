const GSheet = require('google-spreadsheet');
const auth = require('../auth');

const doc = new GSheet('1mOLA7x-wUGACpg4KR9o_4j2q4GbG9bmrZQwn_wmxp84');
const QUERY = {
    'min-col': 1,
    'max-col': 1,
    'return-empty': false,
};

const authenticate = () => (
    new Promise((resolve) => {
        doc.useServiceAccountAuth(auth, resolve);
    })
);

const getSheet = (title) => (
    new Promise((resolve, reject) => {
        doc.getInfo((err, info) => {
            if (err) {
                reject(err);
                return;
            }
            const sheet = info.worksheets.find(
                (sheet) => sheet.title.toLowerCase() === title.toLowerCase()
            );

            sheet ? resolve(sheet) : reject('Sheet not found');
        });
    })
);

const getEntries = (sheet, opts) => (
    new Promise((resolve, reject) => {
        sheet.getCells(opts, (err, cells) => {
            err ? reject(err) : resolve(
                cells
                    .map((cell) => cell.value)
                    .filter((value) => !isNaN(value))
            );
        })
    })
);

async function exec() {
    await authenticate();
    try {
        const sheet = await getSheet('AFL');
        const entries = await getEntries(sheet, QUERY);
        console.log('Loaded entries:', entries);
    } catch (err) {
        console.log(err);
    }
}

exec();
