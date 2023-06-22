import express from "express";

import {registerUser, loginUser, forgetPassword, logoutUser, userProfileMe, resetPassword,
     usersListsForAdmin, getUserByUserId, CreateUserByAdmin, updateUserByAdmin, deleteUserByAdmin} from '../controllers/users.controll.js';
import {authMiddleware, authorize} from '../middlewares/auth.middleware.js'

const router = express.Router();

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *       - Users
 *     name: Login
 *     summary: Logs in a user
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           //$ref: '#/definitions/User'
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *               format: password
 *         required:
 *           - email
 *           - password
 *     responses:
 *       '200':
 *         description: User found and logged in successfully
 *       '401':
 *         description: Bad username, not found in db
 *       '403':
 *         description: Username and password don't match
 */
router.post('/login', loginUser)
// routes/users.js

/**
 * @swagger
 *  /users/register:
 *   post:
 *     tags:
 *       - Users
 *     summary: Register a user.
 *     requestBody:
 *      content:
 *       aplication/json:
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *           example:
 *             name: abcdef
 *             email: abc@email.com
 *             password: Abcdefg1
 *                   
 */
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
/**
 * @swagger
 * /users/resetpassword/{resettoken}:
 *   get:
 *     tags:
 *       - Users
 *     name: Reset Password Link
 *     summary: Create validation string in reset password link to verify user's allowed to reset their password
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: resettoken
 *         in: path
 *         schema:
 *           type: string
 *         required:
 *           - resettoken
 *         description: The reset password token
 *     responses:
 *       '200':
 *         description: User's password reset link is valid
 *       '403':
 *         description: Password reset link is invalid or has expired
 */
router.get('/resetpassword/:resettoken', resetPassword);

//only admin previlage
router.get('/admin',authMiddleware, authorize('admin'), usersListsForAdmin);

router.get('/admin/:userid',authMiddleware, authorize('admin'), getUserByUserId);

router.post('/admin',authMiddleware, authorize('admin'), CreateUserByAdmin);

router.patch('/admin/:userid',authMiddleware, authorize('admin'), updateUserByAdmin);

router.delete('/admin/:userid',authMiddleware, authorize('admin'), deleteUserByAdmin); 

export default router;