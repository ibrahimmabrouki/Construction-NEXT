import styles from "./AdminDashboard.module.css";
import Sidebar from "../Sidebar/Sidebar";
import ProjectsManager from "../managers/ProjectsManager";
import BlogsManager from "../managers/BlogManager";
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

  if (session) {
    const sessionData = JSON.parse(session.value);
    roles = sessionData.roles || [];
  }

  const is = (role: string) => roles.includes("admin") || roles.includes(role);

  return (
    <div className={styles.layout}>
      <Sidebar roles={roles} />

      <main className={styles.main}>
        <div className={styles.topBar}>
          <p className={styles.welcome}>
            Welcome back, <span>Daniel</span>
          </p>
          <h1 className={styles.heading}>Dashboard</h1>
        </div>

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

        {is("projecteditor") && <ProjectsManager />}
        {is("blogeditor") && <BlogsManager />}
        {roles.includes("admin") && <ServicesManager />}
        {is("manager") && <SubmissionsManager />}
      </main>
    </div>
  );
}