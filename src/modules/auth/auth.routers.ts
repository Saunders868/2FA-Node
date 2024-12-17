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
