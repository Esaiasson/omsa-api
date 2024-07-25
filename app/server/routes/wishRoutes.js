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
  
  //function for finding matches based on singular 'article_id'. 
  router.get('/getArticle', async (req, res, next) => {
    const { article_id } = req.body;  

    if (!article_id) {
      return res.status(400).json({ message: 'Missing required article_id parameter' });
    }

    //SQL query that searches through 13 potential categories
    try {
      const [results, metadata] = await db.query(`
        select *, '1'  as matchlevel
        FROM wish w
        where exists (
          select * from have h
          where w.category_1 = h.category_1 
          and h.article_id = :article_id
        )
        union
        select *, '2' as matchlevel
        FROM wish w
        where exists (
          select * from have h
          where w.category_2 = h.category_2 
          and h.article_id = :article_id
        )
        union
        select *, '3' as matchlevel
        FROM wish w
        where exists (
          select * from have h
          where w.category_3 = h.category_3 
          and h.article_id = :article_id
        )
        union
        select *, '4' as matchlevel
        FROM wish w
        where exists (
          select * from have h
          where w.category_4 = h.category_4 
          and h.article_id = :article_id
        )
        union
        select *, '5' as matchlevel
        FROM wish w
        where exists (
          select * from have h
          where w.category_5 = h.category_5 
          and h.article_id = :article_id
        )
        union
        select *, '6' as matchlevel
        FROM wish w
        where exists (
          select * from have h
          where w.category_6 = h.category_6 
          and h.article_id = :article_id
        )
        union
        select *, '7' as matchlevel
        FROM wish w
        where exists (
          select * from have h
          where w.category_7 = h.category_7
          and h.article_id = :article_id
        )
        union
        select *, '8' as matchlevel
        FROM wish w
        where exists (
          select * from have h
          where w.category_8 = h.category_8 
          and h.article_id = :article_id
        )
        union
        select *, '9' as matchlevel
        FROM wish w
        where exists (
          select * from have h
          where w.category_9 = h.category_9 
          and h.article_id = :article_id
        )
        union
        select *, '10' as matchlevel
        FROM wish w
        where exists (
          select * from have h
          where w.category_10 = h.category_10
          and h.article_id = :article_id
        )
        union
        select *, '11' as matchlevel
        FROM wish w
        where exists (
          select * from have h
          where w.category_11 = h.category_11 
          and h.article_id = :article_id
        )
        union
        select *, '12' as matchlevel
        FROM wish w
        where exists (
          select * from have h
          where w.category_12 = h.category_12 
          and h.article_id = :article_id
        )    
        union
        select *, '13' as matchlevel
        FROM wish w
        where exists (
          select * from have h
          where w.category_13 = h.category_13 
          and h.article_id = :article_id
        )
        order by matchlevel desc`, {
          replacements: { article_id },
          type: db.QueryTypes.RAW
        });

        //Object created for sending API-response
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
          let { id, user_id, article_id, matchlevel } = item;
          matchlevel = parseInt(matchlevel)
          
          sortedMatches[matchlevel].push({
            id,
            user_id,
            article_id,
            matchlevel
          });  
      });
      console.log(sortedMatches);
      res.status(200).json(results);
    } catch (error) {
      console.error('Error fetching matches:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  //Function for finding users that have what 'user_id' is searching for. Matches are found based on a singular wish request. 
  router.get('/matchForWish', async (req, res, next) => {
    const { user_id } = req.body;  
  
    if (!user_id) {
      return res.status(400).json({ message: 'Missing required user_id parameter' });
    }

    //SQL query that searches through 13 potential categories
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

      //Object created for sending API-response
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
        let { id, user_id, article_id, matchlevel } = item;
        matchlevel = parseInt(matchlevel)
        
        sortedMatches[matchlevel].push({
          id,
          user_id,
          article_id,
          matchlevel
        });
          
      });
      res.status(200).json(results);
    } catch (error) {
      console.error('Error fetching matches:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  //Function for creating a new wish object in db
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