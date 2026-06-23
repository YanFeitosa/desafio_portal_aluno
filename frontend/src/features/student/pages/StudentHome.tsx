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
          className="rounded-lg border border-[#d8e1ea] border-l-4 border-l-[#2f6f5e] bg-white p-5 shadow-sm shadow-slate-900/5 transition hover:-translate-y-0.5 hover:border-[#b7c6d6] hover:bg-[#fbfcfd]"
        >
          <p className="text-sm font-semibold text-[#2f6f5e]">Mural</p>
          <strong className="mt-1 block text-lg text-[#12213a]">
            Avisos recentes
          </strong>
        </Link>

        <Link
          to="/student/report-card"
          className="rounded-lg border border-[#d8e1ea] border-l-4 border-l-[#b88746] bg-white p-5 shadow-sm shadow-slate-900/5 transition hover:-translate-y-0.5 hover:border-[#b7c6d6] hover:bg-[#fbfcfd]"
        >
          <p className="text-sm font-semibold text-[#9a6b2f]">Boletim</p>
          <strong className="mt-1 block text-lg text-[#12213a]">
            Notas por disciplina
          </strong>
        </Link>
      </div>
    </section>
  );
}
