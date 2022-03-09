const mongoose = require('mongoose');

const FxPositionSchema = mongoose.Schema({
    user_id: {
        type: String
    },
    orderId: {
        type: String
    },
    details: {
        avgPrice: {
            type: String
        },
        clientOrderId: {
            type: String
        },
        closePosition: {
            type: String
        },
        cumQuote: {
            type: String
        },
        executedQty: {
            type: String
        },
        orderId: {
            type: Number
        },
        origQty: {
            type: String
        },
        origType: {
            type: String
        },
        positionSide: {
            type: String
        },
        price: {
            type: String
        },
        priceProtect: {
            type: Boolean
        },
        reduceOnly: {
            type: Boolean
        },
        side: {
            type: String
        },
        status: {
            type: String
        },
        stopPrice: {
            type: String
        },
        symbol: {
            type: String
        },
        time: {
            type: String
        },
        timeInForce: {
            type: String
        },
        type: {
            type: String
        },
        updateTime: {
            type: String
        },
        workingType: {
            type: String
        }
      
    }
}, { timestamps: true })



module.exports = mongoose.model( 'FxPositionLog', FxPositionSchema)