import { Router } from 'express';
import * as object from '../models/objectIndex.js';
import { db } from '../database/databaseConnection.js';

export const getWishRoutes = () => {
  const router = Router();

  router.get('/', async (req, res, next) => {
      const wish = await object.wish.findAll({
      });
      res.status(200).send(wish);
  });

  router.get('/matchForWish', async (req, res, next) => {
    try {
      const [results, metadata] = await db.query(`select *
      FROM have h
      where exists (
          select * from wish w
          where h.category_1 = w.category_1 
          and w.user_id = 'c74b5ce2-b92e-4902-95d1-e664ee9a5993'
      )`);
      res.status(200).json(results);
    } catch (error) {
      console.error('Error fetching wishes:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  

  router.post('/createWish', async (req, res, next) => {
    const { id, 
      user_id, 
      category_1, 
      category_2, 
      category_3, 
      category_4, 
      category_5, 
      category_6, 
      category_7, 
      category_8, 
      category_9, 
      category_10, 
      category_11, 
      category_12, 
      category_13 
    } = req.body;

    if (!id || !user_id || !category_1) {
      return res.status(400).json('Missing required fields');
    }

    try {
      const result = await object.wish.create({
        id,
        user_id,
        category_1,
        category_2, 
        category_3, 
        category_4, 
        category_5, 
        category_6, 
        category_7, 
        category_8, 
        category_9, 
        category_10, 
        category_11, 
        category_12, 
        category_13
      });

      if (result === null) {
        return res.status(404).json('No wish created');
      }

      res.status(201).send(result);
    } catch (error) {
      console.error('Error creating wish', error);
      res.status(500).json('Internal Server Error');
    }
  });

  return router;
};