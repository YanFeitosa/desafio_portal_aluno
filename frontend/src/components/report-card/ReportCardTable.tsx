import type {
  ReportCardSubject,
  ReportCardSubjectStatus,
} from "../../features/report-card/types";

type ReportCardTableProps = {
  subjects: ReportCardSubject[];
};

function formatScore(score: number | null) {
  if (score === null) {
    return "-";
  }

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
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
        <section
          key={subject.id}
          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        >
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
              <p className="text-sm text-slate-600">
                Nenhuma nota registrada para esta disciplina.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-5 py-3 font-medium">Avaliação</th>
                    <th className="px-5 py-3 text-right font-medium">Nota</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {subject.grades.map((grade) => (
                    <tr key={grade.id}>
                      <td className="px-5 py-3 text-slate-700">
                        {grade.evaluationName}
                      </td>

                      <td className="px-5 py-3 text-right font-medium text-slate-900">
                        {formatScore(grade.score)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}