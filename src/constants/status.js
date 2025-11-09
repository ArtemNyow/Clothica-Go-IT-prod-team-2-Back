// export const ORDER_STATUS = ['created', 'paid', 'delivered', 'cancelled'];



export const STATUS = {
  IN_PROGRESS: 'У процесі',
  PACKING: 'Комплектується',
  COMPLETED: 'Виконано',
  CANCELLED: 'Скасовано',
};

export const ORDER_STATUS = Object.values(STATUS);
