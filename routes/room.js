const express = require('express');
const prisma = require('../prisma/client');

const router = express.Router();

// CREATE a room
router.post('/', async (req, res) => {
  try {
    const { roomNumber, type, price, capacity, status, description, imageUrl, amenities } = req.body;

    const room = await prisma.room.create({
      data: {
        roomNumber,
        type,
        price: parseFloat(price),
        capacity: capacity ? parseInt(capacity) : 1,
        status: status || "available",
        description,
        imageUrl,
        amenities: amenities || [],
      },
    });

    res.status(201).json({ message: 'Room created', room });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(400).json({ error: 'Room number already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

// GET all rooms (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { status, type } = req.query;

    const rooms = await prisma.room.findMany({
      where: {
        ...(status && { status }),
        ...(type && { type }),
      },
      orderBy: { roomNumber: 'asc' },
    });

    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single room by id
router.get('/:id', async (req, res) => {
  try {
    const room = await prisma.room.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a room
router.put('/:id', async (req, res) => {
  try {
    const { roomNumber, type, price, capacity, status, description, imageUrl, amenities } = req.body;

    const room = await prisma.room.update({
      where: { id: parseInt(req.params.id) },
      data: {
        roomNumber,
        type,
        price: price ? parseFloat(price) : undefined,
        capacity: capacity ? parseInt(capacity) : undefined,
        status,
        description,
        imageUrl,
        amenities,
      },
    });

    res.json({ message: 'Room updated', room });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE a room
router.delete('/:id', async (req, res) => {
  try {
    await prisma.room.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: 'Room deleted' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;