const express = require('express');

const router = express.Router();

const { organizerLogin, organizerLogout, organizerReg, isAuthenticated, protected } = require('../controllers/organizerController');
const { protectOgr } = require('../middlewares/authMiddleware');

router.post('/login', organizerLogin);
router.post('/register', organizerReg);
router.get('/protected', protectOgr, protected);
router.get('/auth', protectOgr, isAuthenticated);
router.post('/logout', protectOgr, organizerLogout);

module.exports = router
