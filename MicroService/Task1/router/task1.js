const express = require('express');
const router = express();

const Task1Controller = require('../controller/task1');
const task1Controller = new Task1Controller();

router.get('/getTask1', task1Controller.getTask1)
router.post('/createTask1', task1Controller.createTask1);

module.exports = router;