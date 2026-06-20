import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <strong className="block text-sm font-semibold text-slate-900">
          Portal do Aluno
        </strong>

        <span className="text-xs text-slate-500">
          {user?.role === "COORDINATOR" ? "Área da Coordenação" : "Área do Aluno"}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-900">{user?.name}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Sair
        </button>
      </div>
    </header>
  );
}