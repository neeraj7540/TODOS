const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const config = require("config");

const mongoDbconnection = async function () {
    return new Promise((resolve, reject) => {
        const url = config.get("mongoDbConnectionUrl");
        mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true }, (error, result) => {
            if (error) {
                console.log("Mongo", error);
                return reject(error);
            }
            console.log("Mongo Connected");
            return resolve("Db successfully connected!");
        });
    });
};
autoIncrement.initialize(mongoose);

module.exports = { mongoDbconnection };
