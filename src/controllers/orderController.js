import { Order } from '../models/order.js';
import { User } from '../models/user.js';

const generateOrderNumber = async () => {
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const count = await Order.countDocuments();
  return `№${date}${(count + 1).toString().padStart(3, '0')}`;
};

export const createOrderController = async (req, res, next) => {
  try {
    const { items, shippingInfo } = req.body;
    const user = req.user || null;
    const sessionId = req.header('x-session-id');

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ message: 'Не вказано товари для замовлення' });
    }

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );
    const shipping = subtotal >= 1000 ? 0 : 50;
    const total = subtotal + shipping;
    const orderNumber = await generateOrderNumber();

    const orderData = {
      userId: user?._id || null,
      guestSession: user ? null : sessionId || null,
      orderNumber,
      items,
      shippingInfo,
      totals: { subtotal, shipping, total },
    };

    if (!user) {
      const existingUser = await User.findOne({ phone: shippingInfo.phone });
      if (existingUser) {
        orderData.userId = existingUser._id;
        orderData.guestSession = null;
        if (sessionId) {
          await Order.updateMany(
            {
              guestSession: sessionId,
              'shippingInfo.phone': shippingInfo.phone,
            },
            { $set: { userId: existingUser._id, guestSession: null } },
          );
        }
      }
    }

    const order = await Order.create(orderData);
    await order.populate('items.goodId');

    res
      .status(201)
      .json({ message: 'Order created successfully', data: order });
  } catch (err) {
    next(err);
  }
};

export const getUserOrdersController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const ordersQuery = Order.find({ userId })
      .populate('items.goodId')
      .sort({ createdAt: -1 });
    const [totalOrders, orders] = await Promise.all([
      ordersQuery.clone().countDocuments(),
      ordersQuery.skip(skip).limit(Number(limit)),
    ]);

    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({
      message: 'Orders retrieved successfully',
      page: Number(page),
      perPage: Number(limit),
      totalOrders,
      totalPages,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllOrdersController = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const ordersQuery = Order.find();
    if (status) ordersQuery.where('status').equals(status);

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
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatusController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id).populate('items.goodId');
    if (!order)
      return res.status(404).json({ message: 'Замовлення не знайдено' });

    order.status = status;
    await order.save();

    res
      .status(200)
      .json({ message: 'Статус замовлення оновлено', data: order });
  } catch (err) {
    next(err);
  }
};
