import express from 'express';
import { getWishRoutes } from './routes/wishRoutes.js';
import { getHaveRoutes } from './routes/haveRoutes.js';
import { getMultipartRoutes } from './routes/multipartRoutes.js';
import { authenticateUser } from './authentication/apiAuth.js';


export const createServer = () => {
  const app = express();


  app.use(express.json());
  app.use(authenticateUser);
  app.use('/wish',  getWishRoutes());
  app.use('/have', getHaveRoutes());
  app.use('/multipart', getMultipartRoutes());

  return app;
};
