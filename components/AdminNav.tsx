"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Overview", code: "00" },
  { href: "/admin/projects", label: "Projects", code: "01" },
  { href: "/admin/messages", label: "Messages", code: "02" },
  { href: "/admin/files", label: "Files", code: "03" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex items-center gap-1 px-4 md:px-6 h-12 border-b overflow-x-auto flex-shrink-0"
      style={{
        background: "rgba(10, 5, 18, 0.7)",
        backdropFilter: "blur(24px) saturate(140%)",
        WebkitBackdropFilter: "blur(24px) saturate(140%)",
        borderColor: "rgba(185, 139, 255, 0.14)",
      }}
    >
      {NAV.map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap flex-shrink-0"
            style={{
              color: isActive ? "#f6ecfb" : "#9a8fb0",
              background: isActive ? "rgba(185, 139, 255, 0.12)" : "transparent",
              border: isActive ? "1px solid rgba(185, 139, 255, 0.25)" : "1px solid transparent",
            }}
          >
            <span>{item.label}</span>
            <span
              className="tc text-[9px]"
              style={{ color: isActive ? "#b98bff" : "#4a4155" }}
            >
              {item.code}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}