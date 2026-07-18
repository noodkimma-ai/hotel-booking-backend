const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination :(req, file, cb) =>{
        cb(null, "uploads/");
    },
    fileName:(req, file, cb)=>{
        const uniqueName = Date.now()+path.extname(file.originalname);
    cb(null,"uniqueName");
    },
});
const upload = multer({storage,});
module.exports = upload;