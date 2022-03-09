const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    bookName : {
        type : String
    },
    author : {
        type : String
    },
    language : {
        type : String,
        enum : ['English', 'Tamil'],
        message : ('Only Two Languages Available English and Tamil')
    },
    price : {
        type : Number
    },
    edition : {
        type : Number
    },
    publishYear : {
        type : Number,
        min : 1900,
        max : 2022,
        message : ('The books Available Between 1900 to 2022')
    },
    quanityAvailable : {
        type : Number
    },
    status: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('Book', bookSchema);