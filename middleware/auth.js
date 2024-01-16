const jwt = require ('jsonwebtoken');
const config = require ('config');


// here we are exporting a middleware function req and res object available to it.
// we are getting the token from the header using req.header and we are looking at x auth token
// if no token and the route is protected and using this middle ware then it will send 404 msg with denied msg
// if there is invalid token then it will run catch
// if its a valid token then it will decode it with jwt verify so it will put inside this decoded object  
module.exports = function(req,res,next){
    // Get token from header
    const token = req.header ('x-auth-token');
    // check if no token
    if(!token){
        return res.status(401).json({msg: "No token , authorization denied"})
    }

    // verify token 
    try{
        const decoded = jwt.verify(token,config.get('jwtSecret'));
        req.user = decoded.user;
        next();
    } catch(err){
        res.status(401).json({msg:"token is not valid"})
    }
}