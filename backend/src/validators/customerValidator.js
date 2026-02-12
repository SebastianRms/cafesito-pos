import {z} from 'zod';

export const createCustomerValidator = z.object ({
    name: z.string()
        .min(2, "name required")
        .max(100, "name too long"),
    phone_or_email: z.string()
        .regex(/^(\d{10}|[^\s@]+@[^\s@]+\.[^\s@]+)$/, "phone (10 digits) or valid email required"),
}).strict();