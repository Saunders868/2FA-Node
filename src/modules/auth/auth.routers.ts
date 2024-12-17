import { Router } from "express";
import { authController } from "./auth.module";

const authRoutes = Router();

/**
 * @openapi
 * '/api/v1/register':
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
 *      200:
 *        description: Success
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);

export default authRoutes;
