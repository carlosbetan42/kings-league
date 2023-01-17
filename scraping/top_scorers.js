import { TEAMS } from '../db/index.js';
import { cleanText } from './utils.js';

const SCORES_SELECTORS = {
  team: { selector: '.fs-table-text_3', typeOf: 'string' },
  playerName: { selector: '.fs-table-text_4', typeOf: 'string' },
  gamesPlayed: { selector: '.fs-table-text_5', typeOf: 'number' },
  goals: { selector: '.fs-table-text_6', typeOf: 'number' }
};

export const getTopScorers = async ($) => {
  const $rows = $('table tbody tr');

  const getImageFromTeam = ({ name }) => {
    const { image } = TEAMS.find((team) => team.name === name);
    return image;
  };

  const mvpSelectorEntries = Object.entries(SCORES_SELECTORS);

  const mvpList = [];

  $rows.each((index, el) => {
    const mvpEntries = mvpSelectorEntries.map(([key, { selector, typeOf }]) => {
      const rawValue = $(el).find(selector).text();
      const cleanedValue = cleanText(rawValue);
      const value = typeOf === 'number' ? Number(cleanedValue) : cleanedValue;

      return [key, value];
    });

    const { team: teamName, ...mvpData } = Object.fromEntries(mvpEntries);
    const image = getImageFromTeam({ name: teamName });

    mvpList.push({
      ...mvpData,
      rank: index + 1,
      team: teamName,
      image
    });
  });

  return mvpList;
};
