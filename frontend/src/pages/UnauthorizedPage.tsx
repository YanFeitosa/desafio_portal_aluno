import { Link } from "react-router-dom";

export function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow">
        <h1 className="text-2xl font-bold text-slate-900">
          Acesso não autorizado
        </h1>

        <p className="mt-2 text-slate-600">
          Seu perfil não possui permissão para acessar esta página.
        </p>

        <Link
          to="/login"
          className="mt-6 inline-block rounded-lg bg-slate-900 px-4 py-2 text-white"
        >
          Voltar para o login
        </Link>
      </section>
    </main>
  );
}
