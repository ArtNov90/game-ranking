import { Navigate, Route, Routes } from "react-router";
import { Navbar } from "./components/Navbar";
import { RankingPage } from "./pages/RankingPage";
import { MyGamesPage } from "./pages/MyGamesPage";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-5xl p-8">
        <Routes>
          <Route path="/" element={<Navigate to="/classement" replace />} />
          <Route path="/classement" element={<RankingPage />} />
          <Route path="/mes-jeux" element={<MyGamesPage />} />
          <Route path="*" element={<p>Page introuvable.</p>} />
        </Routes>
      </main>
    </div>
  );
}