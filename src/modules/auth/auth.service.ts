import jwt from "jsonwebtoken";
import { ErrorCode } from "../../common/enums/error.enum";
import { VerificationEnum } from "../../common/enums/verification-code.enum";
import {
  BadRequestException,
  UnauthorizedException,
} from "../../common/utils/catchErrors";
import {
  calculateExpirationDate,
  fortyFiveMinutesFromNow,
  ONE_DAY_IN_MS,
} from "../../common/utils/utils";
import SessionModel, {
  SessionDocument,
} from "../../database/models/session.model";
import UserModel, { UserDocument } from "../../database/models/user.model";
import VerificationCodeModel, {
  VerifcationCodeDocument,
} from "../../database/models/verification.model";
import { config } from "../../config/app.config";
import {
  refreshTokenSignOptions,
  RefreshTPayload,
  signJwtToken,
  verifyJwtToken,
} from "../../common/utils/jwt";

export class AuthService {
  public async userExists(email: string): Promise<{ _id: unknown } | null> {
    let user = await UserModel.exists({ email });

    return user;
  }

  private async createUser({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }): Promise<UserDocument> {
    let user = await UserModel.create({
      name,
      email,
      password,
    });

    return user;
  }

  private async createVerificationCode({
    userId,
    type,
    expiresAt,
  }: {
    userId: unknown;
    type: string;
    expiresAt: Date;
  }): Promise<VerifcationCodeDocument> {
    let verificationCode = await VerificationCodeModel.create({
      userId,
      type,
      expiresAt,
    });

    return verificationCode;
  }

  private async createSession({
    userId,
    userAgent,
  }: {
    userId: string;
    userAgent?: string;
  }): Promise<SessionDocument> {
    return await SessionModel.create({
      userId,
      userAgent,
    });
  }

  public async register(user: UserDTO): Promise<{ user: UserDocument }> {
    const { name, email, password } = user;

    const existingUser = await this.userExists(email);

    if (existingUser) {
      throw new BadRequestException(
        "User already exists",
        ErrorCode.BAD_REQUEST
      );
    }

    const newUser = await this.createUser({ name, email, password });
    const userId = newUser._id;
    const verificationCode = await this.createVerificationCode({
      userId,
      type: VerificationEnum.EMAIL_VERIFICATION,
      expiresAt: fortyFiveMinutesFromNow(),
    });

    // send verification code email link

    return {
      user: newUser,
    };
  }

  public async login(loginData: LoginDTO) {
    const { email, password, userAgent } = loginData;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      throw new BadRequestException(
        "Invalid email or password provided",
        ErrorCode.AUTH_USER_NOT_FOUND
      );
    }

    const isPasswordValid = await user.comparePasswords(password);

    if (!isPasswordValid) {
      throw new BadRequestException(
        "Invalid email or password provided",
        ErrorCode.AUTH_USER_NOT_FOUND
      );
    }

    // check if the user enabled 2fa

    const session = await this.createSession({
      userId: user._id as string,
      userAgent,
    });

    const accessToken = signJwtToken({
      userId: user._id,
      sessionId: session._id,
    });

    const refreshToken = signJwtToken(
      {
        sessionId: session._id,
      },
      refreshTokenSignOptions
    );

    return {
      user,
      accessToken,
      refreshToken,
      mfaRequired: false,
    };
  }

  public async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    newRefreshToken: string | undefined;
  }> {
    const { payload } = verifyJwtToken<RefreshTPayload>(refreshToken, {
      secret: refreshTokenSignOptions.secret,
    });

    if (!payload) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const session = await SessionModel.findById(payload.sessionId);
    const now = Date.now();

    if (!session) {
      throw new UnauthorizedException("Session does not exist");
    }

    if (session.expiredAt.getTime() <= now) {
      throw new UnauthorizedException("Session Expired");
    }

    const sessionRequireRefresh =
      session.expiredAt.getTime() - now <= ONE_DAY_IN_MS;

    if (sessionRequireRefresh) {
      session.expiredAt = calculateExpirationDate(
        config.JWT.REFRESH_EXPIRES_IN
      );
      await session.save();
    }

    const newRefreshToken = sessionRequireRefresh
      ? signJwtToken({ sessionId: session._id }, refreshTokenSignOptions)
      : undefined;

    const accessToken = signJwtToken({
      sessionId: session._id,
      userId: session.userId,
    });

    return {
      accessToken,
      newRefreshToken,
    };
  }

  public async verifyEmail(code: string): Promise<{ user: UserDocument }> {
    const validCode = await VerificationCodeModel.findOne({
      code: code,
      type: VerificationEnum.EMAIL_VERIFICATION,
      expiresAt: { $gt: new Date() },
    });

    if (!validCode)
      throw new BadRequestException("Invalid or expired verification code");

    const updatedUser = await UserModel.findByIdAndUpdate(
      validCode.userId,
      {
        isEmailVerified: true,
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      throw new BadRequestException(
        "Unable to verify email address",
        ErrorCode.VALIDATION_ERROR
      );
    }

    await validCode.deleteOne();

    return {
      user: updatedUser,
    };
  }
}
