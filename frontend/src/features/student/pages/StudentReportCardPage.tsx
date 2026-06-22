import { useEffect, useState } from "react";
import { ReportCardTable } from "../../../components/report-card/ReportCardTable";
import { getMyReportCard } from "../../report-card/services/reportCardService";
import type { ReportCardResponse } from "../../report-card/types";

export function StudentReportCardPage() {
  const [reportCard, setReportCard] = useState<ReportCardResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    getMyReportCard()
      .then((data) => {
        if (isActive) {
          setError("");
          setReportCard(data);
        }
      })
      .catch(() => {
        if (isActive) {
          setError("Não foi possível carregar o boletim.");
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

  if (isLoading) {
    return (
      <section className="rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-slate-900">
          Boletim acadêmico
        </h1>

        <p className="mt-4 text-sm text-slate-600">Carregando boletim...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-slate-900">
          Boletim acadêmico
        </h1>

        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      </section>
    );
  }

  if (!reportCard) {
    return (
      <section className="rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-slate-900">
          Boletim acadêmico
        </h1>

        <p className="mt-4 text-sm text-slate-600">
          Nenhum boletim encontrado.
        </p>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-6 rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-slate-900">
          Boletim acadêmico
        </h1>

        <p className="mt-2 text-slate-600">
          Consulte suas notas, médias e situação por disciplina.
        </p>

        <div className="mt-4 grid gap-3 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600 sm:grid-cols-2">
          <p>
            Aluno:{" "}
            <strong className="font-semibold text-slate-900">
              {reportCard.student.name}
            </strong>
          </p>

          <p>
            E-mail:{" "}
            <strong className="font-semibold text-slate-900">
              {reportCard.student.email}
            </strong>
          </p>

          <p>
            Matrícula:{" "}
            <strong className="font-semibold text-slate-900">
              {reportCard.student.registrationNumber}
            </strong>
          </p>
        </div>
      </div>

      {reportCard.subjects.length === 0 ? (
        <div className="rounded-xl bg-white p-6 text-center shadow">
          <p className="text-sm text-slate-600">
            Nenhuma disciplina encontrada no boletim.
          </p>
        </div>
      ) : (
        <ReportCardTable subjects={reportCard.subjects} />
      )}
    </section>
  );
}
