const express = require('express');
const router = express.Router();

const { applicationInsert } = require('../controllers/applicationController');

router.post('/application',applicationInsert);

module.exports = router;