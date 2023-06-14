import express from "express";
import bootcampRouter from './bootcamp.router.js';
import coursesRouter from './course.router.js';
import reviewsRouter from './review.router.js';
import userRouter   from './user.router.js';

const router = express.Router();

router.use('/bootcamps', bootcampRouter);
router.use('/users', userRouter);
router.use('/courses', coursesRouter);
router.use('/reviews', reviewsRouter);

export default router;