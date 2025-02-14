const mongoose = require('mongoose');

const athkarSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        default: 1
    },
    translation: String,
    virtue: String
});

module.exports = mongoose.model('Athkar', athkarSchema);