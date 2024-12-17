import { Request, Response, Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Authentiction API",
      description: "API User MFA Applications",
      contact: {
        name: "Daniel Saunders",
        email: "saundersdaniel.10@gmail.com",
        url: "https://github.com/Saunders868",
      },
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8000/",
        description: "Local server",
      },
    ],
    components: {
      /* securitySchemes: {
        bearerToken: {
          type: "http",
          in: "header",
          name: "Authorization",
          description: "Bearer token to access these api endpoints",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        refreshHeader: {
          type: "http",
          in: "header",
          name: "X-Refresh",
          description: "Refresh token for authentication",
          scheme: "bearer",
        },
      }, */
    },
  },
  apis: [
    "src/modules/**/*.routers.ts",
    "src/common/validators/*.validatior.ts",
    "src/routes.ts",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}
export { swaggerDocs, swaggerSpec };
