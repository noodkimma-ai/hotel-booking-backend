const prisma = require("../prisma/client");
const getAllMyCart = async(res, req)=>{
    try{
        const {}
    const carts = await prisma.cartItem.findMany();
    res.status(200).json(carts);
    }catch(error){
        res.status(500).json({
            message:"failed to find cart",
            error:error.message,
        });
    }

};
module.exports = {getAllMyCart};