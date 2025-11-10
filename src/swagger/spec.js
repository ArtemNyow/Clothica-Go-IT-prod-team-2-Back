// src/swagger/spec.js
const spec = {
  openapi: '3.0.3',
  info: {
    title: 'Shop API',
    version: '1.2.0',
    description:
      'API for Auth, Users, Orders, Goods, Categories, Feedbacks.\n' +
      'Усі шляхи мають префікс /api, а методи й формати відповідають контролерам.',
  },
  servers: [
    {
      url: 'https://clothica-go-it-prod-team-2-back.onrender.com',
      description: 'render',
    },
  ],
  tags: [
    { name: 'Auth' },
    { name: 'Users' },
    { name: 'Orders' },
    { name: 'Goods' },
    { name: 'Categories' },
    { name: 'Feedbacks' },
    { name: 'Subscriptions' },
  ],
  paths: {
    // ===== AUTH =====
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register new user (phone + password + name)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuthRegisterByPhone' },
              examples: {
                register: {
                  value: {
                    phone: '380991112233',
                    password: 'P@ssw0rd1',
                    name: 'Vlad',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description:
              'User created. Cookies sessionId/accessToken/refreshToken будуть встановлені через Set-Cookie.',
            headers: {
              'Set-Cookie': {
                schema: { type: 'string' },
                description:
                  'sessionId, accessToken, refreshToken (httpOnly). Установлюється в відповіді.',
              },
            },
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          400: {
            description: 'Phone in use / validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login by phone + password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuthLoginByPhone' },
              examples: {
                login: {
                  value: { phone: '380991112233', password: 'P@ssw0rd1' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'OK (cookies re-set)',
            headers: {
              'Set-Cookie': {
                schema: { type: 'string' },
                description: 'sessionId, accessToken, refreshToken (httpOnly).',
              },
            },
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          401: {
            description: 'User not found / Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout and clear cookies',
        responses: { 204: { description: 'No Content (cookies cleared)' } },
      },
    },
    '/api/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh session using cookies (sessionId + refreshToken)',
        responses: {
          200: {
            description: 'Session refreshed',
            headers: {
              'Set-Cookie': {
                schema: { type: 'string' },
                description: 'sessionId, accessToken, refreshToken (httpOnly).',
              },
            },
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthMessage' },
                examples: { ok: { value: { message: 'Session refreshed' } } },
              },
            },
          },
          401: {
            description: 'Session not found / token expired',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },

    // ===== ORDERS =====
    '/api/orders': {
      post: {
        tags: ['Orders'],
        summary: 'Create order from cart (uses x-session-id or req.user)',
        parameters: [
          {
            name: 'x-session-id',
            in: 'header',
            required: false,
            schema: { type: 'string' },
            description: 'Session identifier to bind anonymous cart',
          },
        ],
        responses: {
          200: {
            description: 'Order created and cart emptied',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { data: { $ref: '#/components/schemas/Order' } },
                },
              },
            },
          },
          400: {
            description: 'Cart empty',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          401: {
            description: 'Unauthorized (if required by middleware)',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },

    // ===== GOODS =====
    '/api/goods': {
      get: {
        tags: ['Goods'],
        summary: 'Get goods list with filters & pagination',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', minimum: 1, default: 1 },
          },
          {
            name: 'perPage',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 50, default: 10 },
          },
          {
            name: 'category',
            in: 'query',
            schema: { type: 'string', format: 'objectId' },
          },
          {
            name: 'size',
            in: 'query',
            schema: {
              oneOf: [
                { type: 'string' },
                { type: 'array', items: { type: 'string' } },
              ],
            },
            description: 'size=S або size=S&size=M',
          },
          {
            name: 'gender',
            in: 'query',
            schema: { type: 'string', enum: ['male', 'female', 'unisex'] },
          },
          {
            name: 'minPrice',
            in: 'query',
            schema: { type: 'number', minimum: 0 },
          },
          {
            name: 'maxPrice',
            in: 'query',
            schema: { type: 'number', minimum: 0 },
          },
        ],
        responses: {
          200: {
            description: 'Paged goods list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    page: { type: 'integer' },
                    perPage: { type: 'integer' },
                    totalGoods: { type: 'integer' },
                    totalPages: { type: 'integer' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Good' },
                    },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
    '/api/goods/{goodId}': {
      get: {
        tags: ['Goods'],
        summary: 'Get good by id',
        parameters: [
          {
            name: 'goodId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'objectId' },
          },
        ],
        responses: {
          200: {
            description: 'Good',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Good' },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
          400: { $ref: '#/components/responses/BadRequest' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },

    // ===== CATEGORIES =====
    '/api/categories': {
      get: {
        tags: ['Categories'],
        summary: 'Get categories (aggregated from goods)',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', minimum: 1, default: 1 },
          },
          {
            name: 'perPage',
            in: 'query',
            schema: { type: 'integer', minimum: 1, default: 10 },
          },
        ],
        responses: {
          200: {
            description: 'Paged categories summary',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    page: { type: 'integer' },
                    perPage: { type: 'integer' },
                    total: { type: 'integer' },
                    totalPages: { type: 'integer' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/CategorySummary' },
                    },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },

    // ===== FEEDBACKS =====
    '/api/feedbacks': {
      get: {
        tags: ['Feedbacks'],
        summary: 'Get feedbacks for product',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', minimum: 1, default: 1 },
          },
          {
            name: 'perPage',
            in: 'query',
            schema: { type: 'integer', minimum: 1, default: 3 },
          },
          {
            name: 'goodId',
            in: 'query',
            required: true,
            schema: { type: 'string', format: 'objectId' },
            description: 'Good ObjectId',
          },
        ],
        responses: {
          200: {
            description: 'Paged feedbacks for product',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    page: { type: 'integer' },
                    perPage: { type: 'integer' },
                    totalFeedbacks: { type: 'integer' },
                    totalPages: { type: 'integer' },
                    feedbacks: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Feedback' },
                    },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
      post: {
        tags: ['Feedbacks'],
        summary: 'Create feedback',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/FeedbackCreate' },
            },
          },
        },
        responses: {
          201: {
            description: 'Created feedback',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Feedback' },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          404: { $ref: '#/components/responses/NotFound' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },

    // ===== SUBSCRIPTIONS =====
    '/api/subscriptions': {
      post: {
        tags: ['Subscriptions'],
        summary: 'Create new email subscription',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SubscriptionCreate' },
              examples: {
                subscription: { value: { email: 'example@mail.com' } },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Subscription created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Subscription' },
                examples: {
                  ok: {
                    value: {
                      message:
                        'Дякуємо за підписку! Ви будете в курсі всіх новин та акцій',
                      data: {
                        _id: '671a8a4b7f6b9a001234abc1',
                        email: 'example@mail.com',
                      },
                    },
                  },
                },
              },
            },
          },
          409: {
            description: 'Email already subscribed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
  },

  components: {
    schemas: {
      ObjectId: {
        type: 'string',
        description: 'Mongo ObjectId',
        example: '671a8a4b7f6b9a001234abcd',
      },
      Currency: {
        type: 'string',
        description: 'Currency code from CURRENCIES',
        example: 'грн',
      },
      Price: {
        type: 'object',
        properties: {
          value: { type: 'number', minimum: 0 },
          currency: { $ref: '#/components/schemas/Currency' },
        },
        required: ['value', 'currency'],
      },

      // ---- Auth / Users
      User: {
        type: 'object',
        properties: {
          _id: { $ref: '#/components/schemas/ObjectId' },
          firstName: { type: 'string', nullable: true },
          lastName: { type: 'string', nullable: true },
          email: { type: 'string', nullable: true },
          phone: { type: 'number', example: '380991112233' },
          createdAt: { type: 'string', format: 'date-time', nullable: true },
          updatedAt: { type: 'string', format: 'date-time', nullable: true },
        },
        required: ['_id', 'phone'],
      },

      AuthRegisterByPhone: {
        type: 'object',
        properties: {
          phone: {
            type: 'Number',
            description: 'Digits only. Example: 380991112233',
          },
          password: { type: 'Number', minLength: 8 },
          name: { type: 'string' },
        },
        required: ['phone', 'password', 'name'],
      },
      AuthLoginByPhone: {
        type: 'object',
        properties: {
          phone: {
            type: 'Number',
            description: 'Digits only. Example: 380991112233',
          },
          password: { type: 'string' },
        },
        required: ['phone', 'password'],
      },
      AuthMessage: {
        type: 'object',
        properties: { message: { type: 'string' } },
      },

      // ---- Orders
      OrderItem: {
        type: 'object',
        properties: {
          goodId: { $ref: '#/components/schemas/ObjectId' },
          qty: { type: 'integer', minimum: 1 },
          price: { $ref: '#/components/schemas/Price' },
          size: { type: 'string' },
        },
        required: ['goodId', 'qty', 'price'],
      },
      OrderTotals: {
        type: 'object',
        properties: {
          subtotal: { type: 'number' },
          shipping: { type: 'number' },
          total: { type: 'number' },
        },
        required: ['subtotal', 'shipping', 'total'],
      },
      Order: {
        type: 'object',
        properties: {
          _id: { $ref: '#/components/schemas/ObjectId' },
          userId: { $ref: '#/components/schemas/ObjectId' },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/OrderItem' },
          },
          totals: { $ref: '#/components/schemas/OrderTotals' },
          status: { type: 'string', example: 'created' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },

      // ---- Domain
      Good: {
        type: 'object',
        properties: {
          _id: { $ref: '#/components/schemas/ObjectId' },
          name: { type: 'string' },
          category: { $ref: '#/components/schemas/ObjectId' },
          image: { type: 'string' },
          price: { $ref: '#/components/schemas/Price' },
          size: { type: 'array', items: { type: 'string' } },
          description: { type: 'string' },
          feedbacks: {
            type: 'array',
            items: { $ref: '#/components/schemas/ObjectId' },
            nullable: true,
          },
          prevDescription: { type: 'string', nullable: true },
          gender: {
            type: 'string',
            enum: ['male', 'female', 'unisex'],
            nullable: true,
          },
        },
        required: ['_id', 'name', 'category', 'price'],
      },

      CategorySummary: {
        type: 'object',
        properties: {
          _id: { $ref: '#/components/schemas/ObjectId' },
          name: { type: 'string' },
          totalGoods: { type: 'integer' },
        },
        required: ['_id', 'name', 'totalGoods'],
      },

      Feedback: {
        type: 'object',
        properties: {
          _id: { $ref: '#/components/schemas/ObjectId' },
          goodId: { $ref: '#/components/schemas/ObjectId' },
          author: { type: 'string' },
          description: { type: 'string' },
          date: { type: 'string', format: 'date-time' },
        },
        required: ['_id', 'goodId', 'author', 'description', 'date'],
      },
      FeedbackCreate: {
        type: 'object',
        properties: {
          goodId: { $ref: '#/components/schemas/ObjectId' },
          author: { type: 'string' },
          description: { type: 'string' },
        },
        required: ['goodId', 'author', 'description'],
      },

      // ---- Subscriptions
      Subscription: {
        type: 'object',
        properties: {
          _id: { $ref: '#/components/schemas/ObjectId' },
          email: { type: 'string', format: 'email' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['_id', 'email'],
      },
      SubscriptionCreate: {
        type: 'object',
        properties: { email: { type: 'string', format: 'email' } },
        required: ['email'],
      },

      // ---- Common
      Error: {
        type: 'object',
        properties: { message: { type: 'string' } },
      },
    },

    responses: {
      ServerError: { description: 'Internal server error' },
      BadRequest: { description: 'Bad request' },
      NotFound: { description: 'Not found' },
    },
  },
};

export default spec;
