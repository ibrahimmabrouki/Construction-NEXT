"use client";

import styles from "./Contact.module.css";
import { useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent! We'll respond within 24 hours.");
  };

  return (
    <main className="page">
      <section className={styles.section}>
        <div className={styles.grid}>
          {/* LEFT SIDE */}
          <div className={styles.info}>
            <span className={styles.label}>Get in Touch</span>

            <h1 className={styles.title}>Contact Us</h1>

            <p className={styles.subtitle}>
              Whether you have a project in mind or simply want to learn more,
              we'd love to hear from you.
            </p>

            <div className={styles.contactList}>
              {[
                {
                  icon: MapPin,
                  label: "Visit Us",
                  value: "123 Luxury Lane, Beverly Hills, CA",
                },
                {
                  icon: Phone,
                  label: "Call Us",
                  value: "+1 (555) 234-5678",
                },
                {
                  icon: Mail,
                  label: "Email Us",
                  value: "contact@luxvera.com",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.label} className={styles.contactItem}>
                    <Icon className={styles.icon} />

                    <div>
                      <p className={styles.itemLabel}>{item.label}</p>
                      <p className={styles.itemValue}>{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDE (FORM) */}
          <div className={styles.formCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Message</label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  required
                />
              </div>

              <button type="submit" className={styles.button}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
