const Task1 = require('../model/task1');

class Task1Controller{
    constructor() {

    }

    async getTask1(req,res) {
        try {
            const task1 = await Task1.find();
            res.status(200).json(task1);
        } catch (error) {
            res.status(400).send(`Error : ${error}`)
        }
    }

    async createTask1(req,res) {
        try {
            const task1 = new Task1({
                taskName : req.body.taskName,
                description : req.body.description
            })
            const saveTask1 = await task1.save();
            res.status(200).json(saveTask1)
        } catch (error) {
            res.status(400).send(`Error : ${error}`)
        }
    }
}

module.exports = Task1Controller;