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

function normalizeSearch(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function filterNotices(notices: Notice[], searchTerm: string) {
  const normalizedSearch = normalizeSearch(searchTerm);

  if (!normalizedSearch) {
    return notices;
  }

  return notices.filter((notice) => {
    const title = normalizeSearch(notice.title);
    const content = normalizeSearch(notice.content);
    const author = normalizeSearch(notice.author.name);

    return (
      title.includes(normalizedSearch) ||
      content.includes(normalizedSearch) ||
      author.includes(normalizedSearch)
    );
  });
}

export function ManageNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingNoticeId, setDeletingNoticeId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [listError, setListError] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
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
  const showNoticeForm = isFormOpen || !!editingNotice;
  const filteredNotices = useMemo(
    () => filterNotices(notices, searchTerm),
    [notices, searchTerm]
  );

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
      setIsFormOpen(false);
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
      setIsFormOpen(false);
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
        setIsFormOpen(false);
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

  function handleOpenCreateForm() {
    setFeedback(null);
    setEditingNotice(null);
    setIsFormOpen(true);
  }

  function handleEditNotice(notice: Notice) {
    setFeedback(null);
    setIsFormOpen(false);
    setEditingNotice(notice);
  }

  function handleCloseNoticeForm() {
    setEditingNotice(null);
    setIsFormOpen(false);
  }

  return (
    <section>
      <PageHeader
        title="Avisos institucionais"
        description="Publique e mantenha os comunicados exibidos aos alunos."
        actions={
          <Button
            type="button"
            onClick={handleOpenCreateForm}
            disabled={isSubmitting}
          >
            Adicionar
          </Button>
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

      <div className="space-y-6">
        {showNoticeForm && (
          <Card>
            <h2 className="text-lg font-semibold text-[#12213a]">
              {editingNotice ? "Editar aviso" : "Novo aviso"}
            </h2>

            <p className="mt-1 text-sm text-[#526173]">
              {editingNotice
                ? "Revise o conteúdo e salve as alterações."
                : "Crie um comunicado para o mural institucional."}
            </p>

            <div className="mt-5">
              <NoticeForm
                key={editingNotice?.id ?? `create-${createFormKey}`}
                initialValues={initialValues}
                submitLabel={
                  editingNotice ? "Salvar alterações" : "Publicar aviso"
                }
                cancelLabel={editingNotice ? "Cancelar edição" : "Cancelar"}
                isSubmitting={isSubmitting}
                onSubmit={editingNotice ? handleUpdateNotice : handleCreateNotice}
                onCancel={handleCloseNoticeForm}
              />
            </div>
          </Card>
        )}

        <Card>
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#12213a]">
                Avisos publicados
              </h2>

              <p className="mt-1 text-sm text-[#526173]">
                {filteredNotices.length}{" "}
                {filteredNotices.length === 1
                  ? "aviso encontrado"
                  : "avisos encontrados"}
              </p>
            </div>

            <div className="w-full md:max-w-sm">
              <label
                htmlFor="notice-search"
                className="text-sm font-semibold text-[#24364f]"
              >
                Buscar
              </label>

              <input
                id="notice-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="mt-1 w-full rounded-lg border border-[#c8d3df] px-3 py-2 text-[#12213a] outline-none transition placeholder:text-slate-400 focus:border-[#17324d] focus:ring-2 focus:ring-[#17324d]/10"
                placeholder="Título, conteúdo ou autor"
              />
            </div>
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

          {!isLoading &&
            !listError &&
            notices.length > 0 &&
            filteredNotices.length === 0 && (
              <EmptyState
                title="Nenhum resultado"
                message="Nenhum aviso encontrado para a busca informada."
              />
            )}

          {!isLoading && !listError && filteredNotices.length > 0 && (
            <div className="space-y-4">
              {filteredNotices.map((notice) => (
                <article
                  key={notice.id}
                  className="rounded-lg border border-[#d8e1ea] bg-[#fbfcfd] p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-[#12213a]">
                        {notice.title}
                      </h3>

                      <p className="mt-1 text-xs text-[#66768a]">
                        Publicado por {notice.author.name} em{" "}
                        {formatNoticeDate(notice.createdAt)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEditNotice(notice)}
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

                  <p className="mt-4 whitespace-pre-line text-sm leading-6 text-[#526173]">
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
