const express = require('express');
const router = express.Router();

const { applicationInsert } = require('../controllers/applicationController');
const { eventInsert } = require('../controllers/eventController');
const { gameInsert } = require('../controllers/gameController');
const { teamMembershipInsert } = require('../controllers/teamMembershipController');

router.post('/application',applicationInsert);
router.post('/event',eventInsert);
router.post('/game',gameInsert);
router.post('/teammembership',teamMembershipInsert);


module.exports = router;