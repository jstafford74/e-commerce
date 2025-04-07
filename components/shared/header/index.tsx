import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import Menu from "./menu";
import CategoryDrawer from "./category-drawer";
import Search from "./search";

import { cn } from "@/lib/utils";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <CategoryDrawer />
          <Link href="/" className="flex-start ml-4">
            <Image
              src="/images/nobafrog_image.svg"
              alt={`${APP_NAME} logo`}
              height={48}
              width={48}
              priority={true}
            />
            <span className="hidden lg:block font-bold text-2xl ml-3">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <div>
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary"
            )}
          >
            Job Watch
          </Link>
        </div>
        <div>
          <Link
            href="/merch"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary"
            )}
          >
            Merchandise
          </Link>
        </div>
        <div>
          <Link
            href="/blog"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary"
            )}
          >
            Blog
          </Link>
        </div>
        <div className="hidden md:block">
          <Search />
        </div>
        <Menu />
      </div>
    </header>
  );
};

export default Header;
