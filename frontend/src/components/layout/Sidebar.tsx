import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";
import type { UserRole } from "../../types/role";

type NavigationItem = {
  label: string;
  path?: string;
  end?: boolean;
  disabled?: boolean;
  activePrefixes?: string[];
};

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const navigationByRole: Record<UserRole, NavigationItem[]> = {
  COORDINATOR: [
    { label: "Dashboard", path: "/coordinator", end: true },
    { label: "Avisos", path: "/coordinator/notices" },
    {
      label: "Notas",
      path: "/coordinator/grades",
      activePrefixes: ["/coordinator/students/"],
    },
    { label: "Alunos", path: "/coordinator/students", end: true },
    { label: "Disciplinas", disabled: true },
  ],
  STUDENT: [
    { label: "Início", path: "/student", end: true },
    { label: "Avisos", path: "/student/notices" },
    { label: "Boletim", path: "/student/report-card" },
    { label: "Meu perfil", disabled: true },
  ],
};

function getRoleLabel(role?: UserRole) {
  return role === "COORDINATOR" ? "Coordenação" : "Aluno";
}

function getNavigationClassName(isActive: boolean) {
  return [
    "flex min-h-10 items-center rounded-lg px-3 py-2 text-sm font-medium transition",
    isActive
      ? "bg-slate-900 text-white"
      : "text-slate-700 hover:bg-slate-100",
  ].join(" ");
}

function SidebarContent({
  items,
  onNavigate,
  roleLabel,
}: {
  items: NavigationItem[];
  onNavigate?: () => void;
  roleLabel: string;
}) {
  const location = useLocation();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-lg font-bold text-slate-900">Portal do Aluno</h1>
        <p className="text-sm text-slate-500">{roleLabel}</p>
      </div>

      <nav className="space-y-1" aria-label="Navegação principal">
        {items.map((item) => {
          if (!item.path || item.disabled) {
            return (
              <span
                key={item.label}
                aria-disabled="true"
                title="Preparado para etapa futura"
                className="flex min-h-10 cursor-not-allowed items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-400"
              >
                {item.label}
              </span>
            );
          }

          const hasActivePrefix = item.activePrefixes?.some((prefix) =>
            location.pathname.startsWith(prefix)
          );

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                getNavigationClassName(isActive || !!hasActivePrefix)
              }
            >
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();
  const items = user ? navigationByRole[user.role] : [];
  const roleLabel = getRoleLabel(user?.role);

  return (
    <>
      <aside className="hidden min-h-screen w-72 shrink-0 border-r border-slate-200 bg-white p-4 lg:block">
        <SidebarContent items={items} roleLabel={roleLabel} />
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            className="absolute inset-0 h-full w-full bg-slate-950/40"
            onClick={onClose}
          />

          <aside className="relative z-10 flex h-full w-[min(20rem,86vw)] flex-col border-r border-slate-200 bg-white p-4 shadow-xl">
            <SidebarContent
              items={items}
              onNavigate={onClose}
              roleLabel={roleLabel}
            />
          </aside>
        </div>
      )}
    </>
  );
}
