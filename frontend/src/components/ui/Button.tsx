import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "destructive" | "ghost";
type ButtonSize = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingLabel?: string;
  fullWidth?: boolean;
};

const variantClassNames: Record<ButtonVariant, string> = {
  primary:
    "bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-slate-900",
  secondary:
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-500",
  destructive:
    "border border-red-200 bg-white text-red-700 hover:bg-red-50 focus-visible:outline-red-500",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-500",
};

const sizeClassNames: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 py-2",
  md: "min-h-10 px-4 py-2",
};

export function Button({
  children,
  className = "",
  disabled,
  fullWidth = false,
  isLoading = false,
  loadingLabel,
  size = "md",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      className={[
        "inline-flex items-center justify-center rounded-lg text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        sizeClassNames[size],
        variantClassNames[variant],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {isLoading ? loadingLabel ?? "Carregando..." : children}
    </button>
  );
}
