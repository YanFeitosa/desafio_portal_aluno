import { Link } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { PageHeader } from "../../../components/ui";

export function StudentHome() {
  const { user } = useAuth();

  return (
    <section>
      <PageHeader
        title="Área do Aluno"
        description={`Bem-vindo, ${user?.name}. Acompanhe avisos institucionais e consulte seu boletim.`}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          to="/student/notices"
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          <p className="text-sm text-slate-500">Mural</p>
          <strong className="mt-1 block text-lg text-slate-900">
            Avisos recentes
          </strong>
        </Link>

        <Link
          to="/student/report-card"
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          <p className="text-sm text-slate-500">Boletim</p>
          <strong className="mt-1 block text-lg text-slate-900">
            Notas por disciplina
          </strong>
        </Link>
      </div>
    </section>
  );
}
