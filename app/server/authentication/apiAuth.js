import * as object from '../models/objectIndex.js';
import { validateInput } from '../middleware/routeFunctions.js';


export const authenticateUser = async (req, res, next) => {

    const api_key = req.header('api_key');
    const validate = validateInput({ api_key });

    if (validate.valid){
        try{
            const apiUser = await object.apiUser.findOne({ where: {id: api_key} });
            if (apiUser != null && apiUser.id === api_key){
                return next();
            } else {
                res.status(401).json({ message: 'Invalid API key' });
            }
        }
        catch(error){
            res.status(500).json({ message: 'Internal server error' });
        }
    } else{
        res.status(400).json({ message: validate.message });
    }
}