const express = require('express');
const router = express.Router();

const { applicationDelete } = require('../controllers/applicationController');
const { eventDelete } = require('../controllers/eventController');
const { gameDelete } = require('../controllers/gameController');
const { pictureDelete } = require('../controllers/pictureController');
const { tournamentDelete } = require('../controllers/tournamentController');
const { teamDelete } = require('../controllers/teamController');
const { teamMembershipDelete } = require('../controllers/teamMembershipController');


router.delete('/application',applicationDelete);
router.delete('/event',eventDelete);
router.delete('/game',gameDelete);
router.delete('/picture',pictureDelete);
router.delete('/tournament',tournamentDelete);
router.delete('/team',teamDelete);
router.delete('/teammembership',teamMembershipDelete)

module.exports = router;

