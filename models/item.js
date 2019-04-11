const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    erpId: String,
    name: String,
    weight: Number,
    notes: String,
    createdBy: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        username: String
    },
    updatedBy: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        username: String
    },
    addQuantity: Number,
    imageLocation: String,
    imageDisplay: String,
    createdDate: {
        type: Date,
        default: Date.now
    },
    updatedDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Item', itemSchema);