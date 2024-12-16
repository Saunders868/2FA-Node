import UserModel from "../../database/models/user.model";

export class AuthService {
  public async register(user: UserDTO) {
    const { name, email, password, userAgent } = user;

    const existingUser = await UserModel.findOne();
  }
}
