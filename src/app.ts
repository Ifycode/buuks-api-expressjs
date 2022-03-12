import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
// import cors from 'cors';
import { router as appRouter } from './api/routes/app.route';
import { router as bookRouter } from './api/routes/book.route';
import { router as userRouter } from './api/routes/user.route'
import { router as sessionRouter } from './api/routes/session.route';
import deserializeUser from './middleware/deserializeUser';
import { cloudinaryConfig } from './config/cloudinary';
import { resolve } from 'path';
//import multer from 'multer';

dotenv.config();

const app: Express = express();

//const upload = multer();

app.use(morgan('dev'));
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());

// for parsing and fixing multipart/form-data error (postman)
//app.use(upload.any());

// app.use(express.static(resolve(__dirname, 'src/public')));

//app.use(cors({ origin: `http://localhost:${process.env.CLIENT_PORT}` }));

app.use('*', cloudinaryConfig);

// Ensures deserializeUser middleware is called on every single route
app.use(deserializeUser);

//======== Routes ==========
app.use('/', appRouter);
app.use('/users', userRouter);
app.use('/sessions', sessionRouter);
app.use('/books', bookRouter);
//==========================

interface Error {
  status?: number;
  message: string;
}

app.use((req: Request, res: Response, next: NextFunction) => {
  const err: Error = new Error('Route not found!');
  err.status = 404;
  next(err);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

export { app };
