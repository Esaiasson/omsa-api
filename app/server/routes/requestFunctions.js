import { db } from '../database/databaseConnection.js';

export const generateSqlQuery = (baseQuery, category_range) => {
    
    let sqlQuery = 'with matches as ('
    let nmbrOfCategories = parseInt(category_range)

    
    for (let i = 1; i <= nmbrOfCategories; i++){ 
      sqlQuery = sqlQuery.concat(baseQuery(i))
      if(i !== nmbrOfCategories){
        sqlQuery = sqlQuery.concat('union')
      }
      else(
        sqlQuery = sqlQuery.concat(`
          )
            select * from matches 
            order by cast(matchlevel as int) desc
        `)
      )
    }

    return sqlQuery
}


export const queryDb = async (sqlQuery, replacementValues) => {

    try {
        const [results, metadata] = await db.query(
        sqlQuery
        , {
            replacements: replacementValues,
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


        results.forEach(item => {
            let matchlevel = parseInt(item.matchlevel)            
            sortedMatches[matchlevel].push(
                item
            );
            
        });

        return {'accepted': true, 'results': results};

    } catch (error) {
      console.error('Error fetching matches:', error);
      return {'accepted': false, message: 'Internal Server Error' };
    }


}