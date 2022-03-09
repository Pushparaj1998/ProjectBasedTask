const axios = require('axios');
let url = require('url');


class Task1ApiService {
    constructor() {
        this.cache = {}
        
    }

    async getTask1() {
        const {ip , port} = await this.getService(process.env.Task1)
        return this.callService({
            method: 'get',
            url: `http://${ip}:${port}/getTask1`
        })
    }

    async createTask1() {
    const {ip , port} = await this.getService(process.env.Task1)
         return this.callService({
        method: 'post',
        url: `http://${ip}:${port}/createTask1`
        })
    }

    async getService(servicename) {
        const response = await axios.get(`http://`+process.env.SERVICE_PORT + `/find/${servicename}/1`);
        return response.data;
    }
}
module.exports = Task1ApiService;