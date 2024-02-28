import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

const corsOptions = {
    origin: 'https://airbnb-saswat.vercel.app',
    credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

//middlerwares
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public')); // public assets for storing files
app.use(cookieParser());


// Proxy requests to external API
app.use('/api/v1/users', createProxyMiddleware({
    target: 'https://vercel-server-puce.vercel.app/', // Change this to the actual URL of your external API
    changeOrigin: true,
    pathRewrite: {
      '^/api/v1/users': '', // Remove the '/api/v1/users' prefix
    },
  }));

//routes importing
import userRouter from './routes/user.routes.js';

//routes declaration
app.use('/api/v1/users', userRouter); // http://localhost:8000/api/v1/users/register

export { app };
