import { Express, Request, Response } from "express";
import authRoutes from "./modules/auth/auth.routers";
import { config } from "./config/app.config";

const BASE_PATH = config.BASE_PATH;

function routes(app: Express) {
  /**
   * @openapi
   * '/api/v1/healthcheck':
   *  get:
   *     tags:
   *     - HealthCheck
   *     summary: Check if the application is running
   *     responses:
   *      200:
   *        description: Success
   *      500:
   *        description: Internal server error
   */
  app.get(`${BASE_PATH}/healthcheck`, (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  app.use(`${BASE_PATH}/auth`, authRoutes);
}

export default routes;
