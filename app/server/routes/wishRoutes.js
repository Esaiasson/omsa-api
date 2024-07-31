import { Router } from 'express';
import * as object from '../models/objectIndex.js';
import { db } from '../database/databaseConnection.js';
import { validateInput } from '../middleware/routeFunctions.js';
import { generateSqlQuery, queryDb } from './requestFunctions.js'
import { v4 as uuidv4 } from 'uuid';

export const getWishRoutes = () => {
  const router = Router();

  router.get('/', async (req, res, next) => {
      const wish = await object.wish.findAll({
      });
      res.status(200).send(wish);
  });

  //Function for updating wish based on singular article_id
  router.put('/updateWish', async (req, res, next) => {
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
        const updatedWish = await object.wish.findOne({ where: {article_id: article_id} });

        updatedWish.set({
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
      
        await updatedWish.save();
  
      // Send back the updated entity
      res.status(200).json(updatedWish);
    } catch (error) {
      console.error('Error updating wish', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
    } else {
      res.status(400).json({ message: validate.message });
    }
  });

  router.delete('/deleteWish', async (req, res, next) => {
    const { article_id } = req.body;
    
    const validate = validateInput({ article_id });

    if (validate.valid) {
      try {
        const result = await object.wish.destroy({
          where: {
            article_id: article_id,
          }
        });
  
        if (result === 0) {
          return res.status(404).json({ message: 'Wish not found' });
        }
  
        res.sendStatus(204);
      } catch (error) {
        console.error('Error deleting wish', error);
        res.status(500).json('Internal Server Error');
      }
    } else {
      res.status(400).json({ message: validate.message });
    }
  });

 router.get('/twoPartMatchWish', async (req, res, next) => {
    const { user_id, category_range } = req.body;  
  
    const validate = validateInput({ user_id });

    if (validate.valid) {
        
      const baseQuery = (i) => `
          select w_p1.id as p1_id, w_p1.user_id p1_user_id, w_p1.article_id p1_wish_article_id, w_p1.category_1 p1_wish_category_1, w_p1.category_2 p1_wish_category_2, w_p1.category_3 p1_wish_category_3, w_p1.category_4 p1_wish_category_4, w_p1.category_5 p1_wish_category_5, w_p1.category_6 p1_wish_category_6, w_p1.category_7 p1_wish_category_7, w_p1.category_8 p1_wish_category_8, w_p1.category_9 p1_wish_category_9, w_p1.category_10 p1_wish_category_10, w_p1.category_11 p1_wish_category_11, w_p1.category_12 p1_wish_category_12, w_p1.category_13 p1_wish_category_13, h_p2.id p2_id, h_p2.user_id p2_user_id, h_p2.article_id p2_have_article_id, h_p2.category_1 p2_have_category_1, h_p2.category_2 p2_have_category_2, h_p2.category_2 p2_have_category_3, h_p2.category_1 p2_have_category_3, h_p2.category_4 p2_have_category_4, h_p2.category_5 p2_have_category_5, h_p2.category_6 p2_have_category_6, h_p2.category_7 p2_have_category_7, h_p2.category_8 p2_have_category_8, h_p2.category_9 p2_have_category_9, h_p2.category_10 p2_have_category_10, h_p2.category_11 p2_have_category_11, h_p2.category_12 p2_have_category_12, h_p2.category_13 p2_have_category_13, h_p1.article_id p1_have_article_id, h_p1.category_1 p1_have_category_1, h_p1.category_2 p1_have_category_2, h_p1.category_2 p1_have_category_3, h_p1.category_1 p1_have_category_3, h_p1.category_4 p1_have_category_4, h_p1.category_5 p1_have_category_5, h_p1.category_6 p1_have_category_6, h_p1.category_7 p1_have_category_7, h_p1.category_8 p1_have_category_8, h_p1.category_9 p1_have_category_9, h_p1.category_10 p1_have_category_10, h_p1.category_11 p1_have_category_11, h_p1.category_12 p1_have_category_12, h_p1.category_13 p1_have_category_13, '${i}' as matchlevel  from have h_p2
          inner join wish w_p1 on h_p2.category_${i} = w_p1.category_${i}
          inner join have h_p1 on w_p1.user_id = h_p1.user_id 
          where exists(
            select * from wish w_p2
            where w_p2.user_id = h_p2.user_id
            and h_p1.category_${i} = w_p2.category_${i} 
          )
          AND w_p1.user_id = :user_id
          and w_p1.user_id != h_p2.user_id 
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

  //Function for finding users that have what 'user_id' is searching for. Matches are found based on a singular wish request. 
  router.get('/matchForWish', async (req, res, next) => {
    const { user_id, category_range } = req.body;  
    
    const validate = validateInput({ user_id });

    if (validate.valid) {
      //SQL query that searches through 13 potential categories

      const baseQuery = (i) => `
        select *, '${i}'  as matchlevel
        FROM have h
        where exists (
          select * from wish w
          where h.category_${i} = w.category_${i} 
          and w.user_id = :user_id
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

  //Function for creating a new wish object in db
  router.post('/createWish', async (req, res, next) => {
    const {
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

    const id = uuidv4();
    const validate = validateInput({ id, user_id });

    //TEMPORÄR TILL CATEGORY ÄR ETT UUID
    if (!category_1) {
      return res.status(400).json('Category cannot be empty');
    }
    //TEMPORÄR TILL CATEGORY ÄR ETT UUID

    if (validate.valid) {
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
  
        res.status(201).json({ message: 'Wish created'});
      } catch (error) {
        console.error('Error creating wish', error);
        res.status(500).json('Internal Server Error');
      }
    } else {
      res.status(400).json({ message: validate.message });
    }
  });

  return router;
};