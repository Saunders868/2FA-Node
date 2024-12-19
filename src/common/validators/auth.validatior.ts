import { z } from "zod";

export const emailSchema = z.string().trim().email().min(1).max(255);
export const passwordSchema = z.string().trim().min(6).max(255);
export const verificationCodeSchema = z.string().trim().min(1).max(25);

/**
 * @openapi
 * components:
 *  schemas:
 *    RegisterUserInput:
 *      type: object
 *      required:
 *        - name
 *        - email
 *        - password
 *        - confirmPassword
 *      properties:
 *        name:
 *          type: string
 *          default: janedoe
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        password:
 *          type: string
 *          default: Password1!
 *        confirmPassword:
 *          type: string
 *          default: Password1!
 */
export const registerUserValidationSchema = z
  .object({
    name: z.string().trim().min(1).max(255),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((val) => val.password === val.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * @openapi
 * components:
 *  schemas:
 *    LoginUserInput:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        password:
 *          type: string
 *          default: Password1!
 */
export const loginUserValidationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: z.string().optional(),
});

/**
 * @openapi
 * components:
 *  schemas:
 *    VerifyEmailInput:
 *      type: object
 *      required:
 *        - code
 *      properties:
 *        code:
 *          type: string
 */
export const verificationEmailSchema = z.object({
  code: verificationCodeSchema,
});

/**
 * @openapi
 * components:
 *  schemas:
 *    ResetPasswordInput:
 *      type: object
 *      required:
 *        - code
 *        - password
 *      properties:
 *        code:
 *          type: string
 *        password:
 *          type: string
 *          default: Password1!
 */
export const resetPasswordSchema = z.object({
  password: passwordSchema,
  code: verificationCodeSchema,
});
