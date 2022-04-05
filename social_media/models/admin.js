const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const adminSchema  = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    status: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: "Admin"
    },
    deleted: {
        type: false
    }
})
adminSchema.methods.generateAuthToken = async function() {
    const admin = this
    const token = await jwt.sign({ _id: admin._id.toString() }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
    return token
}

adminSchema.statics.findByCredentials = async ( email, password ) => {
    const admin = await Admin.findOne({ email })
    if(!admin){
        throw new Error('Invaild Credentials')
    }
    if (admin.status == false) {
        throw new Error('Access Denied')
    }
    const check = await bcrypt.compare(password, admin.password)
    if(!check){
        throw new Error('Invalid Credentials')
    }
    return admin
}

adminSchema.pre('save', async function (next) {
    const admin = this
    if(admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 8)
    }
    next()
})

let Admin = mongoose.model('admin', adminSchema);
module.exports = Admin;