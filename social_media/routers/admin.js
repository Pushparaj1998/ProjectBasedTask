const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/auth-admin')
const AdminController = require('../controllers/admin');
const adminController = new AdminController();

router.post('/admin/register', adminController.register);
router.post('/admin/login', adminController.login);
router.get('/admin/logout',adminAuth, adminController.logout);




module.exports = router;