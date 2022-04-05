const jwt = require('jsonwebtoken');

const Admin = require('../models/admin');
// const User = require('../models/user');

const auth = async(req, res, next) => {
    try {
        const token = req.cookies.admintoken;
        console.log("token------>", req.cookies.admintoken)
        const decode = await jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findOne({ _id: decode._id, status: true});
        if(!admin) {
            throw new Error('Invail Credentials')
        }
        if (admin.status == false) {
            res.clearCookie('tokenAdmin')
            return res.status(401).send({ success: false, message: "Access Denied"})
        }
        req.token = token
        req.admin = admin
        // if(req.params.user_id) {
        //     const user = await User.findOne({ _id: req.params.user_id })
        //     if (!user) {
        //         return res.status(200).send({ success: false, message: "User Not Found"});

        //     }
        //     req.user = user;
        // }
        next()
    } catch (error) {
        console.log(`Error : ${error}`);
        res.status(401).send({ success: false, message: 'Logged out Kindly Login'})
    }
}

module.exports = auth