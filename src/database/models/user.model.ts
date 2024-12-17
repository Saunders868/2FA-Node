import mongoose, { Document } from "mongoose";
import { compareValue, hashValue } from "../../common/utils/bcrypt";

interface UserPreference {
  enable2FA: boolean;
  emailNotification: boolean;
  twoFactorSecret?: string;
}

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  userPreferences: UserPreference;
  comparePasswords: (value: string) => Promise<boolean>;
}

const userPreferencesSchema = new mongoose.Schema<UserPreference>({
  enable2FA: {
    type: Boolean,
    default: false,
  },
  emailNotification: {
    type: Boolean,
    default: false,
  },
  twoFactorSecret: {
    type: String,
    required: false,
  },
});

const userSchema = new mongoose.Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userPreferences: { type: userPreferencesSchema, default: {} },
    isEmailVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {},
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashValue(this.password);
  }
  next();
});

userSchema.methods.comparePasswords = async function (value: string) {
  return compareValue(value, this.password);
};

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.userPreferences.twoFactorSecret;
    return ret;
  },
});

const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;
