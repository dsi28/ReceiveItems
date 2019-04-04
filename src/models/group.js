const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: String,
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    role: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Group', groupSchema);