import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
    res.send('course');
})


export default router;