import { TEAMS, PRESIDENTS, COACHES } from '../db/index.js';
import { cleanText } from './utils.js';

const LEADERBOARD_SELECTORS = {
  teamName: { selector: '.fs-table-text_3', typeOf: 'string' },
  wins: { selector: '.fs-table-text_4', typeOf: 'number' },
  losses: { selector: '.fs-table-text_5', typeOf: 'number' },
  scoredGoals: { selector: '.fs-table-text_6', typeOf: 'number' },
  concededGoals: { selector: '.fs-table-text_7', typeOf: 'number' },
  yellowCards: { selector: '.fs-table-text_8', typeOf: 'number' },
  redCards: { selector: '.fs-table-text_9', typeOf: 'number' }
};

export const getLeaderboard = async ($) => {
  const $rows = $('table tbody tr');

  const getTeamFrom = ({ name }) => {
    const { presidentId, ...restTeam } = TEAMS.find((team) => team.name === name);
    const president = PRESIDENTS.find((president) => president.id === presidentId);
    return { ...restTeam, president };
  };

  const getCoachFromTeam = ({ name }) => {
    const { name: coach } = COACHES.find((coach) => coach.teamName === name);
    return coach;
  };

  const leaderBoardSelectorEntries = Object.entries(LEADERBOARD_SELECTORS);

  const leaderboard = [];

  $rows.each((_, el) => {
    const leaderBoardEntries = leaderBoardSelectorEntries.map(([key, { selector, typeOf }]) => {
      const rawValue = $(el).find(selector).text();
      const cleanedValue = cleanText(rawValue);
      const value = typeOf === 'number' ? Number(cleanedValue) : cleanedValue;

      return [key, value];
    });

    const { teamName, ...leaderBoardForTeam } = Object.fromEntries(leaderBoardEntries);
    const team = getTeamFrom({ name: teamName });
    const coach = getCoachFromTeam({ name: teamName });

    leaderboard.push({
      ...leaderBoardForTeam,
      team,
      coach
    });
  });

  return leaderboard;
};
