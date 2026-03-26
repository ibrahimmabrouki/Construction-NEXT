"use client";

import { useState } from "react";
import styles from "./InquiryForm.module.css";
import { submitInquiry } from "@/client-services/inquiry";
import { wait } from "@/utils/delay";
import Loader from "../../ui/Loader/Loader";

interface InquiryFormProps {
  projectTitle?: string;
  slug: string;
}

interface InquiryDataSent {
  name: string;
  email: string;
  budget: string;
  message: string;
  projectTitle: string;
}

export default function InquiryForm({ projectTitle, slug }: InquiryFormProps) {
  const [form, setForm] = useState<InquiryDataSent>({
    name: "",
    email: "",
    budget: "",
    message: "",
    projectTitle: projectTitle || "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(form.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const start = Date.now();
      setLoading(true);

      await submitInquiry(form, slug);

      const elapsed = Date.now() - start;
      if (elapsed < 1000) {
        await wait(1000 - elapsed);
      }
      setLoading(false);
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setForm({
          name: "",
          email: "",
          budget: "",
          message: "",
          projectTitle: projectTitle || "",
        });
      }, 5000);
    } catch (error) {
      alert("Failed to submit inquiry. Please try again later.");
    }
  };

  if (submitted) {
    return (
      <div className={styles.card}>
        <div className={styles.success}>
          <div className={styles.successIcon}>✓</div>
          <h3 className={styles.successTitle}>Thank you!</h3>
          <p className={styles.successText}>
            We have received your inquiry and will be in touch within 24 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Loader
        loading={loading}
        message="Sending inquiry..."
        variant="overlay"
      />
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>I'm Interested</h3>
          {projectTitle && <p className={styles.cardSub}>{projectTitle}</p>}
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Budget Range</label>
            <select
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              required
            >
              <option value="" disabled>
                Select a range
              </option>
              <option>Under €1M</option>
              <option>€1M – €2M</option>
              <option>€2M – €5M</option>
              <option>€5M – €10M</option>
              <option>€10M+</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Message</label>
            <textarea
              placeholder="Tell us about your vision..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
            />
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Sending..." : "Send Inquiry"}
          </button>
        </form>
      </div>
    </>
  );
}
