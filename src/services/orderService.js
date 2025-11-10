import createHttpError from 'http-errors';
import { Order } from '../models/order.js';
import { User } from '../models/user.js';
import { ORDER_STATUS } from '../constants/status.js';

export const createOrderService = async ({ body, user, sessionId }) => {
  const { items, shippingInfo } = body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw createHttpError(400, 'Список товарів не може бути порожнім');
  }

  // 1. Якщо юзер авторизований — все просто
  let userId = user?._id || null;

  // 2. Якщо не авторизований, але телефон є у базі
  if (!userId) {
    const existUser = await User.findOne({ phone: shippingInfo.phone });
    if (existUser) {
      userId = existUser._id;
    }
  }

  // 3. Підрахунок totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= 1000 ? 0 : 50;
  const total = subtotal + shipping;

  // 4. Створюємо замовлення
  const order = await Order.create({
    userId: userId || null,
    items,
    shippingInfo,
    totals: { subtotal, shipping, total },
    status: ORDER_STATUS[0],
    guestSession: sessionId || null,
  });

  await order.populate('items.goodId');

  return order;
};

export const getUserOrdersService = async ({ userId }) => {
  const orders = await Order.find({ userId })
    .populate('items.goodId')
    .sort({ createdAt: -1 });

  return orders;
};

export const getAllOrdersService = async (query) => {
  const { status, page = 1, limit = 20 } = query;
  const skip = (page - 1) * limit;

  const filter = {};
  if (status) filter.status = status;

  const [totalOrders, orders] = await Promise.all([
    Order.countDocuments(filter),
    Order.find(filter)
      .populate('items.goodId')
      .populate('userId', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
  ]);

  return {
    page: Number(page),
    perPage: Number(limit),
    totalOrders,
    totalPages: Math.ceil(totalOrders / limit),
    data: orders,
  };
};

export const updateOrderStatusService = async (orderId, status) => {
  if (!ORDER_STATUS.includes(status)) {
    throw createHttpError(
      400,
      `Невірний статус. Допустимі: ${ORDER_STATUS.join(', ')}`,
    );
  }

  const order = await Order.findById(orderId).populate('items.goodId');
  if (!order) {
    throw createHttpError(404, 'Замовлення не знайдено');
  }

  order.status = status;
  await order.save();

  return order;
};
