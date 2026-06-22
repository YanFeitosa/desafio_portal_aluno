import { useState } from "react";
import type { SyntheticEvent } from "react";
import type { GradeFormValues } from "../../features/grades/types";

type GradeFormState = {
  evaluationName: string;
  score: string;
};

type GradeFormErrors = Partial<Record<keyof GradeFormState, string>>;

type GradeFormProps = {
  initialValues?: GradeFormValues;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (data: GradeFormValues) => Promise<void> | void;
  onCancel: () => void;
};

const emptyValues: GradeFormState = {
  evaluationName: "",
  score: "",
};

function getInitialState(initialValues?: GradeFormValues): GradeFormState {
  if (!initialValues) {
    return emptyValues;
  }

  return {
    evaluationName: initialValues.evaluationName,
    score: String(initialValues.score),
  };
}

function validateGrade(values: GradeFormState) {
  const errors: GradeFormErrors = {};
  const evaluationName = values.evaluationName.trim();
  const scoreText = values.score.trim();
  const score = Number(scoreText);

  if (!evaluationName) {
    errors.evaluationName = "Informe o nome da avaliação.";
  } else if (evaluationName.length < 2) {
    errors.evaluationName = "O nome deve ter pelo menos 2 caracteres.";
  } else if (evaluationName.length > 191) {
    errors.evaluationName = "O nome deve ter no máximo 191 caracteres.";
  }

  if (!scoreText) {
    errors.score = "Informe a nota.";
  } else if (Number.isNaN(score)) {
    errors.score = "Informe uma nota válida.";
  } else if (score < 0) {
    errors.score = "A nota não pode ser menor que 0.";
  } else if (score > 10) {
    errors.score = "A nota não pode ser maior que 10.";
  }

  return {
    errors,
    values: {
      evaluationName,
      score,
    },
  };
}

export function GradeForm({
  initialValues,
  submitLabel,
  isSubmitting,
  onSubmit,
  onCancel,
}: GradeFormProps) {
  const [values, setValues] = useState(getInitialState(initialValues));
  const [errors, setErrors] = useState<GradeFormErrors>({});

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>
  ) {
    event.preventDefault();

    const validation = validateGrade(values);
    setErrors(validation.errors);

    if (Object.keys(validation.errors).length > 0) {
      return;
    }

    await onSubmit(validation.values);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4"
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_140px]">
        <div>
          <label
            htmlFor="evaluation-name"
            className="text-sm font-medium text-slate-700"
          >
            Avaliação
          </label>

          <input
            id="evaluation-name"
            type="text"
            maxLength={191}
            value={values.evaluationName}
            onChange={(event) =>
              setValues((currentValues) => ({
                ...currentValues,
                evaluationName: event.target.value,
              }))
            }
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-slate-900"
            placeholder="Ex.: Prova 1"
          />

          {errors.evaluationName && (
            <p className="mt-1 text-sm text-red-700">
              {errors.evaluationName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="score" className="text-sm font-medium text-slate-700">
            Nota
          </label>

          <input
            id="score"
            type="number"
            min={0}
            max={10}
            step="0.01"
            value={values.score}
            onChange={(event) =>
              setValues((currentValues) => ({
                ...currentValues,
                score: event.target.value,
              }))
            }
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-slate-900"
          />

          {errors.score && (
            <p className="mt-1 text-sm text-red-700">{errors.score}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Salvando..." : submitLabel}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
