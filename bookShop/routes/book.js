const express = require('express');
const router = express();
const {adminRoleAuth, UserRoleAuth} = require('../controller/verifyToken');
const BookController = require('../controller/book');
const bookcontroller = new BookController();

router.get('/getBook',UserRoleAuth, bookcontroller.getBook);

router.post('/createBook',adminRoleAuth, bookcontroller.createBook);

router.put('/updateBook/:id',adminRoleAuth, bookcontroller.updateBook);

router.delete('/deleteBook/:id', bookcontroller.deleteBook);

router.get('/listBook',adminRoleAuth, bookcontroller.listBook);

module.exports = router;