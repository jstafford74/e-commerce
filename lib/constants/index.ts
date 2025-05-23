import { BlogPost, NewBlog } from "../validators";

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Nobafrog";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "Modern em-commerce store built with Next.js";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaultValues = {
  email: "",
  password: "",
};

export const signUpDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12;

export const shippingAddressDefaultValues = {
  fullName: "",
  streetAddress: "",
  city: "",
  postalCode: "",
  country: "",
};

export const PAYMENT_METHODS = process.env.NEXT_PUBLIC_PAYMENT_METHODS
  ? process.env.NEXT_PUBLIC_PAYMENT_METHODS.split(", ")
  : ["PayPal", "Stripe"];

export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || "PayPal";

export const productDefaultValues = {
  name: "",
  slug: "",
  category: "",
  images: [],
  brand: "",
  description: "",
  price: "0",
  stock: 0,
  rating: "0",
  numReviews: "0",
  isFeatured: false,
  banner: null,
};

export const USER_ROLES = process.env.USER_ROLES
  ? process.env.USER_ROLES.split(", ")
  : ["admin", "user"];

export const reviewFormDefaultValues = {
  title: "",
  comment: "",
  rating: 0,
};

export const SENDER_EMAIL = process.env.SENDER_EMAIL || "onboarding@resend.dev";

export const adminBlogFormDefaultValues: NewBlog = {
  title: "",
  slug: "",
  createdAt: "",
  updatedAt: "",
  tags: [],
  summary: "",
  author: "",
  body: "",
};

export const updateBlogFormDefaultValues: BlogPost = {
  _id: "",
  title: "",
  slug: "",
  createdAt: "",
  updatedAt: "",
  tags: [],
  summary: "",
  author: "",
  body: "",
};

export const SearchTerms = [
  "total",
  "new_york",
  "connecticut",
  "texas",
  "massachusetts",
  "new_jersey",
  "north_carolina",
  "maryland",
  "florida",
  "california",
  "remote",
  "intern",
  "director",
  "analyst",
  "manager",
  "software",
  "engineer",
  "project",
];
