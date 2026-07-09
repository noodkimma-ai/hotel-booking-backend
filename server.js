require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/room');
const bookingRoutes = require('./routes/booking');
const uploadRoutes = require('./routes/upload');

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// serve uploaded images as static files
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);



app.use('/api/upload', uploadRoutes);



app.listen(5000, () => console.log('Server running on port 5000'));