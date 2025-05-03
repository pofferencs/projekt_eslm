const express = require('express');

const router = express.Router();

const { organizerLogin, organizerLogout, organizerReg, isAuthenticated, protected, organizerGetPicturePath, passEmailSend, passEmailVerify, verifyEmailSend, emailVerifiedMod, organizerSearchByName, organizerProfileSearchByName } = require('../controllers/organizerController');
const { protectOgr } = require('../middlewares/authMiddleware');

router.post('/login', organizerLogin);
router.post('/register', organizerReg);
router.get('/protected', protectOgr, protected);
router.get('/auth', protectOgr, isAuthenticated);
router.post('/logout', protectOgr, organizerLogout);
router.get('/organizerpic/:ogr_id', organizerGetPicturePath);
router.post('/password-reset', passEmailSend);
router.post('/passemail-verify', passEmailVerify);
router.post('/email-verify-send', verifyEmailSend);
router.post('/email-verify', emailVerifiedMod);
router.get('/organizerprofilesearchbyname/:usr_name', organizerProfileSearchByName);

module.exports = router
