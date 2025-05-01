const express = require('express');
const router = express.Router();

const { applicationInsert } = require('../controllers/applicationController');
const { eventInsert } = require('../controllers/eventController');
const { gameInsert } = require('../controllers/gameController');
const { matchInsert } = require('../controllers/matchController');
const { teamMembershipInsert } = require('../controllers/teamMembershipController');
const { teamInsert } = require('../controllers/teamController');
const { tournamentInsert } = require('../controllers/tournamentController');
const { pictureInsert } = require('../controllers/pictureController')


router.post('/application', applicationInsert);
router.post('/event', eventInsert);
router.post('/game', gameInsert);
router.post('/match', matchInsert);
router.post('/teammembership', teamMembershipInsert);
router.post('/team', teamInsert);
router.post('/tournament', tournamentInsert);
router.post('/picture', pictureInsert)

module.exports = router;