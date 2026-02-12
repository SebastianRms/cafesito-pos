import { z } from 'zod';

export const createSaleValidator = z.object({
  customer_id: z.string().optional().nullable(),
  
  payment_method: z.enum(["cash", "card", "transfer"]).default("cash"),

  items: z.array(
    z.object({
      product_id: z.string().min(1, "product_id is required"),
      quantity: z.number().int().min(1, "Quantity must be at least 1")
    })
  ).min(1, "The sale must have at least one item"),
}).strict();