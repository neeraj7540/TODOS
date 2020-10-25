const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const Model = require("../../models/index");
const Validation = require("../validations/index");
const universalFunction = require("../../lib/universal-Function");
const { constant, statusCodes } = require("../../constant");
const messages = require("../../messages").messages.MESSAGES;
/**
 TODOS API'S
 */
exports.addTodos = addTodos;
exports.deleteTodos = deleteTodos;
exports.getAllTodos = getAllTodos;
exports.getTodosById = getTodosById;

async function addTodos(req, res, next) {
    try {
        await Validation.isTodosValidate.validateAddTodos(req);
        const emailUser = await Model.Todos.findOne({ email: req.body.email, isDeleted: false });
        if (emailUser) {
            throw messages.EMAIL_ALREDAY_EXIT;
        }
        const userNameCheck = await Model.Todos.findOne({ userName: req.body.userName, isDeleted: false });
        if (userNameCheck) {
            throw messages.USER_NAME_ALREADY_EXISTS;
        }
        if (req.body.phoneNo) {
            const userData = await Model.Todos.findOne({ phoneNo: req.body.phoneNo, countryCode: req.body.countryCode, isDeleted: false });
            if (userData) {
                throw messages.PHONE_NUMBER_ALREADY_EXISTS;
            }
        }
        let user = await new Model.Todos(req.body).save();
        return universalFunction.sendResponse(req, res, statusCodes.SUCCESS, messages.TODOS_SAVED_SUCCESSFULLY, user);
    } catch (error) {
        next(error);
    }
}
async function deleteTodos(req, res, next) {
    try {
        await Validation.isTodosValidate.validateDeleteTodos(req);
        const todosData = await Model.Todos.findOne({
            _id: req.body.todosId,
            isDeleted: false,
        });
        if (!todosData) throw new Error(messages.INVALID_TODO_ID);

        todosData.isDeleted = true;
        await todosData.save();
        return universalFunction.sendResponse(req, res, statusCodes.SUCCESS, messages.TODOS_DELETED_SUCCESSFULLY);
    } catch (error) {
        next(error);
    }
}
async function getAllTodos(req, res, next) {
    try {
        await Validation.isTodosValidate.validateGetAllTodos(req);

        const limit = Math.max(1, Number(req.body.limit || 10) || 0);
        const page = Math.max(0, Number(req.body.page) || 0);
        const skip = Math.max(0, page - 1) * limit;

        const query = { isDeleted: false };

        const itemCount = await Model.Todos.countDocuments(query);
        const pageCount = Math.ceil(itemCount / limit);
        const results = await Model.Todos.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean().exec();

        const message = results.length <= 0 ? messages.EMPTY_LIST : messages.FETCHED_SUCCESSFULLY;
        return universalFunction.sendResponse(req, res, statusCodes.SUCCESS, message, { results, itemCount, pageCount });

    } catch (error) {
        next(error);
    }
}
async function getTodosById(req, res, next) {
    try {
        await Validation.isTodosValidate.validateTodosById(req);
        const todos = await Model.Todos.findOne({
            _id: ObjectId(req.body.todosId),
            isDeleted: false,
        }).lean().exec();

        if (!todos) throw new Error(messages.INVALID_TODO_ID);
        return universalFunction.sendResponse(req, res, statusCodes.SUCCESS, messages.FETCHED_SUCCESSFULLY, todos);
    } catch (error) {
        next(error);
    }
}