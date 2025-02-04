import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import dotenv from "dotenv";
import ws from "ws";

dotenv.config();
// Sets up WebSocket connections, which enables Neon to use WebSocket communication.
neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;

// Creates a new connection pool using the provided connection string, allowing multiple concurrent connections.
const pool = new Pool({ connectionString });

// Instantiates the Prisma adapter using the Neon connection pool to handle the connection between Prisma and Neon.
const adapter = new PrismaNeon(pool);

// Extends the PrismaClient with a custom result transformer to convert the price and rating fields to strings.
export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        compute(product: { price: Decimal }) {
          return product.price.toString();
        },
      },
      rating: {
        compute(product: { rating: Decimal }) {
          return product.rating.toString();
        },
      },
    },
    cart: {
      itemsPrice: {
        // needs: { itemsPrice: true },
        compute(cart: { itemsPrice: number }) {
          return cart.itemsPrice.toString();
        },
      },
      shippingPrice: {
        // needs: { shippingPrice: true },
        compute(cart: { shippingPrice: number }) {
          return cart.shippingPrice.toString();
        },
      },
      taxPrice: {
        // needs: { taxPrice: true },
        compute(cart: { taxPrice: number }) {
          return cart.taxPrice.toString();
        },
      },
      totalPrice: {
        // needs: { totalPrice: true },
        compute(cart: { totalPrice: number }) {
          return cart.totalPrice.toString();
        },
      },
    },
    order: {
      itemsPrice: {
        // needs: { itemsPrice: true },
        compute(cart: { itemsPrice: number }) {
          return cart.itemsPrice.toString();
        },
      },
      shippingPrice: {
        // needs: { shippingPrice: true },
        compute(cart: { shippingPrice: number }) {
          return cart.shippingPrice.toString();
        },
      },
      taxPrice: {
        // needs: { taxPrice: true },
        compute(cart: { taxPrice: number }) {
          return cart.taxPrice.toString();
        },
      },
      totalPrice: {
        // needs: { totalPrice: true },
        compute(cart: { totalPrice: number }) {
          return cart.totalPrice.toString();
        },
      },
    },
    orderItem: {
      price: {
        compute(cart: { price: number }) {
          return cart.price.toString();
        },
      },
    },
  },
});
