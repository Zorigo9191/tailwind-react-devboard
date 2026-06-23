import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout() {
  return (
    <div>
      <Header />
      <main className="mx-auto py-4 container">
        <Outlet />
      </main>
    </div>
  );
}
