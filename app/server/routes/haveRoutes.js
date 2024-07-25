import { Router } from 'express';
import * as object from '../models/objectIndex.js';
import { db } from '../database/databaseConnection.js';

export const getHaveRoutes = () => {
  const router = Router();

  router.get('/', async (req, res, next) => {
    const have = await object.have.findAll({
    });
    res.status(200).send(have);
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
      with matches as
      (
      select *, '1'  as matchlevel
      FROM wish w
      where exists (
        select * from have h
        where w.category_1 = h.category_1 
        and h.article_id = :article_id
        and h.user_id != w.user_id 
      )
      union
      select *, '2' as matchlevel
      FROM wish w
      where exists (
        select * from have h
        where w.category_2 = h.category_2 
        and h.article_id = :article_id
        and h.user_id != w.user_id
      )
      union
      select *, '3' as matchlevel
      FROM wish w
      where exists (
        select * from have h
        where w.category_3 = h.category_3 
        and h.article_id = :article_id
        and h.user_id != w.user_id
      )
      union
      select *, '4' as matchlevel
      FROM wish w
      where exists (
        select * from have h
        where w.category_4 = h.category_4 
        and h.article_id = :article_id
        and h.user_id != w.user_id
      )
      union
      select *, '5' as matchlevel
      FROM wish w
      where exists (
        select * from have h
        where w.category_5 = h.category_5 
        and h.article_id = :article_id
        and h.user_id != w.user_id
      )
      union
      select *, '6' as matchlevel
      FROM wish w
      where exists (
        select * from have h
        where w.category_6 = h.category_6 
        and h.article_id = :article_id
        and h.user_id != w.user_id
      )
      union
      select *, '7' as matchlevel
      FROM wish w
      where exists (
        select * from have h
        where w.category_7 = h.category_7
        and h.article_id = :article_id
        and h.user_id != w.user_id
      )
      union
      select *, '8' as matchlevel
      FROM wish w
      where exists (
        select * from have h
        where w.category_8 = h.category_8 
        and h.article_id = :article_id
        and h.user_id != w.user_id
      )
      union
      select *, '9' as matchlevel
      FROM wish w
      where exists (
        select * from have h
        where w.category_9 = h.category_9 
        and h.article_id = :article_id
        and h.user_id != w.user_id
      )
      union
      select *, '10' as matchlevel
      FROM wish w
      where exists (
        select * from have h
        where w.category_10 = h.category_10
        and h.article_id = :article_id
        and h.user_id != w.user_id
      )
      union
      select *, '11' as matchlevel
      FROM wish w
      where exists (
        select * from have h
        where w.category_11 = h.category_11 
        and h.article_id = :article_id
        and h.user_id != w.user_id
      )
      union
      select *, '12' as matchlevel
      FROM wish w
      where exists (
        select * from have h
        where w.category_12 = h.category_12 
        and h.article_id = :article_id
        and h.user_id != w.user_id
      )    
      union
      select *, '13' as matchlevel
      FROM wish w
      where exists (
        select * from have h
        where w.category_13 = h.category_13 
        and h.article_id = :article_id
        and h.user_id != w.user_id
      )
      )
      select * from matches
      order by cast(matchlevel as int) desc`, {
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

  //Function for finding users that wants what 'user_id' has. Matches are found based on a singular have request. 
  router.get('/matchForHave', async (req, res, next) => {
    const { user_id } = req.body;  
  
    if (!user_id) {
      return res.status(400).json({ message: 'Missing required user_id parameter' });
    }
  
    //SQL query that searches through 13 potential categories
    try {
      const [results, metadata] = await db.query(`
      with matches as
      (
      select *, '1'  as matchlevel
        FROM wish w
        where exists (
          select * from have h
          where w.category_1 = h.category_1 
          and h.user_id = :user_id
          and h.user_id != w.user_id
        )
        union
        select *, '2' as matchlevel
        FROM wish w
        where exists (
          select * from have h
          where w.category_2 = h.category_2 
          and h.user_id = :user_id
          and h.user_id != w.user_id
        )
        union
        select *, '3' as matchlevel
        FROM wish w
        where exists (
          select * from have h
          where w.category_3 = h.category_3 
          and h.user_id = :user_id
          and h.user_id != w.user_id
        )
        union
        select *, '4' as matchlevel
        FROM wish w
        where exists (
          select * from have h
          where w.category_4 = h.category_4 
          and h.user_id = :user_id
          and h.user_id != w.user_id
        )
        union
        select *, '5' as matchlevel
        FROM wish w
        where exists (
          select * from have h
          where w.category_5 = h.category_5 
          and h.user_id = :user_id
          and h.user_id != w.user_id
        )
        union
        select *, '6' as matchlevel
        FROM wish w
        where exists (
          select * from have h
          where w.category_6 = h.category_6 
          and h.user_id = :user_id
          and h.user_id != w.user_id
        )
        union
        select *, '7' as matchlevel
        FROM wish w
        where exists (
          select * from have h
          where w.category_7 = h.category_7
          and h.user_id = :user_id
          and h.user_id != w.user_id
        )
        union
        select *, '8' as matchlevel
        FROM wish w
        where exists (
          select * from have h
          where w.category_8 = h.category_8 
          and h.user_id = :user_id
          and h.user_id != w.user_id
        )
        union
        select *, '9' as matchlevel
        FROM wish w
        where exists (
          select * from have h
          where w.category_9 = h.category_9 
          and h.user_id = :user_id
          and h.user_id != w.user_id
        )
        union
        select *, '10' as matchlevel
        FROM wish w
        where exists (
          select * from have h
          where w.category_10 = h.category_10
          and h.user_id = :user_id
          and h.user_id != w.user_id
        )
        union
        select *, '11' as matchlevel
        FROM wish w
        where exists (
          select * from have h
          where w.category_11 = h.category_11 
          and h.user_id = :user_id
          and h.user_id != w.user_id
        )
        union
        select *, '12' as matchlevel
        FROM wish w
        where exists (
          select * from have h
          where w.category_12 = h.category_12 
          and h.user_id = :user_id
          and h.user_id != w.user_id
        )    
        union
        select *, '13' as matchlevel
        FROM wish w
        where exists (
          select * from have h
          where w.category_13 = h.category_13 
          and h.user_id = :user_id
          and h.user_id != w.user_id
        )
        )
        select * from matches
        order by cast(matchlevel as int) desc`, {
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
      console.log(sortedMatches);
      res.status(200).json(results);
    } catch (error) {
      console.error('Error fetching wishes:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  //Function for creating a new have object in db
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