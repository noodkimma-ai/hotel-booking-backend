
const jwt = require("jsonwebtoken");
 const authMiddleware = (req, res, next)=>{
    const authHeader = req.headers.authorization;   // frontend bata token awxa 
    if(!authHeader){
        return res.status(401).json({
            message:"No token provided"    //if use la login nagari proceed tO BOOKING garnu khojo bhaney token nai hudoina 
        });
    }
    try{
    const token = authHeader.split(" ")[1];
    console.log("Token: ", token);
    console.log("SECRET EXISTS:", !!process.env.JWT_SECRET);
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODE: ", decode);
    req.user = decode;
    next(); //yesley k garxa bhaney jun route ma xa ni authmiddleware, create booking function authmiddle ware paxi next function run garxa bhaney ko left to right function
    }catch(error){
        return res.status(401).json({
            message:"Invalid or expire token"
        });
    }

 }
 module.exports= authMiddleware;