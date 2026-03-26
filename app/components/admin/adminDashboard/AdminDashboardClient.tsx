"use client";

import { useEffect, useState } from "react";
import styles from "./AdminDashboardClient.module.css";
import {
  getLatestActivities,
  deleteActivity,
} from "@/client-services/activity";
import { useAuthStore } from "../../../store/auth";

type Activity = {
  _id: string;
  user: string;
  action: string;
  resource: string;
  title: string;
  createdAt: string;
};

type Stats = {
  projects: number;
  blogs: number;
  services: number;
  inquiries: number;
};

export default function AdminDashboardClient({
  username,
  stats,
}: {
  username: string;
  stats: Stats;
}) {
  const hasAccess = useAuthStore((s) => s.hasAccess);

  const deleteAccess = hasAccess("blogs", "delete");

  const [activities, setActivities] = useState<Activity[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Component mounted");

    const fetchActivities = async () => {
      try {
        console.log("Fetching activities...");

        setLoading(true);

        const data = await getLatestActivities();

        console.log("activities:", data);

        setActivities(data);
      } catch (error) {
        console.error("Fetch activity error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteActivity(id);
      setActivities((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      console.error("Delete error", error);
    }
  };

  const visibleActivities = showAll ? activities : activities.slice(0, 3);

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.welcome}>
        Welcome back, <span>{username}</span>
      </h1>

      {/* need to be implementd as backend */}
      <div className={styles.stats}>
        <div className={styles.card}>
          <p>Projects</p>
          <h2>{stats.projects}</h2>
        </div>

        <div className={styles.card}>
          <p>Blog Posts</p>
          <h2>{stats.blogs}</h2>
        </div>

        <div className={styles.card}>
          <p>Services</p>
          <h2>{stats.services}</h2>
        </div>

        <div className={styles.card}>
          <p>Inquiries</p>
          <h2>{stats.inquiries}</h2>
        </div>
      </div>

      <div className={styles.activityWrapper}>
        <div className={styles.activityHeader}>
          <h2>Latest Activity</h2>

          <span
            className={styles.viewAll}
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? "Show Less" : "View All Activity"}
          </span>
        </div>

        <div className={styles.activityCard}>
          {visibleActivities.map((a) => (
            <div key={a._id} className={styles.activityItem}>
              <div className={styles.icon}>
                {a.user.charAt(0).toUpperCase()}
              </div>

              <div className={styles.content}>
                <p>
                  <strong>{a.user}</strong> {a.action} {a.resource}{" "}
                  <span className={styles.highlight}>{a.title}</span>
                </p>

                <span className={styles.time}>{formatTime(a.createdAt)}</span>
              </div>

              {deleteAccess && (
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(a._id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}

          {activities.length === 0 && (
            <p style={{ color: "#aaa" }}>No activity yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

function formatTime(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours} hours ago`;

  return `${Math.floor(hours / 24)} days ago`;
}
