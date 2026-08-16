const express = require('express');
const router = express.Router();  //express ko router babanona aba yo router ko booking sambhandhi saboi route manage garxa 
const prisma = require('../prisma/client');
const authMiddleware = require('../middleware/authMiddleware');   // booking garna login gareko user ,atra paoxa 
const {createBooking, getMyBookings, getAllBookings} = require('../controllers/bookingController');  // router la request receive garxa but actual businnes logic controller ma hunxa 
const adminMiddleware = require('../middleware/adminMiddleware');




router.post("/", authMiddleware, createBooking);   // frontend bata ako xa pathjun server ma xa so yeta just / gareko tyo path aru kae chahidoina 

router.get("/my-bookings", authMiddleware, getMyBookings); // my-booking yo frontend la magda kun route use garney so hami frontend ma use garxu url ma yo backend ko route

router.get("/", authMiddleware,adminMiddleware, getAllBookings); //admin la saboi booking liney 

module.exports= router;

// // CREATE a booking
// router.post('/', async (req, res) => {
//   try {
//     const { userId, roomId, checkIn, checkOut } = req.body;

//     const room = await prisma.room.findUnique({ where: { id: parseInt(roomId) } });
//     if (!room) return res.status(404).json({ error: 'Room not found' });
//     if (room.status !== 'available') {
//       return res.status(400).json({ error: 'Room is not available' });
//     }

//     // calculate nights & total price
//     const nights = Math.ceil(
//       (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
//     );
//     if (nights <= 0) {
//       return res.status(400).json({ error: 'Invalid check-in/check-out dates' });
//     }
//     const totalPrice = nights * room.price;

//     // create booking + mark room as booked (transaction keeps both in sync)
//     const booking = await prisma.$transaction(async (tx) => {
//       const newBooking = await tx.booking.create({
//         data: {
//           userId: parseInt(userId),
//           roomId: parseInt(roomId),
//           checkIn: new Date(checkIn),
//           checkOut: new Date(checkOut),
//           totalPrice,
//         },
//       });

//       await tx.room.update({
//         where: { id: parseInt(roomId) },
//         data: { status: 'booked' },
//       });

//       return newBooking;
//     });

//     res.status(201).json({ message: 'Booking created', booking });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET all bookings (admin) — includes room + user info
// router.get('/', async (req, res) => {
//   try {
//     const bookings = await prisma.booking.findMany({
//       include: { user: true, room: true },
//       orderBy: { createdAt: 'desc' },
//     });
//     res.json(bookings);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET bookings for a specific user (customer's own bookings)
// router.get('/user/:userId', async (req, res) => {
//   try {
//     const bookings = await prisma.booking.findMany({
//       where: { userId: parseInt(req.params.userId) },
//       include: { room: true },
//       orderBy: { createdAt: 'desc' },
//     });
//     res.json(bookings);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // UPDATE booking status (admin: confirm, check-in, check-out, cancel)
// router.put('/:id', async (req, res) => {
//   try {
//     const { status, paymentStatus } = req.body;

//     const booking = await prisma.booking.update({
//       where: { id: parseInt(req.params.id) },
//       data: {
//         ...(status && { status }),
//         ...(paymentStatus && { paymentStatus }),
//       },
//     });

//     // if cancelled, free up the room again
//     if (status === 'cancelled') {
//       await prisma.room.update({
//         where: { id: booking.roomId },
//         data: { status: 'available' },
//       });
//     }

//     // if checked-out, free up the room too
//     if (status === 'checked-out') {
//       await prisma.room.update({
//         where: { id: booking.roomId },
//         data: { status: 'available' },
//       });
//     }

//     res.json({ message: 'Booking updated', booking });
//   } catch (err) {
//     if (err.code === 'P2025') {
//       return res.status(404).json({ error: 'Booking not found' });
//     }
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;