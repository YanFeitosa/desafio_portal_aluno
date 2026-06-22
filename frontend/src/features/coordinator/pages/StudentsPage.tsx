import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listStudents } from "../../students/services/studentService";
import type { Student } from "../../students/types";

export function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadStudents() {
    try {
      setError("");
      setIsLoading(true);

      const data = await listStudents();
      setStudents(data);
    } catch {
      setError("Não foi possível carregar os alunos.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isActive = true;

    listStudents()
      .then((data) => {
        if (isActive) {
          setError("");
          setStudents(data);
        }
      })
      .catch(() => {
        if (isActive) {
          setError("Não foi possível carregar os alunos.");
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section>
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Gestão acadêmica
            </h1>

            <p className="mt-2 text-slate-600">
              Selecione um aluno para lançar ou atualizar notas por disciplina.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadStudents()}
            disabled={isLoading}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Recarregando..." : "Recarregar"}
          </button>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-slate-900">
          Alunos cadastrados
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          {students.length} {students.length === 1 ? "aluno" : "alunos"} na
          listagem.
        </p>

        {isLoading && (
          <p className="mt-5 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Carregando alunos...
          </p>
        )}

        {!isLoading && error && (
          <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {!isLoading && !error && students.length === 0 && (
          <div className="mt-5 rounded-lg border border-dashed border-slate-300 p-6 text-center">
            <p className="text-sm text-slate-600">
              Nenhum aluno encontrado.
            </p>
          </div>
        )}

        {!isLoading && !error && students.length > 0 && (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Aluno</th>
                  <th className="px-4 py-3 font-medium">E-mail</th>
                  <th className="px-4 py-3 font-medium">Matrícula</th>
                  <th className="px-4 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {student.user.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {student.user.email}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {student.registrationNumber}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/coordinator/students/${student.id}`}
                        className="inline-flex rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                      >
                        Gerenciar notas
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}
