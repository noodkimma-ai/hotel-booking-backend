import { message } from "antd";

const createBooking = async(req, res)=>{
    try{
        const {cartItem } = req.body;
        const userId = req.user.userID;
        const searchCheckIn = new Date(checkIn);
        const searchCheckOut = new Date(checkOut);
        for (const item of cartItem){    // yo item bhitra cartItem ko harek room ko object hunxxa

              const room = await prisma.room.findUnique({   //pahila database ma bhako room find garney
            where:{
                roomId:item.id,
            },
        });

        if(!room){  //if room available xoina bhaney database ma then room not available dekhaoney 
            return res.status(404).json({
                message:"room not found",
            });
        }
            const overLappingBooking = await prisma.Booking.findMany({   //yesma overlap bhako booking nikalney 
                where:{
                    roomId:item.id,
                    price:item.price,
                    AND:[{
                      checkOut:{
                        gt:searchCheckIn
                      },
                      checkIN:{
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


            await prism.Booking.create({
                data:{
                    userId,
                    roomId:item.id,
                    checkIN:searchCheckIn,
                    checkOut:searchCheckOut,
                    totalPrice,
                }
            });

          
        }
        
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message:"Internal server Error",
            error:error.message,
        });
    };
}