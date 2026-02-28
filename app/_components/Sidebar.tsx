"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Bookmark,
  UserRoundIcon,
  Plus,
  Album,
  Search,
  type LucideIcon,
} from "lucide-react";

type SidebarItem = {
  id: string;
  href: string;
  icon: LucideIcon;
  label: string;
};

const sidebarItems: SidebarItem[] = [
  { id: "home", href: "/", icon: Home, label: "Home" },
  { id: "profile", href: "/profile", icon: UserRoundIcon, label: "Profile" },
  { id: "bookmark", href: "/bookmarks", icon: Bookmark, label: "Bookmarks" },
  { id: "add", href: "/postPosts", icon: Plus, label: "Add Post" },
  { id: "album", href: "/posts", icon: Album, label: "My Posts" },
  { id: "search", href: "/searchUser", icon: Search, label: "Search" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-56 min-w-[14rem] bg-white border-r border-black border-t border-t-gray-200 flex flex-col pt-8 pb-8 px-3 gap-1">
      {sidebarItems.map((item) => {
        const active = isActive(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.id}
            href={item.href}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-150 group
              ${active ? "bg-gray-100" : "hover:bg-gray-100"}`}
          >
            <Icon
              size={24}
              strokeWidth={active ? 2.5 : 2}
              className={`transition-colors duration-150 ${
                active
                  ? "text-gray-900"
                  : "text-gray-500 group-hover:text-gray-900"
              }`}
            />
            <span
              className={`text-base transition-colors duration-150 ${
                active
                  ? "font-bold text-gray-900"
                  : "font-normal text-gray-500 group-hover:text-gray-900"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </aside>
  );
}
