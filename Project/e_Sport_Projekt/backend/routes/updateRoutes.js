const express = require('express');
const router = express.Router();
const {userUpdate} = require('../controllers/updateControllers')

router.patch('/userUpdate',userUpdate);

module.exports = router;