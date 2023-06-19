import express from "express";
import { addCourse, getCourses } from "../controllers/courses.controller.js";
import {authMiddleware, authorize} from '../middlewares/auth.middleware.js'

const router = express.Router();

router.get('/', (req, res) => {
    res.send('course');
})
router.get('/:bootcampid', authMiddleware, getCourses);
router.post('/:bootcampid', authMiddleware, authorize('publisher', 'admin'), addCourse);


export default router;