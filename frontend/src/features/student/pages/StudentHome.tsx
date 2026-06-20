import { Link } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

export function StudentHome() {
  const { user } = useAuth();

  return (
    <section className="rounded-xl bg-white p-6 shadow">
      <h1 className="text-2xl font-bold text-slate-900">
        Área do Aluno
      </h1>

      <p className="mt-2 text-slate-600">
        Bem-vindo, {user?.name}. Aqui você poderá acompanhar avisos e boletim.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Link
          to="/student/notices"
          className="rounded-lg border border-slate-200 p-4 transition hover:border-slate-400 hover:bg-slate-50"
        >
          <p className="text-sm text-slate-500">Mural</p>
          <strong className="mt-1 block text-lg text-slate-900">
            Avisos recentes
          </strong>
        </Link>

        <div className="rounded-lg border border-slate-200 p-4 opacity-70">
          <p className="text-sm text-slate-500">Boletim</p>
          <strong className="mt-1 block text-lg text-slate-900">
            Notas por disciplina
          </strong>
          <span className="mt-2 block text-xs text-slate-500">
            Em breve
          </span>
        </div>
      </div>
    </section>
  );
}