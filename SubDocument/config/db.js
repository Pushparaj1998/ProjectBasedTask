const mongooose = require('mongoose');

mongooose.connect(process.env.dbURL, {useNewUrlParser : true});
const con = mongooose.connection;
con.on('open', ()=> {
    console.log("DB Connected...")
})