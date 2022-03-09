const mongoose = require('mongoose')

const task1Schema = mongoose.Schema({
    taskName : {
        type : String
    },
    description : {
        type : String
    }
})

module.exports = mongoose.model('Task1', task1Schema)