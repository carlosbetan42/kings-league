import * as cheerio from 'cheerio';
import { writeDBFile } from '../db/index.js';
import { getLeaderboard } from './leaderboard.js';
import { logError, logInfo, logSuccess } from './log.js';
import { getMvp } from './mvp.js';

export const SCRAPINGS = {
  leaderboard: {
    url: 'https://kingsleague.pro/estadisticas/clasificacion/',
    scraper: getLeaderboard
  },
  mvp: {
    url: 'https://kingsleague.pro/estadisticas/mvp/',
    scraper: getMvp
  }
  // coaches: {
  //   url: 'https://es.besoccer.com/competicion/info/kings-league/2023',
  //   scraper: getCoaches
  // }
};

export const cleanText = (text) =>
  text
    .replace(/\t|\n|\s:/g, '')
    .replace(/.*:/g, '')
    .trim();

export const scrape = async (url) => {
  const res = await fetch(url);
  const html = await res.text();
  return cheerio.load(html);
};

export const scrapeAndSave = async (name) => {
  const start = performance.now();
  try {
    const { scraper, url } = SCRAPINGS[name];

    logInfo(`Scraping ${name}...`);
    const $ = await scrape(url);
    const content = await scraper($);
    logSuccess(`${name} list scraped successfully`);
    logInfo(`Writing ${name} list to DB...`);
    await writeDBFile(name, content);
    logSuccess(`${name} list scraped successfully`);
  } catch (e) {
    logError(`Error scraping ${name} list`);
    logError(e);
  } finally {
    const end = performance.now();
    const time = (end - start) / 1000;
    logInfo(`${name} list scraped in ${time} seconds`);
  }
};
