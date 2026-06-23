import type { HTMLAttributes } from "react";

type CardPadding = "none" | "sm" | "md" | "lg";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: CardPadding;
};

const paddingClassNames: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function Card({
  children,
  className = "",
  padding = "lg",
  ...props
}: CardProps) {
  return (
    <div
      className={[
        "rounded-lg border border-slate-200 bg-white shadow-sm",
        paddingClassNames[padding],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
