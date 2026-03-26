"use client";

import { useState, useEffect } from "react";
import styles from "./projects.module.css";
import SectionHeading from "../../ui/SectionHeading/SectionHeading";
import ProjectCard from "../../ui/ProjectCard/ProjectCard";
import { getAllProject } from "../../../../client-services/projects";
import { wait } from "@/utils/delay";
import Loader from "../../ui/Loader/Loader";

export async function getProjects() {
  return await getAllProject();
}

const styleFilters = [
  "All",
  "Mediterranean",
  "Modern",
  "Tropical",
  "Contemporary",
  "Minimalist",
  "Industrial",
];
const statusFilters = ["All", "Completed", "In Progress", "Planning"];

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [styleFilter, setStyleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoadingMessage("Loading Projects...");
        setLoading(true);
        const start = Date.now();
        const data = await getProjects();
        setProjects(data);
        const elapsed = Date.now() - start;
        if (elapsed < 1000) {
          await wait(1000 - elapsed);
        }
        // console.log(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filtered = projects.filter((p) => {
    if (styleFilter !== "All" && p.style !== styleFilter) return false;
    if (statusFilter !== "All" && p.status !== statusFilter) return false;
    return true;
  });

  return (
    <>
      <Loader loading={loading} message={loadingMessage} variant="overlay" />

      <main className="page">
        <section className={styles.section}>
          <SectionHeading
            label="Portfolio"
            title="Our Projects"
            description="Explore our collection of luxury residential developments worldwide."
          />

          <div className={styles.filters}>
            {styleFilters.map((s) => (
              <button
                key={s}
                onClick={() => setStyleFilter(s)}
                className={`${styles.filterBtn} ${styleFilter === s ? styles.active : ""}`}
              >
                {s}
              </button>
            ))}

            <span className={styles.divider}>|</span>

            {statusFilters.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`${styles.filterBtn} ${statusFilter === s ? styles.active : ""}`}
              >
                {s}
              </button>
            ))}
          </div>

          {loading ? (
            <p className={styles.empty}>Loading projects...</p>
          ) : filtered.length === 0 ? (
            <p className={styles.empty}>No projects match your filters.</p>
          ) : (
            <div className={styles.grid}>
              {filtered.map((p) => (
                <ProjectCard key={p._id} {...p} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
