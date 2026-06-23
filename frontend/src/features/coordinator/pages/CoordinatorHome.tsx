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

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          to="/coordinator/notices"
          className="rounded-lg border border-[#d8e1ea] border-l-4 border-l-[#2f6f5e] bg-white p-5 shadow-sm shadow-slate-900/5 transition hover:-translate-y-0.5 hover:border-[#b7c6d6] hover:bg-[#fbfcfd]"
        >
          <p className="text-sm font-semibold text-[#2f6f5e]">Mural</p>
          <strong className="mt-1 block text-lg text-[#12213a]">
            Avisos institucionais
          </strong>
        </Link>

        <Link
          to="/coordinator/grades"
          className="rounded-lg border border-[#d8e1ea] border-l-4 border-l-[#b88746] bg-white p-5 shadow-sm shadow-slate-900/5 transition hover:-translate-y-0.5 hover:border-[#b7c6d6] hover:bg-[#fbfcfd]"
        >
          <p className="text-sm font-semibold text-[#9a6b2f]">Acadêmico</p>
          <strong className="mt-1 block text-lg text-[#12213a]">
            Gestão acadêmica
          </strong>
        </Link>
      </div>
    </section>
  );
}
