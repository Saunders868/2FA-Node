import { Router } from "express";
import { authenticateJWT } from "../../common/strategy/jwt.strategy";
import { mfaController } from "./mfa.module";

const mfaRoutes = Router();

/**
 * @openapi
 * 'api/v1/mfa/setup':
 *  get:
 *      tags:
 *      - MFA
 *      summary: setup MFA for a user
 *      responses:
 *          200:
 *              description: success
 *          401:
 *              description: unauthorized
 */
mfaRoutes.get("/setup", authenticateJWT, mfaController.generateMFASetup);

/**
 * @openapi
 * 'api/v1/mfa/verify':
 *  post:
 *      tags:
 *      - MFA
 *      summary: verify user mfa
 *      requestBody:
 *          required: true
 *          content: application/json
 *          schema:
 *              type: object
 *              required:
 *                  - code
 *                  - secretKey
 *              properties:
 *                  code:
 *                      type: string
 *                  secretKey:
 *                      type: string
 *      responses:
 *          200:
 *              description: Success
 *          400:
 *              description: Bad request
 *          401:
 *              description: Unauthorized
 */
mfaRoutes.post("/verify", authenticateJWT, mfaController.verifyMFASetup);

/**
 * @openapi
 * 'api/v1/mfa/revoke':
 *  put:
 *      tags:
 *      - MFA
 *      summary: revoke MFA for a user
 *      responses:
 *          200:
 *              description: success
 *          401:
 *              description: unauthorized
 */
mfaRoutes.put("/revoke", authenticateJWT, mfaController.revokeMFA);

/**
 * @openapi
 * 'api/v1/mfa/verify-login':
 *  post:
 *      tags:
 *      - MFA
 *      summary: verify user mfa and log them in
 *      requestBody:
 *          required: true
 *          content: application/json
 *          schema:
 *              type: object
 *              required:
 *                  - code
 *                  - email
 *              properties:
 *                  code:
 *                      type: string
 *                  email:
 *                      type: string
 *      responses:
 *          200:
 *              description: Success
 *          400:
 *              description: Bad request
 *          401:
 *              description: Unauthorized
 */
mfaRoutes.post("/verify-login", mfaController.verifyMFAforLogin);

export default mfaRoutes;
