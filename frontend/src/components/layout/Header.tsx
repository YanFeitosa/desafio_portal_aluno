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
    <header className="sticky top-0 z-30 border-b border-[#d8e1ea] bg-white/95 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMenuOpen}
            onClick={onMenuToggle}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#c8d3df] bg-white transition hover:bg-[#f6f9fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#54708c] lg:hidden"
          >
            <span className="flex flex-col gap-1.5" aria-hidden="true">
              <span className="h-0.5 w-5 rounded-full bg-[#24364f]" />
              <span className="h-0.5 w-5 rounded-full bg-[#24364f]" />
              <span className="h-0.5 w-5 rounded-full bg-[#24364f]" />
            </span>
          </button>

          <div className="min-w-0">
            <strong className="block truncate text-sm font-bold text-[#12213a]">
              Portal do Aluno
            </strong>

            <span className="text-xs text-[#66768a]">
              {roleLabel === "Coordenação"
                ? "Área da Coordenação"
                : "Área do Aluno"}
            </span>
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-3">
          <div className="hidden min-w-0 text-right sm:block">
            <p className="truncate text-sm font-semibold text-[#12213a]">
              {user?.name}
            </p>
            <p className="truncate text-xs text-[#66768a]">{user?.email}</p>
          </div>

          <span className="hidden rounded-full border border-[#cfe0d9] bg-[#eef7f2] px-3 py-1 text-xs font-semibold text-[#2f6f5e] md:inline-flex">
            {roleLabel}
          </span>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleLogout}
          >
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}
