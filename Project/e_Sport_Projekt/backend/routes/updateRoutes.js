const express = require('express');
const router = express.Router();

const { applicationUpdate, applicationHandle } = require('../controllers/applicationController');
const { userUpdate } = require('../controllers/userController');
const { eventUpdate } = require('../controllers/eventController');
const { gameUpdate } = require('../controllers/gameController');
const { matchUpdate } = require('../controllers/matchController');
const { pictureUpdate } = require('../controllers/pictureController');
const { picture_linkUpdate } = require('../controllers/pictureLinkController');
const { teamUpdate } = require('../controllers/teamController');
const { teamMembershipUpdate } = require('../controllers/teamMembershipController');
const { tournamentUpdate } = require('../controllers/tournamentController');
const { organizerUpdate, userBanByOrg } = require('../controllers/organizerController');

router.patch('/user', userUpdate);
router.patch('/application', applicationUpdate);
router.patch('/application/handle', applicationHandle);
router.patch('/event', eventUpdate);
router.patch('/game', gameUpdate);
router.patch('/match', matchUpdate);
router.patch('/picture', pictureUpdate);
router.patch('/picturelink', picture_linkUpdate);
router.patch('/team', teamUpdate);
router.patch('/teamMembership', teamMembershipUpdate);
router.patch('/tournament', tournamentUpdate)
router.patch('/organizer',organizerUpdate);
router.patch('/banuser', userBanByOrg);

module.exports = router;