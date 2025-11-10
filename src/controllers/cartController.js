import createHttpError from 'http-errors';
import {Cart} from '../models/cart.js';
import {Good} from '../models/good.js';


export const addToCart = async (req, res, next) => {
  const sessionId = req.header('x-session-id');
  const userId = req.user?._id;
  const { goodId, size, qty = 1 } = req.body;

  const good = await Good.findById(goodId);
  if (!good) {
    next(createHttpError(404, 'Good not found'));
    return;
  }

  if (!good.size.includes(size)) {
    next(createHttpError(400, `Size ${size} is not available for this product`));
    return;
  }

  let cart = await Cart.findOne({
    $or: [{ sessionId }, { userId }],
  });

  if (!cart) {
    cart = await Cart.create({
      userId: userId || null,
      sessionId: sessionId || null,
      items: [],
    });
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.goodId.toString() === goodId && item.size === size
  );

  if (existingItemIndex > -1) {

    cart.items[existingItemIndex].qty += qty;
  } else {

    cart.items.push({
      goodId,
      size,
      qty,
      price: good.price.value,
    });
  }

  await cart.save();
  await cart.populate('items.goodId');

  res.status(200).json({
    message: 'Item added to cart successfully',
    data: cart,
  });
};




export const getCart = async (req, res, next) => {
  const sessionId = req.header('x-session-id');
  const userId = req.user?._id;

  const cart = await Cart.findOne({
    $or: [{ sessionId }, { userId }],
  }).populate('items.goodId');

  if (!cart || cart.items.length === 0) {
    res.status(200).json({
      message: 'Cart is empty',
      data: {
        items: [],
        totals: {
          subtotal: 0,
          shipping: 0,
          total: 0,
        },
      },
    });
    return;
  }

  const subtotal = cart.items.reduce((sum, item) => {
    return sum + item.price * item.qty;
  }, 0);

  const shipping = subtotal >= 1000 ? 0 : 50;
  const total = subtotal + shipping;

  res.status(200).json({
    message: 'Cart retrieved successfully',
    data: {
      ...cart.toObject(),
      totals: {
        subtotal,
        shipping,
        total,
      },
    },
  });
};



export const updateCartItem = async (req, res, next) => {
  const sessionId = req.header('x-session-id');
  const userId = req.user?._id;
  const { goodId, size, qty } = req.body;

  const cart = await Cart.findOne({
    $or: [{ sessionId }, { userId }],
  });

  if (!cart) {
    next(createHttpError(404, 'Cart not found'));
    return;
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.goodId.toString() === goodId && item.size === size
  );

  if (itemIndex === -1) {
    next(createHttpError(404, 'Item not found in cart'));
    return;
  }

  cart.items[itemIndex].qty = qty;
  await cart.save();
  await cart.populate('items.goodId');

  res.status(200).json({
    message: 'Cart item updated successfully',
    data: cart,
  });
};



export const removeFromCart = async (req, res, next) => {
  const sessionId = req.header('x-session-id');
  const userId = req.user?._id;
  const { goodId, size } = req.body;

  const cart = await Cart.findOne({
    $or: [{ sessionId }, { userId }],
  });

  if (!cart) {
    next(createHttpError(404, 'Cart not found'));
    return;
  }

  const initialLength = cart.items.length;
  cart.items = cart.items.filter(
    (item) => !(item.goodId.toString() === goodId && item.size === size)
  );

  if (cart.items.length === initialLength) {
    next(createHttpError(404, 'Item not found in cart'));
    return;
  }

  await cart.save();
  await cart.populate('items.goodId');

  res.status(200).json({
    message: 'Item removed from cart successfully',
    data: cart,
  });
};



export const clearCart = async (req, res, next) => {
  const sessionId = req.header('x-session-id');
  const userId = req.user?._id;

  const cart = await Cart.findOne({
    $or: [{ sessionId }, { userId }],
  });

  if (!cart) {
    next(createHttpError(404, 'Cart not found'));
    return;
  }

  cart.items = [];
  await cart.save();

  res.status(200).json({
    message: 'Cart cleared successfully',
    data: cart,
  });
};
