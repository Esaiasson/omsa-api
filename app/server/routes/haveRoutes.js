import { Router } from 'express';
import * as object from '../models/objectIndex.js';
import { db } from '../database/databaseConnection.js';
import { validateInput } from '../middleware/routeFunctions.js';


export const getHaveRoutes = () => {
  const router = Router();

  router.get('/', async (req, res, next) => {
    const have = await object.have.findAll({
    });
    res.status(200).send(have);
  });

  //Function for updating have based on singular article_id
  router.put('/updateHave', async (req, res, next) => {
    const { 
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
      category_13,
     } = req.body;

    const validate = validateInput({ article_id });
  
    if (validate.valid) {
      try {
        const updatedHave = await object.have.findOne({ where: {article_id: article_id} });

        updatedHave.set({
          category_1: category_1,
          category_2: category_2,
          category_3: category_3,
          category_4: category_4,
          category_5: category_5,
          category_6: category_6,
          category_7: category_7,
          category_8: category_8,
          category_9: category_9,
          category_10: category_10,
          category_11: category_11,
          category_12: category_12,
          category_13: category_13
        });
      
        await updatedHave.save();
  
      // Send back the updated entity
      res.status(200).json(updatedHave);
    } catch (error) {
      console.error('Error updating have', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }  
    } else {
      res.status(400).json({ message: validate.message });
    }
  });

  router.delete('/deleteHave', async (req, res, next) => {
    const { article_id } = req.body;
    
    const validate = validateInput({ article_id });

    if (validate.valid) {
      try {
        const result = await object.have.destroy({
          where: {
            article_id: article_id,
          }
        });
  
        if (result === 0) {
          return res.status(404).json({ message: 'Have not found' });
        }
        res.sendStatus(204);
      } catch (error) {
        console.error('Error deleting have', error);
        res.status(500).json('Internal Server Error');
      }
    } else {
      res.status(400).json({ message: validate.message });
    }
  });

  //Finding two part matches based on singular 'user_id'. 
  router.get('/twoPartMatchHave', async (req, res, next) => {
    const { user_id } = req.body;  

    const validate = validateInput({ user_id });

    if (validate.valid) {
      //SQL query that searches for two-part matches through 13 potential categories
    try {
      const [results, metadata] = await db.query(`
      with matches as
      (
      select h_p1.id as p1_id, h_p1.user_id p1_user_id, h_p1.article_id p1_have_article_id, w_p1.article_id p1_wish_article_id, w_p2.id p2_id, w_p2.user_id p2_user_id, h_p2.article_id p2_have_article_id, w_p2.article_id p2_wish_article_id, '1' as matchlevel
      from wish w_p2
      inner join have h_p1 on w_p2.category_1 = h_p1.category_1
      inner join wish w_p1 on h_p1.user_id = w_p1.user_id 
      inner join have h_p2 on w_p1.category_1 = h_p2.category_1 and h_p2.user_id = w_p2.user_id
      AND h_p1.user_id = :user_id
      and h_p1.user_id != w_p2.user_id 
      union
      /*category-2*/
      select h_p1.id as p1_id, h_p1.user_id p1_user_id, h_p1.article_id p1_have_article_id, w_p1.article_id p1_wish_article_id, w_p2.id p2_id, w_p2.user_id p2_user_id, h_p2.article_id p2_have_article_id, w_p2.article_id p2_wish_article_id, '2' as matchlevel
      from wish w_p2
      inner join have h_p1 on w_p2.category_2 = h_p1.category_2
      inner join wish w_p1 on h_p1.user_id = w_p1.user_id 
      inner join have h_p2 on w_p1.category_2 = h_p2.category_2 and h_p2.user_id = w_p2.user_id
      AND h_p1.user_id = :user_id
      and h_p1.user_id != w_p2.user_id 
      union
      /*category-3*/
      select h_p1.id as p1_id, h_p1.user_id p1_user_id, h_p1.article_id p1_have_article_id, w_p1.article_id p1_wish_article_id, w_p2.id p2_id, w_p2.user_id p2_user_id, h_p2.article_id p2_have_article_id, w_p2.article_id p2_wish_article_id, '3' as matchlevel
      from wish w_p2
      inner join have h_p1 on w_p2.category_3 = h_p1.category_3
      inner join wish w_p1 on h_p1.user_id = w_p1.user_id 
      inner join have h_p2 on w_p1.category_3 = h_p2.category_3 and h_p2.user_id = w_p2.user_id
      AND h_p1.user_id = :user_id
      and h_p1.user_id != w_p2.user_id 
      union
      /*category-4*/
      select h_p1.id as p1_id, h_p1.user_id p1_user_id, h_p1.article_id p1_have_article_id, w_p1.article_id p1_wish_article_id, w_p2.id p2_id, w_p2.user_id p2_user_id, h_p2.article_id p2_have_article_id, w_p2.article_id p2_wish_article_id, '4' as matchlevel
      from wish w_p2
      inner join have h_p1 on w_p2.category_4 = h_p1.category_4
      inner join wish w_p1 on h_p1.user_id = w_p1.user_id 
      inner join have h_p2 on w_p1.category_4 = h_p2.category_4 and h_p2.user_id = w_p2.user_id
      AND h_p1.user_id = :user_id
      and h_p1.user_id != w_p2.user_id 
      union
      /*category-5*/
      select h_p1.id as p1_id, h_p1.user_id p1_user_id, h_p1.article_id p1_have_article_id, w_p1.article_id p1_wish_article_id, w_p2.id p2_id, w_p2.user_id p2_user_id, h_p2.article_id p2_have_article_id, w_p2.article_id p2_wish_article_id, '5' as matchlevel
      from wish w_p2
      inner join have h_p1 on w_p2.category_5 = h_p1.category_5
      inner join wish w_p1 on h_p1.user_id = w_p1.user_id 
      inner join have h_p2 on w_p1.category_5 = h_p2.category_5 and h_p2.user_id = w_p2.user_id
      AND h_p1.user_id = :user_id
      and h_p1.user_id != w_p2.user_id 
      union
      /*category-6*/
      select h_p1.id as p1_id, h_p1.user_id p1_user_id, h_p1.article_id p1_have_article_id, w_p1.article_id p1_wish_article_id, w_p2.id p2_id, w_p2.user_id p2_user_id, h_p2.article_id p2_have_article_id, w_p2.article_id p2_wish_article_id, '6' as matchlevel
      from wish w_p2
      inner join have h_p1 on w_p2.category_6 = h_p1.category_6
      inner join wish w_p1 on h_p1.user_id = w_p1.user_id 
      inner join have h_p2 on w_p1.category_6 = h_p2.category_6 and h_p2.user_id = w_p2.user_id
      AND h_p1.user_id = :user_id
      and h_p1.user_id != w_p2.user_id 
      union
      /*category-7*/
      select h_p1.id as p1_id, h_p1.user_id p1_user_id, h_p1.article_id p1_have_article_id, w_p1.article_id p1_wish_article_id, w_p2.id p2_id, w_p2.user_id p2_user_id, h_p2.article_id p2_have_article_id, w_p2.article_id p2_wish_article_id, '7' as matchlevel
      from wish w_p2
      inner join have h_p1 on w_p2.category_7 = h_p1.category_7
      inner join wish w_p1 on h_p1.user_id = w_p1.user_id 
      inner join have h_p2 on w_p1.category_7 = h_p2.category_7 and h_p2.user_id = w_p2.user_id
      AND h_p1.user_id = :user_id
      and h_p1.user_id != w_p2.user_id 
      union
      /*category-8*/
      select h_p1.id as p1_id, h_p1.user_id p1_user_id, h_p1.article_id p1_have_article_id, w_p1.article_id p1_wish_article_id, w_p2.id p2_id, w_p2.user_id p2_user_id, h_p2.article_id p2_have_article_id, w_p2.article_id p2_wish_article_id, '8' as matchlevel
      from wish w_p2
      inner join have h_p1 on w_p2.category_8 = h_p1.category_8
      inner join wish w_p1 on h_p1.user_id = w_p1.user_id 
      inner join have h_p2 on w_p1.category_8 = h_p2.category_8 and h_p2.user_id = w_p2.user_id
      AND h_p1.user_id = :user_id
      and h_p1.user_id != w_p2.user_id 
      union
      /*category-9*/
      select h_p1.id as p1_id, h_p1.user_id p1_user_id, h_p1.article_id p1_have_article_id, w_p1.article_id p1_wish_article_id, w_p2.id p2_id, w_p2.user_id p2_user_id, h_p2.article_id p2_have_article_id, w_p2.article_id p2_wish_article_id, '9' as matchlevel
      from wish w_p2
      inner join have h_p1 on w_p2.category_9 = h_p1.category_9
      inner join wish w_p1 on h_p1.user_id = w_p1.user_id 
      inner join have h_p2 on w_p1.category_9 = h_p2.category_9 and h_p2.user_id = w_p2.user_id
      AND h_p1.user_id = :user_id
      and h_p1.user_id != w_p2.user_id 
      union
      /*category-10*/
      select h_p1.id as p1_id, h_p1.user_id p1_user_id, h_p1.article_id p1_have_article_id, w_p1.article_id p1_wish_article_id, w_p2.id p2_id, w_p2.user_id p2_user_id, h_p2.article_id p2_have_article_id, w_p2.article_id p2_wish_article_id, '10' as matchlevel
      from wish w_p2
      inner join have h_p1 on w_p2.category_10 = h_p1.category_10
      inner join wish w_p1 on h_p1.user_id = w_p1.user_id 
      inner join have h_p2 on w_p1.category_10 = h_p2.category_10 and h_p2.user_id = w_p2.user_id
      AND h_p1.user_id = :user_id
      and h_p1.user_id != w_p2.user_id 
      union
      /*category-11*/
      select h_p1.id as p1_id, h_p1.user_id p1_user_id, h_p1.article_id p1_have_article_id, w_p1.article_id p1_wish_article_id, w_p2.id p2_id, w_p2.user_id p2_user_id, h_p2.article_id p2_have_article_id, w_p2.article_id p2_wish_article_id, '11' as matchlevel
      from wish w_p2
      inner join have h_p1 on w_p2.category_11 = h_p1.category_11
      inner join wish w_p1 on h_p1.user_id = w_p1.user_id 
      inner join have h_p2 on w_p1.category_11 = h_p2.category_11 and h_p2.user_id = w_p2.user_id
      AND h_p1.user_id = :user_id
      and h_p1.user_id != w_p2.user_id 
      union
      /*category-12*/
      select h_p1.id as p1_id, h_p1.user_id p1_user_id, h_p1.article_id p1_have_article_id, w_p1.article_id p1_wish_article_id, w_p2.id p2_id, w_p2.user_id p2_user_id, h_p2.article_id p2_have_article_id, w_p2.article_id p2_wish_article_id, '12' as matchlevel
      from wish w_p2
      inner join have h_p1 on w_p2.category_12 = h_p1.category_12
      inner join wish w_p1 on h_p1.user_id = w_p1.user_id 
      inner join have h_p2 on w_p1.category_12 = h_p2.category_12 and h_p2.user_id = w_p2.user_id
      AND h_p1.user_id = :user_id
      and h_p1.user_id != w_p2.user_id 
      union
      /*category-13*/
      select h_p1.id as p1_id, h_p1.user_id p1_user_id, h_p1.article_id p1_have_article_id, w_p1.article_id p1_wish_article_id, w_p2.id p2_id, w_p2.user_id p2_user_id, h_p2.article_id p2_have_article_id, w_p2.article_id p2_wish_article_id, '13' as matchlevel
      from wish w_p2
      inner join have h_p1 on w_p2.category_13 = h_p1.category_13
      inner join wish w_p1 on h_p1.user_id = w_p1.user_id 
      inner join have h_p2 on w_p1.category_13 = h_p2.category_13 and h_p2.user_id = w_p2.user_id
      AND h_p1.user_id = :user_id
      and h_p1.user_id != w_p2.user_id 
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
        let { 
          p1_user_id,
          p1_wish_article_id,
          p2_user_id,
          p2_have_article_id,
          p1_have_article_id,
          matchlevel
        } = item;
        matchlevel = parseInt(matchlevel)
        
        sortedMatches[matchlevel].push({
          p1_user_id,
          p1_wish_article_id,
          p2_user_id,
          p2_have_article_id,
          p1_have_article_id,
          matchlevel
        });
          
      });
      console.log(sortedMatches);
      res.status(200).json(results);
    } catch (error) {
      console.error('Error fetching matches:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
    } else {
      res.status(400).json({ message: validate.message });
    }
  });

  //function for finding matches based on singular 'article_id'. 
  router.get('/getArticle', async (req, res, next) => {
    const { article_id } = req.body; 

    const validate = validateInput({ article_id });

    if (validate.valid) {
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
          let { 
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
            category_13,
            matchlevel
          } = item;
          matchlevel = parseInt(matchlevel)
          
          sortedMatches[matchlevel].push({
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
            category_13,
            matchlevel
          });  
      });
        console.log(sortedMatches);
        res.status(200).json(results);
      } catch (error) {
        console.error('Error fetching matches:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    } else {
      res.status(400).json({ message: validate.message });
    }
  });

  //Function for finding users that wants what 'user_id' has. Matches are found based on a singular have request. 
  router.get('/matchForHave', async (req, res, next) => {
    const { user_id } = req.body;  

    const validate = validateInput({ user_id });

    if (validate.valid) {
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
        let { 
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
          category_13,
          matchlevel
         } = item;
        matchlevel = parseInt(matchlevel)

        sortedMatches[matchlevel].push({
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
          category_13,
          matchlevel
        });
      });
      console.log(sortedMatches);
      res.status(200).json(results);
    } catch (error) {
      console.error('Error fetching wishes:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
    } else {
      res.status(400).json({ message: validate.message });
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
  
    //Så småningom ska här vara en för category också!
    const validate = validateInput({id, user_id, article_id});

    if (validate.valid) {
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
    
        res.status(201).json({ message: 'Have created'});
      } catch (error) {
        console.error('Error creating have', error);
        res.status(500).json('Internal Server Error');
      }
    } else {
      res.status(400).json({ message: validate.message });
    }
  });
  
  return router;
};