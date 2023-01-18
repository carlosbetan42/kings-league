const BASE_URL = 'https://kings-league-api.carlos-betan-42.workers.dev';

export const getAllTeams = async () => {
  try {
    const response = await fetch(BASE_URL + '/teams');
    const teams = await response.json();
    return teams;
  } catch (error) {
    // enviar un error a un sistema de reporte de errores
    return [];
  }
};
