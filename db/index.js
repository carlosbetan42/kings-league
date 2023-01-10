import { writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
// import TEAMS from '../db/teams.json' assert { type: 'json' };

const DB_PATH = path.join(process.cwd(), './db');

const readDBFile = (dbName) => {
  return readFile(`${DB_PATH}/${dbName}.json`, 'utf-8').then(JSON.parse);
};

export const TEAMS = await readDBFile('teams');
export const PRESIDENTS = await readDBFile('presidents');

export const writeDBFile = (dbName, data) => {
  return writeFile(`${DB_PATH}/${dbName}.json`, JSON.stringify(data, null, 2), 'utf-8');
};
