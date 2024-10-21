import { z } from "zod";

const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Content must be at least 10 characters" })
    .max(300, { message: "Content must be ano longer than 300 characters" }),
});

export default messageSchema;
