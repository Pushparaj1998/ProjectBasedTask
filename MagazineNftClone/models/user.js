const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    walletAddress: {
        type: String,
        required: true
    },
    nonce: {
        type: String
    },
    signature: {
        type: String
    },
    login: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        deafault: 'Unknown'
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    confirmPassword: {
        type: String,
        trim: true,
        minlength: 8
    },
    DOB: {
        type: String,
        trim: true
    },
    mobileNum: {
        type: Number,
        minlength: 10
    },
    address: {
        type: String
    },
    bio: {
        type: String
    },
    country: {
        type: String
    },
    country_code: {
        type: String
    },
    zipcode: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    enable2FA: {
        type: Boolean,
        default: false
    },
    enableEmailVerfication: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: false
    },
    secret2FA: {
        type: Boolean,
        default: false
    },
    notes: {
        type: String,
        enum: ['LOGGED_IN', 'LOGGED_OUT']
    },
    language: {
        type: String,
        default: 'en'
    },
    otp: {
        type: String
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }


})