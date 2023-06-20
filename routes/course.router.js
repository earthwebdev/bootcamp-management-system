import express from "express";
import { addCourse, getCourses } from "../controllers/courses.controller.js";
import {authMiddleware, authorize} from '../middlewares/auth.middleware.js'
import querypagination from "../middlewares/querypagination.middleware.js";
import courseModel from '../models/courses.model.js';
import BootcampModel from '../models/bootcamps.model.js';
const router = express.Router();

router.get('/', (req, res) => {
    res.send('course');
})
router.get('/:bootcampid', authMiddleware, querypagination(courseModel, BootcampModel, 'bootcampid'), getCourses);
router.post('/:bootcampid', authMiddleware, authorize('publisher', 'admin'), addCourse);


export default router;