const User = require('../models/user')

class UserController {
    constructor() {

    }

    async register(req, res) {
        try {
            const user = new User({
                name : req.body.name,
                email : req.body.email,
                password : req.body.password,
                role : req.body.role,
                department : req.body.department
            })
            const saveUser = await user.save();
            res.status(200).json(saveUser)
        } catch (error) {
            res.status(400).send(`Error : ${error}`)
        }
    }

    async getUser(req,res) {
        try{
           const user = await User.find();
           res.status(200).json(user)
        }catch(err)
        {
           res.status(200).send(`Error : ${err}`)
        }
    }

    async login(req,res) {
        try {
            const user = await User.findOne({email : req.body.email});
            if(!user) return res.status(400).send('Invalid Email');

            if(user.password != req.body.password)
            return res.status(400).send('Invalid Password');
            
            res.status(200).json('Login SucessFully ');

        } catch (error) {
            
        }
    }
}

module.exports = UserController;