const ServiceCallAPI = require("../task1_service")
const serviceCallAPI = new ServiceCallAPI();

class Task1Controller {
    constructor() {}

    async getTask1(req,res){
        let response = await serviceCallAPI.getTask1();
        res.status(200).send(response)
    }
    async createTask1(req,res){
        let response = await serviceCallAPI.createTask1();
        res.status(200).send(response)
    }
}

module.exports = Task1Controller;