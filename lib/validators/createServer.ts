import * as z from 'zod';

export const CreateServerValidator = z.object({
    name: z.string().min(1, {
        message: 'Server name is required'
    }).max(100),
    imageUrl: z.string().min(1, {
        message: 'Server image is required'
    })
});

export type CreateServerRequest = z.infer<typeof CreateServerValidator>;