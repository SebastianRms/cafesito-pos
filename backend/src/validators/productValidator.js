import { z } from 'zod';

const singleProductSchema = z.object({
  name: z.string()
    .min(1, "name required")
    .max(100, "name too long"),
  description: z.string()
    .min(1, "description required").optional().nullable(),
  price: z.number()
    .positive("price must be greater than 0"), 
  stock: z.number()
    .int()
    .nonnegative("stock cannot be negative"), 
  category: z.string().optional().nullable(),
  images_url: z.array(z.string().url()).optional().nullable(),
});

// Acepta un solo producto o un array de productos
export const createProductValidator = z.union([
  singleProductSchema,
  z.array(singleProductSchema).min(1, "At least one product required")
]);