import { Hono } from 'hono';
import { serveStatic } from 'hono/serve-static.module';
import leaderboard from '../db/leaderboard.json';
import teams from '../db/teams.json';
import presidents from '../db/presidents.json';
import topScorers from '../db/top_scorers.json';
import topAssists from '../db/top_assists.json';
import mvp from '../db/mvp.json';

const app = new Hono();

app.get('/', (ctx) => {
  return ctx.json([
    {
      endpoint: '/leaderboard',
      description: 'Returns the leaderboard'
    },
    {
      endpoint: '/teams',
      description: 'Returns the teams'
    },
    {
      endpoint: '/presidents',
      description: 'Returns the presidents'
    },
    {
      endpoint: '/coaches',
      description: 'Returns the coaches'
    },
    {
      endpoint: '/top-scorers',
      description: 'Returns the top scorers'
    },
    {
      endpoint: '/top-assists',
      description: 'Returns the top assists'
    },
    {
      endpoint: '/mvp',
      description: 'Returns the mvp'
    }
  ]);
});

app.get('/leaderboard', (ctx) => {
  return ctx.json(leaderboard);
});

app.get('/teams', (ctx) => {
  return ctx.json(teams);
});

app.get('/teams/:id', (ctx) => {
  const id = ctx.req.param('id');
  const foundTeam = teams.find((team) => team.id === id);
  return foundTeam ? ctx.json(foundTeam) : ctx.json({ message: 'Team not found' }, 404);
});

app.get('/presidents', (ctx) => {
  return ctx.json(presidents);
});

app.get('/presidents/:id', (ctx) => {
  const id = ctx.req.param('id');
  const foundPresident = presidents.find((president) => president.id === id);
  return foundPresident
    ? ctx.json(foundPresident)
    : ctx.json({ message: 'President not found' }, 404);
});

app.get('/top-scorers', (ctx) => {
  return ctx.json(topScorers);
});

app.get('/top-assists', (ctx) => {
  return ctx.json(topAssists);
});

app.get('/mvp', (ctx) => {
  return ctx.json(mvp);
});

app.get('/static/*', serveStatic({ root: './' }));

app.notFound((ctx) => {
  const { pathname } = new URL(ctx.req.url);

  if (ctx.req.url.at(-1) === '/') {
    return ctx.redirect(pathname.slice(0, -1));
  }

  return ctx.json({ message: 'Not found' }, 404);
});

export default app;
