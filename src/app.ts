import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import routes from './routes';
import authRoutes from './routes/authRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import openApiDocument from './docs/openapi';
import { env } from './config/env';
import { authenticateRequest } from './middleware/authMiddleware';

const app = express();

app.use(
  cors({
    origin: env.clientOrigin === '*' ? true : env.clientOrigin,
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use(authenticateRequest);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

