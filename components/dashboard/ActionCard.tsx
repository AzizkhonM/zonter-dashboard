"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type ActionCardProps = {
  icon: string;
  title: string;
  description: string;
  href: string;
  linkText: string;
  highlight?: boolean;
};

export default function ActionCard({
  icon,
  title,
  description,
  href,
  linkText,
  highlight = false,
}: ActionCardProps) {
  const pathname = usePathname();

  const localeSet = new Set(["uz", "en", "ru"]);
  const segment = pathname.split("/")[1];
  const locale = localeSet.has(segment) ? segment : "uz";

  const localizedHref = locale === "uz" ? href : `/${locale}${href}`;

  return (
    <div className={`action-card ${highlight ? "highlight" : ""}`}>
      <div className="action-icon">{icon}</div>

      <h3 className="action-title">{title}</h3>

      <p className="action-description">{description}</p>

      <Link href={localizedHref} className="action-link">
        {linkText}
        <span className="arrow">→</span>
      </Link>
    </div>
  );
}
