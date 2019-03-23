const mongoose = require('mongoose'),
passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String,
    email: String
});
//roles
    // admin: create batches, create items, delete batches, delete items, responde to requests, approve batches, power over users
    // strong: (strong user) create batches, create items, delete items, responde to requests, send requests
    // standard: (standard user) create items, delete items, send requests

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);