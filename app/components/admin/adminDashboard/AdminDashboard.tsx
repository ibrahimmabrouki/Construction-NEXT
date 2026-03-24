import styles from "./AdminDashboard.module.css";
import Sidebar from "../Sidebar/Sidebar";
import ProjectsManager from "../managers/ProjectsManager";
import BlogsManager from "../managers/BlogsManager";
import ServicesManager from "../managers/ServicesManager";
import SubmissionsManager from "../managers/SubmissionsManager";
import { cookies } from "next/headers";

const stats = [
  { label: "Active Projects", value: "12" },
  { label: "Blog Posts", value: "24" },
  { label: "Submissions", value: "8" },
  { label: "Total Revenue", value: "€34.2M" },
];

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  let roles: string[] = [];
  let username = "Admin";

  if (session) {
    const sessionData = JSON.parse(session.value);
    roles = sessionData.roles || [];
    username = sessionData.username || "Admin";
  }

  const is = (role: string) => roles.includes("admin") || roles.includes(role);

  return (
    <div className={styles.layout}>
      <Sidebar roles={roles} />

      <main className={styles.main}>

        {/* Sticky centered top bar */}
        <div className={styles.topBar}>
          <p className={styles.welcome}>
            Welcome back, <span>{username}</span>
          </p>
          {/* <h1 className={styles.heading}>Dashboard</h1> */}
        </div>

        {/* Scrollable content */}
        <div className={styles.content}>

          {roles.includes("admin") && (
            <div className={styles.stats}>
              {stats.map((s) => (
                <div key={s.label} className={styles.statCard}>
                  <p className={styles.statLabel}>{s.label}</p>
                  <p className={styles.statValue}>{s.value}</p>
                </div>
              ))}
            </div>
          )}

          <div id="projects">
            {is("projecteditor") && <ProjectsManager />}
          </div>

          <div id="blogs">
            {is("blogeditor") && <BlogsManager />}
          </div>

          <div id="services">
            {roles.includes("admin") && <ServicesManager />}
          </div>

          <div id="submissions">
            {is("manager") && <SubmissionsManager />}
          </div>

        </div>
      </main>
    </div>
  );
}