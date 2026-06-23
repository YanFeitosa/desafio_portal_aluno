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
    "bg-[#17324d] text-white shadow-sm shadow-slate-900/10 hover:bg-[#214666] focus-visible:outline-[#17324d]",
  secondary:
    "border border-[#c8d3df] bg-white text-[#24364f] shadow-sm hover:border-[#9fb1c3] hover:bg-[#f6f9fb] focus-visible:outline-[#54708c]",
  destructive:
    "border border-red-200 bg-white text-red-700 shadow-sm hover:bg-red-50 focus-visible:outline-red-500",
  ghost:
    "bg-transparent text-[#24364f] hover:bg-[#eef4f7] focus-visible:outline-[#54708c]",
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
        "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
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
