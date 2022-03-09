const express = require('express');
const router = express();
const {adminRoleAuth} = require('../controller/verifyToken')

const AdminController = require('../controller/admin');
const admincontroller = new AdminController();

router.get('/getAdmin',adminRoleAuth,  admincontroller.getAdmin);
router.post('/createAdmin',adminRoleAuth,  admincontroller.createAdmin);
router.put('/updateAdmin/:id',adminRoleAuth, admincontroller.updateAdmin);
router.delete('/deleteAdmin/:id',adminRoleAuth,  admincontroller.deleteAdmin);
router.post('/adminLogin', admincontroller.adminLogin);
router.post('/adminLogout', admincontroller.adminLogout);
module.exports = router;