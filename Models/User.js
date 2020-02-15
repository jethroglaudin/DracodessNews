const mongoose = require('mongoose');
const Joi = require("joi");
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 1,
        maxlength: 200
    },
    username: {
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
        maxlength: 50,
        unique: true
    },
    avatar: {
        type: String
    }  
})


const User = mongoose.model(UserSchema);

function validateUser(){
    // validate User from MongoDB
   const schema = {
       name: Joi.string().min(1).max(200).required(),
       username: Joi.string().min(2).max(15).required(),
       email: Joi.string().required().email(),
       password: Joi.string().min(8).maxLength(50).required()
   }
}

exports.User;
exports.validateUser;