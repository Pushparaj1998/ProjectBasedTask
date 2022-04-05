require('dotenv').config({ path: __dirname + '/config/.env' })
const express = require('express');
const app = express();
require('./config/db');

const AdminRouters = require('./routers/admin');
app.use(express.json())
app.use(AdminRouters);

app.listen(process.env.PORT, ()=> {
    console.log(`Server running on that Port ${process.env.PORT}`)
})