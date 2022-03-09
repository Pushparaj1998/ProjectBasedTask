const jwt = require('jsonwebtoken');

 function auth(req, res, next) {


    const token = req.cookies.token;
    if(token) {
        try {
            const verified = jwt.verify(token, process.env.TokenSecret)
            req.user = verified;
            next();
        } catch (error) {
            res.status(400).send('Invalid Token'+error)
        }
    }
    return res.status(401).send("Access Denied");

}

async function  adminRoleAuth(req,res,next){

    const token = req.cookies.adminToken;
    if(!token){
        res.status(401).send('Please Login');
    }else{
            // console.log(token)
            const decoded = await jwt.decode(token);
            // console.log(decoded.role);
            if(decoded.role == "Owner")
            {
                next();
            }else{
                res.status(400).send("Access Denied")
            }
    }
}
async function  UserRoleAuth(req,res,next){

    const userToken = req.cookies.userToken;
    if(userToken ){

       // console.log(token)
       const userDecoded = await jwt.decode(userToken);
       if( userDecoded.role == "Customer"){
        next();
       }else
       {
           res.status(400).send("Access Denied")
       }    
    }else{
        res.status(401).send('Please Login');  
    }
}

module.exports = { auth, adminRoleAuth, UserRoleAuth }