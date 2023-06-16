import express from "express";

import {registerUser, loginUser, forgetPassword, logoutUser, userProfileMe, resetPassword,
     usersListsForAdmin, getUserByUserId, CreateUserByAdmin, updateUserByAdmin, deleteUserByAdmin} from '../controllers/users.controll.js';
import {authMiddleware, authorize} from '../middlewares/auth.middleware.js'

const router = express.Router();

router.post('/login', loginUser)

router.post('/register', registerUser);

//jwt token to undefined
router.patch('/logout',authMiddleware, logoutUser);

////send auth token // get current user details from auth token and send a response to user
router.get('/user/me', authMiddleware, userProfileMe);

router.put('/updateDetails', registerUser);

//old password to new password reset
router.put('/updatePassword', authMiddleware, registerUser);
//req.body.oldpassword / req.body.newpassword

router.put('/forgotpassword', forgetPassword);                              

router.post('/resetpassword/:resettoken', resetPassword);

//only admin previlage
router.get('/admin',authMiddleware, authorize('admin'), usersListsForAdmin);

router.get('/admin/:userid',authMiddleware, authorize('admin'), getUserByUserId);

router.post('/admin',authMiddleware, authorize('admin'), CreateUserByAdmin);

router.patch('/admin/:userid',authMiddleware, authorize('admin'), updateUserByAdmin);

router.delete('/admin/:userid',authMiddleware, authorize('admin'), deleteUserByAdmin); 

//docker
//multer
//swagger
//JEST

export default router;