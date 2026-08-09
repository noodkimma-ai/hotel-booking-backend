const prisma = require("../prisma/client");

const createBooking = async(req, res)=>{
    try{

        console.log("CREATEBOOKING TERMINAL HIT");
        console.log("User: ", req.user);
        console.log("BODY: ", req.body);
        const {cartItems, checkIn, checkOut, guests } = req.body;

        console.log("Check In: ", checkIn);
        console.log("CHECKOUT: ", checkOut);
        const userId = req.user.userId;
        const searchCheckIn = new Date(checkIn);
        const searchCheckOut = new Date(checkOut);

        console.log("SEARCH CHEK IN: ", searchCheckIn);
        console.log("SEARCH CHECKOUT: ", searchCheckOut);
        const MILLIINSECOND_IN_ONE_DAY = 24 * 60 * 60 * 1000;  //calculate 1 day time in millisecond

        const totalNight = (searchCheckOut - searchCheckIn) / MILLIINSECOND_IN_ONE_DAY ;
        for (const item of cartItems){    // yo item bhitra cartItem ko harek room ko object hunxxa

              const room = await prisma.room.findUnique({   //pahila database ma bhako room find garney
            where:{
                id:item.id,
            },
        });

        if(!room){  //if room available xoina bhaney database ma then room not available dekhaoney 
            return res.status(404).json({
                message:"room not found",
            });
        }
            const overLappingBooking = await prisma.booking.findMany({   //yesma overlap bhako booking nikalney 
                where:{
                    roomId:item.id,
                    // price:item.price,
                    AND:[{
                      checkOut:{
                        gt:searchCheckIn
                      },
                      checkIn:{
                        lt:searchCheckOut
                      }
                    },
                ],
                },
            });

            if(overLappingBooking.length>0){
                return res.status(400).json({
                    message:"No longer room is available",
                    
                });
            }

            const totalPrice = room.price * totalNight;


            await prisma.Booking.create({
                data:{
                    userId,
                    roomId:item.id,
                    checkIn:searchCheckIn,
                    checkOut:searchCheckOut,
                    totalPrice,
                }
            });

          
        }

        return res.status(201).json({
           message:"Booking successfully",
        })
        
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message:"Internal server Error",
            error:error.message,
        });
    };
}

module.exports = {createBooking};