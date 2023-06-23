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
 *        type: object
 *        required:
 *          - name
 *          - description
 *          - careers
 *          - averageCost
 *        properties:
 *          id:
 *            type: string
 *            description: The id of the book
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
 *            description: The average cost of the bootcamp
 *          Photo:
 *            type: string
 *            format: binary
 *            description: The photo of the bootcamp
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
 *          photo: abc.jpg
 */ 

router.get('', authMiddleware, filteredResults(Bootcamp), getBootcamp);
/**
 * @swagger
 *  /bootcamps:
 *   post:
 *     tags:
 *       - Bootcamps
 *     summary: Create a bootcamp
 *     requestBody:
 *      required: true
 *      content:
 *       multipart/form-data:
 *         schema:
 *           $ref: '#/components/schemas/Bootcamp'
 *     responses:
 *       '200':
 *         description: Bootcamp created successfully.
 *       '401':
 *         description: You are not authorie to access this resource
 *       '403':
 *         description: Unable to create bootcamp.
 *                   
 */
router.post('', authMiddleware, authorize('publisher', 'admin'), upload.single('photo'), addBootcamp);

/**
 * @swagger
 *  /bootcamps:
 *   patch:
 *     tags:
 *       - Bootcamps
 *     summary: Update a bootcamp
 *     requestBody:
 *      required: true
 *      content:
 *       multipart/form-data:
 *         schema:
 *           $ref: '#/components/schemas/Bootcamp'
  *     responses:
 *       '200':
 *         description: Bootcamp updated successfully.
 *       '401':
 *         description: You are not authorie to access this resource
 *       '403':
 *         description: No bootcamp found.
 *                   
 */
router.patch('/:id', authMiddleware, authorize('publisher', 'admin'), upload.single('photo'), updateBootcamp);

/**
 * @swagger
 *   /bootcamps/{id}:
 *    delete:
 *     tags:
 *       - Bootcamps
 *     summary: Delete a bootcamp  
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: string
 *         required:
 *           - id
 *         description: The bootcamp id 
 *     responses:
 *       '200':
 *         description: Bootcamp deleted successfully.
 *       '401':
 *         description: No authorize user to delete this bootcamp.
 *       '400':
 *         description: No bootcamp found.
 *                   
 */
router.delete('/:id', authMiddleware, authorize('publisher', 'admin'), deleteBootcamp);

export default router;