const Task2 = require('../model/task2');

class Task2Controller{
    constructor() {

    }

    async getTask2(req,res) {
        try {
            const task2 = await Task2.find();
            res.status(200).json(task2);
        } catch (error) {
            res.status(400).send(`Error : ${error}`)
        }
    }

    async createTask2(req,res) {
        try {
            const task2 = new Task2({
                taskName : req.body.taskName,
                description : req.body.description
            })
            const saveTask2 = await task2.save();
            res.status(200).json(saveTask2)
        } catch (error) {
            res.status(400).send(`Error : ${error}`)
        }
    }
}

module.exports = Task2Controller;