import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";
import type { UserRole } from "../../types/role";

type NavigationItem = {
  label: string;
  path?: string;
  end?: boolean;
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
      label: "Gestão acadêmica",
      path: "/coordinator/grades",
      activePrefixes: ["/coordinator/grades/"],
    },
  ],
  STUDENT: [
    { label: "Início", path: "/student", end: true },
    { label: "Avisos", path: "/student/notices" },
    { label: "Boletim", path: "/student/report-card" },
  ],
};

function getRoleLabel(role?: UserRole) {
  return role === "COORDINATOR" ? "Coordenação" : "Aluno";
}

function getNavigationClassName(isActive: boolean) {
  return [
    "flex min-h-10 items-center rounded-lg px-3 py-2 text-sm font-semibold transition",
    isActive
      ? "bg-[#17324d] text-white shadow-sm shadow-slate-900/10"
      : "text-[#43536a] hover:bg-[#eef4f7] hover:text-[#12213a]",
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
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#c8d3df] bg-[#f6f9fb] text-sm font-bold text-[#17324d]">
            PA
          </span>

          <div>
            <h1 className="text-lg font-bold text-[#12213a]">
              Portal do Aluno
            </h1>
            <p className="text-sm text-[#66768a]">{roleLabel}</p>
          </div>
        </div>
      </div>

      <nav className="space-y-1" aria-label="Navegação principal">
        {items.map((item) => {
          const hasActivePrefix = item.activePrefixes?.some((prefix) =>
            location.pathname.startsWith(prefix)
          );

          return (
            <NavLink
              key={item.path}
              to={item.path!}
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
      <aside className="hidden min-h-screen w-72 shrink-0 border-r border-[#d8e1ea] bg-white/95 p-4 shadow-sm shadow-slate-900/5 lg:block">
        <SidebarContent items={items} roleLabel={roleLabel} />
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            className="absolute inset-0 h-full w-full bg-[#12213a]/45"
            onClick={onClose}
          />

          <aside className="relative z-10 flex h-full w-[min(20rem,86vw)] flex-col border-r border-[#d8e1ea] bg-white p-4 shadow-xl">
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
