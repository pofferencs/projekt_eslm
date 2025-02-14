const express = require('express');

const router = express.Router();

//const {applicationDelete} = require('../controllers/applicationController');
//const { eventDelete } = require('../controllers/eventController');
//const { gameDelete } = require('../controllers/gameController');
//const { pictureDelete } = require('../controllers/pictureController');
//const { tournamentDelete } = require('../controllers/tournamentController');
const {userLogin, userReg, userLogout, isAuthenticated, protected} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/login', userLogin);
router.post('/register', userReg);
router.get('/protected', protect, protected);
router.get('/auth', protect, isAuthenticated);
router.post('/logout', protect, userLogout);

//router.delete('/application', applicationDelete)
//router.delete('/event', eventDelete);
//router.delete('/game', gameDelete);
//router.delete('/picture', pictureDelete);
//router.delete('/tournament', tournamentDelete);


module.exports = router
