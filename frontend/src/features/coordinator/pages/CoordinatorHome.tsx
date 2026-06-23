import { Link } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { PageHeader } from "../../../components/ui";

export function CoordinatorHome() {
  const { user } = useAuth();

  return (
    <section>
      <PageHeader
        title="Painel da Coordenação"
        description={`Bem-vindo, ${user?.name}. Use o menu para gerenciar os fluxos administrativos do portal.`}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Link
          to="/coordinator/notices"
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          <p className="text-sm text-slate-500">Mural</p>
          <strong className="mt-1 block text-lg text-slate-900">
            Avisos institucionais
          </strong>
        </Link>

        <Link
          to="/coordinator/students"
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          <p className="text-sm text-slate-500">Acadêmico</p>
          <strong className="mt-1 block text-lg text-slate-900">
            Gestão de alunos
          </strong>
        </Link>

        <Link
          to="/coordinator/grades"
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          <p className="text-sm text-slate-500">Notas</p>
          <strong className="mt-1 block text-lg text-slate-900">
            Boletins e avaliações
          </strong>
        </Link>
      </div>
    </section>
  );
}
