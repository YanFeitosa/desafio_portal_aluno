import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { GradeForm } from "../../../components/grades/GradeForm";
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
import { createGrade, updateGrade } from "../../grades/services/gradeService";
import type { GradeFormValues } from "../../grades/types";
import {
  getStudent,
  listStudentEnrollments,
} from "../../students/services/studentService";
import type { Student, StudentEnrollment } from "../../students/types";

type Feedback = {
  type: "success" | "error";
  message: string;
};

type ActiveGradeForm =
  | {
      mode: "create";
      enrollmentId: number;
    }
  | {
      mode: "edit";
      enrollmentId: number;
      gradeId: number;
      initialValues: GradeFormValues;
    };

function formatScore(score: string) {
  const numericScore = Number(score);

  if (Number.isNaN(numericScore)) {
    return score;
  }

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(numericScore);
}

function isPositiveInteger(value: number) {
  return Number.isInteger(value) && value > 0;
}

export function StudentAcademicPage() {
  const params = useParams<{ id: string }>();
  const studentId = Number(params.id);
  const hasInvalidStudentId = !params.id || !isPositiveInteger(studentId);

  const [student, setStudent] = useState<Student | null>(null);
  const [enrollments, setEnrollments] = useState<StudentEnrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [activeGradeForm, setActiveGradeForm] =
    useState<ActiveGradeForm | null>(null);

  async function loadAcademicData() {
    if (hasInvalidStudentId) {
      return;
    }

    try {
      setError("");
      setIsLoading(true);

      const [nextStudent, nextEnrollments] = await Promise.all([
        getStudent(studentId),
        listStudentEnrollments(studentId),
      ]);

      setStudent(nextStudent);
      setEnrollments(nextEnrollments);
    } catch {
      setError("Não foi possível carregar os dados acadêmicos do aluno.");
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshEnrollments() {
    const nextEnrollments = await listStudentEnrollments(studentId);
    setEnrollments(nextEnrollments);
  }

  useEffect(() => {
    if (hasInvalidStudentId) {
      return;
    }

    let isActive = true;

    Promise.all([getStudent(studentId), listStudentEnrollments(studentId)])
      .then(([nextStudent, nextEnrollments]) => {
        if (isActive) {
          setError("");
          setStudent(nextStudent);
          setEnrollments(nextEnrollments);
        }
      })
      .catch(() => {
        if (isActive) {
          setError("Não foi possível carregar os dados acadêmicos do aluno.");
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
  }, [hasInvalidStudentId, studentId]);

  async function handleSubmitGrade(data: GradeFormValues) {
    if (!activeGradeForm) {
      return;
    }

    try {
      setFeedback(null);
      setIsSubmitting(true);

      if (activeGradeForm.mode === "create") {
        await createGrade({
          enrollmentId: activeGradeForm.enrollmentId,
          evaluationName: data.evaluationName,
          score: data.score,
        });

        setFeedback({
          type: "success",
          message: "Nota lançada com sucesso.",
        });
      } else {
        await updateGrade(activeGradeForm.gradeId, {
          evaluationName: data.evaluationName,
          score: data.score,
        });

        setFeedback({
          type: "success",
          message: "Nota atualizada com sucesso.",
        });
      }

      setActiveGradeForm(null);
      await refreshEnrollments();
    } catch {
      setFeedback({
        type: "error",
        message: "Não foi possível salvar a nota.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (hasInvalidStudentId) {
    return (
      <section>
        <PageHeader title="Gestão acadêmica" />
        <Card>
          <ErrorState title="Aluno inválido" message="Aluno inválido." />
        </Card>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section>
        <PageHeader title="Gestão acadêmica" />
        <Card>
          <LoadingState message="Carregando dados acadêmicos..." />
        </Card>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <PageHeader title="Gestão acadêmica" />
        <Card>
          <ErrorState
            message={error}
            onRetry={() => void loadAcademicData()}
          />
        </Card>
      </section>
    );
  }

  if (!student) {
    return (
      <section>
        <PageHeader title="Gestão acadêmica" />
        <Card>
          <EmptyState
            title="Nenhum aluno encontrado"
            message="Nenhum aluno encontrado."
          />
        </Card>
      </section>
    );
  }

  return (
    <section>
      <PageHeader
        title={student.user.name}
        actions={
          <Button
            type="button"
            variant="secondary"
            onClick={() => void loadAcademicData()}
            disabled={isLoading}
          >
            Recarregar
          </Button>
        }
        details={
          <>
            <Link
              to="/coordinator/students"
              className="text-sm font-semibold text-[#54708c] transition hover:text-[#17324d]"
            >
              Voltar para alunos
            </Link>

            <div className="mt-3 grid gap-3 rounded-lg border border-[#d8e1ea] bg-[#f6f9fb] px-4 py-3 text-sm text-[#526173] sm:grid-cols-2">
              <p>
                E-mail:{" "}
                <strong className="font-semibold text-[#12213a]">
                  {student.user.email}
                </strong>
              </p>

              <p>
                Matrícula:{" "}
                <strong className="font-semibold text-[#12213a]">
                  {student.registrationNumber}
                </strong>
              </p>
            </div>
          </>
        }
      />

      {feedback && (
        <p
          className={[
            "mb-6 rounded-lg px-4 py-3 text-sm",
            feedback.type === "success"
              ? "border border-[#cfe0d9] bg-[#eef7f2] text-[#2f6f5e]"
              : "border border-red-100 bg-red-50 text-red-700",
          ].join(" ")}
        >
          {feedback.message}
        </p>
      )}

      {enrollments.length === 0 ? (
        <Card>
          <EmptyState
            title="Nenhuma disciplina encontrada"
            message="Nenhuma disciplina encontrada para este aluno."
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {enrollments.map((enrollment) => {
            const isCreating =
              activeGradeForm?.mode === "create" &&
              activeGradeForm.enrollmentId === enrollment.id;
            const isEditingThisEnrollment =
              activeGradeForm?.mode === "edit" &&
              activeGradeForm.enrollmentId === enrollment.id;

            return (
              <Card key={enrollment.id} className="overflow-hidden" padding="none">
                <div className="flex flex-col gap-3 border-b border-[#d8e1ea] p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-[#12213a]">
                      {enrollment.subject.name}
                    </h2>

                    <p className="mt-1 text-sm text-[#66768a]">
                      {enrollment.grades.length}{" "}
                      {enrollment.grades.length === 1
                        ? "avaliação registrada"
                        : "avaliações registradas"}
                    </p>
                  </div>

                  <Button
                    type="button"
                    onClick={() =>
                      setActiveGradeForm({
                        mode: "create",
                        enrollmentId: enrollment.id,
                      })
                    }
                    disabled={isSubmitting}
                  >
                    Lançar nota
                  </Button>
                </div>

                <div className="p-5">
                  {isCreating && (
                    <GradeForm
                      key={`create-${enrollment.id}`}
                      submitLabel="Salvar nota"
                      isSubmitting={isSubmitting}
                      onSubmit={handleSubmitGrade}
                      onCancel={() => setActiveGradeForm(null)}
                    />
                  )}

                  {enrollment.grades.length === 0 ? (
                    <EmptyState
                      title="Sem notas registradas"
                      message="Nenhuma nota registrada para esta disciplina."
                    />
                  ) : (
                    <Table>
                      <TableHead>
                        <tr>
                          <TableHeaderCell>Avaliação</TableHeaderCell>
                          <TableHeaderCell align="right">Nota</TableHeaderCell>
                          <TableHeaderCell align="right">Ações</TableHeaderCell>
                        </tr>
                      </TableHead>

                      <TableBody>
                        {enrollment.grades.map((grade) => (
                          <tr key={grade.id}>
                            <TableCell className="text-[#526173]">
                              {grade.evaluationName}
                            </TableCell>
                            <TableCell align="right" strong>
                              {formatScore(grade.score)}
                            </TableCell>
                            <TableCell align="right">
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() =>
                                  setActiveGradeForm({
                                    mode: "edit",
                                    enrollmentId: enrollment.id,
                                    gradeId: grade.id,
                                    initialValues: {
                                      evaluationName: grade.evaluationName,
                                      score: Number(grade.score),
                                    },
                                  })
                                }
                                disabled={isSubmitting}
                              >
                                Editar
                              </Button>
                            </TableCell>
                          </tr>
                        ))}
                      </TableBody>
                    </Table>
                  )}

                  {isEditingThisEnrollment && activeGradeForm.mode === "edit" && (
                    <GradeForm
                      key={`edit-${activeGradeForm.gradeId}`}
                      initialValues={activeGradeForm.initialValues}
                      submitLabel="Salvar alteração"
                      isSubmitting={isSubmitting}
                      onSubmit={handleSubmitGrade}
                      onCancel={() => setActiveGradeForm(null)}
                    />
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
