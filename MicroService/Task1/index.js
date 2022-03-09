require('dotenv').config({path : __dirname + '/config/.env'});
const express = require('express');
const app = express();
const axios = require('axios')
const http = require('http')

require('./config/db')

const server = http.createServer(app);

const { connectRabbitMQ } = require("./services/rabbitMQ");
const exp = require('constants');
const { version } = require('os');
connectRabbitMQ();

server.listen(0);

app.use(express.json())
app.use(require('./router/task1'))

server.on('listening', () => {
    const registerService = () => axios.put(`http://${process.env.SERVICE_PORT}`);
    const unregisterService = () => axios.delete(`http://${process.env.SERVICE_PORT}`);
     
    registerService();

    const interval = setInterval(registerService, 20000);
    const cleanup = async() => {
        clearInterval(interval);
        await unregisterService();
    };

    process.on('uncaughtException', async() => {
        await cleanup();
        process.exit(0);
    });

    process.on('SIGINT', async() => {
        await cleanup();
        process.exit(0);
    })

    process.on('SIGINT', async() => {
        await cleanup();
        process.exit(0);
    })

    process.on('SIGTERM', async() => {
        await cleanup();
        process.exit(0);
    })

    console.log(`Hi there, Iam Listening on port ${server.address().port}`);
})
