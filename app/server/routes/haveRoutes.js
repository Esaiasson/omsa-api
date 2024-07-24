import { Router } from 'express';
import * as object from '../models/objectIndex.js';
import { db } from '../database/databaseConnection.js';

export const getHaveRoutes = () => {
  const router = Router();

  router.get('/matchForHave', async (req, res, next) => {
    const { user_id } = req.body;  
  
    if (!user_id) {
      return res.status(400).json({ message: 'Missing required user_id parameter' });
    }
  
    try {
      const [results, metadata] = await db.query(`
      select *, '1'  as matchlevel
      FROM have h
      where exists (
        select * from wish w
        where h.category_1 = w.category_1 
        and w.user_id = :user_id
      )
      union
       select *, '2' as matchlevel
      FROM have h
      where exists (
        select * from wish w
        where h.category_2 = w.category_2 
        and w.user_id = :user_id
      )
      union
       select *, '3' as matchlevel
      FROM have h
      where exists (
        select * from wish w
        where h.category_3 = w.category_3 
        and w.user_id = :user_id
      )
      union
       select *, '4' as matchlevel
      FROM have h
      where exists (
        select * from wish w
        where h.category_4 = w.category_4 
        and w.user_id = :user_id
      )
      union
       select *, '5' as matchlevel
      FROM have h
      where exists (
        select * from wish w
        where h.category_5 = w.category_5 
        and w.user_id = :user_id
      )
      union
       select *, '6' as matchlevel
      FROM have h
      where exists (
        select * from wish w
        where h.category_6 = w.category_6 
        and w.user_id = :user_id
      )
      union
       select *, '7' as matchlevel
      FROM have h
      where exists (
        select * from wish w
        where h.category_7 = w.category_7
        and w.user_id = :user_id
      )
      union
       select *, '8' as matchlevel
      FROM have h
      where exists (
        select * from wish w
        where h.category_8 = w.category_8 
        and w.user_id = :user_id
      )
      union
       select *, '9' as matchlevel
      FROM have h
      where exists (
        select * from wish w
        where h.category_9 = w.category_9 
        and w.user_id = :user_id
      )
      union
       select *, '10' as matchlevel
      FROM have h
      where exists (
        select * from wish w
        where h.category_10 = w.category_10
        and w.user_id = :user_id
      )
      union
       select *, '11' as matchlevel
      FROM have h
      where exists (
        select * from wish w
        where h.category_11 = w.category_11 
        and w.user_id = :user_id
      )
      union
       select *, '12' as matchlevel
      FROM have h
      where exists (
        select * from wish w
        where h.category_12 = w.category_12 
        and w.user_id = :user_id
      )    
      union
       select *, '13' as matchlevel
      FROM have h
      where exists (
        select * from wish w
        where h.category_13 = w.category_13 
        and w.user_id = :user_id
      )
      order by matchlevel desc`, {
          replacements: { user_id },
          type: db.QueryTypes.RAW
      });

      let sortedMatches = {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
        11: [],
        12: [],
        13: []
      };

      // Process results to populate sortedMatches
      results.forEach(item => {
        let alreadyExists = false
        let { id, user_id, article_id, matchlevel } = item;
        matchlevel = parseInt(matchlevel)
        if (matchlevel != 13){
          console.log(matchlevel +1);
          sortedMatches[matchlevel + 1].forEach(subitem =>{
            if(subitem.id === item.id){
              alreadyExists = true
            }
          })
          if (alreadyExists === false){
            sortedMatches[matchlevel].push({
              id,
              user_id,
              article_id,
              matchlevel
            });
          }
        }
        if (matchlevel === 13) {
          sortedMatches[matchlevel].push({
            id,
            user_id,
            article_id,
            matchlevel
          });
        
        } 
      });

      console.log(sortedMatches);

      res.status(200).json(results);
    } catch (error) {
      console.error('Error fetching wishes:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  router.get('/', async (req, res, next) => {
      const have = await object.have.findAll({
      });
      res.status(200).send(have);
  });

  router.post('/createHave', async (req, res, next) => {
    const { 
      id, 
      user_id, 
      article_id,
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
  
    // Validate the input data
    if (!id || !user_id || !category_1) {
      return res.status(400).json('Missing required fields');
    }
  
    try {
      const result = await object.have.create({
        id,
        user_id,
        article_id,
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
        return res.status(404).json('No have created');
      }
  
      res.status(201).send(result);
    } catch (error) {
      console.error('Error creating have', error);
      res.status(500).json('Internal Server Error');
    }
  });
  

  return router;
};