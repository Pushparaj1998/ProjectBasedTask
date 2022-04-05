const mongoose = require('mongoose');

const options = { useNewUrlParser: true, useUnifiedTopology: true};

mongoose.connect(process.env.MONGODB_URL, options);

mongoose.connection.on('connected', () => {
    console.log("Mongoose connection is open");
})

mongoose.connection.on('error', (err)=> {
    console.log("Mongoose connection has occured Error" + err );
})

mongoose.connection.on('disconnected', ()=> {
    console.log("Mongoose connection is Disconnected");
})