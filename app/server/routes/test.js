import { Router } from 'express';
import * as object from '../models/objectIndex.js';


export const getUserRoutes = () => {
  const router = Router();

  router.get('/', async (req, res, _next) => {
      const wish = await object.wish.findAll({
      });
      res.status(200).send(wish);
  });

  router.post('/createUserGroup', async (req, res, _next) => {
    const { groupName } = req.body;

    try {
      const result = await object.wish.create({
        category_1: 'test',
      });

      if (result === null) {
        return res.status(404).json('No group created');
      }

      res.status(201).send(group);
    } catch (error) {
      console.error('error creating group ', error);
      res.status(500).json('Internal Server Error');
    }
  });

  return router;
};