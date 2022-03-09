require('dotenv').config({path : __dirname + '/config/.env'});
const express = require('express');
const useragent = require('express-useragent');
const expressip = require('express-ip');
const http = require('http')

//  const logger = require('./middleware/logger');

require('./config/db')

const app = express();

app.use(express.json());
app.use(expressip().getIpInfoMiddleware);
//  app.use(logger);
app.use('/',require('./routers/user'))
app.use('/', require('./routers/task1'))

app.use(useragent.express());

const port  = 4003;

const { connectRabbitMQ } = require("./services/rabbitMQ");
connectRabbitMQ();

const server = app.listen(port, ()=> {
    console.log(`Server running on the Port ${port}`)
})

process.on('unhandledRejection', (err, Promise) => {
    console.log(`Error: ${err.message}`);
    server.close(()=> process.exit(1));
})