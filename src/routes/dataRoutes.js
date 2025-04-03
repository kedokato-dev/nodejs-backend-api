const express = require('express');
const { scrapeController } = require('../controllers/scrapeController');
const { userInfoController } = require('../controllers/userInfoController');


const router = express.Router();

function setRoutes(app) {
    // Route để cào dữ liệu
    router.post('/scrape', scrapeController);

    router.post('/profile', userInfoController);

    app.use('/api', router);
}

module.exports = setRoutes;