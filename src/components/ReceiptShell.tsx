import type { ReactNode } from "react";

type ReceiptShellProps = {
  children: ReactNode;
  ariaLabel?: string;
  variant?: "primary" | "compact";
};

export function ReceiptShell({ children, ariaLabel, variant = "primary" }: ReceiptShellProps) {
  return (
    <article className={`receipt-paper receipt-paper--${variant}`} aria-label={ariaLabel}>
      <div className="receipt-paper__grain" aria-hidden="true" />
      <div className="receipt-paper__content">{children}</div>
    </article>
  );
}
