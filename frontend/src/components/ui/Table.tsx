import type {
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

type TableProps = TableHTMLAttributes<HTMLTableElement> & {
  containerClassName?: string;
};

type TableCellProps = TdHTMLAttributes<HTMLTableCellElement> & {
  align?: "left" | "right";
  strong?: boolean;
};

type TableHeaderCellProps = ThHTMLAttributes<HTMLTableCellElement> & {
  align?: "left" | "right";
};

export function Table({
  children,
  className = "",
  containerClassName = "",
  ...props
}: TableProps) {
  return (
    <div className={["overflow-x-auto", containerClassName].filter(Boolean).join(" ")}>
      <table
        className={["w-full border-collapse text-left text-sm", className]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHead({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={["bg-slate-50 text-slate-600", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export function TableBody({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={["divide-y divide-slate-100", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export function TableHeaderCell({
  align = "left",
  className = "",
  ...props
}: TableHeaderCellProps) {
  return (
    <th
      className={[
        "px-4 py-3 font-medium",
        align === "right" ? "text-right" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export function TableCell({
  align = "left",
  className = "",
  strong = false,
  ...props
}: TableCellProps) {
  return (
    <td
      className={[
        "px-4 py-3 text-slate-600",
        align === "right" ? "text-right" : "",
        strong ? "font-medium text-slate-900" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
