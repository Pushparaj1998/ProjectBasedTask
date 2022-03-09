const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const mongoose = require('mongoose');
const url = 'mongodb://localhost/CryptoApp'
require('./router/fxPayload');
require('./router/payload');

mongoose.connect(url, {useNewUrlParser : true})
const con = mongoose.connection;
con.on('open', ()=> {
    console.log("Mongoose Connected....")
})

app.use(express.json())
app.use(bodyParser.json())
app.use(require('./router/trade'));

// payload.OrderPayload();
//payload.FxOrderPayload();

const PORT = 4005;

app.listen(PORT, ()=> console.log(`The Server Running on that Port ${PORT}`));