import { z } from "zod";
import { userRoleSchema } from "./enums";

export const loginSchema = z.object({
  email: z.string().trim().email("invalid_email"),
  password: z.string().min(8, "password_too_short").max(200),
});
export type LoginInput = z.infer<typeof loginSchema>;

export interface AuthUserDTO {
  id: string;
  email: string;
  role: z.infer<typeof userRoleSchema>;
}
