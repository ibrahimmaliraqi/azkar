const router = require('express').Router();
const Hadith = require('../models/Hadith');

// Get random hadith of the day
router.get('/daily', async (req, res) => {
    try {
        const count = await Hadith.countDocuments();
        const random = Math.floor(Math.random() * count);
        const hadith = await Hadith.findOne().skip(random);
        res.json(hadith);
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// Get all hadiths
router.get('/', async (req, res) => {
    try {
        const hadiths = await Hadith.find();
        res.json(hadiths);
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

module.exports = router;