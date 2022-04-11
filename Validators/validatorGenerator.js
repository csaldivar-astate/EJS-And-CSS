"use strict";

function makeValidator (schema, prop) {
    if (!["body", "query", "params"].includes(prop)) {
        throw new Error(`${prop} is not a valid property`);
    }

    return function (req, res, next) {
        const {value, error} = schema.validate(req[prop], {
            abortEarly: false,
            stripUnknown: true, 
            errors: {
                escapeHtml: true,
            }
        });
        
        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(400).json({errorMessages});
        } 

        req[prop] = value;
        
        next();
    }
}

module.exports = {
    makeValidator,
};