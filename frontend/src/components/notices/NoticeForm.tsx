import { useState } from "react";
import type { SyntheticEvent } from "react";
import type { CreateNoticeRequest } from "../../features/notices/types";
import { Button } from "../ui";

type NoticeFormValues = CreateNoticeRequest;

type NoticeFormErrors = Partial<Record<keyof NoticeFormValues, string>>;

type NoticeFormProps = {
  initialValues?: NoticeFormValues;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (data: NoticeFormValues) => Promise<void> | void;
  onCancel?: () => void;
};

const emptyValues: NoticeFormValues = {
  title: "",
  content: "",
};

function validateNotice(values: NoticeFormValues) {
  const errors: NoticeFormErrors = {};
  const title = values.title.trim();
  const content = values.content.trim();

  if (!title) {
    errors.title = "Informe o título do aviso.";
  } else if (title.length < 3) {
    errors.title = "O título deve ter pelo menos 3 caracteres.";
  } else if (title.length > 191) {
    errors.title = "O título deve ter no máximo 191 caracteres.";
  }

  if (!content) {
    errors.content = "Informe o conteúdo do aviso.";
  } else if (content.length < 5) {
    errors.content = "O conteúdo deve ter pelo menos 5 caracteres.";
  }

  return {
    errors,
    values: {
      title,
      content,
    },
  };
}

export function NoticeForm({
  initialValues,
  submitLabel,
  isSubmitting,
  onSubmit,
  onCancel,
}: NoticeFormProps) {
  const [values, setValues] = useState(initialValues ?? emptyValues);
  const [errors, setErrors] = useState<NoticeFormErrors>({});

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>
  ) {
    event.preventDefault();

    const validation = validateNotice(values);
    setErrors(validation.errors);

    if (Object.keys(validation.errors).length > 0) {
      return;
    }

    await onSubmit(validation.values);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="notice-title" className="text-sm font-medium text-slate-700">
          Título
        </label>

        <input
          id="notice-title"
          type="text"
          maxLength={191}
          value={values.title}
          onChange={(event) =>
            setValues((currentValues) => ({
              ...currentValues,
              title: event.target.value,
            }))
          }
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-900"
          placeholder="Ex.: Calendário de avaliações"
        />

        {errors.title && (
          <p className="mt-1 text-sm text-red-700">{errors.title}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="notice-content"
          className="text-sm font-medium text-slate-700"
        >
          Conteúdo
        </label>

        <textarea
          id="notice-content"
          rows={7}
          value={values.content}
          onChange={(event) =>
            setValues((currentValues) => ({
              ...currentValues,
              content: event.target.value,
            }))
          }
          className="mt-1 w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-900"
          placeholder="Escreva o comunicado para alunos e coordenação."
        />

        {errors.content && (
          <p className="mt-1 text-sm text-red-700">{errors.content}</p>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="submit"
          isLoading={isSubmitting}
          loadingLabel="Salvando..."
        >
          {submitLabel}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar edição
          </Button>
        )}
      </div>
    </form>
  );
}
