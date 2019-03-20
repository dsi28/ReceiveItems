const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    bId: String,
    createdDate: {
        default: Date.now(),
        type: Date
    },
    createdBy: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        }
    ]
});

module.exports = mongoose.model('Batch', batchSchema);