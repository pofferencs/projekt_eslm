const express = require('express');
const router = express.Router();
const {userUpdate, applicationUpdate, eventUpdate, gameUpdate, pictureUpdate, picture_linkUpdate} = require('../controllers/updateControllers')

router.patch('/user',userUpdate);
router.patch('/application', applicationUpdate);
router.patch('/event',eventUpdate);
router.patch('/game',gameUpdate);
// router.patch('/match',);
router.patch('/picture', pictureUpdate);
router.patch('/picturelink', picture_linkUpdate);
// router.patch('/team',);
// router.patch('/teamMembership',);
// router.patch('/tournament',)

module.exports = router;