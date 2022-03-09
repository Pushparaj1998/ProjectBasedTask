const mongoose = require('mongoose');


const coinlistSchema =  mongoose.Schema({
    coin: {
        type: String
    },
    bal: {
        type: Number,
        default:0
    }
    
}, { timestamps: true })

const walletSchema =  mongoose.Schema({
    user_id: {
        type: String,
    },
    subAccountId: {
        type: String
    },
    user_binanceKey: {
        apiKey: {
            type: String
        },
        apiSecret: {
            type: String
        }
    },
    email:{
        type: String
    },
    verified: {
        type: Boolean
    },
    name:{
        type:String
    },
    balance:[coinlistSchema]
    
}, { timestamps: true });


module.exports = mongoose.model('Wallet', walletSchema)