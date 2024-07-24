import { Router } from 'express';
import * as object from '../models/objectIndex.js';

export const getWishRoutes = () => {
  const router = Router();

  router.get('/', async (req, res, next) => {
      const wish = await object.wish.findAll({
      });
      res.status(200).send(wish);
  });

  router.post('/createWish', async (req, res, next) => {

    const { wishData } = req.body;
    try {
      const result = await object.wish.create({
        id: '0a384389-e996-4082-ab1b-1bd42a181220',
        user_id: '0a384389-e996-4082-ab1b-1bd42a181220',
        category_1: 'testwish',
      });

      if (result === null) {
        return res.status(404).json('No wish created');
      }

      res.status(201).send();
    } catch (error) {
      console.error('error creating group ', error);
      res.status(500).json('Internal Server Error');
    }
  });

  return router;
};