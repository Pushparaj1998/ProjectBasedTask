const axios = require('axios')
const cryptDecrypt = require('./crypto');
const logger = require('./logger');
const crypto = require('crypto');
const qs = require('qs');
const Fxtrade = require('../models/fxTrade')
const express = require('express')
const router = express();
const GET_MARK_RISK = "/fapi/v1/premiumIndex";

const CREATE_FX_ORDER = '/fapi/v1/order';
const MASTER_KEY_BASEURL = 'https://prediction.coinrocket.es';
const GET_APIKEY = '/prediction/broker/getsubAccountApi';
const FX_BASEURL = "https://fapi.binance.com";
const GET_ACCOUNT_DETAILS = "/fapi/v2/account";
const ACCOUNT_WALLET_DETAILS = '/prediction/broker/futuresSummary';
const BASEURL = "https://api.binance.com";
const CHANGE_POSITION_MODE = '/fapi/v1/positionSide/dual';
//const GET_BALANCE = "/sapi/v1/accountSnapshot"
const FUND_TRANSFER = '/sapi/v1/futures/transfer';
const CHANGE_MARGIN_TYPE = "/fapi/v1/marginType";
const GET_LISTEN_KEY = '/fapi/v1/listenKey'
const GET_POSITION_RISK = '/fapi/v2/positionRisk';

const BinanceEndpointsFX = {
    GetApiKey: async(req, res) => {
        const requestConfig = {
            method: 'GET',
            url: MASTER_KEY_BASEURL + GET_APIKEY + '?subAccountId=' + req.body.subaccountId,   
        };

        try {
            const response = await axios(requestConfig);
            return res.status(200).send({ status: 200, data: response.data })
        } catch (error) {
            logger.error(error.response.data.msg)
            return res.status(500).send({ status: 500, data: error.response.data.msg })
        }
    },
    GetAccountDetails: async(req ,res ) => {
        
        const APISECRET = await cryptDecrypt.decrypt(req.body.apisecret);
        const APIKEY = await cryptDecrypt.decrypt(req.body.apikey);
        let inputData = { subaccountId: req.body.subaccountId, timestamp: new Date().getTime() };
        const keys = { APISECRET, APIKEY };
        const dataQueryString = qs.stringify(inputData);
        const signature = await crypto.createHmac('sha256', keys.APISECRET).update(dataQueryString).digest('hex'); 

        const requestConfig = {
            method: "GET",
            url: FX_BASEURL + GET_ACCOUNT_DETAILS + '?' + dataQueryString + '&signature=' + signature,
            headers: {
                'X-MBX-APIKEY': keys.APIKEY
            }
        }
        try {
            const response = await axios(requestConfig);
            return res.status(200).send({ status: 200, data: response.data });
        } catch (error) {
            logger.error(error.response.data.msg)
            return res.status(500).send({ status: 500, data: error.response.data.msg })
        }
    },
    GetFXBalance: async(data) => {

        const APISECRET = await cryptDecrypt.decrypt(data.apisecret);
        const APIKEY = await cryptDecrypt.decrypt(data.apikey);
        const keys = { APISECRET, APIKEY };
        let inputData = { type: "FUTURES", timestamp: new Date().getTime() };
        const dataQueryString = qs.stringify(inputData);
        //console.log('dataQueryString------------------->', dataQueryString)
        const signature = await crypto.createHmac('sha256', keys.APISECRET).update(dataQueryString).digest('hex'); 

        const requestConfig = {
            method: 'GET',
            url: FX_BASEURL + GET_ACCOUNT_DETAILS + '?' + dataQueryString +'&signature=' + signature,
            headers: {
                'X-MBX-APIKEY': keys.APIKEY
            }
        }
            const response = await axios(requestConfig);
            return response.data;
    },
    FundTransfer: async(req, res) => {
        const APISECRET = await cryptDecrypt.decrypt(req.body.apisecret);
        const APIKEY = await cryptDecrypt.decrypt(req.body.apikey);
        const keys = { APIKEY, APISECRET };
        let inputData = req.body.tradeData;
        inputData.timestamp = new Date().getTime();

        const dataQueryString = qs.stringify(inputData);
        const signature = await crypto.createHmac('sha256', keys.APISECRET).update(dataQueryString).digest('hex');
        
        const requestConfig = {
            method : 'POST',
            url: BASEURL + FUND_TRANSFER + '?' + dataQueryString + '&signature=' + signature,
            headers: {
                'X-MBX-APIKEY': keys.APIKEY
            }
        };

        try {
            const response = await axios(requestConfig);
            return res.status(200).send({ status: 200, message: "Fund Transfred Successfully", data: response.data});
        } catch (error) {
            logger.error(error.response.data.msg);
            return res.status(500).send( { status: 500, data: error.response.data.msg})
        }
     
    },

    CreateFXOrder: async(req, res) => {
        const APISECRET = await cryptDecrypt.decrypt(req.body.apisecret);
        const APIKEY = await cryptDecrypt.decrypt(req.body.apikey);
        const keys = { APISECRET,APIKEY }
        const tradeData = req.body.tradeData
        let inputData = tradeData;
        inputData.timestamp = new Date().getTime();

        const dataQueryString = qs.stringify(inputData);
        const signature = await crypto.createHmac('sha256', keys.APISECRET).update(dataQueryString).digest('hex');

        const requestConfig = {
            method: 'POST',
            url: FX_BASEURL + CREATE_FX_ORDER + '?' + dataQueryString + '&signature=' + signature,
            headers: {
                'X-MBX-APIKEY': keys.APIKEY
            }
        }

        try {
            const response = await axios(requestConfig);
            return res.status(200).send({ status: 200, message: "Order Placed SuccessFully", data: response.data });
        } catch (error) {

            logger.error(error.response.data.msg)
            return res.status(500).send({ status: 500, data: error.response.data.msg })
        }
    },

    GetPositionMode: async (req, res) => {
        const APISECRET = await cryptDecrypt.decrypt(req.body.apisecret);
        const APIKEY = await cryptDecrypt.decrypt(req.body.apikey);
        const keys = { APISECRET,APIKEY } 
        let inputData = { timestamp: new Date().getTime() };
        const dataQueryString = qs.stringify(inputData);
        const signature = await crypto.createHmac('sha256', keys.APISECRET).update(dataQueryString).digest('hex');
        
        const requestConfig = {
            method: 'GET',
            url: FX_BASEURL + CHANGE_POSITION_MODE + '?' + dataQueryString + '&signature=' + signature ,
            headers: {
                'X-MBX-APIKEY': keys.APIKEY
            }
        }
        try {
            const response = await axios(requestConfig);
            return res.status(200).send({ status: 200, message: "Position Mode Fetched SuccessFully", data: response.data });
        } catch (error) {

            logger.error(error.response.data.msg)
            return res.status(500).send({ status: 500, data: error.response.data.msg })
        }
    },
    ChangePositionMode: async(req, res) => {
        const APISECRET = await cryptDecrypt.decrypt(req.body.apisecret);
        const APIKEY = await cryptDecrypt.decrypt(req.body.apikey);
        const keys = { APISECRET,APIKEY } 
        let inputData = { dualSidePosition : req.body.side,timestamp: new Date().getTime() };
        const dataQueryString = qs.stringify(inputData);
        const signature = await crypto.createHmac('sha256', keys.APISECRET).update(dataQueryString).digest('hex');

        const requestConfig = {
            method: 'POST',
            url: FX_BASEURL + CHANGE_POSITION_MODE + '?' + dataQueryString + '&signature=' + signature ,
            headers: {
                'X-MBX-APIKEY': keys.APIKEY
            }
        }
        try {
            const response = await axios(requestConfig);
            return res.status(200).send({ status: 200, message: "Position Mode Changed SuccessFully", data: response.data });
        } catch (error) {

            logger.error(error.response.data.msg)
            return res.status(500).send({ status: 500, data: error.response.data.msg })
        }

    },
    ChangeMarginType: async(req, res) => {
        const APISECRET = await cryptDecrypt.decrypt(req.body.apisecret);
        const APIKEY = await cryptDecrypt.decrypt(req.body.apikey);
        const keys = { APISECRET,APIKEY } 
        let inputData = { symbol : req.body.symbol, marginType: req.body.type, timestamp: new Date().getTime() };
        const dataQueryString = qs.stringify(inputData);
        const signature = await crypto.createHmac('sha256', keys.APISECRET).update(dataQueryString).digest('hex');

        const requestConfig = {
            method: 'POST',
            url: FX_BASEURL + CHANGE_MARGIN_TYPE + '?' + dataQueryString + '&signature=' + signature,
            headers: {
                'X-MBX-APIKEY': keys.APIKEY
            }
        }

        try {
            const response = await axios(requestConfig);
            return res.status(200).send( { status: 200, message: "Position Mode Changed SuccessFully", data: response.data })
        } catch (error) {
            logger.error(error.response.data.msg)
            return res.status(500).send({ status: 500, data: error.response.data.msg })
        }
    },
    FxListenKey: async(req, res) => {
        try {
            let APIKEY = await cryptDecrypt.decrypt(req.body.apikey);
            const APISECRET = await cryptDecrypt.decrypt(req.body.apisecret);
            let keys = { APIKEY,APISECRET };
            let inputData = {timestamp: new Date().getTime() };
            const dataQueryString = qs.stringify(inputData);
            const signature = await crypto.createHmac('sha256', keys.APISECRET).update(dataQueryString).digest('hex');

            const requestConfig = {
                method: 'POST',
                url: FX_BASEURL + GET_LISTEN_KEY + '?' + dataQueryString + '&signature=' + signature,
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

    CancelOrder: async(req, res) => {
        try {
            let APIKEY = await cryptDecrypt.decrypt(req.body.apikey);
            const APISECRET = await cryptDecrypt.decrypt(req.body.apisecret);
            let keys = { APIKEY,APISECRET }; 
            const dataQueryString = qs.stringify(inputData);
            const signature = await crypto.createHmac('sha256', keys.APISECRET).update(dataQueryString).digest('hex');

            const requestConfig = {
                method: 'DELETE',
                url: FX_BASEURL + CANCEL_ORDER + '?' + dataQueryString + '&signature=' + signature,
                headers: {
                    'X-MBX-APIKEY': keys.APIKEY
                }
            }
            const response = await axios(requestConfig);
            return res.status(200).send({ status: 200, message: "Listen Key Genrated SuccessFully", data: response.data });
 
        } catch(error) {
            console.log("Error @ AccountInfo :", error)
            logger.error(error.respone.data ? error.respone.data.data.msg : error);
            res.status(400).send({ status: 500, data: error.respone.data.msg})
        }
    },

    GetPositionRisk: async(req, res) => {
        try {
            let APIKEY = await cryptDecrypt.decrypt("422edfc014eb7f5694020c8dfd0f4314:8b6f129b1307b80ea37a7a7e7f050e3130d1fbce1d52fac3a414cabc6c3b7dcdb8255408388b738c6ad675215db64bcd0d2f00c51d7cfe2c86295c989e5a2004413341200058cd9378eda05b75d1d56d");
            const APISECRET = await cryptDecrypt.decrypt("89c0f6964882df426b1c709d0616d8ad:ac4c1327583646b5fa24c7cff32c426683f8abc72ce9061e696d1fc4a0fccfd350cca6fb29894641bfdb3c943ac8473fd93fdd032bc261049a80ae067d7903dadfea5d1620858ab7bd149f65d57ff59b");
            let keys = { APIKEY,APISECRET }; 
            let inputData = { timestamp: new Date().getTime() };

            const dataQueryString = qs.stringify(inputData);
            const signature = await crypto.createHmac('sha256', keys.APISECRET).update(dataQueryString).digest('hex');
            const requestConfig = {
                method: 'GET',
                url: FX_BASEURL + GET_POSITION_RISK + "?" + dataQueryString + "&signature=" + signature,
                headers: {
                    'X-MBX-APIKEY': keys.APIKEY
                }        
            }
            const response = await axios(requestConfig);
            // return   res.status(200).send({ status: 200, message: "Get POsition RIsk", data: response.data });
            return response.data;
        } catch (error) {
            console.log("Error @ AccountInfo :", error)
            //logger.error(error.respone.data ? error.respone.data.data.msg : error);
            res.status(400).send({ status: 500, data: error.respone.data})
        }
    },
    
    GetMarkPrice: async (symbol) => {
        try{
            let inputData = { symbol: symbol, timestamp: new Date().getTime() };
            const dataQueryString = qs.stringify(inputData);
            const requestConfig = {
                method: 'GET',
                url: FX_BASEURL + GET_MARK_RISK + "?" + dataQueryString                  
            }
            const response = await axios(requestConfig);
            return  response.data ;
        } catch (error) {
            console.log("Error @ AccountInfo :", error)
            //logger.error(error.respone.data ? error.respone.data.data.msg : error);
            // res.status(400).send({ status: 500, data: error.respone.data});
        }
} }



module.exports = BinanceEndpointsFX;
