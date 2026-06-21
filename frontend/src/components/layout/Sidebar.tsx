import { NavLink } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";

type NavigationItem = {
  label: string;
  path: string;
};

export function Sidebar() {
  const { user } = useAuth();

  const coordinatorItems: NavigationItem[] = [
    {
      label: "Início",
      path: "/coordinator",
    },
  ];

  const studentItems: NavigationItem[] = [
  {
    label: "Início",
    path: "/student",
  },
  {
    label: "Avisos",
    path: "/student/notices",
  },
  {
    label: "Boletim",
    path: "/student/report-card",
  },
];

  const items = user?.role === "COORDINATOR" ? coordinatorItems : studentItems;

  return (
    <aside className="hidden min-h-screen w-64 border-r border-slate-200 bg-white p-4 md:block">
      <div className="mb-8">
        <h1 className="text-lg font-bold text-slate-900">Portal do Aluno</h1>
        <p className="text-sm text-slate-500">Ambiente acadêmico</p>
      </div>

      <nav className="space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              [
                "block rounded-lg px-3 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100",
              ].join(" ")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}