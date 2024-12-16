import { Express, Request, Response } from "express";
import authRoutes from "./modules/auth/auth.routers";
import { config } from "./config/app.config";

const BASE_PATH = config.BASE_PATH;

function routes(app: Express) {
  app.get(`${BASE_PATH}/healthcheck`, (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  app.use(`${BASE_PATH}`, authRoutes);
}

export default routes;
