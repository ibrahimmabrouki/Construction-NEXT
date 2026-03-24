"use client";

import { useEffect, useState } from "react";
import styles from "./SubmissionsManager.module.css";
import {
  deleteInquiry,
  getAllInquires,
  reviewInquiry,
} from "@/client-services/inquiry";

interface InquiryDataRecieved {
  _id: string;
  name: string;
  email: string;
  budget: string;
  message: string;
  projectTitle: string;
  date: string;
  status: string;
}

// const initial: Submission[] = [
//   {
//     _id: "1",
//     name: "John Smith",
//     email: "john@example.com",
//     budget: "€2M–€5M",
//     date: "Mar 15, 2026",
//     status: "New",
//   },
//   {
//     _id: "2",
//     name: "Maria Garcia",
//     email: "maria@example.com",
//     budget: "€1M–€2M",
//     date: "Mar 12, 2026",
//     status: "Reviewed",
//   },
//   {
//     _id: "3",
//     name: "David Kim",
//     email: "david@example.com",
//     budget: "€5M+",
//     date: "Mar 10, 2026",
//     status: "New",
//   },
// ];

export default function SubmissionsManager() {
  const [submissions, setSubmissions] = useState<InquiryDataRecieved[]>([]);

  const markReviewed = (_id: string) => {
    setSubmissions(
      submissions.map((s) =>
        s._id === _id ? { ...s, status: "Reviewed" } : s,
      ),
    );
  };

  const handleReview = async (_id: string) => {
    try {
      if (!_id) {
        console.error("Invalid inquiry ID");
        return;
      }

      const updated = await reviewInquiry(_id);

      setSubmissions((prev) => prev.map((s) => (s._id === _id ? updated : s)));
    } catch (error) {
      console.error("Failed to review inquiry:", error);
    }
  };

  const handleDelete = async (_id: string) => {
    try {
      if (!_id) {
        console.error("Invalid inquiry ID");
        return;
      }

      const deleted = await deleteInquiry(_id);

      setSubmissions((prev) => prev.filter((s) => s._id !== deleted._id));
    } catch (error) {
      console.error("Failed to delete inquiry:", error);
    }
  };

  //fetching the inquiries from the backend to be displayed
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await getAllInquires();
        setSubmissions(response);
      } catch (error) {
        console.error("Failed to fetch inquiries:", error);
      }
    };
    fetchInquiries();
  }, []);

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <h2>Submissions</h2>
      </div>

      <div className={styles.tableWrapper}>
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
              <tr key={s._id}>
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
                        onClick={() => handleReview(s._id)}
                      >
                        Mark Reviewed
                      </button>
                    )}
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(s._id)}
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
    </div>
  );
}
