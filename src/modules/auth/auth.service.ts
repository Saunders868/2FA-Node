import { ErrorCode } from "../../common/enums/error.enum";
import { VerificationEnum } from "../../common/enums/verification-code.enum";
import { BadRequestException } from "../../common/utils/catchErrors";
import { fortyFiveMinutesFromNow } from "../../common/utils/utils";
import UserModel, { UserDocument } from "../../database/models/user.model";
import VerificationCodeModel, { VerifcationCodeDocument } from "../../database/models/verification.model";

export class AuthService {
  public async userExists(email: string):Promise<{ _id: unknown } | null> {
    let user = await UserModel.exists({ email });
    
    return user;
  }

  private async createUser({ name, email, password }: { name: string; email: string; password: string}): Promise<UserDocument> {
    let user = await UserModel.create({
      name,
      email,
      password
    })

    return user;
  }

  private async createVerificationCode({
    userId,
    type,
    expiresAt
  }: {
    userId: unknown;
    type: string;
    expiresAt: Date;
  }): Promise<VerifcationCodeDocument> {
    let verificationCode = await VerificationCodeModel.create({
      userId,
      type,
      expiresAt
    })

    return verificationCode;
  }

  public async register(user: UserDTO): Promise<{ user: UserDocument; }> {
    const { name, email, password } = user;

    const existingUser = await this.userExists(email);

    if(existingUser) {
      throw new BadRequestException("User already exists", ErrorCode.BAD_REQUEST)
    }

    const newUser = await this.createUser({ name, email, password}); 
    const userId = newUser._id;
    const verificationCode = await this.createVerificationCode({
      userId,
      type: VerificationEnum.EMAIL_VERIFICATION,
      expiresAt: fortyFiveMinutesFromNow(),
    })

    // send verification code email link

    return {
      user: newUser
    }
  }


}
