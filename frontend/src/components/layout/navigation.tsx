import { ChevronRight } from "lucide-react";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

export function SidebarItem({
  active = false,
  icon,
  children,
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  active?: boolean;
  icon?: ReactNode;
}) {
  return (
    <a
      className={cn("sidebar-item", active && "sidebar-item--active", className)}
      aria-current={active ? "page" : undefined}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </a>
  );
}

export function NavigationGroup({
  label,
  children,
  className,
}: HTMLAttributes<HTMLDivElement> & {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("navigation-group", className)}>
      <h3>{label}</h3>
      <nav aria-label={label}>{children}</nav>
    </div>
  );
}

export function Breadcrumb({
  items,
}: {
  items: Array<{ label: string; href?: string }>;
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="breadcrumbs">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {item.href && index < items.length - 1 ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
            {index < items.length - 1 && (
              <ChevronRight size={14} aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function TopNavigation({
  brand,
  actions,
}: {
  brand: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="top-navigation">
      <div className="top-navigation__brand">{brand}</div>
      {actions && <div className="top-navigation__actions">{actions}</div>}
    </header>
  );
}
