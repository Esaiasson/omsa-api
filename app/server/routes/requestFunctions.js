

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