const express = require('express');
const router = express.Router();

const { applicationInsert, applicationSubmit } = require('../controllers/applicationController');
const { eventInsert } = require('../controllers/eventController');
const { gameInsert } = require('../controllers/gameController');
const { matchInsert } = require('../controllers/matchController');
const { teamMembershipInsert, invite,    inviteAcceptOrReject,    myInvites } = require('../controllers/teamMembershipController');
const { teamInsert } = require('../controllers/teamController');
const { tournamentInsert } = require('../controllers/tournamentController');
const { pictureInsert, upload } = require('../controllers/pictureController')


router.post('/application', applicationInsert);
router.post('/application/submit', applicationSubmit);
router.post('/event', eventInsert);
router.post('/game', gameInsert);
router.post('/match', matchInsert);
router.post('/teammembership', teamMembershipInsert);
router.post('/team', teamInsert);
router.post('/tournament', tournamentInsert);
router.post('/upload', upload.single('image'), pictureInsert);

//invite kezelések
router.post('/myinvites', myInvites);
router.post('/invite',invite);
router.post('/inviteacceptorreject',inviteAcceptOrReject)

module.exports = router;