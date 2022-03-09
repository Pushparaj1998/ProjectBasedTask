require('dotenv').config({path : __dirname + '/config/.env'});
const express = require('express');
const app = express();
const cookieParser = require("cookie-parser")
require('./config/db')
app.use(cookieParser())
app.use(express.json());
app.use('/', require('./routes/user'));
app.use('/', require('./routes/admin'));
app.use('/', require('./routes/book'));
app.listen(process.env.PORT, ()=> console.log('The Server runing on port 5006')); 