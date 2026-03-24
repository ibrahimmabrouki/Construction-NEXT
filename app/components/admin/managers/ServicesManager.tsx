"use client";

import { useEffect, useState } from "react";
import styles from "./ServicesManager.module.css";
import { ICON_MAP, AVAILABLE_ICONS, IconName } from "@/lib/iconMap";
import { Building2 } from "lucide-react";
import {
  createService,
  deleteService,
  editService,
  getAllServices,
} from "@/client-services/services";

interface Service {
  _id: string;
  iconName: IconName;
  title: string;
  desc: string;
}

// const initial: Service[] = [
//   {
//     _id: "1",
//     iconName: "Building2",
//     title: "Villa Construction",
//     desc: "From concept to completion, we build bespoke luxury villas using the finest materials and cutting-edge construction techniques. Each project is tailored to your lifestyle and environment.",
//   },
//   {
//     _id: "2",
//     iconName: "Home",
//     title: "Smart Home Integration",
//     desc: "Transform your home with intelligent automation — lighting, climate, security, and entertainment systems that adapt to your routines and preferences.",
//   },
//   {
//     _id: "3",
//     iconName: "Paintbrush",
//     title: "Interior Design",
//     desc: "Our in-house design team curates spaces that balance aesthetic beauty with everyday function. Custom furniture, art curation, and material selection included.",
//   },
//   {
//     _id: "4",
//     iconName: "Lightbulb",
//     title: "Renovation & Remodeling",
//     desc: "Breathe new life into existing properties. We specialize in transforming outdated spaces into modern, energy-efficient luxury residences.",
//   },
//   {
//     _id: "5",
//     iconName: "Ruler",
//     title: "Architectural Planning",
//     desc: "Comprehensive architectural services from initial sketches to detailed blueprints. We navigate permits, regulations, and structural requirements.",
//   },
//   {
//     _id: "6",
//     iconName: "Shield",
//     title: "Project Management",
//     desc: "End-to-end project oversight ensuring timelines, budgets, and quality standards are met without compromise.",
//   },
// ];

//setting up the initial empty form so when the user wants to add new serive the
//iconName will be the default on which is Building2
//the other values the title and the desc are empty, show the place holder.

const empty: Omit<Service, "_id"> = {
  iconName: "Building2",
  title: "",
  desc: "",
};

export default function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState<Omit<Service, "_id">>(empty);

  //initiall it is null to compare later and show the title of whether we are
  //editing or creating service.
  const [editId, setEditId] = useState<string | null>(null);

  //initially the form to edit or to create service is hidden
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async () => {
    if (!form.title || !form.desc) return;

    try {
      if (editId) {
        const response = await editService(form, editId);

        setServices(services.map((s) => (s._id === editId ? response : s)));
      } else {
        const response = await createService(form);

        setServices([...services, response]);
      }

      setForm(empty);
      setEditId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error submitting service:", error);
    }
  };

  //this is jsut for frontend purposes,  in order to show the form by making showForm state = to true
  //it also take the servie that we want and set its id, to know which id should be edited in the frontend.
  //also it calls setForm in oder to use the current data to be edited (for the tardgeted service)
  const handleEdit = (s: Service) => {
    setForm({
      iconName: s.iconName,
      title: s.title,
      desc: s.desc,
    });
    setEditId(s._id);
    setShowForm(true);
  };

  const handleDelete = async (_id: string) => {
    try {

      //just for protection but it is not going to happen
      if(!_id){
        alert("ID is not defined");
      }

      const response = await deleteService(_id);

      if(response._id === _id){
        setServices(services.filter((s)=> s._id !== _id))
      }



    } catch (error) {
      console.error("Error deleting service:", error);
    }
    if (confirm("Delete this service?")) {
      setServices(services.filter((s) => s._id !== _id));
    }
  };

  //fetching the services from the backend to be displayed
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getAllServices();
        setServices(response);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      }
    };

    fetchServices();
  }, []);

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
            setShowForm(!showForm); // initlly showForm is false => !false = true.
            setEditId(null);
            setForm(empty); //setting the form to be empty since we are adding new service.
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
                onChange={(e) =>
                  setForm({
                    ...form,
                    iconName: e.target.value as IconName,
                  })
                }
              >
                {AVAILABLE_ICONS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.fieldGroup} style={{ gridColumn: "span 2" }}>
              <label>Description *</label>
              <textarea
                placeholder="Describe this service..."
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          {/* setting up the icon preview at the bottom left
           it is taken from the form 
           note that the default value is Building2*/}
          {form.iconName &&
            (() => {
              const Icon = ICON_MAP[form.iconName] || Building2;
              return (
                <div className={styles.iconPreview}>
                  <Icon size={20} />
                  <span>Icon preview: {form.iconName}</span>
                </div>
              );
            })()}

          {/* after clicking the + Add Service
          editId = null
          null !== null is false => Create Service*/}
          <div className={styles.formActions}>
            <button className={styles.saveBtn} onClick={handleSubmit}>
              {editId !== null ? "Save Changes" : "Create Service"}
            </button>

            <button
              className={styles.cancelBtn}
              onClick={() => {
                setShowForm(false);

                // setting the edit id to null even after trying to edit not only the after clicking create
                //since we need reset to initial state.
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
          const Icon = ICON_MAP[s.iconName] || Building2;

          return (
            <div key={s._id} className={styles.serviceCard}>
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
                    onClick={() => handleDelete(s._id)}
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
