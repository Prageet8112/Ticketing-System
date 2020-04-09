const _ = require('lodash');
const Joi = require('joi');
const Schemas = require('../models/all_schema');

module.exports = (useJoiError = true , schema) => {
    const _useJoiError = _.isBoolean(useJoiError) && useJoiError;
    const _supportedMethods = ['post', 'patch'];

    const _validationOptions = {
        abortEarly: false, 
        allowUnknown: true,
        stripUnknown: true 
    };

    return (req, res, next) => {

        const route = schema;
        const method = req.method.toLowerCase();
        console.log("validator " + method + " " + route);
        if (_.includes(_supportedMethods, method) && _.has(Schemas, route)) {

            const _schema = _.get(Schemas, route);
            console.log("get schema " + _schema);
            if (_schema) {
                return Joi.validate(req.body, _schema, _validationOptions, (err, data) => {
                    if (err) {
                        const JoiError = {
                            status: 'failed',
                            error: {
                                original: err._object,
                                details: _.map(err.details, ({message, type}) => ({
                                    message: message.replace(/['"]/g, ''),
                                    type
                                }))
                            }
                        };

                        const CustomError = {
                            status: 'failed',
                            error: 'Invalid request data. Please review request and try again.'
                        };

                        res.status(400).json(_useJoiError ? JoiError : CustomError);

                    } else {
                        req.body = data;
                        next();
                    }
                });
            }
        }
        next();
    };
};