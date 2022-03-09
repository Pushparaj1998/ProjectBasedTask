const Admin = require('../model/admin')
const Book = require('../model/book')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const auth = require('./verifyToken')


class AdminController {
    constructor() {

    }

    async getAdmin(req,res) {
        try {
                   const admin = await Admin.find();
                   res.status(200).json(admin);
   
        } catch (error) {
            res.status(400).send(`Error : ${error}`)
        }
    }

    async createAdmin (req,res){
        try{
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(req.body.password, salt);
           const admin = new Admin({
               name : req.body.name,
               role : req.body.role,
               email : req.body.email,
               password : hashPassword
           })  
           const saveAdmin = await admin.save();
           res.status(200).json(saveAdmin);
        }catch(error){
              res.status(400).send(`Error : ${error}`)
        }
    }

    async updateAdmin(req,res){
        try {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(req.body.password, salt);
                const admin = await Admin.findById(req.params.id);
                const body = req.body;
                if(body.name) admin.name = body.name;
                if(body.role) admin.role = body.role;
                if(body.email) admin.email = body.email;
                if(body.password) admin.password = hashPassword;
                res.status(200).json(await admin.save());
                    
        } catch (error) {
            res.json(400).send(`Error : ${error}`)
        }
    }

    async deleteAdmin(req,res){
        try {
            await Admin.deleteOne({_id : req.params.id});
            res.status(200).send(`The id ${req.params.id} with the user Was Deleted`)
        } catch (error) {
            res.status(400).send(`Error : ${error}`);
        }
    }
    
    async getBooks(req,res){
        try {
            const book = await Book.find();
            res.status(200).json(book)
        } catch (error) {
            res.status(400).send(`Error : ${error}`);
        }
    }

    async adminLogin(req,res){
        try {
            const  checkAdminEmail = await Admin.findOne({email : req.body.email})

            if(!checkAdminEmail)
               return res.status(401).send('Enter Valid Email!')

            const checkPass = await bcrypt.compare(req.body.password, checkAdminEmail.password);

            if(!checkPass)
               return res.status(401).send('Invalid Password!')

            const token = await jwt.sign({ role: checkAdminEmail.role }, process.env.TokenSecret);

            res.cookie('adminToken', token, {
                maxAge : 1000*60*60*24,
                httpOnly : false
            }).json({succes: true, token : token})


        } catch (error) {
            res.status(400).send(`Error : ${error}`)
        }
    }

    
    async adminLogout(req,res) {
        try {
            res.clearCookie('adminToken')
            res.send('logout success')
        } catch (error) {
            res.status(400).send(`Error : ${error}`)
        }
    }
}


module.exports = AdminController;