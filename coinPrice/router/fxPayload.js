
const WebSocket = require('ws');
let user_id = "61ada80a46f32db7adcd1d53" ;
let listen_key = "tuIu7jQWpZIn6qgqihV9CSPbPPyfcP8quBFrSS6szTniV08EgHgvtx446h3DF5G8";
let FxOpenOrder = require('../models/FxOpenOrder')
let FxWallet = require('../models/fxWallet')
let FXPayloadData = [];
let FxTrade = require('../models/fxTrade');
let FxPositionLog = require('../models/positionLog');
let BinanceEndpointsFX = require('./fxService')
const randomstring = require('randomstring');

const FxPayload = {
    async FxOrderPayload() {
        try {
            let getUserId = user_id;
            const ws = new WebSocket('wss://fstream.binance.com/ws/' + listen_key);
            console.log("FX Oder payload socket Opened", Date.now());
             
            ws.on('message', async(data) => {

            const tradeInfo = await JSON.parse(data);
            // FXPayloadData = tradeInfo;
             console.log("FXPayloadData--------------------------------------------->", tradeInfo);
            // console.log("FXPayloadDataEvent--------------------------------------------->",tradeInfo.e);
            
            

            if( tradeInfo && tradeInfo.e === "ORDER_TRADE_UPDATE" ) {

                    let newFxOpenOrder  = ({
                        avgPrice: tradeInfo.o.ap,
                        clientOrderId: tradeInfo.o.c,
                        closePosition: tradeInfo.o.cp,
                        cumQuote: tradeInfo.o.z,
                        cumQuote: tradeInfo.o.z,
                        executedQty: tradeInfo.o.l,
                        orderId: tradeInfo.o.i,
                        origQty: tradeInfo.o.q,
                        origType: tradeInfo.o.ot,
                        positionSide: tradeInfo.o.ps,
                        price: tradeInfo.o.p,
                        priceProtect: false,
                        reduceOnly: tradeInfo.o.R,
                        side: tradeInfo.o.S,
                        status: tradeInfo.o.X,
                        stopPrice: tradeInfo.o.sp,
                        symbol: tradeInfo.o.s,
                        time: tradeInfo.o.T,
                        timeInForce: tradeInfo.o.f,
                        type: tradeInfo.o.o,
                        updateTime: tradeInfo.o.T,
                        workingType: tradeInfo.o.wt        
                    });
                   
                    if( tradeInfo.o.X !== "NEW" || tradeInfo.o.X !== "PARTIALLY_FILLED") { 

                        const Fxpositon = new FxPositionLog( {
                            user_id: user_id,
                            orderId: tradeInfo.o.i,
                            details: newFxOpenOrder 
                        }).save();
                        // console.log("saved Fx Position Log Data---------->", Fxpositon);

                    } 
                    
                    if( tradeInfo.o.X === "FILLED" ) {

                        //await this.DeleteOpenOrder(user_id, newFxOpenOrder.orderId);
                        const positionrisk = await BinanceEndpointsFX.GetPositionRisk();
                        const filterRisk = await positionrisk.filter((data) => data.symbol == tradeInfo.o.s);
                        // console.log("Filter Risk--------------------------------->",filterRisk);
                        // console.log("positionAmount------------------------------------->", Number(filterRisk[0].positionAmt) );
                        if (Number(filterRisk[0].positionAmt) !== 0 ) {
                            let Price = await BinanceEndpointsFX.GetMarkPrice(tradeInfo.o.s);
                            // console.log("Price----------------->", Price);
                            // let Fxprecision = await fxprecision.findOne({ symbol: tradeInfo.o.s });
                            let worth = (Price.markPrice) * Math.abs(filterRisk[0].positionAmt);
                            // console.log("worth----------------->", worth);

                            let fxTradeHistory = await new FxTrade({
                                user_id: user_id,
                                symbol: tradeInfo.o.s,
                                quantity: Math.abs(filterRisk[0].positionAmt),
                                positionAmt: Math.abs(filterRisk[0].positionAmt),
                                entryPrice: +filterRisk[0].entryPrice,
                                side: tradeInfo.o.S,
                                position: tradeInfo.o.ps,
                                newClientOrderId: tradeInfo.o.c,
                                trade_id: randomstring.generate(6).toUpperCase(),
                                WorthUsdt: worth,
                                fund: worth / filterRisk[0].leverage,
                                leverage:filterRisk[0].leverage,
                                // baseAsset: Fxprecision.baseAsset,
                                // quoteAsset: Fxprecision.quoteAsset,
                            });
                            const saveFxHistory = await fxTradeHistory.save();
                            console.log("saveFxHistory------------------------------->", saveFxHistory);
                        } else if(Number(filterRisk[0].positionAmt) == 0) {
                            let getExPos = await FxTrade.findOne({ isSignal: false, symbol: tradeInfo.o.s, position: tradeInfo.o.ps, user_id: user_id, status: 'OPEN' });
                            //console.log("getExPos--------------------------------------------->", getExPos);
                            // console.log('getExpos Status--------------------------------------->',getExPos.status);
                            if(getExPos) {
                                
                                getExPos.pnl = ((+tradeInfo.o.ap) * (+tradeInfo.o.q)) - (getExPos.entryPrice * (+tradeInfo.o.q));
                                console.log("PNL-------------------->", getExPos.pnl);
                                let initialMargin = ((getExPos.entryPrice) * (+tradeInfo.o.q)) / filterRisk[0].leverage;
                                getExPos.profit = ((getExPos.pnl) / initialMargin) * 100;
                                getExPos.fund = initialMargin;
                                getExPos.WorthUsdt = ((getExPos.entryPrice) * (+tradeInfo.o.q));

                                let getMarkPrice = await BinanceEndpointsFX.GetMarkPrice('BTCUSDT');
                                // console.log("Get Mark Price---------------------> ", getMarkPrice)
                                
                                if(getMarkPrice ) {
                                    if (tradeInfo.o.s != 'BTCUSDT') {
                                        if (((tradeInfo.o.s).slice((tradeInfo.o.s).length -4)) == "USDT") {
                                            getExPos.profitInUSDT = getExPos.pnl;
                                            getExPos.profitInBTC = (1/ (+getMarkPrice.markPrice)) * getExPos.pnl;   
                                        } else if(((tradeInfo.o.s).slice((tradeInfo.o.s).length - 4)) == "BUSD") {
                                            getExPos.profitInUSDT = getExPos.pnl;
                                            getExPos.profitInBTC = (1 / (+getMarkPrice.markPrice)) * getExPos.pnl; 
                                        }
                                    } else {
                                        getExPos.profitInBTC = (getExPos.pnl * (1 / (+getMarkPrice.markPrice)));
                                        getExPos.profitInUSDT = getExPos.pnl;
                                    }
                                }

                                getExPos.status = "COMPLETED";
                                getExPos.side = tradeInfo.o.S;
                                getExPos.exitPrice = +tradeInfo.o.ap;
                                const updateStatus = await getExPos.save();
                                console.log("UpdateStatus------------------------>", updateStatus);
                            }                           
                        }
                            
                    } else if(tradeInfo.o.X == "NEW") {

                        const fxOpenOrder = new FxOpenOrder( {
                            user_id: user_id,
                            orderId: tradeInfo.o.i,
                            details: newFxOpenOrder 
                        })
                        const saveData = await fxOpenOrder.save();
                        // console.log("Saved Fx open Order Data---------->", saveData);

                    } else if( tradeInfo.o.X == "CANCELED") {

                        await this.DeleteOpenOrder(user_id, newFxOpenOrder.orderId);
                        console.log(`OrderID : ${newFxOpenOrder.orderId} in Open Order Deleted SuccessFully`);

                    } else if( tradeInfo.o.X == "EXPIRED") {

                        await this.DeleteOpenOrder(user_id, newFxOpenOrder.orderId);
                        console.log(`OrderID : ${newFxOpenOrder.orderId} in Open Order Deleted SuccessFully`);

                    } 
            
            } else  if( tradeInfo && tradeInfo.e == "ACCOUNT_UPDATE") {
                console.log("Account_UpdateData------------------------->", tradeInfo.a.B[0])
                const fxWalletUpdate = await FxWallet.updateOne({ "user_id": user_id, "balance.asset": tradeInfo.a.B[0].a }, { "$set": { "balance.$.walletBalance": tradeInfo.a.B[0].wb, "balance.$.crossWalletBalance": tradeInfo.a.B[0].cw } })
                // const fxUserWallet = await FxWallet.findOne({ "user_id": user_id})
                console.log("Updated FX Wallet--------------------------->", fxWalletUpdate)
            }
        
        });

        ws.on('ping', (e) => {
        ws.pong();
        });

        ws.on('error', async(error) => {
        console.log("===error==", error)
        });

        ws.on('disconnect', async function() {
            console.log(" order payload disconnected ")
        });

        ws.on("close", async function() {
            console.log("order payload close -------> user Id : ", getUserId)
        })

        }    catch (error) {
        console.log("============error============", error)
        }

    },
    async  DeleteOpenOrder(user_id, orderId) {
        try {
            await FxOpenOrder.deleteOne({ user_id: user_id, orderId: orderId });
        } catch (error) {
            console.log("Error @ DeleteOpenOrder :", error)
        }
    }
}

FxPayload.FxOrderPayload();

module.exports = FxPayload;



// }else if( FXPayloadData.e == "ORDER_TRADE_UPDATE" && FXPayloadData.o.X == "FILLED") {

            //     console.log("Filled Data------------------------->", FXPayloadData.o.X);
                
            //     const findData = await FxOpenOrder.findOne( { orderId: FXPayloadData.o.i } );
            //     console.log('FxOpenOrderData--------------------->', findData)
            //     console.log("find status Data------------------------------>", findData.details.status);
            //     console.log("payload Status---------------------------->",FXPayloadData.o.X)
            //     findData.details.status = FXPayloadData.o.X;
            //     await findData.save();
            //     console.log("updated Data-------------------->", findData)
            // }