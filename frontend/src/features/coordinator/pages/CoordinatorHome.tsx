import { useAuth } from "../../auth/useAuth";

export function CoordinatorHome() {
  const { user } = useAuth();

  return (
    <section className="rounded-xl bg-white p-6 shadow">
      <h1 className="text-2xl font-bold text-slate-900">
        Painel da Coordenação
      </h1>

      <p className="mt-2 text-slate-600">
        Bem-vindo, {user?.name}. Use o menu lateral para gerenciar o portal.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Mural</p>
          <strong className="mt-1 block text-lg text-slate-900">
            Avisos institucionais
          </strong>
        </div>

        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Acadêmico</p>
          <strong className="mt-1 block text-lg text-slate-900">
            Gestão de alunos
          </strong>
        </div>

        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Notas</p>
          <strong className="mt-1 block text-lg text-slate-900">
            Boletins e avaliações
          </strong>
        </div>
      </div>
    </section>
  );
}