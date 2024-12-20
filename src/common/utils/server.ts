import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "../../config/app.config";
import routes from "../../routes";
import { errorHandler } from "../../middleware/errorHandler";
import { swaggerDocs } from "./swagger";

function createServer(): Express {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      credentials: true,
      origin: config.APP_ORIGIN,
    })
  );

  app.use(cookieParser());
  app.disable("x-powered-by");
  swaggerDocs(app);
  routes(app);
  app.use(errorHandler);

  return app;
}

export default createServer;
