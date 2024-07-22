"use client";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DropdownMenu from "./DropDownMenu";

function Navbar() {
  const path = usePathname();
  const { user } = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLoginRoute = (e) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  const handleSignupRoute = (e) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        !event.target.closest(".navbar") && // Check if clicked outside navbar
        !event.target.closest(".dropdown-menu") // Check if clicked outside menu
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      // Cleanup function to remove event listener on unmount
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="flex p-4 items-center justify-between bg-secondary shadow-sm">
      <Link href="/">
        <Image src={"/logo.svg"} width={40} height={20} alt="logo" />
      </Link>
      <ul className="hidden md:flex gap-6">
        {user && (
          <Link href="/dashboard">
            <li
              className={`hover:text-primary cursor-pointer hover:font-semibold transition-all ${
                path == "/dashboard" && "text-primary font-semibold"
              }`}
            >
              Dashboard
            </li>
          </Link>
        )}
        <li
          className={`hover:text-primary cursor-pointer hover:font-semibold transition-all ${
            path == "/dashboard/questions" && "text-primary font-semibold"
          }`}
        >
          Questions
        </li>
        <Link href="/pricing">
          <li
            className={`hover:text-primary cursor-pointer hover:font-semibold transition-all ${
              path == "/pricing" && "text-primary font-semibold"
            }`}
          >
            Upgrade
          </li>
        </Link>
        <li
          className={`hover:text-primary cursor-pointer hover:font-semibold transition-all ${
            path == "/dashboard/how" && "text-primary font-semibold"
          }`}
        >
          How it Works?
        </li>
      </ul>
      <div className="flex gap-2">
        <Button
          className="md:hidden bg-secondary text-primary hover:bg-white"
          onClick={toggleMenu}
        >
          <Menu />
        </Button>
        {user ? (
          <UserButton />
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSignupRoute} variant="outline">
              Sign Up
            </Button>
            <Button onClick={handleLoginRoute}>Login</Button>
          </div>
        )}
        {/* Add the DropdownMenu component here */}
        {isOpen && <DropdownMenu />}
      </div>
    </div>
  );
}

export default Navbar;
