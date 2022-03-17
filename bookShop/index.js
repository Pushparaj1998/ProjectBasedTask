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



var substr = new Array("One", "Two", "Three", "Four");
    var commaList = '';

    var i;
    for (i = 0; i < substr.length; ++i) {
        if (i == substr.length - 1)
            commaList = commaList + " and " + substr[i];
        else if(i>0)
            commaList = commaList + ", " + substr[i];
        else {
            commaList = substr[i]
        }
    }
    // commaList.substr(2, commaList.length)
console.log(commaList);