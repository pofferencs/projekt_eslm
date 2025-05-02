const express = require('express');

const router = express.Router();

const { userLogin, userReg, userLogout, isAuthenticated, protected, userGetPicturePath, passEmailSend, passEmailVerify, verifyEmailSend, emailVerifiedMod, userProfileSearchByName } = require('../controllers/userController');
const { protectUser } = require('../middlewares/authMiddleware');

router.post('/login', userLogin);
router.post('/register', userReg);
router.get('/protected', protectUser, protected);
router.get('/auth', protectUser, isAuthenticated);
router.post('/logout', protectUser, userLogout);
router.get('/userpic/:uer_id', userGetPicturePath);
router.post('/password-reset', passEmailSend);
router.post('/passemail-verify', passEmailVerify);
router.post('/email-verify-send', verifyEmailSend);
router.post('/email-verify', emailVerifiedMod);
router.get('/userprofilesearchbyname/:usr_name', userProfileSearchByName);


module.exports = router
