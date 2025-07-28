const express = require('express');
const router = express.Router();
const controller = require('../controllers/shortUrlsController');

// Define the routes
router.post('/shorturls', controller.createShortUrl);
router.get('/shorturls/:shortc', controller.getStats);
router.get('/:shortc', controller.redirectUrl);

module.exports = router;