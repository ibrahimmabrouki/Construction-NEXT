"use client";

import { useState } from "react";
import styles from "./Manager.module.css";

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

const empty: Omit<Project, "id"> & { id: string } = {
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
        alert("A project with this title slug already exists.");
        return;
      }
      setProjects([...projects, { ...form, id: slug }]);
    }
    setForm(empty);
    setShowForm(false);
  };

  const handleEdit = (p: Project) => {
    setForm({
      id: p.id,
      image: p.image,
      title: p.title,
      location: p.location,
      price: p.price,
      status: p.status,
      style: p.style,
    });
    setEditId(p.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this project?"))
      setProjects(projects.filter((p) => p.id !== id));
  };

  const statusClass: Record<string, string> = {
    Completed: styles.Completed,
    "In Progress": styles.InProgress,
    Planning: styles.Planning,
  };

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <div>
          <h2>Projects</h2>
          <p className={styles.subtitle}>{projects.length} total</p>
        </div>
        <button
          className={styles.addBtn}
          onClick={() => {
            setShowForm(!showForm);
            setEditId(null);
            setForm(empty);
          }}
        >
          {showForm && editId === null ? "Cancel" : "+ Add Project"}
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
                placeholder="e.g. /images/project-1.jpg"
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
              URL slug: <code>/projects/{slugify(form.title)}</code>
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

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Location</th>
            <th>Style</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.id}>
              <td>
                <span className={styles.primaryCell}>{p.title}</span>
                <span className={styles.slugCell}>{p.id}</span>
              </td>
              <td>{p.location}</td>
              <td>{p.style}</td>
              <td className={styles.priceCell}>{p.price}</td>
              <td>
                <span
                  className={`${styles.badge} ${statusClass[p.status] ?? ""}`}
                >
                  {p.status}
                </span>
              </td>
              <td>
                <div className={styles.actions}>
                  <button
                    className={styles.editBtn}
                    onClick={() => handleEdit(p)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
