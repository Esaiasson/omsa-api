import { Router } from 'express';
import * as object from '../models/objectIndex.js';
import { db } from '../database/databaseConnection.js';
import validate from 'uuid-validate';
import { generateSqlQuery, queryDb } from './requestFunctions.js'

export const getMultipartRoutes = () => {
  const router = Router();


 router.get('/fourPartMatch', async (req, res, next) => {
    const { user_id, category_range } = req.body;  
  
    if (!user_id) {
      return res.status(400).json({ message: 'Missing required user_id parameter' });
    }
    if(!category_range){
      return res.status(400).json({ message: 'Missing required category_range parameter' });
    }

    if (!validate(user_id)) {
      return res.status(400).json({ message: 'Invalid request format. The provided identifier must be a valid UUID.' });
    } 

    const baseQuery = (i) => /*`
        select w_p1.id as p1_id, w_p1.user_id p1_userid, w_p1.article_id p1_wish_articleid, h_p1.article_id p1_have_articleid, h_p2.id p2_id, h_p2.user_id p2_userid, w_p2.article_id p2_wish_article_id, h_p2.article_id p2_have_article_id, h_p3.id p3_id, h_p3.user_id p3_userid, w_p3.article_id p3_wish_article_id, h_p3.article_id p3_have_article_id, h_p4.id p4_id, h_p4.user_id p4_userid, w_p4.article_id p4_wish_article_id, h_p4.article_id p4_have_article_id, '${i}' as matchlevel  
        from wish w_p1
        inner join have h_p1 on w_p1.user_id = h_p1.user_id
        inner join have h_p2 on w_p1.category_${i} = h_p2.category_${i} 
        inner join wish w_p2 on h_p2.user_id = w_p2.user_id 
        inner join have h_p3 on w_p2.category_${i} = h_p3.category_${i}
        inner join wish w_p3 on h_p3.user_id = w_p3.user_id 
        inner join have h_p4 on w_p3.category_${i} = h_p4.category_${i} 
        inner join wish w_p4 on h_p4.user_id = w_p4.user_id and w_p4.category_${i} = h_p1.category_${i}
        where 
        w_p1.user_id != w_p2.user_id
        and w_p1.user_id != w_p3.user_id
        and w_p1.user_id != w_p4.user_id
        and w_p2.user_id != w_p3.user_id
        and w_p3.user_id != w_p4.user_id 
        AND w_p1.user_id = :user_id
        `*/
    	`
            select w_p1.id as p1_id, w_p1.user_id p1_userid, w_p1.article_id p1_wish_articleid, h_p1.article_id p1_have_articleid, h_p2.id p2_id, h_p2.user_id p2_userid, w_p2.article_id p2_wish_article_id, h_p2.article_id p2_have_article_id, h_p3.id p3_id, h_p3.user_id p3_userid, w_p3.article_id p3_wish_article_id, h_p3.article_id p3_have_article_id, '${i}' as matchlevel  
            from wish w_p1
            inner join have h_p1 on w_p1.user_id = h_p1.user_id
            inner join have h_p2 on w_p1.category_${i} = h_p2.category_${i} 
            inner join wish w_p2 on h_p2.user_id = w_p2.user_id 
            inner join have h_p3 on w_p2.category_${i} = h_p3.category_${i}
            inner join wish w_p3 on h_p3.user_id = w_p3.user_id and w_p3.category_${i} = h_p1.category_${i}
            where 
            w_p1.user_id != w_p2.user_id
            and w_p1.user_id != w_p3.user_id
            and w_p2.user_id != w_p3.user_id 
            AND w_p1.user_id = :user_id
        `
    const sqlQuery = generateSqlQuery(baseQuery, category_range)
    const replacementValues = { 'user_id': user_id }

    const response = await queryDb(sqlQuery, replacementValues, objectConstruction)
    
    if (response.accepted){
        res.status(200).json(response.results);
    } else{
        res.status(500).json({ message: response.message });
    }
  });

  
 router.get('/threePartMatch', async (req, res, next) => {
    const { user_id, category_range } = req.body;  
  
    if (!user_id) {
      return res.status(400).json({ message: 'Missing required user_id parameter' });
    }
    if(!category_range){
      return res.status(400).json({ message: 'Missing required category_range parameter' });
    }

    if (!validate(user_id)) {
      return res.status(400).json({ message: 'Invalid request format. The provided identifier must be a valid UUID.' });
    } 

    //SQL query that searches for three-part matches through 13 potential categories
    const baseQuery = (i) => `
            select w_p1.id as p1_id, w_p1.user_id p1_userid, w_p1.article_id p1_wish_articleid, h_p1.article_id p1_have_articleid, h_p2.id p2_id, h_p2.user_id p2_userid, w_p2.article_id p2_wish_article_id, h_p2.article_id p2_have_article_id, h_p3.id p3_id, h_p3.user_id p3_userid, w_p3.article_id p3_wish_article_id, h_p3.article_id p3_have_article_id, '${i}' as matchlevel  
            from wish w_p1
            inner join have h_p1 on w_p1.user_id = h_p1.user_id
            inner join have h_p2 on w_p1.category_${i} = h_p2.category_${i} 
            inner join wish w_p2 on h_p2.user_id = w_p2.user_id 
            inner join have h_p3 on w_p2.category_${i} = h_p3.category_${i}
            inner join wish w_p3 on h_p3.user_id = w_p3.user_id and w_p3.category_${i} = h_p1.category_${i}
            where 
            w_p1.user_id != w_p2.user_id
            and w_p1.user_id != w_p3.user_id
            and w_p2.user_id != w_p3.user_id 
            AND w_p1.user_id = :user_id
        `
    const sqlQuery = generateSqlQuery(baseQuery, category_range)

    try {
      const [results, metadata] = await db.query(
        sqlQuery
      , {
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
          p1_have_article_id,
          p2_user_id,
          p2_wish_article_id,
          p2_have_article_id,
          p3_user_id,
          p3_wish_article_id,
          p3_have_article_id,
          matchlevel
        } = item;
        matchlevel = parseInt(matchlevel)
        
        sortedMatches[matchlevel].push({
          p1_user_id,
          p1_wish_article_id,
          p1_have_article_id,
          p2_user_id,
          p2_wish_article_id,
          p2_have_article_id,
          p3_user_id,
          p3_wish_article_id,
          p3_have_article_id,
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

  
  return router;
};