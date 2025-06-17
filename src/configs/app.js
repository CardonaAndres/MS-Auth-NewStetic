import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import AuthRouter from '../auth/routes/auth.routes.js';
import { errorHandler } from '../middlewares/errorHandler.js';

const app = express();

app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser(String(process.env.COOKIE_SECRET)));
app.use(morgan('dev'));

app.use('/API/v1/auth', AuthRouter);

app.use(errorHandler);

export default app;