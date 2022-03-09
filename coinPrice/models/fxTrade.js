const mongoose = require('mongoose')

// var TargetSchema = new mongoose.Schema({
//     triggerType: {
//         type: String,
//         enum: ["LIMIT", "MARKET"],
//         default:'MARKET'
//     },
//     targetType: {
//         type: String,
//         enum: ["PRICE", "PERCENTAGE"],
//         default:'PRICE'
//     },
//     target:{
//         type: Number,
//         default:0
//     },
//     quantity:{
//         type: Number,
//         default:0
//     },
//     actual_qty:{
//         type: Number,
//         default:0
//     },
//     status:{
//         type: Boolean,
//         default:false
//     }
// }, { timestamps: true });


// const ReferralCommission = new mongoose.Schema({
//     asset: {
//         type: String,
//     },
//     amount:{
//         type: Number,
//         default: 0
//     },
// },{ timestamps: true })


var FxTradeSchema = new mongoose.Schema({
    user_id: {
        type: String,
    },
    orderId: {
        type: Number
    },
    symbol: {
        type: String
    }, 
    status: {
        type: String,
        enum:['SIGNAL','OPEN','CLOSE','COMPLETED'],
        default:'OPEN'
    },
    ClientOrderId: {
        type: String
    },
    price: {
        type: String
    },
    avgPrice: {
        type: String
    },
    quantity: {
        type: Number
    },
    executedQty: {
        type: String
    },
    cumQty:{
        type: String
    },
    cumQuote: {
        type: String
    },
    timeInForce: {
        type: String
    },
    type: {
        type: String
    },
    reduceOnly: {
        type: Boolean
    },
    closePosition: {
        type: Boolean
    },
    side: {
        type: String,
        enum:['BUY','SELL']
    },
    positionSide: {
        type: String,
        enum:['LONG','SHORT','BOTH']
    },
    stopPrice: {
        type: String
    },
    workingType: {
        type: String
    },
    priceProtect: {
        type: Boolean
    },
    origType: {
        type: Boolean
    },
    positionAmt: {
        type: Number
    },
    fund: {
        type: Number
    },
    leverage:{
        type: Number
    },
    profit: {
        type: Number,
        default:0
    },
    profitInBTC: {
        type: Number,
        default:0
    },
    profitInUSDT:{
        type: Number,
        default:0
    },
    entryPrice: {
        type: Number,
        default:0
    },
    exitPrice: {
        type: Number,
        default:0
    },
    pnl: {
        type: Number,
        default:0
    },
    isSignal:{
        type:Boolean,
        default:false
    },
    signalType: {
        type: String
    },
    signalName: {
        type: String
    },
    // target:{
    //     type:[TargetSchema]
    //}, 
    order_type: {
        type: String,
        enum:['LONG','LONGCLOSE','SHORT','SHORTCLOSE'],
    },
    trade_id:{
        type: String,
        default: ''
    },
    deleted: {
        type: Boolean,
        default: false
    },
    liquidation: {
        type: Boolean
    },
    takeProfitEnable: {
        type: Boolean
    },
    stopLossEnable: {
        type: Boolean
    },
    stopLoss:{
        type: Number
    },
    takeProfit:{
        type: Number
    },
    WorthUsdt:{
        type: Number,
        default:0
    },
    // bot_id:{
    //     type: mongoose.Schema.Types.ObjectId,
    // },
    // client_id:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'FxclientShare'
    // },
    // admin_id:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'fxadminShare'
    // },
    // transaction_id:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'FxtransactionFee'
    // },
    // client_transaction_id:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'FxClienttransactionFee'
    // },
    baseAsset:{
        type: String,
    },
    quoteAsset:{
        type: String,
    },
    // referralShare:[ReferralCommission],
}, { timestamps: true });

module.exports = mongoose.model('Fxtrade', FxTradeSchema)