const amqplib = require('amqplib');
const { checkout } = require('../../../bookShop/routes/admin');

let ch = null;

const getRabbitMQ = () => ch;

const connectRabbitMQ = async () =>{
    console.error("[AMQP] connected");

    let conn = await amqplib.connect(process.env.RABBITMQ_URL);
    ch = await conn.createChannel();

    // startLoader();

    conn.on("close", function() {
        console.error("[AMQP] reconnecting");
        connectRabbitMQ();
    })
}

// const startLoader = async () => {
//     mqforSocket(ch);
//     mqforNotification(ch);
//     mqforCustomNotificationMail(ch);
    
// }

module.exports = {
    getRabbitMQ,
    connectRabbitMQ
}