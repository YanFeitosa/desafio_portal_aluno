import { useEffect, useState } from "react";
import { NoticeCard } from "../../../components/notices/NoticeCard";
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
      <section className="rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-slate-900">
          Avisos
        </h1>

        <p className="mt-4 text-sm text-slate-600">
          Carregando avisos...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-slate-900">
          Avisos
        </h1>

        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      </section>
    );
  }
  
  return (
    <section>
      <div className="mb-6 rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-slate-900">
          Avisos
        </h1>

        <p className="mt-2 text-slate-600">
          Acompanhe os comunicados mais recentes publicados pela coordenação.
        </p>
      </div>

      {notices.length === 0 ? (
        <div className="rounded-xl bg-white p-6 text-center shadow">
          <p className="text-sm text-slate-600">
            Nenhum aviso publicado até o momento.
          </p>
        </div>
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