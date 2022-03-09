const express = require('express');
const router = express();
const webSocket = require('ws');
const crypto = require('crypto')
const axios = require('axios')
const logger = require('./logger')
const cryptDecrypt = require('./crypto')
const qs = require('qs')
const NewOrder = require('../models/trade')
const Userwallet = require('../models/wallet')
const fxWallet = require('../models/fxWallet')

const FxBinanceEndpoints = require('./fxService')
const CANCEL_ORDER_ENDPOINT = "/api/v3/order"
const GET_ALL_ORDERS =  "/api/v3/allOrders"
let BASEURL = 'https://api.binance.com';
let ACCOUNT_INFO = '/api/v3/account';
let NEW_ORDER_ENDPOINT = "/api/v3/order";
const LISTEN_KEY = '/api/v3/userDataStream';

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
            logger.error(error.respone.data ? error.respone.data.data.msg : error);
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
    try{
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

    }catch(error) {
        console.log("Error @ AccountInfo :", error)
        logger.error(error.respone.data ? error.respone.data.data.msg : error);
        res.status(400).send({ status: 500, data: error.respone.data.msg})
    } 

    },
    wallet : async(req, res) => {
        try {
            
        } catch (error) {
            
        }
    }
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
        const balance = await  BinanceEndpoints.AccountInfo(req.body);
        const resultmap = await balance.balances.filter((opt) => opt.free > 0).map((opt) => ({ coin: opt.asset, bal: opt.free }));

        res.status(200).send({ success: true, status: 200, message:"Spot User Balance Fetched SuccessFully", data: resultmap });
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
        
        const order = new NewOrder({
            symbol: data.symbol,
            orderId: data.orderId,
            orderListId: data.orderListId,
            clientOrderId: data.clientOrderId,
            transactTime: data.transactTime,
            price: data.price,
            origQty: data.origQty,
            executedQty: data.executedQty,
            cummulativeQuoteQty: data.cummulativeQuoteQty,
            status: data.status,
            timeInForce: data.timeInForce,
            type: data.type,
            side: data.side,
            fills: data.fills
        })
        const saveOrder = await order.save();
        res.status(200).send({ success: true, status: 200, message:"New Order Placed SuccessFully", data: saveOrder });
    } catch (error) { 
        console.log(`Error------------>${error}`)
        res.status(400).send(`Error: ${error}`)
    }
});

router.post('/listenKey', BinanceEndpoints.ListenKey);

router.put('/pingListenKey', BinanceEndpoints.pingListenKey);

router.delete('/cancelOrder', BinanceEndpoints.CancelOrder);

router.get('/getAllOrder', BinanceEndpoints.AllOrder);

router.get('/getFxApiKey', FxBinanceEndpoints.GetApiKey);

router.get('/getAccountdetails', FxBinanceEndpoints.GetAccountDetails);

router.post('/createFxOrder', FxBinanceEndpoints.CreateFXOrder);


router.get('/fundTransfer', FxBinanceEndpoints.FundTransfer);

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

module.exports = router;