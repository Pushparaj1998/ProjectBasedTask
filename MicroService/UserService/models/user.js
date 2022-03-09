const mongoose = require('mongoose');


const userSchema = mongoose.Schema({

    name : {
        type : String
    },
    email: {
        type : String
    },
    password:{
        type: String
    },
    role: {
        type : String
    },
    department : {
        type : String
    }
})

module.exports = mongoose.model('User', userSchema)

