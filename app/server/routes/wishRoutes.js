import { Router } from 'express';
import * as object from '../models/objectIndex.js';
import { db } from '../database/databaseConnection.js';
import validate from 'uuid-validate';

export const getWishRoutes = () => {
  const router = Router();

  router.get('/', async (req, res, next) => {
      const wish = await object.wish.findAll({
      });
      res.status(200).send(wish);
  });

  router.delete('/deleteWish', async (req, res, next) => {
    const { article_id } = req.body;
    
    if (!article_id) {
      return res.status(400).json({ message: 'Missing required article_id parameter' });
    }

    if ( !validate(article_id)) {
      return res.status(400).json({ message: 'Invalid request format. The provided identifier must be a valid UUID.' });
    } 

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

  });

  router.get('/twoPartMatchWish', async (req, res, next) => {
    const { user_id } = req.body;  
  
    if (!user_id) {
      return res.status(400).json({ message: 'Missing required user_id parameter' });
    }

    if (!validate(user_id)) {
      return res.status(400).json({ message: 'Invalid request format. The provided identifier must be a valid UUID.' });
    } 

    //SQL query that searches for two-part matches through 13 potential categories
    try {
      const [results, metadata] = await db.query(`
      with matches as
      (select w_p1.id as p1_id, w_p1.user_id p1_user_id, w_p1.article_id p1_wish_article_id, w_p1.category_1 p1_wish_category_1, w_p1.category_2 p1_wish_category_2, w_p1.category_3 p1_wish_category_3, w_p1.category_4 p1_wish_category_4, w_p1.category_5 p1_wish_category_5, w_p1.category_6 p1_wish_category_6, w_p1.category_7 p1_wish_category_7, w_p1.category_8 p1_wish_category_8, w_p1.category_9 p1_wish_category_9, w_p1.category_10 p1_wish_category_10, w_p1.category_11 p1_wish_category_11, w_p1.category_12 p1_wish_category_12, w_p1.category_13 p1_wish_category_13, h_p2.id p2_id, h_p2.user_id p2_user_id, h_p2.article_id p2_have_article_id, h_p2.category_1 p2_have_category_1, h_p2.category_2 p2_have_category_2, h_p2.category_3 p2_have_category_3, h_p2.category_4 p2_have_category_4, h_p2.category_5 p2_have_category_5, h_p2.category_6 p2_have_category_6, h_p2.category_7 p2_have_category_7, h_p2.category_8 p2_have_category_8, h_p2.category_9 p2_have_category_9, h_p2.category_10 p2_have_category_10, h_p2.category_11 p2_have_category_11, h_p2.category_12 p2_have_category_12, h_p2.category_13 p2_have_category_13, h_p1.article_id p1_have_article_id, h_p1.category_1 p1_have_category_1, h_p1.category_2 p1_have_category_2, h_p1.category_3 p1_have_category_3, h_p1.category_4 p1_have_category_4, h_p1.category_5 p1_have_category_5, h_p1.category_6 p1_have_category_6, h_p1.category_7 p1_have_category_7, h_p1.category_8 p1_have_category_8, h_p1.category_9 p1_have_category_9, h_p1.category_10 p1_have_category_10, h_p1.category_11 p1_have_category_11, h_p1.category_12 p1_have_category_12, h_p1.category_13 p1_have_category_13, '1' as matchlevel  from have h_p2
      inner join wish w_p1 on h_p2.category_1 = w_p1.category_1
      inner join have h_p1 on w_p1.user_id = h_p1.user_id 
      where exists(
        select * from wish w_p2
        where w_p2.user_id = h_p2.user_id
        and h_p1.category_1 = w_p2.category_1 
      )
      AND w_p1.user_id = :user_id
      and w_p1.user_id != h_p2.user_id 
      union
      /*category-2*/
      select w_p1.id as p1_id, w_p1.user_id p1_user_id, w_p1.article_id p1_wish_article_id, w_p1.category_1 p1_wish_category_1, w_p1.category_2 p1_wish_category_2, w_p1.category_3 p1_wish_category_3, w_p1.category_4 p1_wish_category_4, w_p1.category_5 p1_wish_category_5, w_p1.category_6 p1_wish_category_6, w_p1.category_7 p1_wish_category_7, w_p1.category_8 p1_wish_category_8, w_p1.category_9 p1_wish_category_9, w_p1.category_10 p1_wish_category_10, w_p1.category_11 p1_wish_category_11, w_p1.category_12 p1_wish_category_12, w_p1.category_13 p1_wish_category_13, h_p2.id p2_id, h_p2.user_id p2_user_id, h_p2.article_id p2_have_article_id, h_p2.category_1 p2_have_category_1, h_p2.category_2 p2_have_category_2, h_p2.category_3 p2_have_category_3, h_p2.category_4 p2_have_category_4, h_p2.category_5 p2_have_category_5, h_p2.category_6 p2_have_category_6, h_p2.category_7 p2_have_category_7, h_p2.category_8 p2_have_category_8, h_p2.category_9 p2_have_category_9, h_p2.category_10 p2_have_category_10, h_p2.category_11 p2_have_category_11, h_p2.category_12 p2_have_category_12, h_p2.category_13 p2_have_category_13, h_p1.article_id p1_have_article_id, h_p1.category_1 p1_have_category_1, h_p1.category_2 p1_have_category_2, h_p1.category_3 p1_have_category_3, h_p1.category_4 p1_have_category_4, h_p1.category_5 p1_have_category_5, h_p1.category_6 p1_have_category_6, h_p1.category_7 p1_have_category_7, h_p1.category_8 p1_have_category_8, h_p1.category_9 p1_have_category_9, h_p1.category_10 p1_have_category_10, h_p1.category_11 p1_have_category_11, h_p1.category_12 p1_have_category_12, h_p1.category_13 p1_have_category_13, '2' as matchlevel  from have h_p2
      inner join wish w_p1 on h_p2.category_2 = w_p1.category_2
      inner join have h_p1 on w_p1.user_id = h_p1.user_id 
      where exists(
        select * from wish w_p2
        where w_p2.user_id = h_p2.user_id
        and h_p1.category_2 = w_p2.category_2
      )
      AND w_p1.user_id = :user_id
      and w_p1.user_id != h_p2.user_id
        union
      /*category-3*/
      select w_p1.id as p1_id, w_p1.user_id p1_user_id, w_p1.article_id p1_wish_article_id, w_p1.category_1 p1_wish_category_1, w_p1.category_2 p1_wish_category_2, w_p1.category_3 p1_wish_category_3, w_p1.category_4 p1_wish_category_4, w_p1.category_5 p1_wish_category_5, w_p1.category_6 p1_wish_category_6, w_p1.category_7 p1_wish_category_7, w_p1.category_8 p1_wish_category_8, w_p1.category_9 p1_wish_category_9, w_p1.category_10 p1_wish_category_10, w_p1.category_11 p1_wish_category_11, w_p1.category_12 p1_wish_category_12, w_p1.category_13 p1_wish_category_13, h_p2.id p2_id, h_p2.user_id p2_user_id, h_p2.article_id p2_have_article_id, h_p2.category_1 p2_have_category_1, h_p2.category_2 p2_have_category_2, h_p2.category_3 p2_have_category_3, h_p2.category_4 p2_have_category_4, h_p2.category_5 p2_have_category_5, h_p2.category_6 p2_have_category_6, h_p2.category_7 p2_have_category_7, h_p2.category_8 p2_have_category_8, h_p2.category_9 p2_have_category_9, h_p2.category_10 p2_have_category_10, h_p2.category_11 p2_have_category_11, h_p2.category_12 p2_have_category_12, h_p2.category_13 p2_have_category_13, h_p1.article_id p1_have_article_id, h_p1.category_1 p1_have_category_1, h_p1.category_2 p1_have_category_2, h_p1.category_3 p1_have_category_3, h_p1.category_4 p1_have_category_4, h_p1.category_5 p1_have_category_5, h_p1.category_6 p1_have_category_6, h_p1.category_7 p1_have_category_7, h_p1.category_8 p1_have_category_8, h_p1.category_9 p1_have_category_9, h_p1.category_10 p1_have_category_10, h_p1.category_11 p1_have_category_11, h_p1.category_12 p1_have_category_12, h_p1.category_13 p1_have_category_13, '3' as matchlevel  from have h_p2
      inner join have h_p1 on w_p1.user_id = h_p1.user_id 
      where exists(
        select * from wish w_p2
        where w_p2.user_id = h_p2.user_id
        and h_p1.category_3 = w_p2.category_4
      )
      AND w_p1.user_id = :user_id
      and w_p1.user_id != h_p2.user_id
        union
      /*category-4*/
      select w_p1.id as p1_id, w_p1.user_id p1_user_id, w_p1.article_id p1_wish_article_id, w_p1.category_1 p1_wish_category_1, w_p1.category_2 p1_wish_category_2, w_p1.category_3 p1_wish_category_3, w_p1.category_4 p1_wish_category_4, w_p1.category_5 p1_wish_category_5, w_p1.category_6 p1_wish_category_6, w_p1.category_7 p1_wish_category_7, w_p1.category_8 p1_wish_category_8, w_p1.category_9 p1_wish_category_9, w_p1.category_10 p1_wish_category_10, w_p1.category_11 p1_wish_category_11, w_p1.category_12 p1_wish_category_12, w_p1.category_13 p1_wish_category_13, h_p2.id p2_id, h_p2.user_id p2_user_id, h_p2.article_id p2_have_article_id, h_p2.category_1 p2_have_category_1, h_p2.category_2 p2_have_category_2, h_p2.category_3 p2_have_category_3, h_p2.category_4 p2_have_category_4, h_p2.category_5 p2_have_category_5, h_p2.category_6 p2_have_category_6, h_p2.category_7 p2_have_category_7, h_p2.category_8 p2_have_category_8, h_p2.category_9 p2_have_category_9, h_p2.category_10 p2_have_category_10, h_p2.category_11 p2_have_category_11, h_p2.category_12 p2_have_category_12, h_p2.category_13 p2_have_category_13, h_p1.article_id p1_have_article_id, h_p1.category_1 p1_have_category_1, h_p1.category_2 p1_have_category_2, h_p1.category_3 p1_have_category_3, h_p1.category_4 p1_have_category_4, h_p1.category_5 p1_have_category_5, h_p1.category_6 p1_have_category_6, h_p1.category_7 p1_have_category_7, h_p1.category_8 p1_have_category_8, h_p1.category_9 p1_have_category_9, h_p1.category_10 p1_have_category_10, h_p1.category_11 p1_have_category_11, h_p1.category_12 p1_have_category_12, h_p1.category_13 p1_have_category_13, '4' as matchlevel  from have h_p2
      inner join have h_p1 on w_p1.user_id = h_p1.user_id 
      where exists(
        select * from wish w_p2
        where w_p2.user_id = h_p2.user_id
        and h_p1.category_4 = w_p2.category_4
      )
      AND w_p1.user_id = :user_id
      and w_p1.user_id != h_p2.user_id
        union
      /*category-5*/
      select w_p1.id as p1_id, w_p1.user_id p1_user_id, w_p1.article_id p1_wish_article_id, w_p1.category_1 p1_wish_category_1, w_p1.category_2 p1_wish_category_2, w_p1.category_3 p1_wish_category_3, w_p1.category_4 p1_wish_category_4, w_p1.category_5 p1_wish_category_5, w_p1.category_6 p1_wish_category_6, w_p1.category_7 p1_wish_category_7, w_p1.category_8 p1_wish_category_8, w_p1.category_9 p1_wish_category_9, w_p1.category_10 p1_wish_category_10, w_p1.category_11 p1_wish_category_11, w_p1.category_12 p1_wish_category_12, w_p1.category_13 p1_wish_category_13, h_p2.id p2_id, h_p2.user_id p2_user_id, h_p2.article_id p2_have_article_id, h_p2.category_1 p2_have_category_1, h_p2.category_2 p2_have_category_2, h_p2.category_3 p2_have_category_3, h_p2.category_4 p2_have_category_4, h_p2.category_5 p2_have_category_5, h_p2.category_6 p2_have_category_6, h_p2.category_7 p2_have_category_7, h_p2.category_8 p2_have_category_8, h_p2.category_9 p2_have_category_9, h_p2.category_10 p2_have_category_10, h_p2.category_11 p2_have_category_11, h_p2.category_12 p2_have_category_12, h_p2.category_13 p2_have_category_13, h_p1.article_id p1_have_article_id, h_p1.category_1 p1_have_category_1, h_p1.category_2 p1_have_category_2, h_p1.category_3 p1_have_category_3, h_p1.category_4 p1_have_category_4, h_p1.category_5 p1_have_category_5, h_p1.category_6 p1_have_category_6, h_p1.category_7 p1_have_category_7, h_p1.category_8 p1_have_category_8, h_p1.category_9 p1_have_category_9, h_p1.category_10 p1_have_category_10, h_p1.category_11 p1_have_category_11, h_p1.category_12 p1_have_category_12, h_p1.category_13 p1_have_category_13, '5' as matchlevel  from have h_p2
      inner join have h_p1 on w_p1.user_id = h_p1.user_id 
      where exists(
        select * from wish w_p2
        where w_p2.user_id = h_p2.user_id
        and h_p1.category_5 = w_p2.category_5
      )
      AND w_p1.user_id = :user_id
      and w_p1.user_id != h_p2.user_id
        union
      /*category-6*/
      select w_p1.id as p1_id, w_p1.user_id p1_user_id, w_p1.article_id p1_wish_article_id, w_p1.category_1 p1_wish_category_1, w_p1.category_2 p1_wish_category_2, w_p1.category_3 p1_wish_category_3, w_p1.category_4 p1_wish_category_4, w_p1.category_5 p1_wish_category_5, w_p1.category_6 p1_wish_category_6, w_p1.category_7 p1_wish_category_7, w_p1.category_8 p1_wish_category_8, w_p1.category_9 p1_wish_category_9, w_p1.category_10 p1_wish_category_10, w_p1.category_11 p1_wish_category_11, w_p1.category_12 p1_wish_category_12, w_p1.category_13 p1_wish_category_13, h_p2.id p2_id, h_p2.user_id p2_user_id, h_p2.article_id p2_have_article_id, h_p2.category_1 p2_have_category_1, h_p2.category_2 p2_have_category_2, h_p2.category_3 p2_have_category_3, h_p2.category_4 p2_have_category_4, h_p2.category_5 p2_have_category_5, h_p2.category_6 p2_have_category_6, h_p2.category_7 p2_have_category_7, h_p2.category_8 p2_have_category_8, h_p2.category_9 p2_have_category_9, h_p2.category_10 p2_have_category_10, h_p2.category_11 p2_have_category_11, h_p2.category_12 p2_have_category_12, h_p2.category_13 p2_have_category_13, h_p1.article_id p1_have_article_id, h_p1.category_1 p1_have_category_1, h_p1.category_2 p1_have_category_2, h_p1.category_3 p1_have_category_3, h_p1.category_4 p1_have_category_4, h_p1.category_5 p1_have_category_5, h_p1.category_6 p1_have_category_6, h_p1.category_7 p1_have_category_7, h_p1.category_8 p1_have_category_8, h_p1.category_9 p1_have_category_9, h_p1.category_10 p1_have_category_10, h_p1.category_11 p1_have_category_11, h_p1.category_12 p1_have_category_12, h_p1.category_13 p1_have_category_13, '6' as matchlevel  from have h_p2
      inner join have h_p1 on w_p1.user_id = h_p1.user_id 
      where exists(
        select * from wish w_p2
        where w_p2.user_id = h_p2.user_id
        and h_p1.category_6 = w_p2.category_6
      )
      AND w_p1.user_id = :user_id
      and w_p1.user_id != h_p2.user_id
        union
      /*category-7*/
      select w_p1.id as p1_id, w_p1.user_id p1_user_id, w_p1.article_id p1_wish_article_id, w_p1.category_1 p1_wish_category_1, w_p1.category_2 p1_wish_category_2, w_p1.category_3 p1_wish_category_3, w_p1.category_4 p1_wish_category_4, w_p1.category_5 p1_wish_category_5, w_p1.category_6 p1_wish_category_6, w_p1.category_7 p1_wish_category_7, w_p1.category_8 p1_wish_category_8, w_p1.category_9 p1_wish_category_9, w_p1.category_10 p1_wish_category_10, w_p1.category_11 p1_wish_category_11, w_p1.category_12 p1_wish_category_12, w_p1.category_13 p1_wish_category_13, h_p2.id p2_id, h_p2.user_id p2_user_id, h_p2.article_id p2_have_article_id, h_p2.category_1 p2_have_category_1, h_p2.category_2 p2_have_category_2, h_p2.category_3 p2_have_category_3, h_p2.category_4 p2_have_category_4, h_p2.category_5 p2_have_category_5, h_p2.category_6 p2_have_category_6, h_p2.category_7 p2_have_category_7, h_p2.category_8 p2_have_category_8, h_p2.category_9 p2_have_category_9, h_p2.category_10 p2_have_category_10, h_p2.category_11 p2_have_category_11, h_p2.category_12 p2_have_category_12, h_p2.category_13 p2_have_category_13, h_p1.article_id p1_have_article_id, h_p1.category_1 p1_have_category_1, h_p1.category_2 p1_have_category_2, h_p1.category_3 p1_have_category_3, h_p1.category_4 p1_have_category_4, h_p1.category_5 p1_have_category_5, h_p1.category_6 p1_have_category_6, h_p1.category_7 p1_have_category_7, h_p1.category_8 p1_have_category_8, h_p1.category_9 p1_have_category_9, h_p1.category_10 p1_have_category_10, h_p1.category_11 p1_have_category_11, h_p1.category_12 p1_have_category_12, h_p1.category_13 p1_have_category_13, '7' as matchlevel  from have h_p2
      inner join have h_p1 on w_p1.user_id = h_p1.user_id 
      where exists(
        select * from wish w_p2
        where w_p2.user_id = h_p2.user_id
        and h_p1.category_7 = w_p2.category_7
      )
      AND w_p1.user_id = :user_id
      and w_p1.user_id != h_p2.user_id
        union
      /*category-8*/
      select w_p1.id as p1_id, w_p1.user_id p1_user_id, w_p1.article_id p1_wish_article_id, w_p1.category_1 p1_wish_category_1, w_p1.category_2 p1_wish_category_2, w_p1.category_3 p1_wish_category_3, w_p1.category_4 p1_wish_category_4, w_p1.category_5 p1_wish_category_5, w_p1.category_6 p1_wish_category_6, w_p1.category_7 p1_wish_category_7, w_p1.category_8 p1_wish_category_8, w_p1.category_9 p1_wish_category_9, w_p1.category_10 p1_wish_category_10, w_p1.category_11 p1_wish_category_11, w_p1.category_12 p1_wish_category_12, w_p1.category_13 p1_wish_category_13, h_p2.id p2_id, h_p2.user_id p2_user_id, h_p2.article_id p2_have_article_id, h_p2.category_1 p2_have_category_1, h_p2.category_2 p2_have_category_2, h_p2.category_3 p2_have_category_3, h_p2.category_4 p2_have_category_4, h_p2.category_5 p2_have_category_5, h_p2.category_6 p2_have_category_6, h_p2.category_7 p2_have_category_7, h_p2.category_8 p2_have_category_8, h_p2.category_9 p2_have_category_9, h_p2.category_10 p2_have_category_10, h_p2.category_11 p2_have_category_11, h_p2.category_12 p2_have_category_12, h_p2.category_13 p2_have_category_13, h_p1.article_id p1_have_article_id, h_p1.category_1 p1_have_category_1, h_p1.category_2 p1_have_category_2, h_p1.category_3 p1_have_category_3, h_p1.category_4 p1_have_category_4, h_p1.category_5 p1_have_category_5, h_p1.category_6 p1_have_category_6, h_p1.category_7 p1_have_category_7, h_p1.category_8 p1_have_category_8, h_p1.category_9 p1_have_category_9, h_p1.category_10 p1_have_category_10, h_p1.category_11 p1_have_category_11, h_p1.category_12 p1_have_category_12, h_p1.category_13 p1_have_category_13, '8' as matchlevel  from have h_p2
      inner join have h_p1 on w_p1.user_id = h_p1.user_id 
      where exists(
        select * from wish w_p2
        where w_p2.user_id = h_p2.user_id
        and h_p1.category_8 = w_p2.category_8
      )
      AND w_p1.user_id = :user_id
      and w_p1.user_id != h_p2.user_id
        union
      /*category-9*/
      select w_p1.id as p1_id, w_p1.user_id p1_user_id, w_p1.article_id p1_wish_article_id, w_p1.category_1 p1_wish_category_1, w_p1.category_2 p1_wish_category_2, w_p1.category_3 p1_wish_category_3, w_p1.category_4 p1_wish_category_4, w_p1.category_5 p1_wish_category_5, w_p1.category_6 p1_wish_category_6, w_p1.category_7 p1_wish_category_7, w_p1.category_8 p1_wish_category_8, w_p1.category_9 p1_wish_category_9, w_p1.category_10 p1_wish_category_10, w_p1.category_11 p1_wish_category_11, w_p1.category_12 p1_wish_category_12, w_p1.category_13 p1_wish_category_13, h_p2.id p2_id, h_p2.user_id p2_user_id, h_p2.article_id p2_have_article_id, h_p2.category_1 p2_have_category_1, h_p2.category_2 p2_have_category_2, h_p2.category_3 p2_have_category_3, h_p2.category_4 p2_have_category_4, h_p2.category_5 p2_have_category_5, h_p2.category_6 p2_have_category_6, h_p2.category_7 p2_have_category_7, h_p2.category_8 p2_have_category_8, h_p2.category_9 p2_have_category_9, h_p2.category_10 p2_have_category_10, h_p2.category_11 p2_have_category_11, h_p2.category_12 p2_have_category_12, h_p2.category_13 p2_have_category_13, h_p1.article_id p1_have_article_id, h_p1.category_1 p1_have_category_1, h_p1.category_2 p1_have_category_2, h_p1.category_3 p1_have_category_3, h_p1.category_4 p1_have_category_4, h_p1.category_5 p1_have_category_5, h_p1.category_6 p1_have_category_6, h_p1.category_7 p1_have_category_7, h_p1.category_8 p1_have_category_8, h_p1.category_9 p1_have_category_9, h_p1.category_10 p1_have_category_10, h_p1.category_11 p1_have_category_11, h_p1.category_12 p1_have_category_12, h_p1.category_13 p1_have_category_13, '9' as matchlevel  from have h_p2
      inner join have h_p1 on w_p1.user_id = h_p1.user_id 
      where exists(
        select * from wish w_p2
        where w_p2.user_id = h_p2.user_id
        and h_p1.category_9 = w_p2.category_9
      )
      AND w_p1.user_id = :user_id
      and w_p1.user_id != h_p2.user_id
        union
      /*category-10*/
      select w_p1.id as p1_id, w_p1.user_id p1_user_id, w_p1.article_id p1_wish_article_id, w_p1.category_1 p1_wish_category_1, w_p1.category_2 p1_wish_category_2, w_p1.category_3 p1_wish_category_3, w_p1.category_4 p1_wish_category_4, w_p1.category_5 p1_wish_category_5, w_p1.category_6 p1_wish_category_6, w_p1.category_7 p1_wish_category_7, w_p1.category_8 p1_wish_category_8, w_p1.category_9 p1_wish_category_9, w_p1.category_10 p1_wish_category_10, w_p1.category_11 p1_wish_category_11, w_p1.category_12 p1_wish_category_12, w_p1.category_13 p1_wish_category_13, h_p2.id p2_id, h_p2.user_id p2_user_id, h_p2.article_id p2_have_article_id, h_p2.category_1 p2_have_category_1, h_p2.category_2 p2_have_category_2, h_p2.category_3 p2_have_category_3, h_p2.category_4 p2_have_category_4, h_p2.category_5 p2_have_category_5, h_p2.category_6 p2_have_category_6, h_p2.category_7 p2_have_category_7, h_p2.category_8 p2_have_category_8, h_p2.category_9 p2_have_category_9, h_p2.category_10 p2_have_category_10, h_p2.category_11 p2_have_category_11, h_p2.category_12 p2_have_category_12, h_p2.category_13 p2_have_category_13, h_p1.article_id p1_have_article_id, h_p1.category_1 p1_have_category_1, h_p1.category_2 p1_have_category_2, h_p1.category_3 p1_have_category_3, h_p1.category_4 p1_have_category_4, h_p1.category_5 p1_have_category_5, h_p1.category_6 p1_have_category_6, h_p1.category_7 p1_have_category_7, h_p1.category_8 p1_have_category_8, h_p1.category_9 p1_have_category_9, h_p1.category_10 p1_have_category_10, h_p1.category_11 p1_have_category_11, h_p1.category_12 p1_have_category_12, h_p1.category_13 p1_have_category_13, '10' as matchlevel  from have h_p2
      inner join have h_p1 on w_p1.user_id = h_p1.user_id 
      where exists(
        select * from wish w_p2
        where w_p2.user_id = h_p2.user_id
        and h_p1.category_10 = w_p2.category_10
      )
      AND w_p1.user_id = :user_id
      and w_p1.user_id != h_p2.user_id
        union
      /*category-11*/
      select w_p1.id as p1_id, w_p1.user_id p1_user_id, w_p1.article_id p1_wish_article_id, w_p1.category_1 p1_wish_category_1, w_p1.category_2 p1_wish_category_2, w_p1.category_3 p1_wish_category_3, w_p1.category_4 p1_wish_category_4, w_p1.category_5 p1_wish_category_5, w_p1.category_6 p1_wish_category_6, w_p1.category_7 p1_wish_category_7, w_p1.category_8 p1_wish_category_8, w_p1.category_9 p1_wish_category_9, w_p1.category_10 p1_wish_category_10, w_p1.category_11 p1_wish_category_11, w_p1.category_12 p1_wish_category_12, w_p1.category_13 p1_wish_category_13, h_p2.id p2_id, h_p2.user_id p2_user_id, h_p2.article_id p2_have_article_id, h_p2.category_1 p2_have_category_1, h_p2.category_2 p2_have_category_2, h_p2.category_3 p2_have_category_3, h_p2.category_4 p2_have_category_4, h_p2.category_5 p2_have_category_5, h_p2.category_6 p2_have_category_6, h_p2.category_7 p2_have_category_7, h_p2.category_8 p2_have_category_8, h_p2.category_9 p2_have_category_9, h_p2.category_10 p2_have_category_10, h_p2.category_11 p2_have_category_11, h_p2.category_12 p2_have_category_12, h_p2.category_13 p2_have_category_13, h_p1.article_id p1_have_article_id, h_p1.category_1 p1_have_category_1, h_p1.category_2 p1_have_category_2, h_p1.category_3 p1_have_category_3, h_p1.category_4 p1_have_category_4, h_p1.category_5 p1_have_category_5, h_p1.category_6 p1_have_category_6, h_p1.category_7 p1_have_category_7, h_p1.category_8 p1_have_category_8, h_p1.category_9 p1_have_category_9, h_p1.category_10 p1_have_category_10, h_p1.category_11 p1_have_category_11, h_p1.category_12 p1_have_category_12, h_p1.category_13 p1_have_category_13, '11' as matchlevel  from have h_p2
      inner join have h_p1 on w_p1.user_id = h_p1.user_id 
      where exists(
        select * from wish w_p2
        where w_p2.user_id = h_p2.user_id
        and h_p1.category_11 = w_p2.category_11
      )
      AND w_p1.user_id = :user_id
      and w_p1.user_id != h_p2.user_id
        union
      /*category-12*/
      select w_p1.id as p1_id, w_p1.user_id p1_user_id, w_p1.article_id p1_wish_article_id, w_p1.category_1 p1_wish_category_1, w_p1.category_2 p1_wish_category_2, w_p1.category_3 p1_wish_category_3, w_p1.category_4 p1_wish_category_4, w_p1.category_5 p1_wish_category_5, w_p1.category_6 p1_wish_category_6, w_p1.category_7 p1_wish_category_7, w_p1.category_8 p1_wish_category_8, w_p1.category_9 p1_wish_category_9, w_p1.category_10 p1_wish_category_10, w_p1.category_11 p1_wish_category_11, w_p1.category_12 p1_wish_category_12, w_p1.category_13 p1_wish_category_13, h_p2.id p2_id, h_p2.user_id p2_user_id, h_p2.article_id p2_have_article_id, h_p2.category_1 p2_have_category_1, h_p2.category_2 p2_have_category_2, h_p2.category_3 p2_have_category_3, h_p2.category_4 p2_have_category_4, h_p2.category_5 p2_have_category_5, h_p2.category_6 p2_have_category_6, h_p2.category_7 p2_have_category_7, h_p2.category_8 p2_have_category_8, h_p2.category_9 p2_have_category_9, h_p2.category_10 p2_have_category_10, h_p2.category_11 p2_have_category_11, h_p2.category_12 p2_have_category_12, h_p2.category_13 p2_have_category_13, h_p1.article_id p1_have_article_id, h_p1.category_1 p1_have_category_1, h_p1.category_2 p1_have_category_2, h_p1.category_3 p1_have_category_3, h_p1.category_4 p1_have_category_4, h_p1.category_5 p1_have_category_5, h_p1.category_6 p1_have_category_6, h_p1.category_7 p1_have_category_7, h_p1.category_8 p1_have_category_8, h_p1.category_9 p1_have_category_9, h_p1.category_10 p1_have_category_10, h_p1.category_11 p1_have_category_11, h_p1.category_12 p1_have_category_12, h_p1.category_13 p1_have_category_13, '12' as matchlevel  from have h_p2
      inner join have h_p1 on w_p1.user_id = h_p1.user_id 
      where exists(
        select * from wish w_p2
        where w_p2.user_id = h_p2.user_id
        and h_p1.category_12 = w_p2.category_12
      )
      AND w_p1.user_id = :user_id
      and w_p1.user_id != h_p2.user_id
        union
      /*category-13*/
      select w_p1.id as p1_id, w_p1.user_id p1_user_id, w_p1.article_id p1_wish_article_id, w_p1.category_1 p1_wish_category_1, w_p1.category_2 p1_wish_category_2, w_p1.category_3 p1_wish_category_3, w_p1.category_4 p1_wish_category_4, w_p1.category_5 p1_wish_category_5, w_p1.category_6 p1_wish_category_6, w_p1.category_7 p1_wish_category_7, w_p1.category_8 p1_wish_category_8, w_p1.category_9 p1_wish_category_9, w_p1.category_10 p1_wish_category_10, w_p1.category_11 p1_wish_category_11, w_p1.category_12 p1_wish_category_12, w_p1.category_13 p1_wish_category_13, h_p2.id p2_id, h_p2.user_id p2_user_id, h_p2.article_id p2_have_article_id, h_p2.category_1 p2_have_category_1, h_p2.category_2 p2_have_category_2, h_p2.category_3 p2_have_category_3, h_p2.category_4 p2_have_category_4, h_p2.category_5 p2_have_category_5, h_p2.category_6 p2_have_category_6, h_p2.category_7 p2_have_category_7, h_p2.category_8 p2_have_category_8, h_p2.category_9 p2_have_category_9, h_p2.category_10 p2_have_category_10, h_p2.category_11 p2_have_category_11, h_p2.category_12 p2_have_category_12, h_p2.category_13 p2_have_category_13, h_p1.article_id p1_have_article_id, h_p1.category_1 p1_have_category_1, h_p1.category_2 p1_have_category_2, h_p1.category_3 p1_have_category_3, h_p1.category_4 p1_have_category_4, h_p1.category_5 p1_have_category_5, h_p1.category_6 p1_have_category_6, h_p1.category_7 p1_have_category_7, h_p1.category_8 p1_have_category_8, h_p1.category_9 p1_have_category_9, h_p1.category_10 p1_have_category_10, h_p1.category_11 p1_have_category_11, h_p1.category_12 p1_have_category_12, h_p1.category_13 p1_have_category_13, '13' as matchlevel  from have h_p2
      inner join have h_p1 on w_p1.user_id = h_p1.user_id 
      where exists(
        select * from wish w_p2
        where w_p2.user_id = h_p2.user_id
        and h_p1.category_13 = w_p2.category_13
      )
      AND w_p1.user_id = :user_id
      and w_p1.user_id != h_p2.user_id
      )
      
      select * from matches
        order by cast(matchlevel as integer) desc`, {
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
          p1_wish_category_1,
          p1_wish_category_2,
          p1_wish_category_3,
          p1_wish_category_4,
          p1_wish_category_5,
          p1_wish_category_6,
          p1_wish_category_7,
          p1_wish_category_8,
          p1_wish_category_9,
          p1_wish_category_10,
          p1_wish_category_11,
          p1_wish_category_12,
          p1_wish_category_13,
          p2_user_id,
          p2_have_article_id,
          p1_have_article_id,
          matchlevel
        } = item;
        matchlevel = parseInt(matchlevel)
        
        sortedMatches[matchlevel].push({
          p1_user_id,
          p1_wish_article_id,
          p1_wish_category_1,
          p1_wish_category_2,
          p1_wish_category_3,
          p1_wish_category_4,
          p1_wish_category_5,
          p1_wish_category_6,
          p1_wish_category_7,
          p1_wish_category_8,
          p1_wish_category_9,
          p1_wish_category_10,
          p1_wish_category_11,
          p1_wish_category_12,
          p1_wish_category_13,
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
  });

  //Function for finding users that have what 'user_id' is searching for. Matches are found based on a singular wish request. 
  router.get('/matchForWish', async (req, res, next) => {
    const { user_id } = req.body;  
  
    if (!user_id) {
      return res.status(400).json({ message: 'Missing required user_id parameter' });
    }

    if (!validate(user_id)) {
      return res.status(400).json({ message: 'Invalid request format. The provided identifier must be a valid UUID.' });
    } 

    //SQL query that searches through 13 potential categories
    try {
      const [results, metadata] = await db.query(`
      with matches as
      (
      select *, '1'  as matchlevel
        FROM have h
        where exists (
          select * from wish w
          where h.category_1 = w.category_1 
          and w.user_id = :user_id
          and h.user_id != w.user_id
        )
        union
        select *, '2' as matchlevel
        FROM have h
        where exists (
          select * from wish w
          where h.category_2 = w.category_2 
          and w.user_id = :user_id
          and h.user_id != w.user_id
        )
        union
        select *, '3' as matchlevel
        FROM have h
        where exists (
          select * from wish w
          where h.category_3 = w.category_3 
          and w.user_id = :user_id
          and h.user_id != w.user_id
        )
        union
        select *, '4' as matchlevel
        FROM have h
        where exists (
          select * from wish w
          where h.category_4 = w.category_4 
          and w.user_id = :user_id
          and h.user_id != w.user_id
        )
        union
        select *, '5' as matchlevel
        FROM have h
        where exists (
          select * from wish w
          where h.category_5 = w.category_5 
          and w.user_id = :user_id
          and h.user_id != w.user_id
        )
        union
        select *, '6' as matchlevel
        FROM have h
        where exists (
          select * from wish w
          where h.category_6 = w.category_6 
          and w.user_id = :user_id
          and h.user_id != w.user_id
        )
        union
        select *, '7' as matchlevel
        FROM have h
        where exists (
          select * from wish w
          where h.category_7 = w.category_7
          and w.user_id = :user_id
          and h.user_id != w.user_id
        )
        union
        select *, '8' as matchlevel
        FROM have h
        where exists (
          select * from wish w
          where h.category_8 = w.category_8 
          and w.user_id = :user_id
          and h.user_id != w.user_id
        )
        union
        select *, '9' as matchlevel
        FROM have h
        where exists (
          select * from wish w
          where h.category_9 = w.category_9 
          and w.user_id = :user_id
          and h.user_id != w.user_id
        )
        union
        select *, '10' as matchlevel
        FROM have h
        where exists (
          select * from wish w
          where h.category_10 = w.category_10
          and w.user_id = :user_id
          and h.user_id != w.user_id
        )
        union
        select *, '11' as matchlevel
        FROM have h
        where exists (
          select * from wish w
          where h.category_11 = w.category_11 
          and w.user_id = :user_id
          and h.user_id != w.user_id
        )
        union
        select *, '12' as matchlevel
        FROM have h
        where exists (
          select * from wish w
          where h.category_12 = w.category_12 
          and w.user_id = :user_id
          and h.user_id != w.user_id
        )    
        union
        select *, '13' as matchlevel
        FROM have h
        where exists (
          select * from wish w
          where h.category_13 = w.category_13 
          and w.user_id = :user_id
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
          matchlevel } = item;

        matchlevel = parseInt(matchlevel);
        
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

    if (!validate(id) || !validate(user_id)) {
      return res.status(400).json({ message: 'Invalid request format. The provided identifier must be a valid UUID.' });
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