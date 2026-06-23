import { useEffect, useState } from "react";
import { NoticeCard } from "../../../components/notices/NoticeCard";
import {
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
} from "../../../components/ui";
import { listNotices } from "../../notices/services/noticeService";
import type { Notice } from "../../notices/types";

export function StudentNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadNotices() {
      try {
        setError("");
        setIsLoading(true);

        const data = await listNotices();
        setNotices(data);
      } catch {
        setError("Não foi possível carregar os avisos.");
      } finally {
        setIsLoading(false);
      }
    }

    loadNotices();
  }, []);

  if (isLoading) {
    return (
      <section>
        <PageHeader title="Avisos" />
        <Card>
          <LoadingState message="Carregando avisos..." />
        </Card>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <PageHeader title="Avisos" />
        <Card>
          <ErrorState message={error} />
        </Card>
      </section>
    );
  }
  
  return (
    <section>
      <PageHeader
        title="Avisos"
        description="Acompanhe os comunicados mais recentes publicados pela coordenação."
      />

      {notices.length === 0 ? (
        <Card>
          <EmptyState
            title="Nenhum aviso publicado"
            message="Nenhum aviso publicado até o momento."
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice}
             />
          ))}
        </div>
      )}
    </section>
  );
}
