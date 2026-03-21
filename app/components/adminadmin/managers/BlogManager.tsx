"use client";

import { useState } from "react";
import styles from "./Manager.module.css";

type Post = {
  id: string;
  image: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
};

const initial: Post[] = [
  {
    id: "smart-home-trends-2026",
    image: "/images/project-1.jpg",
    title: "Smart Home Trends to Watch in 2026",
    date: "Mar 10, 2026",
    category: "Technology",
    excerpt:
      "From AI-powered climate control to integrated wellness systems, discover what's shaping the future of smart living.",
  },
  {
    id: "sustainable-luxury-building",
    image: "/images/project-2.jpg",
    title: "Sustainable Luxury: Building Without Compromise",
    date: "Feb 28, 2026",
    category: "Sustainability",
    excerpt:
      "How modern construction techniques allow for environmentally responsible luxury homes.",
  },
  {
    id: "choosing-right-architect",
    image: "/images/project-3.jpg",
    title: "How to Choose the Right Architect",
    date: "Feb 15, 2026",
    category: "Guide",
    excerpt:
      "Essential criteria and questions to ask when selecting an architect.",
  },
];

const categoryOptions = [
  "Technology",
  "Sustainability",
  "Guide",
  "Design",
  "News",
  "Lifestyle",
];

const empty: Post = {
  id: "",
  image: "",
  title: "",
  date: "",
  category: "Technology",
  excerpt: "",
};

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function todayFormatted() {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogsManager() {
  const [posts, setPosts] = useState<Post[]>(initial);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = () => {
    if (!form.title || !form.excerpt) return;
    const slug = editId !== null ? editId : slugify(form.title);
    const dateToUse = form.date || todayFormatted();

    if (editId !== null) {
      setPosts(
        posts.map((p) =>
          p.id === editId ? { ...form, id: editId, date: dateToUse } : p,
        ),
      );
      setEditId(null);
    } else {
      if (posts.find((p) => p.id === slug)) {
        alert("A post with this title slug already exists.");
        return;
      }
      setPosts([...posts, { ...form, id: slug, date: dateToUse }]);
    }
    setForm(empty);
    setShowForm(false);
  };

  const handleEdit = (p: Post) => {
    setForm({ ...p });
    setEditId(p.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this post?"))
      setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <div>
          <h2>Blog Posts</h2>
          <p className={styles.subtitle}>{posts.length} total</p>
        </div>
        <button
          className={styles.addBtn}
          onClick={() => {
            setShowForm(!showForm);
            setEditId(null);
            setForm(empty);
          }}
        >
          {showForm && editId === null ? "Cancel" : "+ Add Post"}
        </button>
      </div>

      {showForm && (
        <div className={styles.form}>
          <h3>{editId !== null ? "Edit Post" : "New Blog Post"}</h3>

          <div className={styles.fields}>
            <div className={styles.fieldGroup} style={{ gridColumn: "span 2" }}>
              <label>Title *</label>
              <input
                placeholder="e.g. Smart Home Trends to Watch in 2026"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {categoryOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label>Date (leave blank for today)</label>
              <input
                placeholder="e.g. Mar 10, 2026"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
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

            <div className={styles.fieldGroup} style={{ gridColumn: "span 2" }}>
              <label>Excerpt * (shown on the blog grid card)</label>
              <textarea
                placeholder="A short description shown on the blog listing page..."
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          {!editId && form.title && (
            <p className={styles.slugPreview}>
              URL slug: <code>/blog/{slugify(form.title)}</code>
            </p>
          )}

          <div className={styles.formActions}>
            <button className={styles.saveBtn} onClick={handleSubmit}>
              {editId !== null ? "Save Changes" : "Publish Post"}
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
            <th>Category</th>
            <th>Date</th>
            <th>Excerpt</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p.id}>
              <td>
                <span className={styles.primaryCell}>{p.title}</span>
                <span className={styles.slugCell}>{p.id}</span>
              </td>
              <td>
                <span className={`${styles.badge} ${styles.Planning}`}>
                  {p.category}
                </span>
              </td>
              <td className={styles.dateCell}>{p.date}</td>
              <td className={styles.excerptCell}>{p.excerpt}</td>
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
