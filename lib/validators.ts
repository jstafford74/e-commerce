import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constants";
// import { format, isValid } from "date-fns";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "Price must have exactly two decimal places"
  );

// const formattedDate = z
//   .date()
//   .refine((date) => isValid(date), {
//     message: "Invalid date",
//   })
//   .transform((date) => format(date, "MM-dd-yyyy"));

// Custom Zod type for ObjectId validation (optional, for stricter checks)
const objectIdSchema = z
  .string()
  .refine((value) => /^[0-9a-fA-F]{24}$/.test(value), {
    message: "Invalid ObjectId format",
  });

export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  brand: z.string().min(3, "Brand must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

// Schema for updating products
export const updateProductSchema = insertProductSchema.extend({
  id: z.string().min(1, "Id is required"),
});

// Schema for signing users in
export const signInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Schema for signing up a user
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Cart Schemas
export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  qty: z.number().int().nonnegative("Quantity must be a positive number"),
  image: z.string().min(1, "Image is required"),
  price: currency,
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "Session cart id is required"),
  userId: z.string().optional().nullable(),
});

// Schema for the shipping address
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  streetAddress: z.string().min(3, "Address must be at least 3 characters"),
  city: z.string().min(3, "City must be at least 3 characters"),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
  country: z.string().min(3, "Country must be at least 3 characters"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

// Schema for payment method
export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "Payment method is required"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    message: "Invalid payment method",
  });

// Schema for inserting order
export const insertOrderSchema = z.object({
  userId: z.string().min(1, "User is required"),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: "Invalid payment method",
  }),
  shippingAddress: shippingAddressSchema,
});

// Schema for inserting an order item
export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: currency,
  qty: z.number(),
});

// Schema for the PayPal paymentResult
export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

// Schema for updating the user profile
export const updateProfileSchema = z.object({
  name: z.string().min(3, "Name must be at leaast 3 characters"),
  email: z.string().min(3, "Email must be at leaast 3 characters"),
});

// Schema to update users
export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, "ID is required"),
  role: z.string().min(1, "Role is required"),
});

// Schema to insert reviews
export const insertReviewSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  productId: z.string().min(1, "Product is required"),
  userId: z.string().min(1, "User is required"),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
});

export const companySchema = z.object({
  _id: z.union([z.string(), objectIdSchema]),
  name: z.string(),
  url: z.string(),
  active_applications: z.string().array(),
  inactive_applications: z.string().array(),
});

export const updateCompanySchema = z.object({
  name: z.string(),
  url: z.string(),
});

export const addCompanySchema = z.object({
  name: z.string(),
  url: z.string(),
  email: z.string(),
  password: z.string(),
  equity_ticker: z.string().optional(),
  industry: z.string().optional(),
  sector: z.string().optional(),
});
export type NewCompany = z.infer<typeof addCompanySchema>;

export const passwordSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type EmailAndPassword = z.infer<typeof passwordSchema>;
export type Company = z.infer<typeof companySchema>;

export type FullCompany = EmailAndPassword & Company;

export const linkedSnapshotSchema = z.object({
  company_id: z.string(),
  total: z.number().int(),
  snapshot_date: z.string(),
  new_york: z.number().int(),
  connecticut: z.number().int(),
  texas: z.number().int(),
  massachusetts: z.number().int(),
  new_jersey: z.number().int(),
  maryland: z.number().int(),
  north_carolina: z.number().int(),
  florida: z.number().int(),
  california: z.number().int(),
  name: z.string(),
});

export type LinkedSnapshot = z.infer<typeof linkedSnapshotSchema>;

export type SelectedOptions =
  | "total"
  | "new_york"
  | "connecticut"
  | "texas"
  | "massachusetts"
  | "new_jersey"
  | "north_carolina"
  | "maryland"
  | "florida"
  | "california"
  | "remote"
  | "intern"
  | "director"
  | "analyst"
  | "manager"
  | "software"
  | "engineer"
  | "project";

export type TotalSnapshot = {
  _id: string;
  total: number;
  new_york: number;
  connecticut: number;
  texas: number;
  massachusetts: number;
  new_jersey: number;
  maryland: number;
  north_carolina: number;
  florida: number;
  california: number;
  remote: number;
  intern: number;
  director: number;
  analyst: number;
  manager: number;
  software: number;
  engineer: number;
  project: number;
};

export const tagSchema = z.object({
  _id: z.union([z.string(), objectIdSchema]),
  name: z.string().min(1, { message: "Tag name is required" }), // Tag names must not be empty
});

// Define type for Tag
export type Tag = z.infer<typeof tagSchema>;

export const addBlogSchema = z.object({
  title: z.string(),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  createdAt: z.string(), // Date for when the post is created
  updatedAt: z.string().optional(), // Date for when the post is updated
  tags: z.array(z.string()),
  summary: z.string(),
  author: z.string(),
  body: z.string(),
});

export type NewBlog = z.infer<typeof addBlogSchema>;

export const blogPostSchema = z.object({
  _id: z.union([z.string(), objectIdSchema]),
  title: z.string(),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  createdAt: z.string(), // Date for when the post is created
  updatedAt: z.string(), // Date for when the post is updated
  tags: z.array(tagSchema),
  summary: z.string(),
  author: z.string(),
  body: z.string(),
});

export type BlogPost = z.infer<typeof blogPostSchema>;

export const updateBlogPostSchema = z.object({
  title: z.string(),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  updatedAt: z.string(),
  tags: z.array(tagSchema),
  summary: z.string(),
  author: z.string(),
  body: z.string(),
});

export type UpdateBlogPost = z.infer<typeof updateBlogPostSchema>;
