const express = require('express');
const prisma = require('../prisma/client');

const router = express.Router();

// ADD item to cart
router.post('/', async (req, res) => {
  try {
    const { userId, roomId, checkIn, checkOut } = req.body;

    const room = await prisma.room.findUnique({ where: { id: parseInt(roomId) } });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    if (room.status !== 'available') {
      return res.status(400).json({ error: 'Room is not available' });
    }

    const nights = Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    );
    if (nights <= 0) {
      return res.status(400).json({ error: 'Invalid check-in/check-out dates' });
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        userId: parseInt(userId),
        roomId: parseInt(roomId),
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
      },
    });

    res.status(201).json({ message: 'Added to cart', cartItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET cart items for a user (with room details)
router.get('/:userId', async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: parseInt(req.params.userId) },
      include: { room: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REMOVE an item from cart
router.delete('/:id', async (req, res) => {
  try {
    await prisma.cartItem.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: 'Removed from cart' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    res.status(500).json({ error: err.message });
  }
});

// CHECKOUT — convert all cart items into bookings
router.post('/checkout/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { room: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // check all rooms are still available before booking any
    for (const item of cartItems) {
      if (item.room.status !== 'available') {
        return res.status(400).json({ error: `Room ${item.room.roomNumber} is no longer available` });
      }
    }

    const bookings = await prisma.$transaction(async (tx) => {
      const createdBookings = [];

      for (const item of cartItems) {
        const nights = Math.ceil(
          (new Date(item.checkOut) - new Date(item.checkIn)) / (1000 * 60 * 60 * 24)
        );
        const totalPrice = nights * item.room.price;

        const booking = await tx.booking.create({
          data: {
            userId: item.userId,
            roomId: item.roomId,
            checkIn: item.checkIn,
            checkOut: item.checkOut,
            totalPrice,
          },
        });

        await tx.room.update({
          where: { id: item.roomId },
          data: { status: 'booked' },
        });

        createdBookings.push(booking);
      }

      // clear the cart after successful checkout
      await tx.cartItem.deleteMany({ where: { userId } });

      return createdBookings;
    });

    res.status(201).json({ message: 'Checkout successful', bookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;