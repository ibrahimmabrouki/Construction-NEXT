import Link from "next/link";
import styles from "./Footer.module.css";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";

const quickLinks = [
  { label: "Projects", path: "/projects" },
  { label: "Services", path: "/services" },
  { label: "About", path: "/about" },
];

const resources = [
  { label: "Blog", path: "/blog" },
  { label: "News", path: "/news" },
  { label: "Contact", path: "/contact" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          
          {/* BRAND */}
          <div className={styles.brandColumn}>
            <h3 className={`${styles.logo} ${styles.heading}`}>LuxVera</h3>
            <p className={styles.description}>
              Premium construction & smart living. Building the future of
              luxury residential spaces.
            </p>

            {/* SOCIAL ICONS */}
            <div className={styles.socials}>
              <a href="#" className={styles.socialIcon}>
                <FaFacebookF />
              </a>
              <a href="#" className={styles.socialIcon}>
                <FaInstagram />
              </a>
              <a href="#" className={styles.socialIcon}>
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className={styles.columnBorder}>
            <h4 className={styles.heading}>Quick Links</h4>
            <div className={styles.linkGroup}>
              {quickLinks.map((link) => (
                <Link key={link.path} href={link.path} className={styles.link}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* RESOURCES */}
          <div className={styles.columnBorder}>
            <h4 className={styles.heading}>Resources</h4>
            <div className={styles.linkGroup}>
              {resources.map((link) => (
                <Link key={link.path} href={link.path} className={styles.link}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CONTACT */}
          <div className={styles.columnBorder}>
            <h4 className={styles.heading}>Contact</h4>

            <div className={styles.contactGroup}>
              <div className={styles.contactItem}>
                <HiOutlineMail />
                <span>contact@luxvera.com</span>
              </div>

              <div className={styles.contactItem}>
                <HiOutlinePhone />
                <span>+1 (555) 234-5678</span>
              </div>

              <div className={styles.contactItem}>
                <HiOutlineLocationMarker />
                <span>Beverly Hills, CA</span>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM */}
        <div className={styles.bottom}>
          <p>© 2026 LuxVera Construction. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}