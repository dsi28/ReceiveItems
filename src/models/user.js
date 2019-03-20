const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String,
    email: String
});

module.exports = mongoose.model('User', userSchema);