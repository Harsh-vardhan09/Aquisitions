import {z} from 'zod';

export const signUpSchema=z.object({
    name:z.string().trim().min(1,'Name is required').max(50,'Name must be less than 50 characters'),
    email:z.string().max(255).toLowerCase().trim().email('Invalid email address'),
    password:z.string().min(8,'Password must be at least 8 characters').max(128,'Password must be less than 255 characters'),
    role:z.enum(['user','admin']).default('user')
})

export const signInSchema=z.object({
    email:z.string().max(255).toLowerCase().trim().email('Invalid email address'),
    password:z.string().min(2,'Password must be at least 2 characters').max(128,'Password must be less than 255 characters')
})