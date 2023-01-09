import * as cheerio from 'cheerio';
import { writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
// import TEAMS from '../db/teams.json' assert { type: 'json' };

(async () => {
  const DB_PATH = path.join(process.cwd(), './db/');
  const TEAMS = await readFile(`${DB_PATH}/teams.json`, 'utf-8').then(JSON.parse);

  const URLS = {
    leaderboard: 'https://kingsleague.pro/estadisticas/clasificacion/'
  };

  const scrape = async (url) => {
    const res = await fetch(url);
    const html = await res.text();
    return cheerio.load(html);
  };

  const getLeaderboard = async () => {
    const $ = await scrape(URLS.leaderboard);
    const $rows = $('table tbody tr');

    const LEADERBOARD_SELECTORS = {
      teamName: { selector: '.fs-table-text_3', typeOf: 'string' },
      wins: { selector: '.fs-table-text_4', typeOf: 'number' },
      loses: { selector: '.fs-table-text_5', typeOf: 'number' },
      scoredGoals: { selector: '.fs-table-text_6', typeOf: 'number' },
      concededGoals: { selector: '.fs-table-text_7', typeOf: 'number' },
      yellowCards: { selector: '.fs-table-text_8', typeOf: 'number' },
      redCards: { selector: '.fs-table-text_9', typeOf: 'number' }
    };

    const getTeamFrom = ({ name }) => TEAMS.find((team) => team.name === name);

    const cleanText = (text) => text.replace(/\t|\n|\s:/g, '').replace(/.*:/g, '');

    const leaderBoardSelectorEntries = Object.entries(LEADERBOARD_SELECTORS);

    const leaderboard = [];

    $rows.each((_, el) => {
      const leaderBoardEntries = leaderBoardSelectorEntries.map(([key, { selector, typeOf }]) => {
        const rawValue = $(el).find(selector).text();
        const cleanedValue = cleanText(rawValue);
        const value = typeOf === 'number' ? Number(cleanedValue) : cleanedValue;

        return [key, value];
      });

      console.log(Object.fromEntries(leaderBoardEntries));

      const { teamName, ...leaderBoardForTeam } = Object.fromEntries(leaderBoardEntries);
      const team = getTeamFrom({ name: teamName });

      leaderboard.push({
        ...leaderBoardForTeam,
        team
      });
    });

    return leaderboard;
  };

  const leaderboard = await getLeaderboard();

  await writeFile(`${DB_PATH}/leaderboard.json`, JSON.stringify(leaderboard, null, 2), 'utf-8');
})();
