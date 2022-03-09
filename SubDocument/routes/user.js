const express  = require('express');
const router = express();

const UserController = require('../controller/user');
const usercontroller = new UserController();

router.get('/getUser', usercontroller.getUser);
router.post('/createUser', usercontroller.createUser)


module.exports = router;