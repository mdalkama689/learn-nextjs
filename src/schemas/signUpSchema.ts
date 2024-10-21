import { z } from "zod";

export const usernameValidation =  z
.string()
.regex(/^[a-zA-Z0-9_]{3,16}$/, {
  message:
    "Username must be 3-30 characters long and can only contain letters, numbers, underscores, or hyphens.",
})
const signUpSchema = z.object({
  username: usernameValidation, 
  email: z.string().min(1, {message: 'Password is required'}).email({ message: "Invalid email address" }),
  password: z
    .string().min(1, {message: 'Password is required'})
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(30, { message: "Password cannot exceed 30 characters" }),
});

export default signUpSchema;
