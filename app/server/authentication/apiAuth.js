import * as object from '../models/objectIndex.js';


export const authenticateUser = async (req, res, next) => {

    const api_key = req.header('api_key');


    const apiUser = await object.apiUser.findOne({ where: {id: api_key} });
    if (apiUser != null && apiUser.id === api_key){

        return next();
    } else {
        res.status(401).json({ message: 'Invalid API key' });
    }


}