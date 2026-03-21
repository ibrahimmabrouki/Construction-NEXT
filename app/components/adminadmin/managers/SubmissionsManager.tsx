"use client";

import { useState } from "react";
import styles from "./Manager.module.css";

type Submission = {
  id: number;
  name: string;
  email: string;
  budget: string;
  date: string;
  status: string;
};

const initial: Submission[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    budget: "€2M–€5M",
    date: "Mar 15, 2026",
    status: "New",
  },
  {
    id: 2,
    name: "Maria Garcia",
    email: "maria@example.com",
    budget: "€1M–€2M",
    date: "Mar 12, 2026",
    status: "Reviewed",
  },
  {
    id: 3,
    name: "David Kim",
    email: "david@example.com",
    budget: "€5M+",
    date: "Mar 10, 2026",
    status: "New",
  },
];

export default function SubmissionsManager() {
  const [submissions, setSubmissions] = useState<Submission[]>(initial);

  const markReviewed = (id: number) => {
    setSubmissions(
      submissions.map((s) => (s.id === id ? { ...s, status: "Reviewed" } : s)),
    );
  };

  const handleDelete = (id: number) => {
    setSubmissions(submissions.filter((s) => s.id !== id));
  };

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <h2>Submissions</h2>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Budget</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td style={{ color: "#666" }}>{s.email}</td>
              <td>{s.budget}</td>
              <td style={{ color: "#888" }}>{s.date}</td>
              <td>
                <span
                  className={`${styles.badge} ${s.status === "Reviewed" ? styles.Completed : styles.InProgress}`}
                >
                  {s.status}
                </span>
              </td>
              <td>
                <div className={styles.actions}>
                  {s.status === "New" && (
                    <button
                      className={styles.editBtn}
                      onClick={() => markReviewed(s.id)}
                    >
                      Mark Reviewed
                    </button>
                  )}
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(s.id)}
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
