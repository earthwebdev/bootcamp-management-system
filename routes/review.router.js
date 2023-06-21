import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getReviews, createReview, updateReview, deleteReview } from '../controllers/reviews.controller.js';
import { filteredResults } from "../middlewares/filterdResults.middleware";
import ReviewModel from "../models/reviews.model";

const router = express.Router();

/* router.get('/', (req, res) => {
    res.send('review');
}) */

router.get('', authMiddleware, filteredResults(ReviewModel), getReviews);

router.post('/', authMiddleware, createReview);

router.patch('/:id', authMiddleware, updateReview);

router.delete('/:id', authMiddleware, deleteReview);


export default router;