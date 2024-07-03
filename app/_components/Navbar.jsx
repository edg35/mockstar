"use client";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

function Navbar() {
  const path = usePathname();
  const { user } = useUser();
  const router = useRouter();

  const handleLoginRoute = (e) => {
    e.preventDefault();
    router.push("/sign-in");
  };

  const handleSignupRoute = (e) => {
    e.preventDefault();
    router.push("/sign-up");
  };

  return (
    <div className="flex p-4 items-center justify-between bg-secondary shadow-sm">
      <Image src={"/logo.svg"} width={40} height={20} alt="logo" />
      <ul className="hidden md:flex gap-6">
        <li
          className={`hover:text-primary cursor-pointer hover:font-semibold transition-all ${
            path == "/dashboard" && "text-primary font-semibold"
          }`}
        >
          Dashboard
        </li>
        <li
          className={`hover:text-primary cursor-pointer hover:font-semibold transition-all ${
            path == "/dashboard/questions" && "text-primary font-semibold"
          }`}
        >
          Questions
        </li>
        <li
          className={`hover:text-primary cursor-pointer hover:font-semibold transition-all ${
            path == "/dashboard/upgrade" && "text-primary font-semibold"
          }`}
        >
          Upgrade
        </li>
        <li
          className={`hover:text-primary cursor-pointer hover:font-semibold transition-all ${
            path == "/dashboard/how" && "text-primary font-semibold"
          }`}
        >
          How it Works?
        </li>
      </ul>
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
    </div>
  );
}

export default Navbar;
