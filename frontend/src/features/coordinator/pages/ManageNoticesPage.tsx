import { useEffect, useMemo, useState } from "react";
import { NoticeForm } from "../../../components/notices/NoticeForm";
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
} from "../../../components/ui";
import {
  createNotice,
  deleteNotice,
  listNotices,
  updateNotice,
} from "../../notices/services/noticeService";
import type { CreateNoticeRequest, Notice } from "../../notices/types";

type Feedback = {
  type: "success" | "error";
  message: string;
};

function formatNoticeDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

export function ManageNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingNoticeId, setDeletingNoticeId] = useState<number | null>(null);
  const [listError, setListError] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [createFormKey, setCreateFormKey] = useState(0);

  const initialValues = useMemo(() => {
    if (!editingNotice) {
      return undefined;
    }

    return {
      title: editingNotice.title,
      content: editingNotice.content,
    };
  }, [editingNotice]);

  async function loadNotices() {
    try {
      setListError("");
      setIsLoading(true);

      const data = await listNotices();
      setNotices(data);
    } catch {
      setListError("Não foi possível carregar os avisos.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isActive = true;

    listNotices()
      .then((data) => {
        if (isActive) {
          setListError("");
          setNotices(data);
        }
      })
      .catch(() => {
        if (isActive) {
          setListError("Não foi possível carregar os avisos.");
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

  async function handleCreateNotice(data: CreateNoticeRequest) {
    try {
      setFeedback(null);
      setIsSubmitting(true);

      await createNotice(data);
      setFeedback({
        type: "success",
        message: "Aviso criado com sucesso.",
      });
      setCreateFormKey((currentKey) => currentKey + 1);
      await loadNotices();
    } catch {
      setFeedback({
        type: "error",
        message: "Não foi possível criar o aviso.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateNotice(data: CreateNoticeRequest) {
    if (!editingNotice) {
      return;
    }

    try {
      setFeedback(null);
      setIsSubmitting(true);

      await updateNotice(editingNotice.id, data);
      setFeedback({
        type: "success",
        message: "Aviso atualizado com sucesso.",
      });
      setEditingNotice(null);
      await loadNotices();
    } catch {
      setFeedback({
        type: "error",
        message: "Não foi possível atualizar o aviso.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteNotice(notice: Notice) {
    const confirmed = window.confirm(
      `Deseja excluir o aviso "${notice.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setFeedback(null);
      setDeletingNoticeId(notice.id);

      await deleteNotice(notice.id);

      if (editingNotice?.id === notice.id) {
        setEditingNotice(null);
      }

      setFeedback({
        type: "success",
        message: "Aviso excluído com sucesso.",
      });
      await loadNotices();
    } catch {
      setFeedback({
        type: "error",
        message: "Não foi possível excluir o aviso.",
      });
    } finally {
      setDeletingNoticeId(null);
    }
  }

  function handleCancelEditing() {
    setEditingNotice(null);
  }

  return (
    <section>
      <PageHeader
        title="Avisos institucionais"
        description="Publique e mantenha os comunicados exibidos aos alunos."
        actions={
          <Button
            type="button"
            variant="secondary"
            onClick={() => void loadNotices()}
            isLoading={isLoading}
            loadingLabel="Recarregando..."
          >
            Recarregar
          </Button>
        }
      />

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

      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <Card>
          <h2 className="text-lg font-semibold text-slate-900">
            {editingNotice ? "Editar aviso" : "Novo aviso"}
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            {editingNotice
              ? "Revise o conteúdo e salve as alterações."
              : "Crie um comunicado para o mural institucional."}
          </p>

          <div className="mt-5">
            <NoticeForm
              key={editingNotice?.id ?? `create-${createFormKey}`}
              initialValues={initialValues}
              submitLabel={editingNotice ? "Salvar alterações" : "Publicar aviso"}
              isSubmitting={isSubmitting}
              onSubmit={editingNotice ? handleUpdateNotice : handleCreateNotice}
              onCancel={editingNotice ? handleCancelEditing : undefined}
            />
          </div>
        </Card>

        <Card>
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Avisos publicados
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              {notices.length} {notices.length === 1 ? "aviso" : "avisos"} na
              listagem.
            </p>
          </div>

          {isLoading && <LoadingState message="Carregando avisos..." />}

          {!isLoading && listError && (
            <ErrorState
              message={listError}
              onRetry={() => void loadNotices()}
            />
          )}

          {!isLoading && !listError && notices.length === 0 && (
            <EmptyState
              title="Nenhum aviso publicado"
              message="Nenhum aviso publicado até o momento."
            />
          )}

          {!isLoading && !listError && notices.length > 0 && (
            <div className="space-y-4">
              {notices.map((notice) => (
                <article
                  key={notice.id}
                  className="rounded-lg border border-slate-200 p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {notice.title}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Publicado por {notice.author.name} em{" "}
                        {formatNoticeDate(notice.createdAt)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditingNotice(notice)}
                      >
                        Editar
                      </Button>

                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => void handleDeleteNotice(notice)}
                        isLoading={deletingNoticeId === notice.id}
                        loadingLabel="Excluindo..."
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>

                  <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-600">
                    {notice.content}
                  </p>
                </article>
              ))}
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
