const express = require('express');
const router = express.Router();
const {userList, applicationList, eventList, gameList, matchList, pictureList, teamList, tournamentList, teamMembershipList} = require('../controllers/listsControllers');

router.get('/users',userList);
router.get('/applications',applicationList);
router.get('/events',eventList);
router.get('/games',gameList);
router.get('/matches',matchList);
router.get('/pictures',pictureList);
router.get('/picturelinks',pictureList);
router.get('/teams',teamList);
router.get('/teamMemberships',teamMembershipList);
router.get('/tournaments',tournamentList)

module.exports = router;