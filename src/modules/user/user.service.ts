import UserModel, { UserDocument } from "../../database/models/user.model";

export class UserService {
  public async findUserById(userId: string): Promise<UserDocument | null> {
    const user = await UserModel.findById(userId, {
      password: false,
    });

    return user || null;
  }
}
