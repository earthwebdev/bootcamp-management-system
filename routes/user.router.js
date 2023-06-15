import express from "express";

import {registerUser, loginUser, forgetPassword, logoutUser, userProfileMe} from '../controllers/users.controll.js';
import {authMiddleware} from '../middlewares/auth.middleware.js'

const router = express.Router();

router.post('/login', loginUser)

router.post('/register', registerUser);

//jwt token to undefined
router.patch('/logout',authMiddleware, logoutUser);

////send auth token // get current user details from auth token and send a response to user
router.get('/user/me', authMiddleware, userProfileMe);

router.post('/updateDetails', registerUser);

router.post('/updatePassword', registerUser);

router.post('/forgotpassword', forgetPassword);

router.post('/resetPassword/:resettoken', registerUser);


export default router;