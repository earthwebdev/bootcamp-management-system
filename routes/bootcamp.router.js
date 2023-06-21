import express from "express";
import { getBootcamp, addBootcamp, deleteBootcamp, updateBootcamp } from "../controllers/bootcamps.controller.js";
import {authMiddleware, authorize} from '../middlewares/auth.middleware.js';
import upload from "../middlewares/multer.middleware.js";
import { filteredResults } from "../middlewares/filterdResults.middleware.js";
import Bootcamp from "../models/bootcamps.model.js";


const router = express.Router();

router.get('', authMiddleware, filteredResults(Bootcamp), getBootcamp);

router.post('', authMiddleware, authorize('publisher', 'admin'), upload.single('photo'), addBootcamp);

router.patch('/:id', authMiddleware, authorize('publisher', 'admin'), upload.single('photo'), updateBootcamp);

router.delete('/:id', authMiddleware, authorize('publisher', 'admin'), deleteBootcamp);

export default router;