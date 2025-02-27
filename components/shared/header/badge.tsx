"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { getMyCart } from "@/lib/actions/cart.actions";

export default function CartBadge() {
  const [cartItems, setCartItems] = useState(0);

  //   async function getCartItems() {
  //     const cart = await getMyCart();
  //     if (!cart?.items.length) {
  //       setCartItems(0);
  //     } else {
  //       setCartItems(cart?.items.length);
  //     }
  //   }
  useEffect(() => {
    (async () => {
      try {
        const cart = await getMyCart();
        if (!cart?.items.length) {
          setCartItems(0);
        } else {
          setCartItems(cart?.items.length);
        }
      } catch (error) {
        console.error("Error getting cart items", error);
      }
    })();
  }, [cartItems]);

  if (cartItems === 0) return null;

  return (
    <Badge className="relative -top-4 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">
      {cartItems}
    </Badge>
  );
}
