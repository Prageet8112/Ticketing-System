const Joi = require('joi'); 

const schemas = {
    buses : Joi.object().keys({
        registrationNumber : Joi.string().min(10).max(12).required(),
        numberOfSeats : Joi.number().greater(1).required(),
        otherDetails : Joi.string().max(100)
    }),
    tickets : Joi.object().keys({
        seatNumber : Joi.number().greater(0).required() ,
        busNumber : Joi.string().required(),
        name : Joi.string().alphanum().min(2).max(30).required(),
        age : Joi.number().greater(3).required(),
        currentStatus : Joi.string().valid(['CLOSED'])
    }),
    users : Joi.object().keys({
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().min(5).required().strict() ,
        role : Joi.string().valid(['admin','customer']).default('customer').required()

    })
};

module.exports = schemas;