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
import { useAuthStore } from "../../../store/auth";

type Action = "create" | "read" | "update" | "delete";
const resourcesList = ["projects", "blogs", "services", "users", "inquiries"];

type Permission = {
  resource: string;
  actions: Action[];
};

type AuthRole = {
  _id: string;
  permissions: Permission[];
};

const DashboardLink = {
  label: "Dashboard",
  path: "/admin",
  icon: LayoutDashboard,
};

const RoleLink = {
  label: "Roles",
  path: "/admin/roles",
  icon: Inbox,
};

const allLinks = [
  {
    label: "Projects",
    path: "/admin/projects",
    icon: FolderOpen,
    source: "projects",
  },
  {
    label: "Blog Posts",
    path: "/admin/blogs",
    icon: FileText,
    source: "blogs",
  },
  {
    label: "Services",
    path: "/admin/services",
    icon: Wrench,
    source: "services",
  },
  {
    label: "Submissions",
    path: "/admin/submissions",
    icon: Inbox,
    source: "inquiries",
  },

  {
    label: "Users",
    path: "/admin/users",
    icon: Inbox,
    source: "users",
  },
];

export default function Sidebar() {
  const username = useAuthStore((s) => s.username);
  const roles = useAuthStore((s) => s.roles);
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const hasRole = useAuthStore((s) => s.hasRole);

  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleLinks = allLinks.filter((link) =>
  hasPermission(link.source)
);
console.log("the visible links are: ", visibleLinks);

  const handleLogout = async () => {
    await logoutAdmin();
    router.push("/admin-login");
  };

  const close = () => setMobileOpen(false);

  const initials = username.slice(0, 1).toUpperCase();
  // const roleLabel = roles.includes("admin") ? "Admin" : (roles[0] ?? "User");

  return (
    <>
      {/* Mobile top bar */}
      <div className={styles.mobileBar}>
        <div className={styles.mobileLeft}>
          <span className={styles.mobileLogo}>LuxVera</span>
        </div>{" "}
        <div className={styles.mobileRight}>
          <button
            className={styles.menuBtn}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
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
          <Link
            key={DashboardLink.path}
            href={DashboardLink.path}
            onClick={close}
            className={`${styles.link} ${
              pathname === DashboardLink.path ? styles.active : ""
            }`}
          >
            <DashboardLink.icon size={16} />
            {DashboardLink.label}
          </Link>
          {visibleLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={close}
                className={`${styles.link} ${
                  pathname === link.path ? styles.active : ""
                }`}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}

          {hasRole("admin") && (
            <Link
              key={RoleLink.path}
              href={RoleLink.path}
              onClick={close}
              className={`${styles.link} ${
                pathname === RoleLink.path ? styles.active : ""
              }`}
            >
              <RoleLink.icon size={16} />
              {RoleLink.label}
            </Link>
          )}
        </nav>

        {/* Bottom */}
        <div className={styles.bottom}>
          {/* User card */}
          <div className={styles.userCard}>
            <div className={styles.userAvatar}>{initials}</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{username}</span>
              {/* <span className={styles.userRole}>{roleLabel}</span> */}
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
