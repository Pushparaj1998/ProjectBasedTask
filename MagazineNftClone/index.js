require('dotenv').config({ path:__dirname + '/config/.env' })
const express = require('express');
const app = express();
require('./config/db');

const server = app.listen(process.env.PORT, () => {
    console.log("Magazine Nft running on : localhost", process.env.PORT);
})

process.on('unhandledRejection', (err, Promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
})