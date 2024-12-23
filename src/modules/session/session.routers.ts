import { Router } from "express";
import { sessionController } from "./session.module";

const sessionRoutes = Router();

/**
 * @openapi
 * '/api/v1/sessions/all':
 *  get:
 *     tags:
 *     - Session
 *     summary: Get all Sessions
 *     responses:
 *      200:
 *        description: Success
 *      404:
 *        description: Sessions not found
 */
sessionRoutes.get("/all", sessionController.getAllSessions);

/**
 * @openapi
 * '/api/v1/sessions/':
 *  get:
 *     tags:
 *     - Session
 *     summary: Get current session
 *     responses:
 *      200:
 *        description: Success
 *      404:
 *        description: Session not found
 */
sessionRoutes.get("/", sessionController.getSession);

/**
 * @openapi
 * '/api/v1/{id}':
 *  delete:
 *     tags:
 *     - Session
 *     summary: Delete a session
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The id of the session.
 *         required: true
 *     responses:
 *      200:
 *        description: Success
 *      404:
 *        description: Session not found
 */
sessionRoutes.delete("/:id", sessionController.deleteSession);

export default sessionRoutes;
