const express = require('express');
const router = express();
let webSocket = require('ws');
const crypto = require('crypto');
const axios = require('axios');
const logger = require('./logger');
const cryptDecrypt = require('./crypto');
const qs = require('qs');
const Trade = require('../models/trade');
const Userwallet = require('../models/wallet');
const fxWallet = require('../models/fxWallet');
const Precision = require('../models/precision');
// const Trade = require('../models/spotTrade');
let apikey = "422edfc014eb7f5694020c8dfd0f4314:8b6f129b1307b80ea37a7a7e7f050e3130d1fbce1d52fac3a414cabc6c3b7dcdb8255408388b738c6ad675215db64bcd0d2f00c51d7cfe2c86295c989e5a2004413341200058cd9378eda05b75d1d56d";
let apisecret = "89c0f6964882df426b1c709d0616d8ad:ac4c1327583646b5fa24c7cff32c426683f8abc72ce9061e696d1fc4a0fccfd350cca6fb29894641bfdb3c943ac8473fd93fdd032bc261049a80ae067d7903dadfea5d1620858ab7bd149f65d57ff59b";
let subAccountId = "2697983055934934529" ;

let UserDetails = {  
        apikey : "422edfc014eb7f5694020c8dfd0f4314:8b6f129b1307b80ea37a7a7e7f050e3130d1fbce1d52fac3a414cabc6c3b7dcdb8255408388b738c6ad675215db64bcd0d2f00c51d7cfe2c86295c989e5a2004413341200058cd9378eda05b75d1d56d",
        apisecret : "89c0f6964882df426b1c709d0616d8ad:ac4c1327583646b5fa24c7cff32c426683f8abc72ce9061e696d1fc4a0fccfd350cca6fb29894641bfdb3c943ac8473fd93fdd032bc261049a80ae067d7903dadfea5d1620858ab7bd149f65d57ff59b",
        subAccountId : "2697983055934934529" 
}

const FxBinanceEndpoints = require('./fxService')
const CANCEL_ORDER_ENDPOINT = "/api/v3/order"
const GET_ALL_ORDERS =  "/api/v3/allOrders"
let BASEURL = 'https://api.binance.com';
let ACCOUNT_INFO = '/api/v3/account';
let NEW_ORDER_ENDPOINT = "/api/v3/order";
const LISTEN_KEY = '/api/v3/userDataStream';
// const EXCHANGE_INFO = "/api/v3/exchangeInfo";

let user_id = "61ada80a46f32db7adcd1d53" ;
let spotCoinData = [];
let fxCoinData = [];

const BinanceTickerWS = {

    binanceTickerStart: async() => {

        BinanceTickerWS.binanceSpotTickerStart();
        BinanceTickerWS.binanceFxTickerStart();

    },
    binanceSpotTickerStart: async() => {

        const ws = new webSocket('wss://stream.binance.com:9443/ws/!ticker@arr')
        console.log('Ticker Socket Opened', Date.now())

        ws.on('message', async function incoming(data) {
            const ticker = JSON.parse(data);
            spotCoinData = ticker;
            // console.log("spotCoinData-------------------------->", spotCoinData);
        });

        ws.on('error', async(error) => {
            console.log("Ticker Socket Error", Date.now())
            console.log(error)
        });

        ws.on('disconnect', async function() {
            console.log("Ticker Socket Disconnect", Date.now())
        });

        ws.on('close', async function() {
            console.log("Ticker Socket Closed", Date.now());
            BinanceTickerWS.binanceSpotTickerStart();
        });
    },

    binanceFxTickerStart: async() => {
        const ws = new webSocket('wss://fstream.binance.com/ws/!ticker@arr')
        console.log('Ticker Fx Opened', Date.now())

        ws.on('message',  async function incoming(data) {
            const ticker = JSON.parse(data);
            fxCoinData = ticker;
        });
        
        ws.on('error', async(error) => {
            console.log("Ticker Socket Error", Date.now())
            console.log(error)
        });

        ws.on('disconnect', async function() {
            console.log("Ticker Socket Disconnected", Date.now())
        });

        ws.on('close', async function() {
            console.log("Ticker Socket Closed", Date.now());
            BinanceTickerWS.binanceFxTickerStart();
        });  
    }
}

const CurrentPriceWS = {
    currentPrice: async () => {
       try {
            
            const ws = new webSocket('wss://stream.binance.com:9443/ws/' + "btcusdt" + '@ticker');
            console.log("CurrentPrice Socket Opened", Date.now());
            ws.on('message', async function incoming(data) {
                const ticker = JSON.parse(data);
                // console.log("ticker------------>", ticker);
                let trade = await Trade.findOne({ symbol: ticker.s, side: "BUY", tradeStatus: "NEW", takeProfitEnable: true});
                //  console.log("Trade------------>", trade);
                
                if(trade){ 
                    let entryPrice = trade.entryPrice;
                    console.log("EntryPrice------------>", entryPrice);
                    let closePrice =  ((((entryPrice) / 100) * 0.05) + trade.entryPrice);
                    console.log('closePrice------------------>', closePrice);
                    let currentPrice = +ticker.c;
                    trade.currentPrice = currentPrice;     
                    console.log("current Price-------------->", currentPrice);
                    await trade.save();
                    if( currentPrice >= closePrice){
                        let takeProfit = ((currentPrice * trade.origQty) - (trade.origQty * trade.entryPrice));
                        trade.profit = takeProfit;
                        console.log("trade Profit--------------------------->",takeProfit);
                        let profitPercentage = (((currentPrice) - (trade.entryPrice)) * 100) / (trade.entryPrice);
                        trade.profitPercentage = profitPercentage;
                        console.log("trade Profit in percentage--------------------------->", trade.profitPercentage);
                        await trade.save();
                        await BinanceEndpoints.autoSell();
                    }
                    
                }
            });

            ws.on('ping', (e) => {
                ws.pong();
            });

            ws.on('error', async(error) => {
                console.log("currentPrice Socket Error", error)
            });

            ws.on('disconnect', async function() {
                console.log('currentPrice Socket Disconnect');
            });

            ws.on('close', async function() {
                console.log("socket close console");
            });
       } catch (error) {
            console.log("currentPrice Socket  Catch Error", error);
       }
    }
}

CurrentPriceWS.currentPrice();
// async function userTradeVolume(user_id) {
//     let trade = await Trade.find({ $or: [{ status: 'BUYED' }, { status: 'COMPLETED' }], user_id: user_id })
//     // let spotfee = await spotvolumefee.find
//     // let trade = await Trade.find({user_id: req.params.user_id,status:"COMPLETED"})

//     let totalBuyWorthUsdt = 0;
//     let totalSellWorthUsdt = 0;
//     let totalBuyWorthLength = 0;
//     let totalSellWorthLength = 0;


//     trade.forEach(element => {
//         if (element.buyWorthUsdt > 0) {
//             totalBuyWorthUsdt += element.buyWorthUsdt
//             totalBuyWorthLength += 1
//         }
//         if (element.sellWorthUsdt > 0) {
//             totalSellWorthUsdt += element.sellWorthUsdt
//             totalSellWorthLength += 1
//         }

//     });

//     let totalVolume = totalBuyWorthUsdt + totalSellWorthUsdt
//     // console.log("=================tradevvroltre.=======", totalVolume);
//     let spotfee = await spotvolumefee.findOne({ $and: [{ from: { $lte: totalVolume } }, { to: { $gte: totalVolume } }], status: true })
//     if(spotfee){
//     // console.log("=============== fee=====", spotfee);
//         return spotfee;
//     }else{
//         let firstspotfee = await spotvolumefee.findOne({ status: true })
//         if(firstspotfee){
//             return firstspotfee;
//         }
//     }

// }
const BinanceEndpoints = {
    AccountInfo: async(data) => {
        try {
                const APIKEY = await cryptDecrypt.decrypt(data.apikey);
                const APISECRET = await cryptDecrypt.decrypt(data.apisecret);
                const SUBID = data.subAccountId;
                let keys = {APIKEY, APISECRET, SUBID};
                //console.log(APIKEY);
                let inputData = { timestamp: new Date().getTime() };
                let dataQueryString = qs.stringify(inputData);  
                const signature = await crypto.createHmac('sha256', keys.APISECRET).update(dataQueryString).digest('hex');
        
                const requestConfig = {
                     method: "GET",
                     url: BASEURL + ACCOUNT_INFO + '?' + dataQueryString + '&signature=' + signature,
                     headers: {
                     'X-MBX-APIKEY': keys.APIKEY
                }
            }
            //console.log(requestConfig,'conkjsklajfeiufaskjconfigurtion')
            const response = await axios(requestConfig);
            return response.data;
            // res.status(200).send({ status: 200, data: response.data });  
        } catch (error) {
            console.log("Error @ AccountInfo :", error)
            logger.error(error.respone.data ? error.respone.data.data.msg : error);
            return  error.respone.data.msg
        }
    },

    NewOrder: async(data) => {
        try {
            //console.log("value------------->",data)
            const APIKEY = await cryptDecrypt.decrypt(data.apikey);
            const APISECRET = await cryptDecrypt.decrypt(data.apisecret);
            const SUBID = data.subAccountId;
            let keys = {APIKEY, APISECRET, SUBID};
            let inputData =  data.tradeData
            
            inputData.timestamp = new Date().getTime();
            let dataQueryString = qs.stringify(inputData); 
            //console.log(dataQueryString) 
            const signature = await crypto.createHmac('sha256', keys.APISECRET).update(dataQueryString).digest('hex');
            
            const requestConfig = {
                method: "POST",
                url: BASEURL + NEW_ORDER_ENDPOINT + '?' + dataQueryString + '&signature=' + signature,
                headers: {
                'X-MBX-APIKEY': keys.APIKEY
                }
            }
            const response = await axios(requestConfig);
            //console.log(response,'resojklhkut')
            return response.data;
            //res.status(200).send({ status: 200, data: response.data });  
        } catch (error) {
            console.log("Error @ AccountInfo :", error)
            // logger.error(error.respone.data ? error.respone.data.data.msg : error);
            //res.status(400).send({ status: 500, data: error.respone.data.msg})
        }
    },

    CancelOrder: async(req,res) => {
        try {
                const APIKEY = await cryptDecrypt.decrypt(req.body.apikey);
                const APISECRET = await cryptDecrypt.decrypt(req.body.apisecret);
                let keys = {APIKEY, APISECRET};
                let inputData =  req.body.tradeData       
                inputData.timestamp = new Date().getTime();
                let dataQueryString = qs.stringify(inputData);
                const signature = await crypto.createHmac('sha256', keys.APISECRET).update(dataQueryString).digest('hex');
                const requestConfig = {
                    method: "DELETE",
                    url: BASEURL + CANCEL_ORDER_ENDPOINT + '?' + dataQueryString + '&signature=' + signature,
                    headers: {
                    'X-MBX-APIKEY': keys.APIKEY
                    }
                }
                const response = await axios(requestConfig);
                console.log(response.data,'resojklhkut')
                return res.status(200).send({ status: 200, data: response.data });
        } catch (error) {
            console.log("Error @ AccountInfo :", error)
            logger.error(error.respone.data ? error.respone.data.data.msg : error);
            res.status(400).send({ status: 500, data: error.respone.data.msg})
        }
    },

    AllOrder: async(req,res) => {
        try {
                const APIKEY = await cryptDecrypt.decrypt(req.body.apikey);
                const APISECRET = await cryptDecrypt.decrypt(req.body.apisecret);
                let keys = {APIKEY, APISECRET};
                let inputData =  req.body.tradeData       
                inputData.timestamp = new Date().getTime();
                let dataQueryString = qs.stringify(inputData);
                const signature = await crypto.createHmac('sha256', keys.APISECRET).update(dataQueryString).digest('hex');
                const requestConfig = {
                    method: "GET",
                    url: BASEURL + GET_ALL_ORDERS + '?' + dataQueryString + '&signature=' + signature,
                    headers: {
                    'X-MBX-APIKEY': keys.APIKEY
                    }
                }
                const response = await axios(requestConfig);
                // console.log(response.data,'resojklhkut')
                return res.status(200).send({ status: 200, data: response.data });
        } catch (error) {
            console.log("Error @ AccountInfo :", error)
            logger.error(error.respone.data ? error.respone.data.data.msg : error);
            res.status(400).send({ status: 500, data: error.respone.data.msg})
        }
    },

    ListenKey: async (req,res) => {
        try {
            let APIKEY = await cryptDecrypt.decrypt(req.body.apikey);
            let keys = {APIKEY}
            const requestConfig = {
                method: 'POST',
                url: BASEURL + LISTEN_KEY,
                headers: {
                    'X-MBX-APIKEY': keys.APIKEY
                }
            }
            const response = await axios(requestConfig);
            return res.status(200).send({ status: 200, message: "Listen Key Genrated SuccessFully", data: response.data });

        } catch (error) {
            console.log("Error @ AccountInfo :", error)
            logger.error(error.respone.data ? error.respone.data.data.msg : error);
            res.status(400).send({ status: 500, data: error.respone.data.msg})
        }
    },

    pingListenKey: async(req, res) => {
        try {
            const dataQueryString = qs.stringify({ listenKey: req.body.listenKey});
            let APIKEY = await cryptDecrypt.decrypt(req.body.apikey);
            let keys = { APIKEY }
            const requestConfig = {
                method: 'PUT',
                url: BASEURL + LISTEN_KEY + '?' + dataQueryString,
                headers: {
                    'X-MBX-APIKEY': keys.APIKEY
                }
            }
            const response = await axios(requestConfig);
            return res.status(200).send({ status: 200, message: " PingListenKey Updated Successfully ",data: response.data });

        } catch(error) {
            console.log("Error @ AccountInfo :", error)
            logger.error(error.respone.data ? error.respone.data.data.msg : error);
            res.status(400).send({ status: 500, data: error.respone.data.msg})
        } 
    }, 

    autoSell: async() => {
        try {
            const findBuy = await Trade.findOne({ symbol: 'BTCUSDT',side: "BUY", tradeStatus: "NEW", takeProfitEnable: true});
            let input = {
                apikey : apikey,
                apisecret : apisecret,
                subAccountId: subAccountId,
                tradeData : {
                    symbol: findBuy.symbol,
                    side: "SELL",
                    type: "MARKET",
                    quantity: findBuy.fills[0].qty
                    // quantity: tradeDetails.decimal == 0 ? parseFloat(tradeDetails.quantity).toFixed(2) : tradeDetails.quantity,        
                }
                
            }
            // console.log("input------------>", input);
            let data = await  BinanceEndpoints.NewOrder(input);
            console.log("tradeDetails---------------->", data);
            // console.log("findBuy--------------------->", findBuy);
            const buyPrice = parseFloat(findBuy.fills[0].price);
            // console.log("buyPrice--------------------->", buyPrice);
            const sellPrice = parseFloat(data.fills[0].price);
            // console.log("sellPrice--------------------->", sellPrice);
            const profit = sellPrice - buyPrice;
            // console.log("profit--------------------------------->", profit)
            const sellOrder = new Trade({
                symbol: data.symbol,
                orderId: data.orderId,
                orderListId: data.orderListId,
                clientOrderId: data.clientOrderId,
                transactTime: data.transactTime,
                price: data.price,
                origQty: +data.origQty,
                executedQty: +data.executedQty,
                cummulativeQuoteQty: +data.cummulativeQuoteQty,
                status: data.status,
                timeInForce: data.timeInForce,
                type: data.type,
                side: data.side,
                fills: data.fills,
                entryPrice: buyPrice,
                profit: profit,
                tradeStatus: "COMPLETED"
            })

            findBuy.profit = profit;
            findBuy.tradeStatus = "COMPLETED";
            await findBuy.save();

            sellOrder.currentPrice = findBuy.currentPrice;
            sellOrder.profitPercentage = findBuy.profitPercentage;
            sellOrder.takeProfitEnable = findBuy.takeProfitEnable;
            const SELL_ORDER = await sellOrder.save();
            console.log("SELL_ORDER------------------->", SELL_ORDER);
        } catch (error) {
            console.log("Error in Auto Sell----------------->", error)
        }
    },

    // ExchangeInfo: async() => {
    //     try {
    //         const requestConfig = {
    //             method: 'GET',
    //             url: BASEURL + EXCHANGE_INFO
    //         }
    //         const response = await axios(requestConfig);
    //         // return res.status(200).send({ status: 200, message:"Exchange info Fetched Sucessfully", data: response.data.symbols});
    //         // console.log("response------------------------------------->",response.data.symbols);
    //         return response.data.symbols;
    //     } catch (error) {
    //         console.log("error in function------------>", error)
    //         return error;
    //     }
            
    // },

    spotUserBalance: async(data) => {
        const balance = await  BinanceEndpoints.AccountInfo(data);
        const resultmap = await balance.balances.filter((opt) => opt.free > 0).map((opt) => ({ coin: opt.asset, bal: opt.free }));
        return resultmap;
    },

    // tradeRepeatedCode: async(req, res, assetsPair) => {
    //     try {
    //         let new_trade = await BinanceEndpoints.NewOrder(req.body);
    //         if(new_trade) {
    //             let response = new_trade;
    //             let status = "NEW";
    //             let filledStatus = 0;
    //             let tradeSide = response.side;
    //             let arr = [];
    //             if(req.body.TAKE_PROFIT) {
    //                 for (doc of req.body.TAKE_PROFIT) {
    //                     arr.push({
    //                         takeProfit: doc.TAKE_PROFIT,
    //                         profitPercentage: doc.profitPercentage,
    //                         quantity: sliceDecimal((response.origQty - ((0.1 / 100) * (response.origQty))), assetsPair.decimal),
    //                         status: false
    //                     })
    //                 }
    //             }
    //             const trade = await new Trade({
    //                 user_id: user_id,
    //                 symbol: response.symbol,
    //                 quoteAsset: assetsPair.quoteAsset,
    //                 baseAssetPrecision: assetsPair.baseAssetPrecision,
    //                 quoteAssetPrecision: assetsPair.quoteAssetPrecision,
    //                 baseAsset: assetsPair.baseAsset,
    //                 decimal: assetsPair.decimal,
    //                 // quantity: sliceDecimal((response.origQty - ((VolFee / 100) * (response.origQty))), assetsPair.decimal),
    //                 fund: req.body.fund,
    //                 entryPrice: response.price,
    //                 takeProfitEnable: req.body.takeProfitEnable,
    //                 //  takeProfit: req.body.takeProfit,
    //                 takeProfit: arr,
    //                 // takeProfitLength:req.body.takeProfit.length,
    //                 stopLossEnable: req.body.stopLossEnable,
    //                 stopLoss: req.body.STOP_LOSS,
    //                 tradeSide: tradeSide,
    //                 trade_id: randomstring.generate(10).toUpperCase(),
    //                 status: status,
    //                 // tradeFee: (temp_fee).toFixed(10),
    //                 // buyWorthUsdt: buyworth,
    //                 // sellWorthUsdt: sellworth,
    //                 filledStatus: filledStatus
    //             })
    //             const saveTrade = await trade.save();
    //             return saveTrade;
    //         }

    //     } catch (error) {
    //         console.log("Error---------------->", error);
    //     }
    // }
    
}


router.get('/getSpotCoin/:symbol', async(req, res) => {
    try {
        const findData = await spotCoinData.find(coin => coin.s  == req.params.symbol);
        const val = { symbol : findData.s, price : findData.c};
        if(spotCoinData){
            console.log('true')
        }else {
            console.log('false')
        }

        return res.status(200).send({success: true, status: 200, message: "Spot Coin Data Feteched Successfully",data: val});
    } catch (error) {
        console.log('Error in the getSpotCoin', error);
        return res.status(200).send({ success: false, status: 500, message: "Failed to Fetch Spot Coin Data" })
    }
} )

router.get('/filterSpotCoin/:symbol', async(req, res) => {
    try {
        // const coin = await spotCoinData.filter((opt) => opt.c == 386002).map((opt) => ({ symbol: opt.s, price: opt.c}));
        const coin = await spotCoinData.filter((opt) => opt.c == 386002);
        console.log("coin------------------------------->",coin);
        return res.status(200).send({success: true, status: 200, message: "Spot Filtered Coin Data Feteched Successfully",data: coin});
    } catch (error) {
        console.log('Error in the getSpotCoin', error);
        return res.status(200).send({ success: false, status: 500, message: "Failed to Fetch Spot Coin Data" }) 
    }
})
router.get('/getFxCoin/:symbol', async(req,res) => {
    try {
        const findData = await fxCoinData.find(coin => coin.s == req.params.symbol);

        const val = {symbol : findData.s, price : findData.c};
        if(fxCoinData){
            console.log('true')
        }else {
            console.log('false')
        }
        return res.status(200).send({success: true, status: 200, message: "Fx Coin Data Feteched Successfully",data: val});
    } catch (error) {
        console.log('Error in the getFxCoin', error);
        return res.status(200).send({ success: false, status: 500, message: "Failed to Fetch Fx Coin Data" })
    }
})

router.get('/getAllSpotCoin', async(req, res) => {
    try {
        // let symbol = [{ }];
        // let price = [{ }];
        // let data = [{ }];
        // for(let i=0; i<spotCoinData.length; i++) {
        //     symbol[i] = {symbol : spotCoinData[i].s};
        //     price[i] = {price : spotCoinData[i].c};
        // }
        // for(let i=0; i<spotCoinData.length; i++){
        //     data[i] = [symbol[i], price[i]];
        // } 
        let val1 = [];
        for(let i=0; i<spotCoinData.length; i++)
        {
            val1[i] =  {symbol : spotCoinData[i].s, price : spotCoinData[i].c};
        }
        if(val1){
            console.log('true')
        }else {
            console.log('false')
        }
        return res.status(200).send({success: true, status: 200, message: "Spot Coins Data Feteched Successfully",data: val1});
    } catch (error) {
        console.log('Error in the getAllSpotCoin', error);
        return res.status(200).send({ success: false, status: 500, message: "Failed to Fetch Spot Coins Data" })
    }
})

router.get('/getAllFxCoin', async(req,res) => { 
    try {
        let val = [];
        for(let i=0; i<fxCoinData.length; i++)
        {
            val[i] =  {symbol : fxCoinData[i].s, price : fxCoinData[i].c};
        }
        if(val){
            console.log('true')
        }else {
            console.log('false')
        }
        return res.status(200).send({success: true, status: 200, message: "Fx Coins Data Feteched Successfully",data: val});
    } catch (error) {
        console.log('Error in the getAllFxCoin', error);
        return res.status(200).send({ success: false, status: 500, message: "Failed to Fetch Fx Coins Data" })
    }
})

router.get('/getParticularSpotCoin', async(req, res) => {
    try {
        const val = req.body.symbols;
        let temp = [];
        
        for(let i=0; i<val.length; i++)
        {
           temp[i] = await  spotCoinData.find(coin => coin.s == val[i])
        }
        let val1 = [];
        for(let i=0; i<temp.length; i++)
        {
            val1[i] =  {symbol : temp[i].s, price : temp[i].c};
        }
        if(val1){
            console.log("true");
        }else {
            console.log("false");
        }

        return res.status(200).send({success: true, status: 200, message: "Spot Coins Data Feteched Successfully",data: val1});
    } catch (error) {
        console.log('Error in the getParticularSpotCoin', error);
        return res.status(200).send({ success: false, status: 500, message: "Failed to Fetch Spot Coins Data" })
    }
})

router.get('/getParticularFxCoin', async(req,res) => {
    try {
        const val = req.body.symbols;
        let temp = [];

        for(let i=0; i<val.length; i++)
        {
            temp[i] = await fxCoinData.find(coin => coin.s == val[i])
        }
        let val1 = [];
        for(let i=0; i<temp.length; i++)
        {
            val1[i] =  {symbol : temp[i].s, price : temp[i].c};
        }
        if(val1) {
            console.log("true");
        }else {
            console.log("false");
        }

        return res.status(200).send({success: true, status: 200, message: "Fx Coins Data Feteched Successfully",data: val1});
    } catch (error) {
        console.log('Error in the getParticullarFxCoin', error);
        return res.status(200).send({ success: false, status: 500, message: "Failed to Fetch Spot Coins Data" })
    }
})

BinanceTickerWS.binanceTickerStart();


router.get('/spotUserBalance', async(req, res) => {
    try {
        // const balance = await  BinanceEndpoints.AccountInfo(req.body);
        // const resultmap = await balance.balances.filter((opt) => opt.free > 0).map((opt) => ({ coin: opt.asset, bal: opt.free }));
        const result = await BinanceEndpoints.spotUserBalance(UserDetails);
        
        res.status(200).send({ success: true, status: 200, message:"Spot User Balance Fetched SuccessFully", data: result });
    } catch (error) {
        console.log(`Error------------>${error}`)
        res.status(400).send(`Error: ${error}`)
    }
});

router.post('/newOrder', async(req, res) => {
    try {
        // console.log("newOrdervalue------------->",req.body)
        let data = await BinanceEndpoints.NewOrder(req.body);
        //console.log("data-------------->", data)
        
        if(data.side == "BUY") {
            const order = new Trade({
                symbol: data.symbol,
                orderId: data.orderId,
                orderListId: data.orderListId,
                clientOrderId: data.clientOrderId,
                transactTime: data.transactTime,
                price: data.price,
                origQty: +data.origQty,
                executedQty: data.executedQty,
                cummulativeQuoteQty: data.cummulativeQuoteQty,
                status: data.status,
                timeInForce: data.timeInForce,
                type: data.type,
                side: data.side,
                fills: data.fills,
                entryPrice: +data.fills[0].price,
                takeProfitEnable: req.body.takeProfitEnable
            })
    
            const BUY_Order = await order.save();
            console.log("BUY_ORDER---------------------->", BUY_Order)
        }
        if(data.side == "SELL")
        {
            const findBuy = await Trade.findOne({ symbol: data.symbol, side: "BUY", tradeStatus: "NEW"});
            
            console.log("findBuy--------------------->", findBuy);
            const buyPrice = parseFloat(findBuy.cummulativeQuoteQty);
            console.log("buyPrice--------------------->", buyPrice);
            const sellPrice = parseFloat(data.cummulativeQuoteQty);
            console.log("sellPrice--------------------->", sellPrice);
            const profit = sellPrice - buyPrice;
            console.log("profit--------------------------------->", profit)
            const sellOrder = new Trade({
                symbol: data.symbol,
                orderId: data.orderId,
                orderListId: data.orderListId,
                clientOrderId: data.clientOrderId,
                transactTime: data.transactTime,
                price: data.price,
                origQty: +data.origQty,
                executedQty: +data.executedQty,
                cummulativeQuoteQty: +data.cummulativeQuoteQty,
                status: data.status,
                timeInForce: data.timeInForce,
                type: data.type,
                side: data.side,
                fills: data.fills,
                entryPrice: +data.fills[0].price,
                profit: profit,
                tradeStatus: "COMPLETED"
            })

            findBuy.profit = profit;
            findBuy.tradeStatus = "COMPLETED";
            await findBuy.save();

            const SELL_ORDER = await sellOrder.save();
            console.log("SELL_ORDER------------------->", SELL_ORDER);
        }
        res.status(200).send({ success: true, status: 200, message:"New Order Placed SuccessFully"});
    } catch (error) { 
        console.log(`Error------------>${error}`)
        res.status(400).send(`Error: ${error}`)
    }
});


router.post('/listenKey', BinanceEndpoints.ListenKey);

router.put('/pingListenKey', BinanceEndpoints.pingListenKey);

router.delete('/cancelOrder', BinanceEndpoints.CancelOrder);

router.get('/getAllOrder', BinanceEndpoints.AllOrder);

// router.get("/exchangeInfo", async(req, res) => {
//     try {
//         const data = await BinanceEndpoints.ExchangeInfo();
//         // console.log("data------------>", data);
//         res.status(200).send({ status: 200, message:"Exchange info Fetched Sucessfully", data: data});
//     } catch (error) {
//         res.status(400).send({ status: 500, data: error});
//     }
// });

// router.get('/importTradePair', async(req, res) => {
//     try {
//         let info = await BinanceEndpoints.ExchangeInfo();
//         res.status(200).send({ success: true, status: 200, message: "Trade Pair Imported Successfully" });
//         // console.log("info---------------------->", info)
//         if (info) {
//             // console.log("info data----------------------->", info.data)
//             for(symbol of info) {
//                 let status = false;
//                 if(symbol.quoteAsset == 'BTC' || symbol.quoteAsset == 'USDT') {
//                     status = true;
//                 }

//                 let check_exe = await Precision.findOne({ symbol: symbol.symbol });
//                 if(check_exe) {
//                     check_exe.baseAsset = symbol.baseAsset;
//                     check_exe.baseAssetPrecision = symbol.baseAssetPrecision;
//                     check_exe.quoteAsset = symbol.quoteAsset;
//                     check_exe.quotePrecision = symbol.quotePrecision;
//                     check_exe.quoteAssetPrecision = symbol.quoteAssetPrecision;
//                     check_exe.isSpotTradingAllowed = symbol.isSpotTradingAllowed;
//                     // check_exe.decimal = (+symbol.filters[2].stepSize).countDecimals();

//                     await check_exe.save();
//                 } else {
//                     await new Precision({
//                         symbol: symbol.symbol,
//                         // decimal: (+symbol.filters[2].stepSize).countDecimals(),
//                         baseAsset: symbol.baseAsset,
//                         baseAssetPrecision: symbol.baseAssetPrecision,
//                         quoteAsset: symbol.quoteAsset,
//                         quotePrecision: symbol.quotePrecision,
//                         quoteAssetPrecision: symbol.quoteAssetPrecision,
//                         isSpotTradingAllowed: symbol.isSpotTradingAllowed,
//                         status: status
//                     }).save();
//                 }
//             }
//         } else {
//             res.status(500).send({ success: false, status: 500, message: "Failed" });
//         }
//     } catch (error) {
//         console.log("error---------------->", error)
//         res.status(400).send(error);  
//     }
// })
// async function precisionDecimal(val) {
//     let str = val.toString();
//     if ((str.split(".")[0].indexOf("1") > -1) == true) {
//         return 8
//     } else {
//         return Number(str.split(".")[1].indexOf("1") + 1)
//     }
// }

// router.get('/importSpotTradePair', async(req, res) => {
//     try {
//         let info = await BinanceEndpoints.ExchangeInfo();
//         res.status(200).send({ success: true, status: 200, message: "Trade Pair Imported Successfully" });
//         // console.log("info---------------------->", info)
//         if (info) {
//             // console.log("info data----------------------->", info.data)
//             for(symbol of info) {
//                 let status = false;
//                 if(symbol.quoteAsset == 'BTC' || symbol.quoteAsset == 'USDT') {
//                     status = true;
//                 }

//                 let check_exe = await Precision.findOne({ symbol: symbol.symbol });
//                 if(check_exe) {
//                     check_exe.baseAsset = symbol.baseAsset;
//                     check_exe.baseAssetPrecision = symbol.baseAssetPrecision;
//                     check_exe.quoteAsset = symbol.quoteAsset;
//                     check_exe.quotePrecision = symbol.quotePrecision;
//                     check_exe.quoteAssetPrecision = symbol.quoteAssetPrecision;
//                     check_exe.isSpotTradingAllowed = symbol.isSpotTradingAllowed;
//                     check_exe.filters = symbol.filters;
//                     check_exe.decimal = await precisionDecimal(symbol.filters[2].stepSize);

//                     await check_exe.save();
//                 } else {
//                     await new Precision({
//                         symbol: symbol.symbol,
//                         decimal: await precisionDecimal(symbol.filters[2].stepSize),
//                         baseAsset: symbol.baseAsset,
//                         baseAssetPrecision: symbol.baseAssetPrecision,
//                         quoteAsset: symbol.quoteAsset,
//                         quotePrecision: symbol.quotePrecision,
//                         quoteAssetPrecision: symbol.quoteAssetPrecision,
//                         isSpotTradingAllowed: symbol.isSpotTradingAllowed,
//                         filters: symbol.filters,
//                         status
//                     }).save();
//                 }
//             }
//         } else {
//             res.status(500).send({ success: false, status: 500, message: "Failed" });
//         }
//     } catch (error) {
//         console.log("error---------------->", error)
//         res.status(400).send(error);  
//     }
// })

router.post('/createWallet', async(req, res) => {
    try {
        const balance = await  BinanceEndpoints.AccountInfo(req.body.data);
        
        const resultmap = await balance.balances.filter((opt) => opt.free > 0).map((opt) => ({ coin: opt.asset, bal: opt.free }));
        // console.log("Balance--------------------------------->", resultmap);
        const wallet = new Userwallet({
            user_id:req.body.user_id,
            subAccountId: req.body.subAccountId ,
            user_binanceKey: {
                apiKey: req.body.user_binanceKey.apiKey,
                apiSecret: req.body.user_binanceKey.apiSecret
            },
            email: req.body.email,
            verified: req.body.verified,
            name: req.body.name,
            balance: resultmap
        })
        const saveWallet = await wallet.save();
        res.status(200).send({ success: true, status: 200, message:"User wallet created SuccessFully", data: saveWallet });
    } catch (error) {
        console.log(`Error------------>${error}`)
        res.status(400).send(`Error: ${error}`)
    }
})






router.get('/getFxApiKey', FxBinanceEndpoints.GetApiKey);

router.get('/getAccountdetails', FxBinanceEndpoints.GetAccountDetails);

router.post('/createFxOrder', FxBinanceEndpoints.CreateFXOrder);

router.get('/fundTransfer', FxBinanceEndpoints.FundTransfer);

router.get('/getPositionMode', FxBinanceEndpoints.GetPositionMode);

router.post('/changePositonMode', FxBinanceEndpoints.ChangePositionMode);

router.post('/changeMarginType', FxBinanceEndpoints.ChangeMarginType);

router.get('/getFxListenkey', FxBinanceEndpoints.FxListenKey);

router.get('/fxCancelOrder', FxBinanceEndpoints.CancelOrder);

router.get('/getfxBalance', async(req, res) => {
    try{
       const fxBalance = await FxBinanceEndpoints.GetFXBalance(req.body);
       const resultmap = await fxBalance.assets.filter((opt) => opt.walletBalance > 0).map((opt) => ({ symbol: opt.asset, bal: opt.walletBalance, crossWalletBalance: opt.crossWalletBalance }));

       res.status(200).send({ status: 200, data: resultmap });
    }catch(error)
    {
        console.log('Error ----------->', error)
        res.status(500).send({ status: 500, data: error.response.data })
    }
});


router.post('/createFxWallet', async(req, res) => {
    try {
        const fxBalance = await FxBinanceEndpoints.GetFXBalance(req.body);
        //  console.log("fxbalance---------------------->", fxBalance)
        const resultmap = await fxBalance.assets.filter((opt) => opt.walletBalance > 0).map((opt) => ({ asset: opt.asset, walletBalance: opt.walletBalance, crossWalletBalance: opt.crossWalletBalance }));
        // console.log("resultmap-------------------------->", resultmap)
        const createWallet = new fxWallet({
            user_id: req.body.user_id,
            balance: resultmap
        })
        const saveData = await createWallet.save();
        console.log("savedata------------------>", saveData)
        res.status(200).send({ status: 200, data: saveData });
    } catch (error) {
        console.log(error)
        res.status(400).send(`Error: ${error}`)
    }
})

router.get('/getPositionRisk', FxBinanceEndpoints.GetPositionRisk);

router.get('/getMarkPrice', FxBinanceEndpoints.GetMarkPrice);

// router.post('/newManualTrade', async(req, res) => {
//     try {
//         let assetsPair = await Precision.findOne({ symbol: req.body.symbol });
//         if(assetsPair !== null) {
//             if(req.body.side == 'BUY') {
//                 const activeTrade1 = await Trade.find({ user_id: user_id, $or: [{ status: 'BUYED' }, { status: 'SELLED' }], baseAsset: assetsPair.quoteAsset });

//                 let qnt = activeTrade1.reduce((a,b) => {
//                     return parseFloat(a) + parseFloat(b.quantity)
//                 }, 0);
//                 let balance = await spotUserBalance(UserDetails);

//                 let requiredBal = balance.filter(ele => ele.asset === assetsPair.quoteAsset).map(ele => ele.free)
//                 let remainBal = requiredBal[0] - (+qnt)

//                 if (remainBal >= req.body.fund) {
//                     let trade = await BinanceEndpoints.tradeRepeatedCode(req, res, assetsPair)
//                     return res.status(200).send({ success: true, status: 200, data: trade, message: "Trade Placed Successfully" });
//                 } else {
//                     // logger.error('Account Has Insufficient Balance ----')
//                     if(qnt > 0){
//                         return res.status(200).send({ success: false, status: 404, message: " Please try with lesser fund due to active trade found on spot " })
//                     }else{
//                         return res.status(200).send({ success: false, status: 404, message: "Insufficient Fund , Kindly Try Again Later" })
//                     }
//                 }
//             }
//             if(req.body.side == 'SELL') {
//                 const activetrade = await Trade.find({ user_id: user_id, $or: [{ status: 'BUYED' }, { status: 'SELLED' }], symbol: req.body.symbol });

//                 let qnt = activetrade.reduce((a, b) => {
//                     return parseFloat(a) + parseFloat(b.quantity)
//                 }, 0);
//                 let balance = await spotUserBalance(UserDetails);

//                 let requiredBal = balance.filter(ele => ele.asset === assetsPair.baseAsset).map(ele => ele.free)
//                 let remainBal = requiredBal[0] - qnt;

//                 if (remainBal >= req.body.quantity) {
//                     let trade = await tradeRepeatedCode(req, res, assetsPair)
//                     return res.status(200).send({ success: true, status: 200, data: trade, message: "Trade Placed Successfully" });
//                 } else {
//                     // logger.error('Account Has Insufficient Balance ----')
//                     if(qnt > 0){
//                         return res.status(200).send({ success: false, status: 404, message: " Please try with lesser fund due to active trade found on spot " })
//                     }else{
//                         return res.status(200).send({ success: false, status: 404, message: "Insufficient Fund , Kindly Try Again Later" })
//                     }
//                 }

//             }
//         }else {
//             console.log("error", error);
//             res.status(200).send({ sucess: false, status: 500, message: error});
//         }
//     } catch (error) {
//         console.log("error", error);
//         res.status(400).send({ sucess: false, status: 500, message: error});
//     }
// })

// module.exports =  BinanceEndpoints ;
module.exports = router;