// const { message } = require("antd");
const { message } = require("antd");
const prisma = require("../prisma/client");
const getAllRoom = async(req, res)=>{
    try{
    const rooms = await  prisma.room.findMany();
    res.status(200).json(rooms);
    }catch(error){
        res.status(500).json({
            message:"failed to lead room",
            error:error.message,
        });
    }

};

const createRoom = async(req, res)=>{
    try{
        const {roomNumber, roomName, roomType, floor, price, capacity, description} = req.body;
        const image = req.file?req.file.filename: null;
        console.log("req.body:", req.body);
        console.log("req.file:", req.file);
        const room = await prisma.room.create({
        data:{
        roomNumber : Number(roomNumber),
        roomName,
        roomType,
        floor : Number(floor),
        price : Number(price),
        capacity : Number(capacity),
        description,
        image,
    },
   });
   res.status(201).json({
    message:"create successfully",
    room,
   });
    }catch(error){
        res.status(500).json({
            message:"something went wrong",
            error:error.message,
        })
        // console.log("something went wrong", error);
    }
}

const updateRoom = async(req, res)=>{
  try{
    const{id} = req.params;
    // const image = req.file?req.file.filename:undefined;
    const room = await prisma.room.update({
        where:{
            id: Number(id)  //kun row update garney bhanera  and why number beause req.params.id string ma hunxa tara database m anumber ma (id = 5)
        },
        data:{
            roomNumber:Number(req.body.roomNumber),
            roomName:req.body.roomName,
            roomType:req.body.roomType, 
            price:Number(req.body.price),
            floor:Number(req.body.floor),
            capacity:Number(req.body.capacity),
            image:req.file?req.file.filename:undefined,
        },
    });
      res.status(200).json({
      message:"üpdate successfully",
      room
    })

  }catch(error){
    console.log(error);
  }
}
const deleteRoom = async(req,res)=>{
    try {
        const {id} = req.params;
        const room = await prisma.room.delete({
            where:{
                id:Number(id)
            },
        });
        res.status(200).json({
            message:"Delete successfully",
            room
        })
    } catch (error) {
        console.log(error);
        
    }
}

const getAvailableRooms = async(req, res)=>{
    try {
        
        const {checkIn, checkOut, guests} = req.query;
        const searchCheckIn = new Date(checkIn);
        const SearchCheckOut = new Date(checkOut);
        const overLapBooking = await prisma.booking.findMany({
            where:{
               AND:[{
                checkOut:{
                    gt:searchCheckIn   //search ko checkout should be greater than booking checkIn
                }
            },
            {
                checkIn:{
                    lt:SearchCheckOut   //search ko checkout should be less than booking checkout
                }
            
               }
            ]
            }
        });

        const bookRoomIds  = overLapBooking.map((booking)=>{ 
            return booking.roomId;  //Kinabhane map() le naya array banauna return value chainxa.
             })    //overLapBooking bhitra multiple room hola aba hami bookinng ma yaota booking linxa map la tesoile la booking use garxam asa parameter
          
             const availablerooms = await prisma.room.findMany({
              where:{
                NOT:{
                    id:{
                    in : bookRoomIds
                    }  // yesko matlab jun bookroomIds ma jun room overlap bhako room ko id ako xa ni tyo bahek aru room ko id dew 
                },
                capacity:{
                    gte:Number(guests)  //capacity should be greater than or equal to number of guests 
                }

             }
          })

          res.json(availablerooms);
        
    } catch (error) {
        res.status(500).json(
            {
                message:"Internal server Error",
                error:error.message,
            }
        );
        
    }
}
module.exports = {getAllRoom, createRoom, updateRoom, deleteRoom, getAvailableRooms};