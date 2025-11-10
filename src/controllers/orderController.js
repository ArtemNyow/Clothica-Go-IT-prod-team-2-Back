import {
  createOrderService,
  getUserOrdersService,
  getAllOrdersService,
  updateOrderStatusService,
} from '../services/orderService.js';

export const createOrderController = async (req, res, next) => {
  try {
    const sessionId = req.header('x-session-id'); // для гостей
    const user = req.user || null;

    const result = await createOrderService({
      body: req.body,
      user,
      sessionId,
    });

    res.status(201).json({
      message: 'Order created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserOrdersController = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const orders = await getUserOrdersService({
      userId,
      query: req.query,
    });

    res.status(200).json({
      message: 'Orders retrieved successfully',
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllOrdersController = async (req, res, next) => {
  try {
    const result = await getAllOrdersService(req.query);

    res.status(200).json({
      message: 'All orders retrieved successfully',
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatusController = async (req, res, next) => {
  try {
    const result = await updateOrderStatusService(
      req.params.id,
      req.body.status,
    );

    res.status(200).json({
      message: 'Статус замовлення оновлено',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
