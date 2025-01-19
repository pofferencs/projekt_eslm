const express = require('express');
const router = express.Router();
const {userList, applicationList, eventList, gameList, matchList, pictureList, teamList, tournamentList, teamMembershipList} = require('../controllers/listsControllers');

router.get('/user',userList);
router.get('/application',applicationList);
router.get('/event',eventList);
router.get('/game',gameList);
router.get('/matche',matchList);
router.get('/picture',pictureList);
router.get('/picturelink',pictureList);
router.get('/team',teamList);
router.get('/teamMembership',teamMembershipList);
router.get('/tournament',tournamentList)

module.exports = router;