import express from "express";
import { getBootcamp, addBootcamp } from "../controllers/bootcamps.controller.js";
import {authMiddleware, authorize} from '../middlewares/auth.middleware.js';
import upload from "../middlewares/multer.middleware.js";


const router = express.Router();

router.get('', authMiddleware, getBootcamp)

router.post('', authMiddleware, authorize('publisher', 'admin'), upload.single('photo'), addBootcamp)


export default router;