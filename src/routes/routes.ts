import { Router } from 'express';
import {deleteUser, getAlluser, logout, refreshToken, registerUser, resetPassword } from '../controller/userController';
import { forgotPassword, getAlltoken, resetPasswordLink,login } from '../controller/authController';
import { authenticateJWT } from '../utils/auth.routes';
import { ValidateSchema } from '../schema/validate-schema';
import { validateRequestSchema } from '../middleware/validate-request-schema';
import { LoginSchema } from '../schema/login-schema';

const router = Router();
/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *               isActive:
 *                 type: boolean
 *                 description: Indicates if the user is active
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request. Invalid email or missing/empty password
 *       500:
 *         description: Internal server error
 */
router.post('/register',ValidateSchema,validateRequestSchema,registerUser);
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/users',authenticateJWT,getAlluser);
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     tags: [login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
router.post("/login",LoginSchema,validateRequestSchema,login);
router.delete('/users/:id', deleteUser);
/**
 * @swagger
 * /api/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [reset-password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               oldPassword:
 *                 type: string
 *                 description: User's old password
 *               newPassword:
 *                 type: string
 *                 description: User's new password
 *             required:
 *               - email
 *               - oldPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password reset successful
 *       401:
 *         description: Invalid old password
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/reset-password', resetPassword);
/**
 * @swagger
 * /apiAuth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [logout]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accessToken:
 *                 type: string
 *                 description: User's access token
 *               refreshToken:
 *                 type: string
 *                 description: User's refresh token
 *             required:
 *               - accessToken
 *               - refreshToken
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Invalid access token or refresh token
 *       500:
 *         description: Internal server error
 */
router.post('/logout', logout);
/**
 * @swagger
 * /api/reset-password-link:
 *   post:
 *     summary: Send password reset link
 *     tags: [reset-password-link]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/reset-password-link', resetPasswordLink);
/**
 * @swagger
 * /api/forgotPassword:
 *   post:
 *     summary: Reset password with token
 *     tags: [forgotPassword]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Reset password token
 *               newPassword:
 *                 type: string
 *                 description: New password to set
 *             required:
 *               - token
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password change successful
 *       400:
 *         description: Invalid token or token expired
 *       500:
 *         description: Internal server error
 */
router.post('/forgotPassword', forgotPassword);
router.get('/token',getAlltoken);
/**
 * @swagger
 * /api/refreshtoken:
 *   post:
 *     summary: Refresh access token
 *     description: Generate a new access token using a valid refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token
 *     responses:
 *       200:
 *         description: New access token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       401:
 *         description: Invalid user ID or verification failure
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.post('/refreshtoken',refreshToken)

export default router;

