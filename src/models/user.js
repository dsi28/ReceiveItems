const mongoose = require('mongoose'),
passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String,
    email: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
});
//roles
    // admin: create batches, create items, delete batches, delete items, respond to requests, approve batches, power over users
    //(not implemented) strong: (strong user) create batches, create items, delete items, respond to requests, send requests
    // standard: (standard user) create items, delete items, send requests

//reset password token is used when reseting password. 
//reset password is date when the token expires

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);