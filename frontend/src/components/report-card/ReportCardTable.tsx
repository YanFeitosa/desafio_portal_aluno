import type {
  ReportCardSubject,
  ReportCardSubjectStatus,
} from "../../features/report-card/types";
import {
  Card,
  EmptyState,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
} from "../ui";

type ReportCardTableProps = {
  subjects: ReportCardSubject[];
};

function formatScore(score: number | null) {
  if (score === null) {
    return "-";
  }

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(score);
}

function getStatusClassName(status: ReportCardSubjectStatus) {
  if (status === "Aprovado") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status === "Reprovado") {
    return "bg-red-50 text-red-700";
  }

  return "bg-slate-100 text-slate-700";
}

export function ReportCardTable({ subjects }: ReportCardTableProps) {
  return (
    <div className="space-y-4">
      {subjects.map((subject) => (
        <Card key={subject.id} className="overflow-hidden" padding="none">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {subject.name}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {subject.grades.length} avaliação
                {subject.grades.length === 1 ? "" : "ões"} registrada
                {subject.grades.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-slate-500">Média</p>
                <strong className="text-lg text-slate-900">
                  {formatScore(subject.average)}
                </strong>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClassName(
                  subject.status
                )}`}
              >
                {subject.status}
              </span>
            </div>
          </div>

          {subject.grades.length === 0 ? (
            <div className="p-5">
              <EmptyState
                title="Sem notas registradas"
                message="Nenhuma nota registrada para esta disciplina."
              />
            </div>
          ) : (
            <Table>
              <TableHead>
                <tr>
                  <TableHeaderCell className="px-5">Avaliação</TableHeaderCell>
                  <TableHeaderCell className="px-5" align="right">
                    Nota
                  </TableHeaderCell>
                </tr>
              </TableHead>

              <TableBody>
                {subject.grades.map((grade) => (
                  <tr key={grade.id}>
                    <TableCell className="px-5 text-slate-700">
                      {grade.evaluationName}
                    </TableCell>

                    <TableCell className="px-5" align="right" strong>
                      {formatScore(grade.score)}
                    </TableCell>
                  </tr>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      ))}
    </div>
  );
}
