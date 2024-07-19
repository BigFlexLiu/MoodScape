const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.get('/data', apiController.getData);
router.post('/data', apiController.postData);

module.exports = router;
