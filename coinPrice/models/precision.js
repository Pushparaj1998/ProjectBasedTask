const mongoose = require('mongoose');

var spotprecisionSchema = mongoose.Schema({
    symbol: {
        type: String,
    },
    decimal: {
        type: Number,
    },
    baseAsset: {
        type: String,
    },
    baseAssetPrecision: {
        type: Number,
    },
    quoteAsset: {
        type: String,
    },
    quotePrecision: {
        type: Number,
    },
    quoteAssetPrecision: {
        type: Number,
    },
    isSpotTradingAllowed: {
        type: Boolean,
    },
    filters: {
        type: Array
    },
    status: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

var spotprecision = mongoose.model('spotprecision', spotprecisionSchema);

module.exports = spotprecision;
