import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { AuthService } from "./auth.service";
import { HTTPSTATUS } from "../../config/http.config";
import {
  loginUserValidationSchema,
  registerUserValidationSchema,
} from "../../common/validators/auth.validatior";
import { setAuthenticationCookies } from "../../common/utils/cookie";

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public register = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const body = registerUserValidationSchema.parse({
        ...req.body,
      });

      const { user } = await this.authService.register(body);

      return res.status(HTTPSTATUS.CREATED).json({
        message: "User Registered Successfully",
        data: user,
      });
    }
  );

  public login = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const userAgent = req.headers["user-agent"];

      const body = loginUserValidationSchema.parse({
        ...req.body,
        userAgent,
      });

      const { user, accessToken, refreshToken, mfaRequired } =
        await this.authService.login(body);

      return setAuthenticationCookies({
        res,
        accessToken,
        refreshToken,
      })
        .status(HTTPSTATUS.OK)
        .json({
          message: "User login successful",
          mfaRequired,
          user,
        });
    }
  );
}
