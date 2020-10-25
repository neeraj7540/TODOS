const express = require("express");
const app = express();
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("config");



const connection = require("./connection/connect");
const route = require("./route");
const universalFunction = require("./lib/universal-Function");
const { statusCodes } = require("./constant");

const server = require("http").createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(logger("dev"));

app.use("/api", route);

app.use((error, req, res, next) => {
    if (error) {
        console.error(error);
        return universalFunction.sendErrorResponse(req, res, statusCodes.BAD_REQUEST, error.message || error);
    }
    next();
});


server.listen(config.get("port"), async () => {
   console.log(`Environment:`, process.env.NODE_ENV);
    console.log(`Running on:`, config.get("port"));
    await connection.mongoDbconnection();
});
