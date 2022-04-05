const Admin = require('../models/admin');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

class AdminController {
    constructor() { }

    async register(req, res) {
        try {
            if(req.body.pass == "JERRY") {
                let admin = await Admin.findOne({ email: req.body.email });
                if(!admin){
                    let newAdmin = await new Admin(req.body);
                    newAdmin.status = true;
                    await newAdmin.save();
                    res.status(200).send({ status: 200, success: true, message: "Admin Registred Successfully", data: newAdmin})
                } else {
                    res.status(200).send({ status: 400, success: false, message: "Already Registered Email Id"});
                }
            } else{
                res.status(200).send({ status: 400, success: false, message: "Invalid Pass"});
            }
        } catch (error) {
            console.log(`Error @ register ${error}`)
            res.status(400).send({ status: 400, success: false, message: "Failed to Register the User"});
        }
    }

    async login(req, res) {
        try {
             const admin = await Admin.findByCredentials(req.body.email, req.body.password)
             if(admin) {
                const token = await admin.generateAuthToken();
                res.cookie('tokenAdmin', token, { maxAge: 1000 * 60 * 60 * 24 * 1, httpOnly: false}).json({ status: 200, success: true, data: admin, message: 'Login Successful'})
                
             }
        } catch (error) {
            console.log(`Error @ login ${error}`);
            res.status(400).send({ status: 400, success: false, message : "Login Failed", error: error});
        }
    }

    async logout(req, res) {
        try {     
            res.clearCookie('tokenAdmin');
            res.status(200).json({ status: 200, success: true, message: "Logout Success" })
        } catch (error) {
            res.status(400).send({ status: 400, success: false, message: "Error in Logout", error: error.data})
        }
    }
}

module.exports = AdminController;
