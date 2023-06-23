import express from "express";
import { addCourse, getCourses, updateCourse, deleteCourse } from "../controllers/courses.controller.js";
import {authMiddleware, authorize} from '../middlewares/auth.middleware.js'
import { filteredResults } from "../middlewares/filterdResults.middleware.js";
import CourseModel from '../models/courses.model.js';
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - duration
 *         - minimumSkill
 *         - content
 *         - bootcamp
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the course
 *         title:
 *           type: string
 *           description: The title of your course
 *         description:
 *           type: string
 *           description: The course description
 *         duration:
 *           type: string
 *           description: The course completed time duration
 *         minimumSkill:
 *           type: string           
 *           enum: ['fresher','junior','beginner', 'intermediate', 'advanced']    
 *           description: The course minimum Skill
 *         content:
 *           type: [string]
 *           array: ["content 1"]
 *           description: The course content in array
 *         scholarshipAvailable:
 *           type: boolean
 *           description: The course scholarship available
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the course was added
 *       example:
 *         id: d5fE_asz
 *         title: The course title
 *         description: course description
 *         duration: 15
 *         minimumSkill: ['fresher','junior','beginner', 'intermediate', 'advanced']
 *         content: ['content goes heres']
 *         scholarshipAvailable: true
 *         bootcamp: bootcampid
 *         createdAt: 2020-03-10T04:05:06.157Z
 */

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: The courses managing API
 * /courses:
 *   get:
 *     summary: Lists all the courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: The list of the courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: Course created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       401:
 *         description: Unauthorised user
 *       404:
 *         description: No bootcamp found
 *       403:
 *         description: Unable to create Course.
 * /courses/{id}:
 *   get:
 *     summary: Get the course by id
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The course id
 *     responses:
 *       200:
 *         description: The course response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: The course was not found
 *   patch:
 *    summary: Update the course by the id
 *    tags: [Courses]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The course id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Course'
 *    responses:
 *      200:
 *        description: Course updated successfully.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Course'
 *      401:
 *        description: You are not authorized to access this resource.
 *      400:
 *        description: No course found.
 *      500:
 *        description: Some error happened
 *   delete:
 *     summary: Remove the course by id
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The course id
 *
 *     responses:
 *       200:
 *         description: Course deleted successfully.
 *       404:
 *         description: The course was not found
  *      400:
 *        description: No course found.
  *      401:
 *        description: No authorize user to delete this review.
 */


router.get('/', authMiddleware, filteredResults(CourseModel), getCourses);
router.post('/', authMiddleware, authorize('publisher', 'admin'), addCourse);

router.patch('/:id', authMiddleware, authorize('publisher', 'admin'), updateCourse);

router.delete('/:id', authMiddleware, authorize('publisher', 'admin'), deleteCourse);


export default router;