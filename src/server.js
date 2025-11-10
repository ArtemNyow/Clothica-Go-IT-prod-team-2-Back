// src/server.js
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import categoryRoutes from './routes/categoryRoutes.js';
import authRouter from './routes/authRoutes.js';
import goodRoutes from './routes/goodRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import userRoutes from './routes/userRoutes.js';
import swaggerUi from 'swagger-ui-express';
import spec from './swagger/spec.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(logger);
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(cookieParser());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec));

app.use(authRouter);
app.use(categoryRoutes);
app.use(goodRoutes);
app.use(feedbackRoutes);
app.use(orderRoutes);
app.use(subscriptionRoutes);
app.use(userRoutes);

app.use(notFoundHandler);

app.use(errors());

app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
