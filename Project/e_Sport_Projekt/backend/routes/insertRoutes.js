const express = require('express');
const router = express.Router();

const { applicationInsert } = require('../controllers/applicationController');
const { eventInsert } = require('../controllers/eventController');

router.post('/application',applicationInsert);
router.post('/event',eventInsert);

module.exports = router;