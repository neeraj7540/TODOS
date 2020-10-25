const joi = require("joi");
const { constant, statusCodes } = require("../constant");
const appMessages = require("../langs");
const messages = require("../messages").messages.MESSAGES;

const sendResponse = async (req, res, code, message, data) => {
    try {
        const lang = req.headers["content-language"] || constant.LANGUAGE_TYPE.ENGLISH;
        return res.status(200).send({
            statusCode: code || statusCodes.SUCCESS,
            message: appMessages[lang]["APP_MESSAGES"][message || messages.SUCCESS],
            data: data || {},
        });
    } catch (error) {
        throw error;
    }
};
const sendErrorResponse = async (req, res, code, error) => {
    try {
        const lang = req.headers["content-language"] || constant.LANGUAGE_TYPE.ENGLISH;
        return res.status(208).send({
            statusCode: code || statusCodes.BAD_REQUEST,
            error: appMessages[lang]["APP_MESSAGES"][error] || error,
            message: error,
        });
    } catch (error) {
        throw error;
    }
};
const unauthorizedResponse = async (req, res, message) => {
    try {
        const lang = req.headers["content-language"] || constant.LANGUAGE_TYPE.ENGLISH;
        const code = statusCodes.UNAUTHORIZED;
        message = message || messages.UNAUTHORIZED;
        return res.status(code).send({
            statusCode: code,
            message: appMessages[lang]["APP_MESSAGES"][message],
            data: {},
        });
    } catch (error) {
        throw error;
    }
};
const validateSchema = async (inputs, schema) => {
    try {
        const { error, value } = joi.validate(inputs, schema);
        if (error)
            throw error.details ? error.details[0].message : '';
        else
            return false;
    } catch (error) {
        throw error
    }
}
module.exports = {
    sendErrorResponse: sendErrorResponse,
    sendResponse: sendResponse,
    unauthorizedResponse: unauthorizedResponse,
    validateSchema: validateSchema,
};
