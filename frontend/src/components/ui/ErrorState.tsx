import type { HTMLAttributes } from "react";
import { Button } from "./Button";

type ErrorStateProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export function ErrorState({
  className = "",
  message,
  onRetry,
  retryLabel = "Tentar novamente",
  title = "Não foi possível carregar os dados",
  ...props
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={[
        "rounded-lg border border-red-100 bg-red-50 px-4 py-3",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <p className="text-sm font-semibold text-red-800">{title}</p>
      <p className="mt-1 text-sm text-red-700">{message}</p>

      {onRetry && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onRetry}
          className="mt-4 border-red-200 text-red-700 hover:bg-red-100"
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
