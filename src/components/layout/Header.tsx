import { LayoutDashboard, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-black py-5">
      <div className="container mx-auto flex justify-between">
        <Link
          to="/boards"
          className="text-primary flex  gap-2 text-lg items-center"
        >
          <LayoutDashboard className="h-5 w-5" />
          DevBoard
        </Link>

        <Link
          to="/profile"
          className="hover:text-primary text-secondary flex  gap-2 text-lg items-center"
        >
          <UserCircle className="h-5 w-5" />
          <span className="text-secondary">Profil</span>
        </Link>
      </div>
    </header>
  );
}
