const mongoose = require('mongoose')

const BuySchema = new mongoose.Schema({
    symbol:{
        type: String
    },
    orderId:{
        type: Number
    },
    orderListId:{
        type: Number
    },
    clientOrderId:{
        type: String
    },
    transactTime:{
        type: Number
    },
    price:{
        type: Number
    },
    origQty:{
        type: String
    },
    executedQty:{
        type: String
    },
    cummulativeQuoteQty:{
        type: String
    },
    status:{
        type: String
    },
    timeInForce:{
        type: String
    },
    type:{
        type: String
    },
    side:{
        type: String,
        enum: ["BUY", "SELL"]
    },
    fills:{
        type: Array
    }
}, { timestamps: true})

// const SellSchema = new mongoose.Schema({
//     symbol:{
//         type: String
//     },
//     orderId:{
//         type: Number
//     },
//     orderListId:{
//         type: Number
//     },
//     clientOrderId:{
//         type: String
//     },
//     transactTime:{
//         type: Number
//     },
//     price:{
//         type: Number
//     },
//     origQty:{
//         type: String
//     },
//     executedQty:{
//         type: String
//     },
//     cummulativeQuoteQty:{
//         type: String
//     },
//     status:{
//         type: String
//     },
//     timeInForce:{
//         type: String
//     },
//     type:{
//         type: String
//     },
//     side:{
//         type: String
//     },
//     fills:{
//         type: Array
//     },
// },{ timestamps: true })

module.exports = mongoose.model('NewOrder', BuySchema);