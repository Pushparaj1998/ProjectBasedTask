const mongoose = require('mongoose');

mongoose.connect(process.env.URL, {useNewUrlParser : true});
const con = mongoose.connection;
//DB Connection
con.on('connected', () => {
    console.log('MongoDB Connection is open')
})
//DB Connection Error
con.on('error', (err)=>{
    console.log(`ERROR : ${err}`)
})
//DB Disconnected
con.on('disconnected', ()=> {
    console.log('DB Disconnected');
})

process.on('SIGINT', ()=>{
    con.close( ()=> {
        console.log("Mongoose default Connection is disconnected due to applicaiton Termination");
    })
})