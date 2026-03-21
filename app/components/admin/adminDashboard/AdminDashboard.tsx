import styles from "./AdminDashboard.module.css";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import StatCard from "../StatCard/StatCard";
import ProjectsManager from "../managers/ProjectsManager";
import BlogsManager from "../managers/BlogsManager";
import ServicesManager from "../managers/ServicesManager";
import SubmissionsManager from "../managers/SubmissionsManager";
import { cookies } from "next/headers";
import { FolderOpen, FileText, Inbox, TrendingUp } from "lucide-react";

const stats = [
  { label: "Active Projects", value: "12", change: "+2.4%", icon: FolderOpen },
  { label: "Blog Posts", value: "24", change: "+1.8%", icon: FileText },
  { label: "Submissions", value: "8", change: "+0.6%", icon: Inbox },
  {
    label: "Total Revenue",
    value: "€34.2M",
    change: "+12.1%",
    icon: TrendingUp,
  },
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
      <Sidebar roles={roles} username={username} />
      <main className={styles.main}>
        <Topbar username={username} />

        {roles.includes("admin") && (
          <div className={styles.stats}>
            {stats.map((s) => (
              <StatCard
                key={s.label}
                label={s.label}
                value={s.value}
                change={s.change}
                icon={s.icon}
              />
            ))}
          </div>
        )}

        {is("projecteditor") && <div id = "projects"><ProjectsManager /></div>}
        {is("blogeditor") && <div id = "blogs" ><BlogsManager /></div>}
        {roles.includes("admin") && <div id = "services" ><ServicesManager /></div>}
        {is("manager") && <div id = "submissions" ><SubmissionsManager /></div>}
      </main>
    </div>
  );
}
