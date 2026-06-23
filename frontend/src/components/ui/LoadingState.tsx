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
        "flex items-center gap-3 rounded-lg border border-[#d8e1ea] bg-[#f6f9fb] px-4 py-3 text-sm text-[#526173]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <span
        aria-hidden="true"
        className="h-4 w-4 animate-spin rounded-full border-2 border-[#c8d3df] border-t-[#17324d]"
      />
      <span>{message}</span>
    </div>
  );

  if (fullPage) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        {content}
      </main>
    );
  }

  return content;
}
