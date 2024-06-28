"use client"
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation";

function Navbar() {
    const path = usePathname();
  return (
    <div className="flex p-4 items-center justify-between bg-secondary shadow-sm">
      <Image src={'/logo.svg'} width={40} height={20} alt='logo' />
      <ul className="hidden md:flex gap-6">
        <li className={`hover:text-primary cursor-pointer hover:font-semibold transition-all ${path=='/dashboard'&& 'text-primary font-semibold'}`}>Dashboard</li>
        <li className={`hover:text-primary cursor-pointer hover:font-semibold transition-all ${path=='/dashboard/questions'&& 'text-primary font-semibold'}`}>Questions</li>
        <li className={`hover:text-primary cursor-pointer hover:font-semibold transition-all ${path=='/dashboard/upgrade'&& 'text-primary font-semibold'}`}>Upgrade</li>
        <li className={`hover:text-primary cursor-pointer hover:font-semibold transition-all ${path=='/dashboard/how'&& 'text-primary font-semibold'}`}>How it Works?</li>
      </ul>
      <UserButton />
    </div>
  )
}

export default Navbar
