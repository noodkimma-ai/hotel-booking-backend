const express = require("express");
const router = express.Router();
const { getAllRoom } = require("../controllers/roomController");
const {createRoom} = require("../controllers/roomController");
const {updateRoom} = require("../controllers/roomController");
const upload = require("../middleware/upload");
const {deleteRoom} = require("../controllers/roomController");
const {getAvailableRooms} = require("../controllers/roomController");


router.get("/search", getAvailableRooms);

router.get("/", getAllRoom);
// router.post("/", createRoom);
router.post("/", upload.single("image"), createRoom);
router.put("/:id",upload.single("image"), updateRoom);
router.delete("/:id", upload.single("image"), deleteRoom),
module.exports = router;