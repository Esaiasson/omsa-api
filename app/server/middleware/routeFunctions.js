import validate from 'uuid-validate';

//Function for validating required input fields from request
export const validateInput = (input) => {
    for (let key in input) {
      if (input.hasOwnProperty(key)) {
        let value = input[key];
        if (!value) {
          return { valid: false, message: `${key} cannot be empty` };
        } else if (!validate(value)) {
          return { valid: false, message: `${key} must be a valid UUID` };
        }
      }
    }
    return { valid: true, message: 'All inputs are valid' };
};



export const validateRequestBody = (body, requiredKeys) => {
  
  const missingKeys = [];
  const emptyKeys = [];

  requiredKeys.forEach(key => {
      if (!body.hasOwnProperty(key)) {
          missingKeys.push(key);
      } else if (req.body[key] === null || body[key] === undefined || body[key] === '') {
          emptyKeys.push(key);
      }
  });

  if (missingKeys.length > 0 || emptyKeys.length > 0) {
      return {
          message: 'Validation error',
          missingKeys,
          emptyKeys
      };
  }
};