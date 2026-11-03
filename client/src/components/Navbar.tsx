import { Link, NavLink } from "react-router";

function linkClass({ isActive }: { isActive: boolean }) {
  return `rounded-lg px-3 py-2 font-medium ${
    isActive ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
  }`;
}

export function Navbar() {
  return (
    <header className="border-b border-slate-800">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-8 py-4">
        <Link to="/" className="text-xl font-bold text-emerald-400">
          Game Ranking
        </Link>

        <div className="flex gap-2">
          <NavLink to="/classement" className={linkClass}>
            Classement
          </NavLink>
          <NavLink to="/mes-jeux" className={linkClass}>
            Mes jeux
          </NavLink>
        </div>
      </nav>
    </header>
  );
}