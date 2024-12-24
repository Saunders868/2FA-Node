import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { MFAService } from "./mfa.service";
import { HTTPSTATUS } from "../../config/http.config";
import {
  verifyMFAforLoginSchema,
  verifyMFASchema,
} from "../../common/validators/mfa.validator";
import { setAuthenticationCookies } from "../../common/utils/cookie";

export class MFAController {
  private mfaService: MFAService;

  constructor(mfaService: MFAService) {
    this.mfaService = mfaService;
  }

  public generateMFASetup = asyncHandler(
    async (req: Request, res: Response) => {
      const { secret, qrImageUrl, message } =
        await this.mfaService.generateMFASetup(req);

      return res.status(HTTPSTATUS.OK).json({
        message,
        secret,
        qrImageUrl,
      });
    }
  );

  public verifyMFASetup = asyncHandler(async (req: Request, res: Response) => {
    const { code, secretKey } = verifyMFASchema.parse({
      ...req.body,
    });

    const { userPreferences, message } = await this.mfaService.verifyMFASetup(
      req,
      code,
      secretKey
    );

    return res.status(HTTPSTATUS.OK).json({
      message,
      userPreferences,
    });
  });

  public revokeMFA = asyncHandler(async (req: Request, res: Response) => {
    const { message, userPreferences } = await this.mfaService.revokeMFA(req);

    return res.status(HTTPSTATUS.OK).json({
      message,
      userPreferences,
    });
  });

  public verifyMFAforLogin = asyncHandler(
    async (req: Request, res: Response) => {
      const { code, email, userAgent } = verifyMFAforLoginSchema.parse({
        ...req.body,
        userAgent: req.headers["user-agent"],
      });

      const { user, accessToken, refreshToken } =
        await this.mfaService.verifyMFAforLogin(code, email, userAgent);

      return setAuthenticationCookies({ res, accessToken, refreshToken })
        .status(HTTPSTATUS.OK)
        .json({
          message: "Verified and login successful",
          user,
        });
    }
  );
}
