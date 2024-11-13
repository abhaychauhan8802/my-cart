import { Button, Link } from "@nextui-org/react";
import { ShoppingCart } from "lucide-react";

import SearchBar from "./SearchBar";
import ProfileDropdown from "./ProfileDropdown";

const Header = () => {
  return (
    <div className="w-full h-[4.5rem] px-3 md:px-14 lg:px-20 flex items-center gap-4 md:gap-7 lg:gap-10 shadow-md fixed top-0 left-0 right-0 bg-white z-20">
      <Link
        href="/"
        className="font-black text-xl md:text-2xl select-none text-gray-800"
      >
        Mcart
      </Link>

      <div className="w-4/5 lg:mx-20">
        <SearchBar />
      </div>

      <div className="flex gap-4">
        <ProfileDropdown />

        <Button variant="bordered" as={Link} href="/cart" radius="full">
          <ShoppingCart className="w-5 text-gray-700" />
          <span>Cart</span>
        </Button>
      </div>
    </div>
  );
};

export default Header;
