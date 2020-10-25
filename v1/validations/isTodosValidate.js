const joi = require("joi");
const universalFunction = require("../../lib/universal-Function");

const validateAddTodos = async (req) => {
    let schema = joi.object().keys({
        phoneNo: joi.string().regex(/^[0-9]+$/).min(5).optional(),
        countryCode: joi.string().regex(/^[0-9,+]+$/).trim().min(2).optional(),
        email: joi.string().regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).required(),
        userName: joi.string().optional(),
        password: joi.string().required(),
    });
    return await universalFunction.validateSchema(req.body, schema);
};
const validateGetAllTodos = async (req) => {
    let schema = joi.object().keys({
        limit: joi.number().optional(),
        page: joi.number().min(1).optional(),
    });
    return await universalFunction.validateSchema(req.body, schema);
};
const validateTodosById = async (req) => {
    let schema = joi.object().keys({
      todosId: joi.string().length(24).required(),
    });
    return await universalFunction.validateSchema(req.body, schema);
};
const validateDeleteTodos = async (req) => {
    let schema = joi.object().keys({
      todosId: joi.string().length(24).required(),
    });
    return await universalFunction.validateSchema(req.body, schema);
};
module.exports = {
    validateAddTodos,
    validateDeleteTodos,
    validateGetAllTodos,
    validateTodosById,
};