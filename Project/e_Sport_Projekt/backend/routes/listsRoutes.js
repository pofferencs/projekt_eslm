const express = require('express');
const router = express.Router();

const { applicationList } = require('../controllers/applicationController');
const { userList, userSearchByName } = require('../controllers/userController');
const { eventList, eventSearchByName, eventGetPicPath } = require('../controllers/eventController');
const { gameList } = require('../controllers/gameController');
const { matchList } = require('../controllers/matchController');
const { pictureList } = require('../controllers/pictureController');
const { picture_linkList } = require('../controllers/pictureLinkController');
const { teamList, teamSearchByName, teamGetPicPath } = require('../controllers/teamController');
const { teamMembershipList, activeMembersList } = require('../controllers/teamMembershipController');
const { tournamentList, tournamentSearchByName, tournamentSearchByEvent, tournamentGetPicPath } = require('../controllers/tournamentController');
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
router.get('/tournamentbyeventname', tournamentSearchByEvent);
router.get('/organizer',organizerList);
router.get('/enamesearch/:name', eventSearchByName);
router.get('/unamesearch/:usr_name', userSearchByName);
router.get('/tonamesearch/:name', tournamentSearchByName);
router.get('/tenamesearch/:full_name', teamSearchByName);
router.get('/teampic/:team_id', teamGetPicPath);
router.get('/tournamentpic/:tournament_id', tournamentGetPicPath);
router.get('/eventpic/:evt_id',eventGetPicPath);
router.get('/team/:team_id/members', activeMembersList)

module.exports = router;