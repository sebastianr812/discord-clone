import * as z from "zod";

export const ChatValidator = z.object({
  content: z.string().min(1),
});

export type ChatRequest = z.infer<typeof ChatValidator>;
