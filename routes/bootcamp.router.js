import express from "express";
import { getBootcamp, addBootcamp, deleteBootcamp, updateBootcamp } from "../controllers/bootcamps.controller.js";
import {authMiddleware, authorize} from '../middlewares/auth.middleware.js';
import upload from "../middlewares/multer.middleware.js";
import { filteredResults } from "../middlewares/filterdResults.middleware.js";
import Bootcamp from "../models/bootcamps.model.js";


const router = express.Router();

/**
 *  @swagger
 *  components:
 *    schemas:
 *      Bootcamp:
 *        type: Object
 *        required:
 *          - name
 *          - description
 *          - careers
 *          - averageCost
 *        properties:
 *          name:
 *            type: String
 *            description: The name of the bootcamp
 *          description:
 *            type: String
 *            description: The description of the bootcamp
 *          website:
 *            type: String
 *            description: The website of the bootcamp
 *          phone:
 *            type: number
 *            description: The phone of the bootcamp
 *          email:
 *            type: number
 *            description: The email of the bootcamp
 *          address:
 *            type: number
 *            description: The address of the bootcamp
 *          careers:
 *            type: Array
 *            description: The available careers of the bootcamp
 *          averageRatomg:
 *            type: number
 *            description: The cost of the bootcamp
 *          averageCost:
 *            type: Array
 *            description: The available careers of the bootcamp
 *          Photo:
 *            type: string
 *            format: binary
 *            description: The available careers of the bootcamp
 *        example:
 *          name: bootcamp 1
 *          description: Bootcamp 1 description
 *          website: http://google.com
 *          phone: 0123456789
 *          email: foo@bar.com
 *          addres: patan
 *          careers: ["web development"]
 *          averageRating: 5
 *          averageCost: 5000
 *          photo: file select field
 */ 

router.get('', authMiddleware, filteredResults(Bootcamp), getBootcamp);
/**
 * @swagger
 *  /bootcamps:
 *   post:
 *     tags:
 *       - Bootcamp
 *     summary: Register a user.
 *     requestBody:
 *      required: true
 *      content:
 *       multipart/form-data:
 *         schema:
 *           $ref: '#/components/schemas/Bootcamp'
 *     responses:
 *       '200':
 *         description: User found and logged in successfully
 *       '401':
 *         description: Bad username, not found in db
 *       '403':
 *         description: Username and password don't match
 *                   
 */
router.post('', authMiddleware, authorize('publisher', 'admin'), upload.single('photo'), addBootcamp);

router.patch('/:id', authMiddleware, authorize('publisher', 'admin'), upload.single('photo'), updateBootcamp);

router.delete('/:id', authMiddleware, authorize('publisher', 'admin'), deleteBootcamp);

export default router;