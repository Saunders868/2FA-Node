import { Router } from "express";
import { authController } from "./auth.module";

const authRoutes = Router();

/**
 * @openapi
 * '/api/v1/auth/register':
 *  post:
 *     tags:
 *     - User
 *     summary: Register a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/RegisterUserInput'
 *     responses:
 *      201:
 *        description: Created
 *      400:
 *        description: Bad request
 */
authRoutes.post("/register", authController.register);

/**
 * @openapi
 * '/api/v1/auth/login':
 *  post:
 *     tags:
 *     - User
 *     summary: Login a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/LoginUserInput'
 *     responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad request
 */
authRoutes.post("/login", authController.login);

/**
 * @openapi
 * '/api/v1/auth/verify/email':
 *  post:
 *     tags:
 *     - User
 *     summary: Verify a user's email
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/VerifyEmailInput'
 *     responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad request
 */
authRoutes.post("/verify/email", authController.verifyEmail);

/**
 * @openapi
 * '/api/v1/auth/password/forgot':
 *  post:
 *     tags:
 *     - User
 *     summary: User forgets their password
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              type: object
 *              required:
 *                  - email
 *              properties:
 *                  email:
 *                      type: string
 *                      default: jane.doe@example.com
 *     responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad request
 */
authRoutes.post("/password/forgot", authController.forgotPassword);

/**
 * @openapi
 * '/api/v1/auth/password/reset':
 *  post:
 *     tags:
 *     - User
 *     summary: Reset a user's password
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/ResetPasswordInput'
 *     responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad request
 */
authRoutes.post("/password/reset", authController.resetPassword);

/**
 * @openapi
 * '/api/v1/auth/refresh':
 *  get:
 *     tags:
 *     - User
 *     summary: Refresh a user's session
 *     responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 */
authRoutes.get("/refresh", authController.refreshToken);

export default authRoutes;
