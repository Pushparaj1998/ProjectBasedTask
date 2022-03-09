const axios = require('axios');
const url = require('url');


class Task2ApiService {
    constructor() {
        this.cache = {}
        
    }

    async getTask2() {
        const {ip , port} = await this.getService()
        return this.callService({
            method: 'get',
            url: `http://${ip}:${port}/getTask2`
        })
    }

    async updateTask2() {
    const {ip , port} = await this.getService()
         return this.callService({
        method: 'get',
        url: `http://${ip}:${port}/createTask2`
        })
    }
}
module .exports = Task2ApiService;