const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    primaryId: String,
    secondaryId: String,
    date: {
        default: Date.now,
        type:Date
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    for: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    },
    title: String,
    desc: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    status: String,
    type: String,
});

module.exports = mongoose.model('Task', taskSchema);