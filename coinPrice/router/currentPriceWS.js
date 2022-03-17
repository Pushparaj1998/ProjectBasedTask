const WebSocket = require("ws");
const Trade = require('../models/trade');


const CurrentPriceWS = {
    currentPrice: async (req, res) => {
       try {
            let trade;
            const ws = new WebSocket('wss://stream.binance.com:9443/ws/' + "btcusdt" + '@ticker');

            ws.on('message', async function incoming(data) {
                const ticker = JSON.parse(data);
                // console.log("ticker------------>", ticker);
                trade = await Trade.findOne({ symbol: data.symbol, side: "BUY", tradeStatus: "NEW", takeProfitEnable: true});
                if(trade){
                    await BinanceEndpoints.au
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
// CurrentPriceWS.currentPrice();

module.exports = CurrentPriceWS