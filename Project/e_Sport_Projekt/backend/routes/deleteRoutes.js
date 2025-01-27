const express = require('express');
const router = express.Router();

const { applicationDelete } = require('../controllers/applicationController');
const { eventDelete } = require('../controllers/eventController');
const { gameDelete } = require('../controllers/gameController');
const { pictureDelete } = require('../controllers/pictureController');
const { tournamentDelete } = require('../controllers/tournamentController');
// team
// teamMembership

module.exports = router;