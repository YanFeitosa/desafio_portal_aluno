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
    return "border border-[#cfe0d9] bg-[#eef7f2] text-[#2f6f5e]";
  }

  if (status === "Reprovado") {
    return "border border-red-100 bg-red-50 text-red-700";
  }

  return "border border-[#d8e1ea] bg-[#f4f8fa] text-[#526173]";
}

function getGradeCountLabel(count: number) {
  return count === 1 ? "1 avaliação registrada" : `${count} avaliações registradas`;
}

export function ReportCardTable({ subjects }: ReportCardTableProps) {
  return (
    <div className="space-y-4">
      {subjects.map((subject) => (
        <Card key={subject.id} className="overflow-hidden" padding="none">
          <div className="flex flex-col gap-3 border-b border-[#d8e1ea] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#12213a]">
                {subject.name}
              </h2>

              <p className="mt-1 text-sm text-[#66768a]">
                {getGradeCountLabel(subject.grades.length)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-medium text-[#66768a]">Média</p>
                <strong className="text-lg text-[#12213a]">
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
