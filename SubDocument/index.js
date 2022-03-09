require('dotenv').config({ path:__dirname + '/config/.env'})
const express = require('express');
const app = express();
require('./config/db')

app.use(express.json());
app.use('/', require('./routes/user'));
const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Server running on that port ${port}`))


        setInterval(function(){ console.log("lofgggggggggg")}, 3000);

