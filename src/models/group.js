const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: String,
    members: [
        {
        id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
        username: String
        }
    ]
});

module.exports = mongoose.model('Group', groupSchema);