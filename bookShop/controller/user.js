
const User = require('../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class UserController{
    constructor() {
    }
    async getUser(req , res){
          try {
              const user = await User.find();
              res.status(200).json(user);
          } catch (error) {
              res.status(400).send(`Error : ${error}`);
          }
    }
    async createUser (req,res){
        try{
            //hashPasswords
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(req.body.password, salt);
           const user = new User({
               name : req.body.name,
               address : req.body.address,
               phoneNumber : req.body.phoneNumber,
               role : req.body.role,
               email : req.body.email,
               password : req.body.hashPassword
           })  
           const saveUser = await user.save();
           res.status(200).json(saveUser);
        }catch(error){
              res.status(400).send(`Error : ${error}`)
        }
    }
    async updateUser(req,res){
        try {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(req.body.password, salt);
                const user = await User.findById(req.params.id);
                const body = req.body;
                if(body.name) user.name = body.name;
                if(body.address) user.age = body.address;
                if(body.phoneNumber) user.phoneNumber = body.phoneNumber;
                if(body.role) user.role = body.role;
                if(body.email) user.email = body.email;
                if(body.password) user.password = hashPassword;
                res.status(200).json(await user.save());
                    
        } catch (error) {
            res.json(400).send(`Error : ${error}`)
        }
    }
    async deleteUser(req,res){
        try {
            await User.deleteOne({_id : req.params.id});
            res.status(200).send(`The id ${req.params.id} with the user Was Deleted`)
        } catch (error) {
            res.status(400).send(`Error : ${error}`);
        }
    }

    async userLogin(req,res){
        try {
            const  checkUserEmail = await User.findOne({email : req.body.email})

            if(!checkUserEmail)
               return res.status(401).send('Enter Valid Email!')

            const checkPass = await bcrypt.compare(req.body.password, checkUserEmail.password);

            if(!checkPass)
               return res.status(401).send('Invalid Password!')

            const token = await jwt.sign({ role: checkUserEmail.role }, process.env.TokenSecret);
            
            res.cookie('userToken', token, {
                maxAge : 1000*60*60*24,
                httpOnly : true
            }).json({succes: true, user_token: token})
        } catch (error) {
            res.status(400).send(`Error : ${error}`)
        }
    }
    async userLogout(req,res) {
        try {
            res.clearCookie('userToken')
            res.send('logout success')
        } catch (error) {
            res.status(400).send(`Error : ${error}`)
        }
    }
}

module.exports = UserController;