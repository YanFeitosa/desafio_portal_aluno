import { useEffect, useState } from "react";
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
      <PageHeader
        title="Gestão acadêmica"
        description="Selecione um aluno para lançar ou atualizar notas por disciplina."
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
        <h2 className="text-lg font-semibold text-slate-900">
          Alunos cadastrados
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          {students.length} {students.length === 1 ? "aluno" : "alunos"} na
          listagem.
        </p>

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

        {!isLoading && !error && students.length > 0 && (
          <Table containerClassName="mt-5">
            <TableHead>
              <tr>
                <TableHeaderCell>Aluno</TableHeaderCell>
                <TableHeaderCell>E-mail</TableHeaderCell>
                <TableHeaderCell>Matrícula</TableHeaderCell>
                <TableHeaderCell align="right">Ações</TableHeaderCell>
              </tr>
            </TableHead>

            <TableBody>
              {students.map((student) => (
                <tr key={student.id}>
                  <TableCell strong>{student.user.name}</TableCell>
                  <TableCell>{student.user.email}</TableCell>
                  <TableCell>{student.registrationNumber}</TableCell>
                  <TableCell align="right">
                    <Link
                      to={`/coordinator/students/${student.id}`}
                      className="inline-flex min-h-9 items-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                    >
                      Gerenciar notas
                    </Link>
                  </TableCell>
                </tr>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </section>
  );
}
