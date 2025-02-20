const express = require('express');

const router = express.Router();

const { organizerLogin, organizerLogout, organizerReg, isAuthenticated, protected } = require('../controllers/organizerController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/login', organizerLogin);
router.post('/register', organizerReg);
router.get('/protected', protect, protected);
router.get('/auth', protect, isAuthenticated);
router.post('/logout', protect, organizerLogout);

module.exports = router
