const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    erpId: String,
    addQuantity: Number,
    image: String
});

module.exports = mongoose.model('Item', itemSchema);