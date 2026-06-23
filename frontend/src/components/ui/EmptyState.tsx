import type { HTMLAttributes, ReactNode } from "react";

type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  message: string;
  action?: ReactNode;
};

export function EmptyState({
  action,
  className = "",
  message,
  title = "Nenhum registro encontrado",
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={[
        "rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-sm text-slate-600">{message}</p>

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
