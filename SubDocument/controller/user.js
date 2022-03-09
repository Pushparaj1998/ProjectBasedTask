const User = require('../models/user');

class UserController{

    constructor() {
        
    } 
     async getUser(req,res) {
           try {
               const user = await User.find();
               res.status(200).json(user);
           } catch (error) {
               res.status(400).send(`Error : ${error}`)
           }
     }

     async createUser(req,res) {
         try {
             
             const user = await new User({
                 name : req.body.name,
                 age : req.body.age,
                 address : {
                    street :  req.body.address.street,
                    district : req.body.address.district,
                    pincode : req.body.address.pincode
                }
             })
             console.log(user)
             const saveUser = await user.save();
             res.status(200).json(saveUser);
         } catch (error) {
             res.status(200).send(`Error : ${error}`)
         }
     }

    
}

module.exports = UserController