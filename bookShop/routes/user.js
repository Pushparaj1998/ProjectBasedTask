const express = require('express');
const router  = express();
const {adminRoleAuth} = require('../controller/verifyToken')
const UserController = require('../controller/user')
const usercontroller = new UserController();

router.get('/getUsers', adminRoleAuth, usercontroller.getUser);
router.post('/createUser',adminRoleAuth, usercontroller.createUser);
router.put('/updateUser/:id',adminRoleAuth, usercontroller.updateUser);
router.delete('/deleteUser/:id',adminRoleAuth, usercontroller.deleteUser);
router.post('/userLogin', usercontroller.userLogin);
router.post('/userLogout', usercontroller.userLogout)
module.exports = router;