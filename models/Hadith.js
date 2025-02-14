const mongoose = require('mongoose');

const hadithSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    narrator: String,
    source: String,
    translation: String
});

module.exports = mongoose.model('Hadith', hadithSchema);