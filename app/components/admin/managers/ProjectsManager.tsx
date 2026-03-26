"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./ProjectsManager.module.css";
import Image from "next/image";
import {
  createProject,
  deleteProject,
  getAllProjectAdmin,
  updateProject,
} from "@/client-services/projects";
import { useAuthStore } from "../../../store/auth";
import { wait } from "@/utils/delay";
import Loader from "../../ui/Loader/Loader";

interface Project {
  slug: string;
  images: string[]; //array of URLs from DB to be displyed incase the admin want to edit them.
  title: string;
  location: string;
  price: string;
  status: string;
  style: string;
  description: string;
}

interface UploadedProject {
  images: File[]; //array of File objects before upload to be stored on the database
  title: string;
  location: string;
  price: string;
  status: string;
  style: string;
  description: string;
}

// const initial: Project[] = [
//   {
//     slug: "villa-azure",
//     images: ["/images/project-1.jpg", "/images/project-2.jpg", "/images/project-3.jpg"],
//     title: "Villa Azure",
//     location: "Marbella, Spain",
//     price: "€2.4M",
//     status: "Completed",
//     style: "Mediterranean",
//     description: "A stunning Mediterranean villa featuring 5 bedrooms, infinity pool, and panoramic sea views.",
//   },
//   {
//     slug: "skyline-penthouse",
//     images: ["/images/project-2.jpg", "/images/project-1.jpg"],
//     title: "Skyline Penthouse",
//     location: "Dubai, UAE",
//     price: "€5.1M",
//     status: "In Progress",
//     style: "Modern",
//     description: "An ultra-modern penthouse with floor-to-ceiling glass walls and rooftop terrace.",
//   },
//   {
//     slug: "horizon-retreat",
//     images: ["/images/project-3.jpg"],
//     title: "Horizon Retreat",
//     location: "Bali, Indonesia",
//     price: "€1.8M",
//     status: "Completed",
//     style: "Tropical",
//     description: "A tropical sanctuary blending modern minimalism with Balinese craftsmanship.",
//   },
//   {
//     slug: "alpine-lodge",
//     images: ["/images/project-1.jpg"],
//     title: "Alpine Lodge",
//     location: "Zurich, Switzerland",
//     price: "€3.2M",
//     status: "Planning",
//     style: "Contemporary",
//     description: "A contemporary mountain retreat designed to blend seamlessly with the Alpine landscape.",
//   },
// ];

const statusOptions = ["Planning", "In Progress", "Completed"];
const styleOptions = [
  "Mediterranean",
  "Modern",
  "Tropical",
  "Contemporary",
  "Minimalist",
  "Industrial",
];

//this the empty project that will be used in order to set the intial state and reset after editing or uploading the post also incase the admin wants to cancel the edit.
const empty: Project = {
  slug: "",
  images: [],
  title: "",
  location: "",
  price: "",
  status: "Planning",
  style: "Modern",
  description: "",
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
  const hasAccess = useAuthStore((s) => s.hasAccess);
  const createAccess = hasAccess("blogs", "create");
  const updateAccess = hasAccess("blogs", "update");
  const deleteAccess = hasAccess("blogs", "delete");

  // this use state is the state that will hold all the projects and filled when the admin logs in
  // it will updated in case the admin make and of the CRUD operations on the database.
  const [projects, setProjects] = useState<Project[]>([]);

  //useState in order to define the values of the form at the begining and it will hold the values added in case the admin wants to add new
  //post or hold the old values incase the admin wants to update the project posted
  const [form, setForm] = useState<Project>(empty);

  //useState that maintian the value to be diplayed in the button
  const [buttonText, setButtonText] = useState<string>("+ Add Project");

  //useState that is used in multiple things. it is set when the user clicks the Edit button which allow them hold the slug which represents the project
  //to be edited, and used in deciding whether we are editing a project or we are posting new project
  const [editSlug, setEditSlug] = useState<string | null>(null);

  //useState that is used to track whether the form should be opened or not
  const [showForm, setShowForm] = useState(false);

  // holds preview URLs for display (bURLs for new files, existing URLs for edit)
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // holds the actual File objects for new uploads
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  //fetching the project initially after rendering the page
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoadingMessage("Loading projects...");
        setLoading(true);
        const start = Date.now();

        const data = await getAllProjectAdmin();
        setProjects(data);

        const elapsed = Date.now() - start;
        if (elapsed < 1000) {
          await wait(1000 - elapsed);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  //handling the images which are picked or discarded.
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    // create preview URLs for all selected files
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    // append to existing previews and files (so user can add more images)
    setImagePreviews((prev) => [...prev, ...newPreviews]); //setting them in order to be able to send them to the back.
    setSelectedFiles((prev) => [...prev, ...files]);

    // reset file input so same files can be re-selected if needed
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));

    if (index < form.images.length) {
      // removing existing image
      setForm((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    } else {
      // removing new file
      setSelectedFiles((prev) =>
        prev.filter((_, i) => i !== index - form.images.length),
      );
    }
  };

  const handleSubmit = async () => {
    if (
      !form.title.trim() ||
      !form.location.trim() ||
      !form.price.trim() ||
      !form.status ||
      !form.style ||
      !form.description.trim()
    ) {
      alert("All fields are required.");
      return;
    }

    const totalImages = form.images.length + selectedFiles.length;

    if (totalImages === 0) {
      alert("Please upload at least one image.");
      return;
    }

    try {
      if (editSlug !== null) {
        setLoadingMessage("Updating project...");
        setLoading(true);
        const start = Date.now();
        const updated = await updateProject(
          {
            title: form.title,
            location: form.location,
            price: form.price,
            status: form.status as any,
            style: form.style as any,
            description: form.description,
            existingImages: form.images,
            newImages: selectedFiles,
          },
          editSlug,
        );

        setProjects((prev) =>
          prev.map((p) => (p.slug === editSlug ? updated : p)),
        );
        const elapsed = Date.now() - start;
        if (elapsed < 1000) {
          await wait(1000 - elapsed);
        }
      } else {
        setLoadingMessage("Creating project...");
        setLoading(true);
        const start = Date.now();
        const created = await createProject({
          title: form.title,
          location: form.location,
          price: form.price,
          status: form.status as any,
          style: form.style as any,
          description: form.description,
          images: selectedFiles,
        });

        setProjects((prev) => [...prev, created]);
        const elapsed = Date.now() - start;
        if (elapsed < 1000) {
          await wait(1000 - elapsed);
        }
      }

      setForm(empty);
      setImagePreviews([]);
      setSelectedFiles([]);
      setShowForm(false);
      setEditSlug(null);
      setButtonText("+ Add Project");
    } catch (error) {
      console.error(error);
      alert("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p: Project) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setForm({ ...p });
    setEditSlug(p.slug);
    // show existing image URLs as previews
    setImagePreviews([...p.images]);
    setSelectedFiles([]);
    setShowForm(true);
    setButtonText("Cancel"); //changing the value of the button text to Cancel since the use is trying to edit the post
  };

  const handleDeleteProject = async (slug: string) => {
    if (!confirm("Delete this project?")) return;

    try {
      setLoadingMessage("Updating project...");
      setLoading(true);
      const start = Date.now();

      await deleteProject(slug);

      setProjects((prev) => prev.filter((p) => p.slug !== slug));
      const elapsed = Date.now() - start;
      if (elapsed < 1000) {
        await wait(1000 - elapsed);
      }
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditSlug(null);
    setForm(empty);
    setImagePreviews([]);
    setSelectedFiles([]);
    setButtonText("+ Add Project"); // resetting the value of the button initially
  };

  return (
    <>
      <Loader loading={loading} message={loadingMessage} variant="overlay" />
      <div className={styles.manager}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Projects</h2>
            <p className={styles.subtitle}>{projects.length} total</p>
          </div>

          {/* this the button at the top corner intillay its text is + Add Project when the user clicks => the admin wants to post new project 
        so it should changed into cancel */}
          {createAccess && (
            <button
              className={styles.addBtn}
              onClick={() => {
                //if the form is shown even if we are editing the project or creating new project post we need to handle the cancel
                if (
                  (showForm && editSlug === null) ||
                  (showForm && editSlug !== null)
                ) {
                  handleCancelForm();
                } else {
                  setShowForm(true); //show the form
                  setEditSlug(null); //set the slug to null since the admin clicked on + Add Projec
                  setForm(empty); //setting the from to have the default values
                  setImagePreviews([]); //setting the images links to null
                  setSelectedFiles([]); //also the selected files are null
                  setButtonText("Cancel");
                }
              }}
            >
              {buttonText}
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className={styles.form}>
            {/* if we are editing exiting project then we need to show Edit Porject otherwise it is new "Project" */}
            <h3>{editSlug !== null ? "Edit Project" : "New Project"}</h3>

            <div className={styles.fields}>
              <div className={styles.fieldGroup}>
                <label>Title *</label>
                <input
                  placeholder="e.g. Villa Azure"
                  value={form.title} //getting the values from the form so incase we are editing throught the handleEdit we are setting the
                  //form to be the passed project, so we display the old values otherwise the form is set to empty when the user clicks the + Add Project
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label>Location *</label>
                <input
                  placeholder="e.g. Marbella, Spain"
                  value={form.location} //similar to title above
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
              </div>

              <div className={styles.fieldGroup}>
                <label>Price</label>
                <input
                  placeholder="e.g. €2.4M"
                  value={form.price} //similar to title above
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label>Style</label>
                <select
                  value={form.style} //similar to title above
                  onChange={(e) => setForm({ ...form, style: e.target.value })}
                >
                  {styleOptions.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label>Status</label>
                <select
                  value={form.status} //similar to title above
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {statusOptions.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Description — full width */}
              <div
                className={styles.fieldGroup}
                style={{ gridColumn: "span 2" }}
              >
                <label>Description *</label>
                <textarea
                  placeholder="Describe the project..."
                  value={form.description} //similar to title above
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={4}
                />
              </div>

              {/* Images upload — full width */}
              <div
                className={styles.fieldGroup}
                style={{ gridColumn: "span 2" }}
              >
                <label>
                  Project Images * ({imagePreviews.length} selected)
                </label>

                {/* Existing + new image previews */}
                {/* incase we have images we are going to display them in the grid */}
                {imagePreviews.length > 0 && (
                  // grid container to display the images
                  <div className={styles.previewGrid}>
                    {imagePreviews.map((src, i) => (
                      <div key={i} className={styles.previewItem}>
                        <div className={styles.previewImageWrap}>
                          <Image
                            src={src}
                            alt={`Preview ${i + 1}`}
                            fill
                            className={styles.previewImage}
                            unoptimized
                          />
                          {/*display the word cover for the first iamge which is the cover image*/}
                          {i === 0 && (
                            <span className={styles.coverBadge}>Cover</span>
                          )}
                        </div>
                        {/* remove button */}
                        <button
                          className={styles.removeImageBtn}
                          onClick={() => removeImage(i)}
                          type="button"
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    {/* this will be also displayed inside the same Grid inorder to allow the user to add more images incase they want*/}
                    <div
                      className={styles.addMoreWrap}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <span className={styles.addMoreIcon}>+</span>
                      <span className={styles.addMoreText}>Add more</span>
                    </div>
                  </div>
                )}

                {/* when ther are no images or the user deleted all the images this how will the upload images look like */}
                {imagePreviews.length === 0 && (
                  <div
                    className={styles.uploadArea}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className={styles.uploadPlaceholder}>
                      <div className={styles.uploadIcon}>↑</div>
                      <p className={styles.uploadText}>
                        Click to upload images
                      </p>
                      <p className={styles.uploadHint}>
                        Select multiple — JPG, PNG, WEBP up to 10MB each
                      </p>
                    </div>
                  </div>
                )}

                {/* Hidden file input — multiple allowed */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  style={{ display: "none" }}
                />

                <p className={styles.uploadNote}>
                  First image is used as the cover on the projects listing page.
                </p>
              </div>
            </div>

            {!editSlug && form.title && (
              <p className={styles.slugPreview}>
                Slug: <code>/projects/{slugify(form.title)}</code>
              </p>
            )}

            <div className={styles.formActions}>
              <button className={styles.saveBtn} onClick={handleSubmit}>
                {editSlug !== null ? "Save Changes" : "Create Project"}
              </button>
              <button className={styles.cancelBtn} onClick={handleCancelForm}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Project rows — only first image shown */}
        <div className={styles.list}>
          {projects.map((p) => (
            <div key={p.slug} className={styles.row}>
              {/* Only first image displayed in the list */}
              <div className={styles.imageWrap}>
                {p.images[0] && (
                  <Image
                    src={p.images[0]}
                    alt={p.title}
                    fill
                    className={styles.image}
                  />
                )}
                {/* image count badge if more than 1 */}
                {p.images.length > 1 && (
                  <span className={styles.imageCount}>
                    +{p.images.length - 1}
                  </span>
                )}
              </div>

              <div className={styles.info}>
                <p className={styles.projectTitle}>{p.title}</p>
                <p className={styles.projectLocation}>{p.location}</p>
              </div>

              <p className={styles.locationCol}>{p.price}</p>

              <span
                className={`${styles.badge} ${statusClass[p.status] ?? ""}`}
              >
                {p.status}
              </span>

              <div className={styles.actions}>
                {updateAccess && (
                  <button
                    className={styles.editBtn}
                    onClick={() => handleEdit(p)}
                  >
                    Edit
                  </button>
                )}
                {deleteAccess && (
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteProject(p.slug)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
