"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function BlogDropdown() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          Blog
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {/* <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator /> */}
        <DropdownMenuItem>
          <Link href="/admin/blog/add" className="flex items-center space-x-2">
            Add
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            href="/admin/blog/update"
            className="flex items-center space-x-2"
          >
            Update
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            href="/admin/blog/delete"
            className="flex items-center space-x-2"
          >
            Delete
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
