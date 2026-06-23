import type { HTMLAttributes } from "react";

type LoadingStateProps = HTMLAttributes<HTMLDivElement> & {
  message?: string;
  fullPage?: boolean;
};

export function LoadingState({
  className = "",
  fullPage = false,
  message = "Carregando...",
  ...props
}: LoadingStateProps) {
  const content = (
    <div
      className={[
        "flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <span
        aria-hidden="true"
        className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900"
      />
      <span>{message}</span>
    </div>
  );

  if (fullPage) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        {content}
      </main>
    );
  }

  return content;
}
