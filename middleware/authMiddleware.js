
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
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    }catch(error){
        return res.status(401).json({
            message:"Invalid or expire token"
        });
    }

 }