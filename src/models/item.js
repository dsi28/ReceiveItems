const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    erpId: String,
    addQuantity: Number,
    imageLocation: String,
    imageDisplay: String,
    createdDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Item', itemSchema);