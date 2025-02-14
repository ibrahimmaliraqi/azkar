const router = require('express').Router();
const Athkar = require('../models/Athkar');

// Get all athkar
router.get('/', async (req, res) => {
    try {
        const athkar = await Athkar.find();
        res.json(athkar);
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// Get athkar by category
router.get('/category/:category', async (req, res) => {
    try {
        const athkar = await Athkar.find({ category: req.params.category });
        res.json(athkar);
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

module.exports = router;