import express from "express";
import { getBootcamp } from "../controllers/bootcamps.controller.js";
import {authMiddleware} from '../middlewares/auth.middleware.js'


const router = express.Router();

router.get('', authMiddleware, getBootcamp)


export default router;