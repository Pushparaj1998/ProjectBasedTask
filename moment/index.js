const moment = require('moment-timezone')

const date = moment('2021-02-12T03:35:00Z').tz('India').format('YYYY-MM-DD HH:mm:ss ZZ');
console.log("date--------->", date)


  