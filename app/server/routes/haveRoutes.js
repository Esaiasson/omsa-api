import { Router } from 'express';
import * as object from '../models/objectIndex.js';
import { db } from '../database/databaseConnection.js';
import { validateInput } from '../middleware/routeFunctions.js';
import { generateSqlQuery, queryDb } from './requestFunctions.js'
import { v4 as uuidv4 } from 'uuid';


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
    const { user_id, category_range } = req.body;  

    const validate = validateInput({ user_id });

    if (validate.valid) {
      //SQL query that searches for two-part matches through categories
      const baseQuery = (i) => `
        select h_p1.id as p1_id, h_p1.user_id p1_user_id, h_p1.article_id p1_have_article_id, w_p1.article_id p1_wish_article_id, w_p2.id p2_id, w_p2.user_id p2_user_id, h_p2.article_id p2_have_article_id, w_p2.article_id p2_wish_article_id, '${i}' as matchlevel
        from wish w_p2
        inner join have h_p1 on w_p2.category_${i} = h_p1.category_${i}
        inner join wish w_p1 on h_p1.user_id = w_p1.user_id 
        inner join have h_p2 on w_p1.category_${i} = h_p2.category_${i} and h_p2.user_id = w_p2.user_id
        AND h_p1.user_id = :user_id
        and h_p1.user_id != w_p2.user_id 
      `

      const sqlQuery = generateSqlQuery(baseQuery, category_range)
      const replacementValues = { 'user_id': user_id }

      const response = await queryDb(sqlQuery, replacementValues)

      if (response.accepted){
        res.status(200).json(response.results);
      } else{
        res.status(500).json({ message: response.message });
      }

    } else {
      res.status(400).json({ message: validate.message });
    }
  });

  //function for finding matches based on singular 'article_id'. 
  router.get('/matchForHave/byArticle', async (req, res, next) => {
    const { article_id, category_range } = req.body; 

    const validate = validateInput({ article_id });

    if (validate.valid) {
      //SQL query that searches through 13 potential categories
      const baseQuery = (i) => `
        select *, '${i}'  as matchlevel
        FROM wish w
        where exists (
          select * from have h
          where w.category_${i} = h.category_${i} 
          and h.article_id = :article_id
          and h.user_id != w.user_id 
        )
      `

      const sqlQuery = generateSqlQuery(baseQuery, category_range)
      const replacementValues = { 'article_id': article_id }

      const response = await queryDb(sqlQuery, replacementValues)
      
      if (response.accepted){
        res.status(200).json(response.results);
      } else{
        res.status(500).json({ message: response.message });
      }

    } else {
      res.status(400).json({ message: validate.message });
    }
  });

  //Function for finding users that wants what 'user_id' has. Matches are found based on a singular have request. 
  router.get('/matchForHave', async (req, res, next) => {
    const { user_id, category_range } = req.body;  

    const validate = validateInput({ user_id });

    if (validate.valid) {
      //SQL query that searches through 13 potential categories
      const baseQuery = (i) => `
      select *, '${i}'  as matchlevel
      FROM wish w
      where exists (
        select * from have h
        where w.category_${i} = h.category_${i} 
        and h.user_id = :user_id
        and h.user_id != w.user_id
      )
      `
      const sqlQuery = generateSqlQuery(baseQuery, category_range)
      const replacementValues = { 'user_id': user_id }

      const response = await queryDb(sqlQuery, replacementValues)
      
      if (response.accepted){
        res.status(200).json(response.results);
      } else{
        res.status(500).json({ message: response.message });
      }

    } else {
      res.status(400).json({ message: validate.message });
    }
  });

  //Function for creating a new have object in db
  router.post('/createHave', async (req, res, next) => {
    const { 
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
    
    const id = uuidv4();
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