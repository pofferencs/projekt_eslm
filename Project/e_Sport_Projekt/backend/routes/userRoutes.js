const express = require('express');

const router = express.Router();

//const {applicationDelete} = require('../controllers/applicationController');
//const { eventDelete } = require('../controllers/eventController');
//const { gameDelete } = require('../controllers/gameController');
//const { pictureDelete } = require('../controllers/pictureController');
//const { tournamentDelete } = require('../controllers/tournamentController');
const {userLogin} = require('../controllers/userController');

router.post('/login', userLogin);

//router.delete('/application', applicationDelete)
//router.delete('/event', eventDelete);
//router.delete('/game', gameDelete);
//router.delete('/picture', pictureDelete);
//router.delete('/tournament', tournamentDelete);


module.exports = router
