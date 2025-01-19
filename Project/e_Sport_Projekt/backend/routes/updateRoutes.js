const express = require('express');
const router = express.Router();
const {userUpdate, applicationsUpdate, eventUpdate, gameUpdate, pictureUpdate, probaPicture_linksUpdate} = require('../controllers/updateControllers')

router.patch('/user',userUpdate);
router.patch('/application', applicationsUpdate);
router.patch('/event',eventUpdate);
router.patch('/game',gameUpdate);
// router.patch('/match',);
router.patch('/picture', pictureUpdate);
router.patch('/probapicturelink', probaPicture_linksUpdate);
// router.patch('/team',);
// router.patch('/teamMembership',);
// router.patch('/tournament',)

module.exports = router;