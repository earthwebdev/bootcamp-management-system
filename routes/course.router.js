import express from "express";
import { addCourse, getCourses } from "../controllers/courses.controller.js";

const router = express.Router();

router.get('/', (req, res) => {
    res.send('course');
})
router.get('/:bootcampId', getCourses);
router.post('/:bootcampId', addCourse);


export default router;