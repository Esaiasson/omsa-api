import { Router } from 'express';
import * as object from '../models/objectIndex.js';


export const getHaveRoutes = () => {
  const router = Router();

  router.get('/', async (req, res, next) => {

      const have = await object.have.findAll({
      });
      res.status(200).send(have);
  });

  router.post('/createHave', async (req, res, next) => {

    //const { haveData } = req.body;
    try {
      const result = await object.have.create({
        id: '0a384389-e996-4082-ab1b-1bd42a181220',
        user_id: '0a384389-e996-4082-ab1b-1bd42a181220',
        category_1: 'test',
      });

      if (result === null) {
        return res.status(404).json('No group created');
      }

      res.status(201).send();
    } catch (error) {
      console.error('error creating group ', error);
      res.status(500).json('Internal Server Error');
    }
  });

  return router;
};