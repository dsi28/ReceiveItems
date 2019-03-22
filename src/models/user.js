const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String,
    email: String
});
//roles
    // admin: create batches, create items, delete batches, delete items, responde to requests, approve batches, power over users
    // strongUser: create batches, create items, delete items, responde to requests, send requests
    // user: create items, delete items, send requests
module.exports = mongoose.model('User', userSchema);