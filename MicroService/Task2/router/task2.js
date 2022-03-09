const express = require('express');
const router = express();

const Task2Controller = require('../controller/task2');
const task2Controller = new Task2Controller();

router.get('/getTask2', task2Controller.getTask2)
router.post('/createTask2', task2Controller.createTask2);

module.exports = router;