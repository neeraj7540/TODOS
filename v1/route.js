const router = require("express").Router();
const Routes = require("./routes");

router.use("/todos", Routes.TodosRoutes);

module.exports = router;
