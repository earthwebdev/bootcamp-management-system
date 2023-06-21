import express from "express";
import { addCourse, getCourses, updateCourse, deleteCourse } from "../controllers/courses.controller.js";
import {authMiddleware, authorize} from '../middlewares/auth.middleware.js'
import { filteredResults } from "../middlewares/filterdResults.middleware.js";
import CourseModel from '../models/courses.model.js';
const router = express.Router();

/* router.get('/', (req, res) => {
    res.send('course');
}) */
router.get('/', authMiddleware, filteredResults(CourseModel), getCourses);
router.post('/:bootcampid', authMiddleware, authorize('publisher', 'admin'), addCourse);

router.patch('/:id', authMiddleware, authorize('publisher', 'admin'), updateCourse);

router.delete('/:id', authMiddleware, authorize('publisher', 'admin'), deleteCourse);


export default router;