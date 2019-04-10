const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    name: String,
    createdDate: {
        default: Date.now,
        type: Date
    },
    updatedDate:{
        default: Date.now,
        type: Date
    },
    desc: String,
    status: {
        type:String,
        default:'open'
    },
    createdBy: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    updatedBy: {
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