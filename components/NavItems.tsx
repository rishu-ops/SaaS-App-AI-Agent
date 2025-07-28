"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Companions", href: "/companions" },
  { label: "My Journey", href: "/my-journey" },
];

const NavItems = () => {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-4 ">
      {navItems.map((item, herf) => (
        <Link
          href={item.href}
          key={item.href}
          className={cn(
            pathname === item.href ? "text-blue-500" : "text-gray-700",
            "hover:text-blue-500 transition-colors"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default NavItems;
