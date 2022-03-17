const WebSocket = require('ws')

let user_id = "61ada80a46f32db7adcd1d53" ;
let listen_key = "gOlEwTFeV25AqNOZUNzeSVkh4q4pbaWNFoNZXkxoAVE1v8fxItgLc5h7MVA7";
let History = require('../models/history');
 let Userwallet = require('../models/wallet');


let payloadData = [];
let walletData = {};

const payload = {
    async OrderPayload() {
        try {
            let getUserId = user_id;
            const ws = new WebSocket('wss://stream.binance.com:9443/ws/' + listen_key);
            console.log("Oder payload socket Opened", Date.now());
             
            ws.on('message', async(data) => {
            const tradeInfo = JSON.parse(data);
            payloadData = tradeInfo;
            // console.log("PayloadData--------------------------------------------->", payloadData)
            let payload = payloadData;
            // console.log("find_Status-------------------->", payload.X)
            if(payload.X === "NEW"){
                const historyData = new History({
                    symbol: payload.s,
                    orderId: payload.i,
                    orderListId: payload.g,
                    clientOrderId: payload.c,
                    transactTime: payload.T,
                    price: payload.p,
                    origQty: payload.q,
                    executedQty: payload.l,
                    cummulativeQuoteQty: payload.z,
                    status: payload.X,
                    timeInForce: payload.f,
                    type: payload.o,
                    side: payload.S  
                })

                const saveHistoryData = await historyData.save();
                // console.log("save History Data--------------------------->", saveHistoryData)
            }
            if(payload.X === "FILLED") {
                // console.log("Filled Data------------------------->",payload.X)
                const updateStatus = await History.updateOne( { orderId: payload.i }, { "$set": { "status": payload.X } })
                // console.log("Updated Data------------------------------>", updateStatus);
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

        } catch (error) {
            console.log("============error============", error)
        }

    },
    async walletPayload() {
        try {
            
            const ws = new WebSocket('wss://stream.binance.com:9443/ws/' + listen_key );
            // console.log('WalletPayload Socket Opened', Date.now());

            ws.on('message', async (data) => {
                const info = JSON.parse(data);
                walletData = info;
                // const sendVal = parseInt(walletData.d);
                // console.log("walletData----------------------------------------->", walletData)
                // console.log("coin name form find user------------------------>", walletData.e)
                if(walletData.e == "outboundAccountPosition"){

                    const findUser = await Userwallet.findOne({"user_id" : "61ada80a46f32db7adcd1d53"});

                    findUser.balance.map(
                         (data) => {
                             if(data.coin == walletData.B[0].a) {
                                data.bal = walletData.B[0].f
                                // console.log("data.bal------------>", data.bal)
                            }
                        }
                    )
                     findUser.save()
                   
                    // for(let i=0;i < findUser.balance.length; i++)
                    // {
                    //     if(findUser.balance[i].coin == walletData.B[0].a)
                    //     {
                    //         findUser.balance[i].bal = walletData.B[0].f;
                    //         await findUser.save();
                    //     }
                    // }
                    // console.log('UpdatedUser---------------------->', findUser);
                }                           
             }
            )

            ws.on('error', async(error) => {
                console.log("===error==", error)
            });
    
            ws.on('disconnect', async function() {
                    console.log(" order payload disconnected ")
             });
    
            ws.on("close", async function() {
                    console.log("order payload close -------> user Id : ", user_id)
            })
        } catch (error) {
            console.log("============error============", error)
        }
    }

}


payload.walletPayload();
payload.OrderPayload();


module.exports = payload;
