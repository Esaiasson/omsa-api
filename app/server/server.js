import express from 'express';
import { getUserRoutes } from './routes/test.js';

export const createServer = () => {
  const app = express();

  app.get('/', (_req, res) => {
    res.json('Hello, world!');
  });
  app.use(express.json());
  app.use('/wish', getUserRoutes());

  return app;
};
