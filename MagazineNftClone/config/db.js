const mongoose = require('mongoose');
const options = { useNewUrlParser: true, useUnifiedTopology: true };


mongoose.connect(process.env.MONGODBURL, options);

mongoose.connection.on('connected', function () {
    console.log("Mongoose Connection is open ");
})

mongoose.connection.on('error', function (err) {
    console.log('Mongoose Connection has occured '+ err + 'error' );
})

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose Connection has Disconnected');
})

