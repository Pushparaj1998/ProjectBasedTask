const Book = require('../model/book');
const jwt = require('jsonwebtoken');

class BookController {
    constructor() {

    }

    // async getBook(req,res) {
    //     try {
    //         const adminToken = req.cookies.adminToken;
    //         const decodeAdminToken = await jwt.decode(adminToken);
    //         const userToken = req.cookies.userToken;
    //         const decodeuserToken = await jwt.decode(userToken);
    //         if(decodeAdminToken.role == "Owner")
    //         {
    //             const book = await Book.find();
    //             res.status(200).json(book);
    //         }else if(decodeuserToken.role == "Customer" ) 
    //         {
    //             const book = await Book.aggregate( [
    //                 {$match: { quanityAvailable : {$gt:0}}}
    //             ])
    //             res.status(200).json(book);     
    //         }
    //     } catch (error) {
    //         res.status(400).send(`Error : ${error}`)
    //     }
    // }


    async listBook(req,res) {
            try {
                    const book = await Book.find({});
                    res.status(200).json(book);
            } catch (error) {
                res.status(400).send(`Error : ${error}`)
            }
        }


    async getBook(req,res) {
            try {
                    const book = await Book.find({status : true});
                    res.status(200).json(book);
            } catch (error) {
                res.status(400).send(`Error : ${error}`)
            }
        }
    

    async createBook (req,res){
        try{
           const book = new Book({
               bookName : req.body.bookName,
               author : req.body.author,
               language : req.body.language,
               price : req.body.price,
               edition : req.body.edition,
               publishYear : req.body.publishYear,
               quanityAvailable : req.body.quanityAvailable,
               status : req.body.status
           })  
           const saveBook = await book.save();
           res.status(200).json(saveBook);
        }catch(error){
              res.status(400).send(`Error : ${error}`)
        }
    }

    async updateBook(req,res){
        try {
                const book = await Book.findById(req.params.id);
                const body = req.body;
                if(body.bookName) book.bookName = body.bookName;
                if(body.author) book.author = body.author;
                if(body.language) book.language = body.language;
                if(body.price) book.price = body.price;
                if(body.edition) book.edition = body.edition;
                if(body.publishYear) book.publishYear = body.publishYear;
                if(body.status) book.status = body.status;
                let searchstatus = req.body.quanityAvailable.toString()
                if (searchstatus) {
                    book.quanityAvailable = body.quanityAvailable;
                }    

                res.status(200).json(await book.save());
                    
        } catch (error) {
            res.json(400).send(`Error : ${error}`)
        }
    }

    async deleteBook(req,res){
        try {
            await Book.deleteOne({_id : req.params.id});
            res.status(200).send(`The id ${req.params.id} with the Book Was Deleted`)
        } catch (error) {
            res.status(400).send(`Error : ${error}`);
        }
    }


}


module.exports = BookController;