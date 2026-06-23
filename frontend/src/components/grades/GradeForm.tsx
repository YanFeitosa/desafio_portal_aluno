import { useState } from "react";
import type { SyntheticEvent } from "react";
import type { GradeFormValues } from "../../features/grades/types";
import { Button } from "../ui";

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
      className="mt-4 rounded-lg border border-[#d8e1ea] bg-[#f6f9fb] p-4"
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_140px]">
        <div>
          <label
            htmlFor="evaluation-name"
            className="text-sm font-semibold text-[#24364f]"
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
            className="mt-1 w-full rounded-lg border border-[#c8d3df] bg-white px-3 py-2 text-[#12213a] outline-none transition placeholder:text-slate-400 focus:border-[#17324d] focus:ring-2 focus:ring-[#17324d]/10"
            placeholder="Ex.: Prova 1"
          />

          {errors.evaluationName && (
            <p className="mt-1 text-sm text-red-700">
              {errors.evaluationName}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="score"
            className="text-sm font-semibold text-[#24364f]"
          >
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
            className="mt-1 w-full rounded-lg border border-[#c8d3df] bg-white px-3 py-2 text-[#12213a] outline-none transition focus:border-[#17324d] focus:ring-2 focus:ring-[#17324d]/10"
          />

          {errors.score && (
            <p className="mt-1 text-sm text-red-700">{errors.score}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button
          type="submit"
          isLoading={isSubmitting}
          loadingLabel="Salvando..."
        >
          {submitLabel}
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
