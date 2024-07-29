import express from 'express';
import { getWishRoutes } from './routes/wishRoutes.js';
import { getHaveRoutes } from './routes/haveRoutes.js';
import { getMultipartRoutes } from './routes/multipartRoutes.js';

export const createServer = () => {
  const app = express();

  app.get('/', (_req, res) => {
    res.json('Hello, world!');
  });
  app.use(express.json());
  app.use('/wish', getWishRoutes());
  app.use('/have', getHaveRoutes());
  app.use('/multipart', getMultipartRoutes());

  return app;
};
