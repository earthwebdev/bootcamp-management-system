import express from "express";
import bootcampRouter from './bootcamp.router.js';
import coursesRouter from './course.router.js';
import reviewsRouter from './review.router.js';
import userRouter   from './user.router.js';
import swaggerRouter   from './swagger.router.js';

const router = express.Router();

router.use('/bootcamps', bootcampRouter);
router.use('/users', userRouter);
router.use('/courses', coursesRouter);
router.use('/reviews', reviewsRouter);
router.use('/swagger', swaggerRouter);

export default router;