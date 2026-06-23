import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  details?: ReactNode;
};

export function PageHeader({
  actions,
  description,
  details,
  title,
}: PageHeaderProps) {
  return (
    <header className="mb-6 border-b border-slate-200 pb-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>

          {description && (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              {description}
            </p>
          )}
        </div>

        {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
      </div>

      {details && <div className="mt-4">{details}</div>}
    </header>
  );
}
