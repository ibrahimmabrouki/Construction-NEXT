"use client";

import { useState } from "react";
import styles from "./Manager.module.css";
import {
  Building2,
  Home,
  Lightbulb,
  Paintbrush,
  Ruler,
  Shield,
  Hammer,
  Layers,
  LucideIcon,
} from "lucide-react";

type Service = {
  id: number;
  iconName: string;
  title: string;
  desc: string;
};

// Map icon names to Lucide components so we can render them
const iconMap: Record<string, LucideIcon> = {
  Building2,
  Home,
  Lightbulb,
  Paintbrush,
  Ruler,
  Shield,
  Hammer,
  Layers,
};

const iconOptions = Object.keys(iconMap);

const initial: Service[] = [
  {
    id: 1,
    iconName: "Building2",
    title: "Villa Construction",
    desc: "From concept to completion, we build bespoke luxury villas using the finest materials and cutting-edge construction techniques. Each project is tailored to your lifestyle and environment.",
  },
  {
    id: 2,
    iconName: "Home",
    title: "Smart Home Integration",
    desc: "Transform your home with intelligent automation — lighting, climate, security, and entertainment systems that adapt to your routines and preferences.",
  },
  {
    id: 3,
    iconName: "Paintbrush",
    title: "Interior Design",
    desc: "Our in-house design team curates spaces that balance aesthetic beauty with everyday function. Custom furniture, art curation, and material selection included.",
  },
  {
    id: 4,
    iconName: "Lightbulb",
    title: "Renovation & Remodeling",
    desc: "Breathe new life into existing properties. We specialize in transforming outdated spaces into modern, energy-efficient luxury residences.",
  },
  {
    id: 5,
    iconName: "Ruler",
    title: "Architectural Planning",
    desc: "Comprehensive architectural services from initial sketches to detailed blueprints. We navigate permits, regulations, and structural requirements.",
  },
  {
    id: 6,
    iconName: "Shield",
    title: "Project Management",
    desc: "End-to-end project oversight ensuring timelines, budgets, and quality standards are met without compromise.",
  },
];

const empty = { iconName: "Building2", title: "", desc: "" };

export default function ServicesManager() {
  const [services, setServices] = useState<Service[]>(initial);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = () => {
    if (!form.title || !form.desc) return;
    if (editId !== null) {
      setServices(
        services.map((s) => (s.id === editId ? { ...form, id: editId } : s)),
      );
      setEditId(null);
    } else {
      setServices([...services, { ...form, id: Date.now() }]);
    }
    setForm(empty);
    setShowForm(false);
  };

  const handleEdit = (s: Service) => {
    setForm({ iconName: s.iconName, title: s.title, desc: s.desc });
    setEditId(s.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this service?"))
      setServices(services.filter((s) => s.id !== id));
  };

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <div>
          <h2>Services</h2>
          <p className={styles.subtitle}>{services.length} total</p>
        </div>
        <button
          className={styles.addBtn}
          onClick={() => {
            setShowForm(!showForm);
            setEditId(null);
            setForm(empty);
          }}
        >
          {showForm && editId === null ? "Cancel" : "+ Add Service"}
        </button>
      </div>

      {showForm && (
        <div className={styles.form}>
          <h3>{editId !== null ? "Edit Service" : "New Service"}</h3>

          <div className={styles.fields}>
            <div className={styles.fieldGroup}>
              <label>Title *</label>
              <input
                placeholder="e.g. Villa Construction"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Icon</label>
              <select
                value={form.iconName}
                onChange={(e) => setForm({ ...form, iconName: e.target.value })}
              >
                {iconOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.fieldGroup} style={{ gridColumn: "span 2" }}>
              <label>Description * (shown on the services page card)</label>
              <textarea
                placeholder="Describe this service in 1–3 sentences..."
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          {/* Icon preview */}
          {form.iconName &&
            (() => {
              const Icon = iconMap[form.iconName];
              return (
                <div className={styles.iconPreview}>
                  <Icon size={20} />
                  <span>Icon preview: {form.iconName}</span>
                </div>
              );
            })()}

          <div className={styles.formActions}>
            <button className={styles.saveBtn} onClick={handleSubmit}>
              {editId !== null ? "Save Changes" : "Create Service"}
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

      <div className={styles.serviceGrid}>
        {services.map((s) => {
          const Icon = iconMap[s.iconName] ?? Building2;
          return (
            <div key={s.id} className={styles.serviceCard}>
              <div className={styles.serviceCardTop}>
                <div className={styles.serviceIconWrap}>
                  <Icon size={20} />
                </div>
                <div className={styles.actions}>
                  <button
                    className={styles.editBtn}
                    onClick={() => handleEdit(s)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(s.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <h4 className={styles.serviceCardTitle}>{s.title}</h4>
              <p className={styles.serviceCardDesc}>{s.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
