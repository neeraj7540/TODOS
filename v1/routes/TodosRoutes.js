const router = require("express").Router();
const Controller = require("../controllers/index");
/**
 TODOS API'S
 */
router.post("/addTodos", Controller.TodosController.addTodos);
router.delete("/deleteTodos", Controller.TodosController.deleteTodos);
router.get("/getAllTodos", Controller.TodosController.getAllTodos);
router.get("/getTodosById", Controller.TodosController.getTodosById);

module.exports = router;
