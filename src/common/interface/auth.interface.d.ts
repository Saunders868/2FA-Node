declare interface UserDTO {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

declare interface LoginDTO {
  email: string;
  password: string;
  userAgent?: string;
}

declare interface ResetPasswordDTO {
  password: string;
  code: string;
}
