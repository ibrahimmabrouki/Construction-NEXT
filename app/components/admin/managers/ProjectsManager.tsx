"use client";

import { useState } from "react";
import styles from "./ProjectsManager.module.css";
import Image from "next/image";

type Project = {
  id: string;
  image: string;
  title: string;
  location: string;
  price: string;
  status: string;
  style: string;
};

const initial: Project[] = [
  {
    id: "villa-azure",
    image: "/images/project-1.jpg",
    title: "Villa Azure",
    location: "Marbella, Spain",
    price: "€2.4M",
    status: "Completed",
    style: "Mediterranean",
  },
  {
    id: "skyline-penthouse",
    image: "/images/project-2.jpg",
    title: "Skyline Penthouse",
    location: "Dubai, UAE",
    price: "€5.1M",
    status: "In Progress",
    style: "Modern",
  },
  {
    id: "horizon-retreat",
    image: "/images/project-3.jpg",
    title: "Horizon Retreat",
    location: "Bali, Indonesia",
    price: "€1.8M",
    status: "Completed",
    style: "Tropical",
  },
  {
    id: "alpine-lodge",
    image: "/images/project-1.jpg",
    title: "Alpine Lodge",
    location: "Zurich, Switzerland",
    price: "€3.2M",
    status: "Planning",
    style: "Contemporary",
  },
];

const statusOptions = ["Planning", "In Progress", "Completed"];
const styleOptions = [
  "Mediterranean",
  "Modern",
  "Tropical",
  "Contemporary",
  "Minimalist",
  "Industrial",
];

const empty = {
  id: "",
  image: "",
  title: "",
  location: "",
  price: "",
  status: "Planning",
  style: "Modern",
};

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

const statusClass: Record<string, string> = {
  Completed: styles.completed,
  "In Progress": styles.inProgress,
  Planning: styles.planning,
};

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>(initial);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = () => {
    if (!form.title || !form.location) return;
    const slug = editId !== null ? editId : slugify(form.title);
    if (editId !== null) {
      setProjects(
        projects.map((p) => (p.id === editId ? { ...form, id: editId } : p)),
      );
      setEditId(null);
    } else {
      if (projects.find((p) => p.id === slug)) {
        alert("Slug already exists.");
        return;
      }
      setProjects([...projects, { ...form, id: slug }]);
    }
    setForm(empty);
    setShowForm(false);
  };

  const handleEdit = (p: Project) => {
    setForm({ ...p });
    setEditId(p.id);
    setShowForm(true);
  };
  const handleDelete = (id: string) => {
    if (confirm("Delete this project?"))
      setProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Projects</h2>
          <p className={styles.subtitle}>
            {projects.length} from {projects.length} total
          </p>
        </div>
        <button
          className={styles.addBtn}
          onClick={() => {
            setShowForm(!showForm);
            setEditId(null);
            setForm(empty);
          }}
        >
          + Add Project
        </button>
      </div>

      {showForm && (
        <div className={styles.form}>
          <h3>{editId !== null ? "Edit Project" : "New Project"}</h3>
          <div className={styles.fields}>
            <div className={styles.fieldGroup}>
              <label>Title *</label>
              <input
                placeholder="e.g. Villa Azure"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Location *</label>
              <input
                placeholder="e.g. Marbella, Spain"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Price</label>
              <input
                placeholder="e.g. €2.4M"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Image path</label>
              <input
                placeholder="/images/project-1.jpg"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Style</label>
              <select
                value={form.style}
                onChange={(e) => setForm({ ...form, style: e.target.value })}
              >
                {styleOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div className={styles.fieldGroup}>
              <label>Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {statusOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>
          {!editId && form.title && (
            <p className={styles.slugPreview}>
              Slug: <code>/projects/{slugify(form.title)}</code>
            </p>
          )}
          <div className={styles.formActions}>
            <button className={styles.saveBtn} onClick={handleSubmit}>
              {editId !== null ? "Save Changes" : "Create Project"}
            </button>
            <button
              className={styles.cancelBtn}
              onClick={() => {
                setShowForm(false);
                setEditId(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className={styles.list}>
        {projects.map((p) => (
          <div key={p.id} className={styles.row}>
            <div className={styles.imageWrap}>
              <Image
                src={p.image}
                alt={p.title}
                fill
                className={styles.image}
              />
            </div>
            <div className={styles.info}>
              <p className={styles.projectTitle}>{p.title}</p>
              <p className={styles.projectLocation}>{p.location}</p>
            </div>
            <p className={styles.locationCol}>{p.location}</p>
            <span className={`${styles.badge} ${statusClass[p.status] ?? ""}`}>
              {p.status}
            </span>
            <div className={styles.actions}>
              <button className={styles.editBtn} onClick={() => handleEdit(p)}>
                Edit
              </button>
              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(p.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
