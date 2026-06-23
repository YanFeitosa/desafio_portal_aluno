import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";
import { Button } from "../ui";

type HeaderProps = {
  isMenuOpen: boolean;
  onMenuToggle: () => void;
};

function getRoleLabel(role?: string) {
  return role === "COORDINATOR" ? "Coordenação" : "Aluno";
}

export function Header({ isMenuOpen, onMenuToggle }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const roleLabel = getRoleLabel(user?.role);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMenuOpen}
            onClick={onMenuToggle}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 lg:hidden"
          >
            <span className="flex flex-col gap-1.5" aria-hidden="true">
              <span className="h-0.5 w-5 rounded-full bg-slate-700" />
              <span className="h-0.5 w-5 rounded-full bg-slate-700" />
              <span className="h-0.5 w-5 rounded-full bg-slate-700" />
            </span>
          </button>

          <div className="min-w-0">
            <strong className="block truncate text-sm font-semibold text-slate-900">
              Portal do Aluno
            </strong>

            <span className="text-xs text-slate-500">
              {roleLabel === "Coordenação"
                ? "Área da Coordenação"
                : "Área do Aluno"}
            </span>
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-3">
          <div className="hidden min-w-0 text-right sm:block">
            <p className="truncate text-sm font-medium text-slate-900">
              {user?.name}
            </p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>

          <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 md:inline-flex">
            {roleLabel}
          </span>

          <Button type="button" variant="secondary" size="sm" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}
