const mongoose = require('mongoose');

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
        type: String
    },
    fills:{
        type: Array
    },
},{ timestamps: true })

const ReferralCommission = new mongoose.Schema({
    asset: {
        type: String,
    },
    amount:{
        type: Number,
        default: 0
    },
},{ timestamps: true })


const SellSchema = new mongoose.Schema({
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
        type: String
    },
    fills:{
        type: Array
    },
},{ timestamps: true })

const takeProfitSchema = new mongoose.Schema({
    takeProfit:{
        type: Number,
        default:0
    },
    price:{
        type:Number,
        default:0
    },
    quantity:{
        type: Number,
        default:0
    },
    fund: {
        type: Number,
        default: 0
    },
    profitPercentage:{
        type: Number,
        default:0
    },
    status:{
        type: Boolean,
        default:false
    }
}, { timestamps: true });

const SpottradeSchema = new mongoose.Schema({
    user_id: {
        type: String,
    },
    buy:{
        type:[BuySchema]
    },
    sell:{
        type:[SellSchema]
    },
    symbol: {
        type: String
    },
    baseAsset: {
        type: String,
    },
    quoteAsset: {
        type: String,
    },
    baseAssetPrecision: {
        type: Number,
    },
    quoteAssetPrecision: {
        type: Number,
    },
    decimal: {
        type: Number
    },
    quantity: {
        type: Number
    },
    fund: {
        type: Number
    },
    buyWorthUsdt:{
        type: Number,
        default:0
    },
    sellWorthUsdt:{
        type: Number,
        default:0
    },
    tradeSide: {
        type: String,
        enum: ['BUY', 'SELL','TRADE']
    },
    trade_id:{
        type:String,
    },
    entryPrice: {
        type: Number,
        default:0
    },
    exitPrice: {
        type: Number,
        default:0
    },
    tradeFee:{
        type:Number,
        default:0
    },
    takeProfitEnable:{
        type:Boolean,
    },
    // takeProfit: {
    //     type: Number,
    //     default:0
    // },
    takeProfit:{
        type:[takeProfitSchema]
    },
    // takeProfit:{
    //     type:Array
    // },
    // takeProfitLength:{
    //     type:Number
    // },
    multipleTakeProfitEnable:{
        type:Boolean,
        default:false
    },
    stopLossEnable:{
        type:Boolean,
    },
   	stopLoss: {
        type: Number,
        default:0
    },
    profit: {
        type: Number,
        default:0
    },
    profitInBTC: {
        type: Number,
        default:0
    },
    profitInUSDT: {
        type: Number,
        default:0
    },
    profitPercentage: {
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
    auto_sell: {
        type: Boolean, 
        default: false
    },
    filledStatus:{
        type:Number,
        default: 0
    },
    // bot_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:'spotconfig'
    // },
    status: {
        type: String,
        enum:['NEW','BUYED','SELLED','COMPLETED','CANCELED','PARTIALLY_FILLED','PARTIALLY_SELLED','EXPIRED',"PARENT_SIGNAL"],
        default:'NEW'
    },
    currentPrice:{
        type: Number,
        default:0
    },
    bot_sell_type:{
        type: String,
        enum:['takeprofit','manual','automatic'],
        default:'automatic'
    },
    // txfee_id :[{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:'transactionFee'
    // }],
    // client_txfee_id :[{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:'clienttransactionFee'
    // }],
    // adminShare:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:'adminShare'
    // },
    // clientShare:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:'clientShare'
    // },
    referralShare:[ReferralCommission],
    
}, { timestamps: true });



var SpotTrade = mongoose.model('spottrade', SpottradeSchema);

module.exports = SpotTrade;