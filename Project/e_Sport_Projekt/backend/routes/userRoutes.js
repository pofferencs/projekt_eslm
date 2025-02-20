const express = require('express');

const router = express.Router();

const { userLogin, userReg, userLogout, isAuthenticated, protected } = require('../controllers/userController');
const { protectUser } = require('../middlewares/authMiddleware');

router.post('/login', userLogin);
router.post('/register', userReg);
router.get('/protected', protectUser, protected);
router.get('/auth', protectUser, isAuthenticated);
router.post('/logout', protectUser, userLogout);

module.exports = router
