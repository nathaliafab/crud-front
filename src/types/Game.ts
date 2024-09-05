import { z } from 'zod';

// Definição do esquema para Platform com Zod
const PlatformSchema = z.object({
    id: z.number(),
    slug: z.string(),
    name: z.string(),
});

// Definição do esquema para Game com Zod
export const GameSchema = z.object({
    id: z.number(),
    slug: z.string(),
    name: z.string(),
    released: z.string(),
    background_image: z.string(),
    rating: z.number(),
    rating_top: z.number(),
    comment: z.string().optional(),
    platforms: z.array(PlatformSchema),
});

// Tipo inferido a partir do esquema GameSchema
export type Game = z.infer<typeof GameSchema>;
