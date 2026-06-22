import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { GradeForm } from "../../../components/grades/GradeForm";
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
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-slate-900">
          Gestão acadêmica
        </h1>

        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          Aluno inválido.
        </p>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-slate-900">
          Gestão acadêmica
        </h1>

        <p className="mt-4 text-sm text-slate-600">
          Carregando dados acadêmicos...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-slate-900">
          Gestão acadêmica
        </h1>

        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>

        <button
          type="button"
          onClick={() => void loadAcademicData()}
          className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Tentar novamente
        </button>
      </section>
    );
  }

  if (!student) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-slate-900">
          Gestão acadêmica
        </h1>

        <p className="mt-4 text-sm text-slate-600">
          Nenhum aluno encontrado.
        </p>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              to="/coordinator/students"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Voltar para alunos
            </Link>

            <h1 className="mt-3 text-2xl font-bold text-slate-900">
              {student.user.name}
            </h1>

            <div className="mt-3 grid gap-3 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600 sm:grid-cols-2">
              <p>
                E-mail:{" "}
                <strong className="font-semibold text-slate-900">
                  {student.user.email}
                </strong>
              </p>

              <p>
                Matrícula:{" "}
                <strong className="font-semibold text-slate-900">
                  {student.registrationNumber}
                </strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void loadAcademicData()}
            disabled={isLoading}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Recarregar
          </button>
        </div>
      </div>

      {feedback && (
        <p
          className={[
            "mb-6 rounded-lg px-4 py-3 text-sm",
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700",
          ].join(" ")}
        >
          {feedback.message}
        </p>
      )}

      {enrollments.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow">
          <p className="text-sm text-slate-600">
            Nenhuma disciplina encontrada para este aluno.
          </p>
        </div>
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
              <section
                key={enrollment.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow"
              >
                <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {enrollment.subject.name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {enrollment.grades.length}{" "}
                      {enrollment.grades.length === 1
                        ? "avaliação registrada"
                        : "avaliações registradas"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveGradeForm({
                        mode: "create",
                        enrollmentId: enrollment.id,
                      })
                    }
                    disabled={isSubmitting}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Lançar nota
                  </button>
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
                    <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
                      Nenhuma nota registrada para esta disciplina.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                          <tr>
                            <th className="px-4 py-3 font-medium">
                              Avaliação
                            </th>
                            <th className="px-4 py-3 text-right font-medium">
                              Nota
                            </th>
                            <th className="px-4 py-3 text-right font-medium">
                              Ações
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                          {enrollment.grades.map((grade) => (
                            <tr key={grade.id}>
                              <td className="px-4 py-3 text-slate-700">
                                {grade.evaluationName}
                              </td>
                              <td className="px-4 py-3 text-right font-medium text-slate-900">
                                {formatScore(grade.score)}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  type="button"
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
                                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  Editar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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
              </section>
            );
          })}
        </div>
      )}
    </section>
  );
}
