const express = require('express');

const router = express.Router();

const { userLogin, userReg, userLogout, isAuthenticated, protected } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/login', userLogin);
router.post('/register', userReg);
router.get('/protected', protect, protected);
router.get('/auth', protect, isAuthenticated);
router.post('/logout', protect, userLogout);

module.exports = router
