import { z } from 'zod';

export const createProductValidator = z.object({
  name: z.string()
    .min(1, "name required")
    .max(100, "name too long"),
  description: z.string()
    .min(1, "description required"),
  price: z.number()
    .positive("price must be greater than 0"), 
  stock: z.number()
    .int()
    .nonnegative("stock cannot be negative"), 
  category: z.string(),
  images_url: z.array(z.string().url()).optional()
});