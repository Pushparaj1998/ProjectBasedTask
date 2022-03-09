const mongoose = require('mongoose');

const balanceSchema =  mongoose.Schema({
    asset: {
        type: String
    },
    walletBalance: {
        type: Number,
        default:0
    },
    crossWalletBalance:{
        type: Number,
        default:0
    }
}, { timestamps: true })

const balanceInfoSchema =  mongoose.Schema({
    user_id: {
        type: String,
    },
    balance:[balanceSchema]
    
}, { timestamps: true })

module.exports = mongoose.model('FxWallet', balanceInfoSchema)