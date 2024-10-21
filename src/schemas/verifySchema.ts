import { z } from "zod";

const verifySchema = z.object({
  otp: z.string().length(6, { message: "Verification code must be 6 digits" }),
});

export default verifySchema;
