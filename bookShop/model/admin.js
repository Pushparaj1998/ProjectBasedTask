const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const adminSchema = new mongoose.Schema({
    name : {
        type: String
    },
    role: {
        type: String,
        enum: ['Owner'],
        message : ('Use User as Role')
    },
    email : {
        type: String
    },
    password : {
        type : String
    }
})
// adminSchema.methods.generateAuthToken = async function(){
//     const admin = this
//     const token = await jwt.sign({role : admin.role}, 'tomandjerry')
//     //await user.save()
//     console.log(token)
//     return token
//  }
module.exports = mongoose.model('Admin', adminSchema);