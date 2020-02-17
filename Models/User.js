const mongoose = require('mongoose');
const Joi = require("joi");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const dotenv = require('dotenv');
dotenv.config({ path: "./config/config.env" })

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 1,
        maxlength: 200
    },
    userName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 15,
        unique: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 100,
        unique: true
    },
    avatar: {
        type: String
    }  
})
UserSchema.pre("save", async function(next) {
    if(!this.isModified("password")){
        next();
    }

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.generateToken = function() {
    return token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"), {
        expiresIn: 36000
    });
}

const User = mongoose.model('users', UserSchema,'users');

function validateUser(user){
    // validate User from MongoDB
   const schema = {
       name: Joi.string().min(1).max(200).required(),
       userName: Joi.string().min(2).max(15).required(),
       email: Joi.string().required().email(),
       password: Joi.string().min(8).max(100).required(),
       password2: Joi.string()
   }
   return Joi.validate(user, schema);
}


exports.User = User;
exports.validateUser = validateUser;