const mongoose = require('mongoose');


const addressSchema = new mongoose.Schema({
    street : {
        type: String
    },
     district : {
        type: String
    },
     pincode : {
        type: String
    }
})
const userSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true,
        message: 'Please Enter the name'
    },
    age : {
        type : String,
        min : 18,
        message : 'Your are Minor'
    },
    address: addressSchema
})

module.exports = mongoose.model('User', userSchema);