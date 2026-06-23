import { useEffect, useState } from "react";
import { ReportCardTable } from "../../../components/report-card/ReportCardTable";
import {
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
} from "../../../components/ui";
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
      <section>
        <PageHeader title="Boletim acadêmico" />
        <Card>
          <LoadingState message="Carregando boletim..." />
        </Card>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <PageHeader title="Boletim acadêmico" />
        <Card>
          <ErrorState message={error} />
        </Card>
      </section>
    );
  }

  if (!reportCard) {
    return (
      <section>
        <PageHeader title="Boletim acadêmico" />
        <Card>
          <EmptyState
            title="Nenhum boletim encontrado"
            message="Nenhum boletim encontrado."
          />
        </Card>
      </section>
    );
  }

  return (
    <section>
      <PageHeader
        title="Boletim acadêmico"
        description="Consulte suas notas, médias e situação por disciplina."
        details={
          <div className="grid gap-3 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600 sm:grid-cols-2">
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
        }
      />

      {reportCard.subjects.length === 0 ? (
        <Card>
          <EmptyState
            title="Nenhuma disciplina encontrada"
            message="Nenhuma disciplina encontrada no boletim."
          />
        </Card>
      ) : (
        <ReportCardTable subjects={reportCard.subjects} />
      )}
    </section>
  );
}
