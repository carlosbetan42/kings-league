import { TEAMS } from '../db/index.js';
import { cleanText } from './utils.js';

const ASSISTS_SELECTORS = {
  team: { selector: '.fs-table-text_3', typeOf: 'string' },
  playerName: { selector: '.fs-table-text_4', typeOf: 'string' },
  gamesPlayed: { selector: '.fs-table-text_5', typeOf: 'number' },
  assists: { selector: '.fs-table-text_6', typeOf: 'number' }
};

export const getAssists = async ($) => {
  const $rows = $('table tbody tr');

  const getImageFromTeam = ({ name }) => {
    const { image } = TEAMS.find((team) => team.name === name);
    return image;
  };

  const assistsSelectorEntries = Object.entries(ASSISTS_SELECTORS);

  const assistsList = [];

  $rows.each((index, el) => {
    const assistsEntries = assistsSelectorEntries.map(([key, { selector, typeOf }]) => {
      const rawValue = $(el).find(selector).text();
      const cleanedValue = cleanText(rawValue);
      const value = typeOf === 'number' ? Number(cleanedValue) : cleanedValue;

      return [key, value];
    });

    const { team: teamName, ...asssitsData } = Object.fromEntries(assistsEntries);
    const image = getImageFromTeam({ name: teamName });

    assistsList.push({
      ...asssitsData,
      rank: index + 1,
      team: teamName,
      image
    });
  });

  return assistsList;
};
