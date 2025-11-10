import createHttpError from 'http-errors';
import { Order } from '../models/order.js';
import { ORDER_STATUS, STATUS } from '../constants/status.js';

const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

export const createOrder = async (req, res, next) => {
  const sessionId = req.header('x-session-id');
  const userId = req.user?._id;
  const { shippingInfo } = req.body;

  // const cart = await Cart.findOne({
  //   $or: [{ sessionId }, { userId }],
  // }).populate('items.goodId');

  // if (!cart || cart.items.length === 0) {
  //   next(createHttpError(400, 'Cart is empty'));
  //   return;
  // }

  // const subtotal = cart.items.reduce((sum, item) => {
  //   return sum + item.price * item.qty;
  // }, 0);

  const shipping = subtotal >= 1000 ? 0 : 50;
  const total = subtotal + shipping;

  // const order = await Order.create({
  //   orderNumber: generateOrderNumber(), // Генеруємо унікальний номер
  //   userId: userId || null,
  //   items: cart.items.map((item) => ({
  //     goodId: item.goodId._id,
  //     size: item.size,
  //     qty: item.qty,
  //     price: item.price,
  //   })),
  //   shippingInfo,
  //   totals: {
  //     subtotal,
  //     shipping,
  //     total,
  //   },
  //   status: STATUS.IN_PROGRESS,
  // });

  // cart.items = [];
  // await cart.save();

  await order.populate('items.goodId');

  res.status(201).json({
    message: 'Order created successfully',
    data: order,
  });
};

export const getUserOrders = async (req, res) => {
  const userId = req.user.userId;

  const orders = await Order.find({ userId })
    .populate('items.goodId')
    .sort({ createdAt: -1 });

  res.status(200).json({
    message: 'Orders retrieved successfully',
    data: orders,
  });
};

export const updateOrderStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!ORDER_STATUS.includes(status)) {
    next(
      createHttpError(
        400,
        `Невірний статус. Допустимі: ${ORDER_STATUS.join(', ')}`,
      ),
    );
    return;
  }

  const order = await Order.findById(id).populate('items.goodId');

  if (!order) {
    next(createHttpError(404, 'Замовлення не знайдено'));
    return;
  }

  order.status = status;
  await order.save();

  res.status(200).json({
    message: 'Статус замовлення оновлено',
    data: order,
  });
};

export const getAllOrders = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  const ordersQuery = Order.find();

  if (status) {
    ordersQuery.where('status').equals(status);
  }

  const [totalOrders, orders] = await Promise.all([
    ordersQuery.clone().countDocuments(),
    ordersQuery
      .populate('items.goodId')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
  ]);

  const totalPages = Math.ceil(totalOrders / limit);
  res.status(200).json({
    message: 'All orders retrieved successfully',
    page: Number(page),
    perPage: Number(limit),
    totalOrders,
    totalPages,
    data: orders,
  });
};
