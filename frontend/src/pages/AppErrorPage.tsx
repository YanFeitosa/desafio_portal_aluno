import {
  isRouteErrorResponse,
  Link,
  useNavigate,
  useRouteError,
} from "react-router-dom";

export function AppErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = "Algo deu errado";
  let message =
    "Ocorreu um erro inesperado durante a navegação. Tente novamente ou volte para uma página segura.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} - ${error.statusText}`;

    if (
      typeof error.data === "object" &&
      error.data !== null &&
      "message" in error.data
    ) {
      message = String(error.data.message);
    }

    if (typeof error.data === "string") {
      message = error.data;
    }
  }

  if (error instanceof Error) {
    message = error.message;
  }

  function handleReload() {
    window.location.reload();
  }

  function handleBack() {
    navigate(-1);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-xl rounded-xl bg-white p-8 shadow">
        <div className="rounded-lg bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-700">
            Erro inesperado
          </p>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-slate-900">
          {title}
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          {message}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleBack}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Voltar
          </button>

          <button
            type="button"
            onClick={handleReload}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Recarregar
          </button>

          <Link
            to="/login"
            className="rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Ir para login
          </Link>
        </div>

        {import.meta.env.DEV && error instanceof Error && error.stack && (
          <details className="mt-6 rounded-lg bg-slate-950 p-4 text-xs text-slate-100">
            <summary className="cursor-pointer font-medium">
              Detalhes técnicos
            </summary>

            <pre className="mt-4 overflow-auto whitespace-pre-wrap">
              {error.stack}
            </pre>
          </details>
        )}
      </section>
    </main>
  );
}