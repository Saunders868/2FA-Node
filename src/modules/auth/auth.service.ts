import jwt from "jsonwebtoken";
import { ErrorCode } from "../../common/enums/error.enum";
import { VerificationEnum } from "../../common/enums/verification-code.enum";
import { BadRequestException } from "../../common/utils/catchErrors";
import { fortyFiveMinutesFromNow } from "../../common/utils/utils";
import SessionModel, {
  SessionDocument,
} from "../../database/models/session.model";
import UserModel, { UserDocument } from "../../database/models/user.model";
import VerificationCodeModel, {
  VerifcationCodeDocument,
} from "../../database/models/verification.model";
import { config } from "../../config/app.config";

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

    const accessToken = jwt.sign(
      {
        userId: user._id,
        sessionId: session._id,
      },
      config.JWT.SECRET,
      {
        audience: ["user"],
        expiresIn: config.JWT.EXPIRES_IN,
      }
    );

    const refreshToken = jwt.sign(
      {
        sessionId: session._id,
      },
      config.JWT.REFRESH_SECRET,
      {
        audience: ["user"],
        expiresIn: config.JWT.REFRESH_EXPIRES_IN,
      }
    );

    return {
      user,
      accessToken,
      refreshToken,
      mfaRequired: false,
    };
  }
}
