const express = require('express');
const router = express.Router();

const { applicationList } = require('../controllers/applicationController');
const { userList, userSearchByName } = require('../controllers/userController');
const { eventList, eventSearchByName, eventGetPicPath, eventSearchById, eventSearchByOrganizer } = require('../controllers/eventController');
const { gameList } = require('../controllers/gameController');
const { matchList } = require('../controllers/matchController');
const { pictureList } = require('../controllers/pictureController');
const { picture_linkList } = require('../controllers/pictureLinkController');
const { teamList, teamSearchByName, teamGetPicPath } = require('../controllers/teamController');
const { tournamentList, tournamentSearchByName, tournamentSearchByEvent, tournamentGetPicPath, tntSearchById } = require('../controllers/tournamentController');
const { organizerList, organizerSearchById } = require('../controllers/organizerController');
const { teamMembershipList, activeMembersList, teamsForPlayer } = require('../controllers/teamMembershipController');


router.get('/user', userList); 
router.get('/application', applicationList);
router.get('/event', eventList); /*Esemény*/
router.get('/event/:id', eventSearchById);
router.post('/eventsearchbyorganizer', eventSearchByOrganizer);
router.get('/game', gameList);
router.get('/match', matchList);
router.get('/picture', pictureList);
router.get('/picturelink', picture_linkList);
router.get('/team', teamList);
router.get('/teamMembership', teamMembershipList);
router.get('/tournament', tournamentList) /*Verseny*/
router.post('/tntsearchid/:id', tntSearchById);
router.post('/tournamentbyeventname', tournamentSearchByEvent);
router.get('/organizer',organizerList);
router.post('/organizerid', organizerSearchById);
router.get('/enamesearch/:name', eventSearchByName);
router.get('/unamesearch/:usr_name', userSearchByName);
router.get('/tonamesearch/:name', tournamentSearchByName);
router.get('/tenamesearch/:full_name', teamSearchByName);
router.get('/teampic/:team_id', teamGetPicPath);
router.get('/tournamentpic/:tournament_id', tournamentGetPicPath);
router.get('/eventpic/:evt_id',eventGetPicPath);
router.get('/team/:team_id/members', activeMembersList)
router.get('/userteammemberships/:user_name',teamsForPlayer);

module.exports = router;