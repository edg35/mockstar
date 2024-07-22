import { useUser } from "@clerk/nextjs";
import Link from "next/link";

function DropdownMenu() {
  const { user } = useUser();
  return (
    <ul className="absolute bg-secondary py-2 rounded-md shadow-md">
      {user && (
        <Link href="/dashboard">
          <li className="hover:text-primary px-4 py-1 cursor-pointer hover:font-semibold">
            Dashboard
          </li>
        </Link>
      )}
      <Link href="/dashboard/questions">
        <li className="hover:text-primary px-4 py-1 cursor-pointer hover:font-semibold">
          Questions
        </li>
      </Link>
      <Link href="/pricing">
        <li className="hover:text-primary px-4 py-1 cursor-pointer hover:font-semibold">
          Upgrade
        </li>
      </Link>
      <Link href="/dashboard/how">
        <li className="hover:text-primary px-4 py-1 cursor-pointer hover:font-semibold">
          How it Works?
        </li>
      </Link>
    </ul>
  );
}

export default DropdownMenu;
