import { useEffect, useState } from "react";
import type { SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button, LoadingState } from "../../../components/ui";
import { useAuth } from "../useAuth";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (user.role === "COORDINATOR") {
      navigate("/coordinator", { replace: true });
      return;
    }

    navigate("/student", { replace: true });
  }, [navigate, user]);

  if (user) {
    return <LoadingState fullPage message="Redirecionando..." />;
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault();

    try {
      setError("");
      setIsSubmitting(true);

      const loggedUser = await login({
        email,
        password,
      });

      if (loggedUser.role === "COORDINATOR") {
        navigate("/coordinator", { replace: true });
        return;
      }

      if (loggedUser.role === "STUDENT") {
        navigate("/student", { replace: true });
        return;
      }

      navigate("/", { replace: true });
    } catch {
      setError("E-mail ou senha inválidos.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md overflow-hidden rounded-lg border border-[#d8e1ea] bg-white shadow-lg shadow-slate-900/10">
        <div className="h-2 bg-[#2f6f5e]" />

        <div className="p-8">
        <div>
          <span className="inline-flex rounded-full border border-[#cfe0d9] bg-[#eef7f2] px-3 py-1 text-xs font-semibold text-[#2f6f5e]">
            Ambiente acadêmico
          </span>

          <h1 className="mt-4 text-3xl font-bold text-[#12213a]">
            Portal do Aluno
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#526173]">
            Acesse sua conta institucional para consultar avisos e boletins.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-semibold text-[#24364f]"
            >
              E-mail
            </label>

            <input
              id="email"
              type="email"
              className="mt-1 w-full rounded-lg border border-[#c8d3df] px-3 py-2 text-[#12213a] outline-none transition placeholder:text-slate-400 focus:border-[#17324d] focus:ring-2 focus:ring-[#17324d]/10"
              placeholder="seu@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm font-semibold text-[#24364f]"
            >
              Senha
            </label>

            <input
              id="password"
              type="password"
              className="mt-1 w-full rounded-lg border border-[#c8d3df] px-3 py-2 text-[#12213a] outline-none transition placeholder:text-slate-400 focus:border-[#17324d] focus:ring-2 focus:ring-[#17324d]/10"
              placeholder="Sua senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            fullWidth
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        </div>
      </section>
    </main>
  );
}
