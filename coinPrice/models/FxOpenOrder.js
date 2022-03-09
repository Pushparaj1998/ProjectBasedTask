const mongoose = require('mongoose');

const FxOpenOrderSchema = mongoose.Schema({
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



module.exports = mongoose.model( 'OpenOrder', FxOpenOrderSchema)



/*  "avgPrice": {
            type
        },
        "clientOrderId": "6A5dMbwuzgUMacmiKS4ZKD",
        "closePosition": false,
        "cumQuote": "0",
        "executedQty": "0",
        "orderId": 45344761292,
        "origQty": "0.001",
        "origType": "MARKET",
        "positionSide": "BOTH",
        "price": "0",
        "priceProtect": false,
        "reduceOnly": false,
        "side": "SELL",
        "status": "NEW",
        "stopPrice": "0",
        "symbol": "BTCUSDT",
        "time": 1646133135007,
        "timeInForce": "GTC",
        "type": "MARKET",
        "updateTime": 1646133135007,
        "workingType": "CONTRACT_PRICE"*/