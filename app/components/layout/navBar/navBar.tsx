"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./navBar.module.css";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Projects", path: "/projects" },
  { label: "Services", path: "/services" },
  { label: "About", path: "/about" },
  { label: "Blog", path: "/blog" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shouldUseScrolledStyle = !isHome || scrolled;

  return (
    <nav
      className={`${styles.navbar} ${
        shouldUseScrolledStyle ? styles.scrolled : styles.transparent
      }`}
    >
      <div className={styles.container}>
        <Link
          href="/"
          className={`${styles.logo} ${
            shouldUseScrolledStyle ? styles.logoDark : styles.logoLight
          }`}
        >
          LuxVera
        </Link>

        <div className={styles.desktopMenu}>
          {navLinks.map((link) => {
            const isActive = pathname === link.path;

            return (
              <Link
                key={link.path}
                href={link.path}
                className={`${styles.navLink} ${
                  shouldUseScrolledStyle ? styles.navLinkDark : styles.navLinkLight
                } ${isActive ? styles.activeLink : ""}`}
              >
                {link.label}
              </Link>
            );
          })}

          <Link href="/ai-design" className={styles.ctaButton}>
            Design Your Home
          </Link>
        </div>

        <button
          className={`${styles.mobileToggle} ${
            shouldUseScrolledStyle ? styles.mobileDark : styles.mobileLight
          }`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={styles.mobileLink}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/ai-design"
            className={styles.mobileCta}
            onClick={() => setMobileOpen(false)}
          >
            Design Your Home
          </Link>
        </div>
      )}
    </nav>
  );
}