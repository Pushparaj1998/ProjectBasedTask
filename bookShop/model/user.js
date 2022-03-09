const mongoose = require('mongoose');

const userSchema =  new mongoose.Schema({
    name : {
        type: String
    },
    address : {
        type : String
    },
    phoneNumber : {
        type: Number
    },
    role : {
        type :String,
        enum: ['Customer'],
        message : ('Use Customer as Role')
    },
    email : {
        type : String
    },
    password : {
        type : String
    }
})

module.exports = mongoose.model('User', userSchema);