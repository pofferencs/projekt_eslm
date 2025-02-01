const express = require('express');
const router = express.Router();

const { applicationInsert } = require('../controllers/applicationController');
const { eventInsert } = require('../controllers/eventController');
const { gameInsert } = require('../controllers/gameController');
const { teamMembershipInsert } = require('../controllers/teamMembershipController');
const { teamInsert } = require('../controllers/teamController');

router.post('/application',applicationInsert);
router.post('/event',eventInsert);
router.post('/game',gameInsert);
router.post('/teammembership',teamMembershipInsert);
router.post('/team',teamInsert);

module.exports = router;