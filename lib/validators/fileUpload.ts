import * as z from "zod";

export const FileUploadValidator = z.object({
  fileUrl: z.string().min(1, {
    message: "Attachment is required",
  }),
});

export type FileUploadRequest = z.infer<typeof FileUploadValidator>;
