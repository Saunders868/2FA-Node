import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { AuthService } from "./auth.service";
import { HTTPSTATUS } from "../../config/http.config";
import { registerUserValidationSchema } from "../../common/validators/auth.validatior";

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public register = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const userAgent = req.headers["user-agent"];
      const body = registerUserValidationSchema.parse({
        ...req.body,
        userAgent,
      });

      this.authService.register(body);

      return res.status(HTTPSTATUS.CREATED).json({
        message: "User Registered Successfully",
      });
    }
  );
}
