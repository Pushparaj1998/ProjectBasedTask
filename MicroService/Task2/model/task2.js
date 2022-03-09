const mongoose = require('mongoose')

const task2Schema = mongoose.Schema({
    taskName : {
        type : String
    },
    description : {
        type : String
    }
})

module.exports = mongoose.model('Task2', task2Schema)