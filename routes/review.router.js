import express from "express";
import { authMiddleware, authorize } from "../middlewares/auth.middleware.js";
import { getReviews, createReview, updateReview, deleteReview } from '../controllers/reviews.controller.js';
import { filteredResults } from "../middlewares/filterdResults.middleware.js";
import ReviewModel from "../models/reviews.model.js";

const router = express.Router();

/* router.get('/', (req, res) => {
    res.send('review');
}) */

router.get('', authMiddleware, filteredResults(ReviewModel), getReviews);

router.post('/', authMiddleware, authorize('user'), createReview);

router.patch('/:id', authMiddleware, authorize('user'), updateReview);

router.delete('/:id', authMiddleware, authorize('user', 'publisher', 'admin'), deleteReview);


export default router;