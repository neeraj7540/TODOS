const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const encrypt = require("bcryptjs");
const TodoModel = new Schema(
    {
        userName: { type: String, index: true, default: "", },
        email: { type: String, index: true, default: "", },
        phoneNo: { type: String, index: true, default: "", },
        countryCode: { type: String, index: true, default: "", },
        password: { type: String, index: true, default: "", },
        isActive: { type: Boolean, default: true, },
        isBlocked: { type: Boolean, default: false, },
        isDeleted: { type: Boolean, default: false, },
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    }
);
TodoModel.set("toJSON", {
    virtuals: true,
    transform: function (doc, ret, option) {
        delete ret.password;
        delete ret.__v;
    },
});
TodoModel.pre("save", function (next) {
    encrypt.genSalt(10, (error, salt) => {
        if (error) return console.log(error);
        else if (this.password) {
            encrypt.hash(this.password, salt, (err, hash) => {
                if (err) return console.log(err);
                this.password = hash;
                next();
            });
        } else {
            next();
        }
    });
});
TodoModel.methods.comparePassword = function (password, cb) {
    encrypt.compare(password, this.password, (error, match) => {
        if (error) return cb(false);
        if (match) return cb(true);
        return cb(false);
    });
};
TodoModel.methods.updatePassword = function (password) {
    return new Promise((resolve, reject) => {
        encrypt.genSalt(10, (error, salt) => {
            if (error) return console.log(error);
            encrypt.hash(password, salt, (err, hash) => {
                if (err) return console.log(err);
                return resolve(hash);
            });
        });
    });
};
const Todos = mongoose.model("Todo", TodoModel);
module.exports = Todos;
