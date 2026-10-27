import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, LogOutIcon, UserCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";


export default function Header() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogOut() {
    await logout();
    navigate("/login");
  }

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
        <div className="flex gap-4">
          <Link
            to="/profile"
            className="hover:text-primary text-secondary flex  gap-2 text-lg items-center"
          >
            <UserCircle className="h-5 w-5" />
            <span className="text-secondary">
              {profile?.display_name ?? "Profil"}
            </span>
          </Link>

          <button
            onClick={handleLogOut}
            className="hover:text-primary text-secondary flex  gap-2 text-lg items-center"
          >
            <LogOutIcon className="h-5 w-5" />
            <span className="text-secondary">Ausloggen</span>
          </button>
        </div>
      </div>
    </header>
  );
}
