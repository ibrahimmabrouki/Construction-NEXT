"use client";

import styles from "./Sidebar.module.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Newspaper,
  Wrench,
  Inbox,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { logoutAdmin } from "@/client-services/auth";

const allLinks = [
  {
    label: "Dashboard",
    path: "/admin",
    hash: "",
    icon: LayoutDashboard,
    roles: ["admin"],
  },
  {
    label: "Projects",
    path: "/admin/projects",
    hash: "#projects",
    icon: FolderOpen,
    roles: ["admin", "projecteditor"],
  },
  {
    label: "Blog Posts",
    path: "/admin/blogs",
    hash: "#blogs",
    icon: FileText,
    roles: ["admin", "blogeditor"],
  },
  {
    label: "News",
    path: "/admin/news",
    hash: "#news",
    icon: Newspaper,
    roles: ["admin", "newseditor"],
  },
  {
    label: "Services",
    path: "/admin/services",
    hash: "#services",
    icon: Wrench,
    roles: ["admin"],
  },
  {
    label: "Submissions",
    path: "/admin/submissions",
    hash: "#submissions",
    icon: Inbox,
    roles: ["admin", "manager"],
  },
];

export default function Sidebar({
  roles,
  username = "Admin",
}: {
  roles: string[];
  username?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleLinks = allLinks.filter((link) =>
    link.roles.some((r) => roles.includes(r)),
  );

  const handleLogout = async () => {
    await logoutAdmin();
    router.push("/admin-login");
  };

  const close = () => setMobileOpen(false);

  const initials = username.slice(0, 1).toUpperCase();
  const roleLabel = roles.includes("admin") ? "Admin" : (roles[0] ?? "User");

  return (
    <>
      {/* Mobile top bar */}
      <div className={styles.mobileBar}>
        <span className={styles.mobileLogo}>LuxVera</span>
        <button
          className={styles.menuBtn}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && <div className={styles.overlay} onClick={close} />}

      <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ""}`}>
        {/* Logo */}
        <div className={styles.logoWrap}>
          <div className={styles.logoMark}>L</div>
          <h2 className={styles.title}>LuxVera</h2>
        </div>

        {/* Nav */}
        <nav className={styles.nav}>
          {visibleLinks.map((link) => {
            const Icon = link.icon;
            const href = link.hash ? `${link.path}${link.hash}` : link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={close}
                className={`${styles.link} ${pathname === link.path ? styles.active : ""}`}
              >
                <Icon size={17} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className={styles.bottom}>
          {/* User card */}
          <div className={styles.userCard}>
            <div className={styles.userAvatar}>{initials}</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{username}</span>
              <span className={styles.userRole}>{roleLabel}</span>
            </div>
          </div>

          <Link href="/" className={styles.link} onClick={close}>
            <LogOut size={16} />
            Back to Site
          </Link>

          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
