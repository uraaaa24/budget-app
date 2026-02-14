import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const baseStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 8,
  border: "none",
  fontWeight: 600,
  cursor: "pointer",
  transition: "filter 150ms ease",
};

const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: { backgroundColor: "#0f172a", color: "#ffffff" },
  secondary: { backgroundColor: "#e2e8f0", color: "#0f172a" },
  danger: { backgroundColor: "#e11d48", color: "#ffffff" },
};

const sizeStyles: Record<ButtonSize, CSSProperties> = {
  sm: { height: 32, padding: "0 12px", fontSize: 14 },
  md: { height: 40, padding: "0 16px", fontSize: 14 },
  lg: { height: 48, padding: "0 20px", fontSize: 16 },
};

export const Button = ({
  children,
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...rest
}: ButtonProps) => {
  const style = {
    ...baseStyle,
    ...variantStyles[variant],
    ...sizeStyles[size],
    opacity: rest.disabled ? 0.5 : 1,
  };

  return (
    <button type={type} className={className} style={style} {...rest}>
      {children}
    </button>
  );
};
