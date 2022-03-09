const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({

    symbol: {
        type: String
    },
    orderId: {
        type: Number,
        unique: true
    },
    orderListId: {
        type: Number
    },
    clientOrderId: {
        type: String,
    },
    transactTime: {
        type: String
    },
    price: {
        type: String
    },
    origQty: {
        type: String
    },
    executedQty: {
        type: String
    },
    cummulativeQuoteQty: {
        type: String
    },
    status: {
        type: String
    },
    timeInForce: {
        type: String
    },
    type: {
        type: String
    },
    side: {
        type: String
    }

}, { timestamps: true });

module.exports = mongoose.model('History', historySchema)