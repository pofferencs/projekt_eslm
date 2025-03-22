const express = require('express');
const router = express.Router();

const { applicationList } = require('../controllers/applicationController');
const { userList, userSearchByName } = require('../controllers/userController');
const { eventList, eventSearchByName } = require('../controllers/eventController');
const { gameList } = require('../controllers/gameController');
const { matchList } = require('../controllers/matchController');
const { pictureList } = require('../controllers/pictureController');
const { picture_linkList } = require('../controllers/pictureLinkController');
const { teamList, teamSearchByName } = require('../controllers/teamController');
const { teamMembershipList } = require('../controllers/teamMembershipController');
const { tournamentList, torunamentSearchByName } = require('../controllers/tournamentController');
const { organizerList } = require('../controllers/organizerController');

router.get('/user', userList); 
router.get('/application', applicationList);
router.get('/event', eventList); /*Esemény*/
router.get('/game', gameList);
router.get('/match', matchList);
router.get('/picture', pictureList);
router.get('/picturelink', picture_linkList);
router.get('/team', teamList);
router.get('/teamMembership', teamMembershipList);
router.get('/tournament', tournamentList) /*Verseny*/
router.get('/organizer',organizerList);
router.get('/enamesearch/:name', eventSearchByName);
router.get('/unamesearch/:usr_name', userSearchByName);
router.get('/tonamesearch/:name', torunamentSearchByName);
router.get('/tenamesearch/:full_name', teamSearchByName);

module.exports = router;