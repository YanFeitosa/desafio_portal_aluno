import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
} from "../../../components/ui";
import { listStudents } from "../../students/services/studentService";
import type { Student } from "../../students/types";

function normalizeSearch(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function filterStudents(students: Student[], searchTerm: string) {
  const normalizedSearch = normalizeSearch(searchTerm);

  if (!normalizedSearch) {
    return students;
  }

  return students.filter((student) => {
    const name = normalizeSearch(student.user.name);
    const registrationNumber = normalizeSearch(student.registrationNumber);

    return (
      name.includes(normalizedSearch) ||
      registrationNumber.includes(normalizedSearch)
    );
  });
}

export function AcademicManagementPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const filteredStudents = useMemo(
    () => filterStudents(students, searchTerm),
    [searchTerm, students]
  );

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
      <PageHeader
        title="Gestão acadêmica"
        description="Encontre um aluno pelo nome ou matrícula para lançar e atualizar notas."
        actions={
          <Button
            type="button"
            variant="secondary"
            onClick={() => void loadStudents()}
            isLoading={isLoading}
            loadingLabel="Recarregando..."
          >
            Recarregar
          </Button>
        }
      />

      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#12213a]">
              Alunos com matrícula ativa
            </h2>

            <p className="mt-1 text-sm text-[#526173]">
              {filteredStudents.length}{" "}
              {filteredStudents.length === 1
                ? "aluno encontrado"
                : "alunos encontrados"}
            </p>
          </div>

          <div className="w-full md:max-w-sm">
            <label
              htmlFor="academic-search"
              className="text-sm font-semibold text-[#24364f]"
            >
              Buscar
            </label>

            <input
              id="academic-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="mt-1 w-full rounded-lg border border-[#c8d3df] px-3 py-2 text-[#12213a] outline-none transition placeholder:text-slate-400 focus:border-[#17324d] focus:ring-2 focus:ring-[#17324d]/10"
              placeholder="Nome ou matrícula"
            />
          </div>
        </div>

        {isLoading && (
          <LoadingState className="mt-5" message="Carregando alunos..." />
        )}

        {!isLoading && error && (
          <ErrorState
            className="mt-5"
            message={error}
            onRetry={() => void loadStudents()}
          />
        )}

        {!isLoading && !error && students.length === 0 && (
          <EmptyState
            className="mt-5"
            title="Nenhum aluno encontrado"
            message="Nenhum aluno encontrado."
          />
        )}

        {!isLoading &&
          !error &&
          students.length > 0 &&
          filteredStudents.length === 0 && (
            <EmptyState
              className="mt-5"
              title="Nenhum resultado"
              message="Nenhum aluno encontrado para a busca informada."
            />
          )}

        {!isLoading && !error && filteredStudents.length > 0 && (
          <>
            <div className="mt-5 hidden md:block">
              <Table>
                <TableHead>
                  <tr>
                    <TableHeaderCell>Aluno</TableHeaderCell>
                    <TableHeaderCell>E-mail</TableHeaderCell>
                    <TableHeaderCell>Matrícula</TableHeaderCell>
                    <TableHeaderCell align="right">Ações</TableHeaderCell>
                  </tr>
                </TableHead>

                <TableBody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <TableCell strong>{student.user.name}</TableCell>
                      <TableCell>{student.user.email}</TableCell>
                      <TableCell>{student.registrationNumber}</TableCell>
                      <TableCell align="right">
                        <Link
                          to={`/coordinator/grades/${student.id}`}
                          className="inline-flex min-h-9 items-center rounded-lg bg-[#17324d] px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-slate-900/10 transition hover:bg-[#214666]"
                        >
                          Gerenciar notas
                        </Link>
                      </TableCell>
                    </tr>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-5 space-y-3 md:hidden">
              {filteredStudents.map((student) => (
                <article
                  key={student.id}
                  className="rounded-lg border border-[#d8e1ea] bg-[#fbfcfd] p-4"
                >
                  <h3 className="font-semibold text-[#12213a]">
                    {student.user.name}
                  </h3>

                  <dl className="mt-3 space-y-2 text-sm text-[#526173]">
                    <div>
                      <dt className="font-semibold text-[#24364f]">E-mail</dt>
                      <dd className="break-words">{student.user.email}</dd>
                    </div>

                    <div>
                      <dt className="font-semibold text-[#24364f]">
                        Matrícula
                      </dt>
                      <dd>{student.registrationNumber}</dd>
                    </div>
                  </dl>

                  <Link
                    to={`/coordinator/grades/${student.id}`}
                    className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-[#17324d] px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-slate-900/10 transition hover:bg-[#214666]"
                  >
                    Gerenciar notas
                  </Link>
                </article>
              ))}
            </div>
          </>
        )}
      </Card>
    </section>
  );
}
