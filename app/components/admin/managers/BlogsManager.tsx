"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./BlogsManager.module.css";
import Image from "next/image";
import {
  createBlog,
  getAllBlogs,
  updateBlog,
  deletePost,
} from "@/client-services/blogs";

interface Post {
  slug: string;
  image: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
}

interface UploadedPost {
  image: File | null;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
}

// const initial: Post[] = [
//   {
//     slug: "smart-home-trends-2026",
//     image: "/images/project-1.jpg",
//     title: "Smart Home Trends to Watch in 2026",
//     date: "Mar 10, 2026",
//     category: "Technology",
//     excerpt: "From AI-powered climate control to integrated wellness systems, discover what's shaping the future of smart living.",
//     content: "",
//   },
//   {
//     slug: "sustainable-luxury-building",
//     image: "/images/project-2.jpg",
//     title: "Sustainable Luxury: Building Without Compromise",
//     date: "Feb 28, 2026",
//     category: "Sustainability",
//     excerpt: "How modern construction techniques allow for environmentally responsible luxury homes.",
//     content: "",
//   },
//   {
//     slug: "choosing-right-architect",
//     image: "/images/project-3.jpg",
//     title: "How to Choose the Right Architect",
//     date: "Feb 15, 2026",
//     category: "Guide",
//     excerpt: "Essential criteria and questions to ask when selecting an architect.",
//     content: "",
//   },
// ];

const categoryOptions = [
  "Technology",
  "Sustainability",
  "Guide",
  "Design",
  "News",
  "Lifestyle",
];

const empty: Post = {
  slug: "",
  image: "",
  title: "",
  date: "",
  category: "Technology",
  excerpt: "",
  content: "",
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
  //this useState is used to recieve and set all the posts after rendering the page through the useEffect
  const [posts, setPosts] = useState<Post[]>([]);

  //this useState Represent the form which is going to hold prev data upon editing or the new data upon uploading new post
  const [form, setForm] = useState<Post>(empty);

  //this useState will hold the value of the slug that represents what post to be edited
  const [editSlug, setEditSlug] = useState<string | null>(null);

  //this useState will be value that determines whether to show the form where the admin can post or edit the post
  //initially it is false which means the form is initially hidden
  const [showForm, setShowForm] = useState(false);

  //this useState if control the value displayed in the button
  const [buttonText, setButtonText] = useState<string>("+ Add Post");

  //this useState string value represets the link or the path to the image
  const [imagePreview, setImagePreview] = useState<string>("");

  //this useState will hold the actual image and it will be updated in the handleImageChange
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  /* in htlm we have  <input type="file" /> a clickable button in order to allow the broswer read and access file on our local devices.
  This button looks ugly. so we use the useRef instead in order to controle the hidden input which is ugly*/

  // after picking the file from our local devices, this function will be called on every change
  //e is the event that have information about what happend and what the user selected as fils
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // e.target.files is the list of the files
    //[0] choosing the first file
    if (!file) return;
    //here we hace the file object that includes some props like
    //file.name, file.size, file.type

    //but since everything still local on the client device and nothing sent to the server
    // Create a local preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setImageFile(file);

    // Store the file name as the image path
    // When you connect to backend, replace this with actual upload logic
    setForm({ ...form, image: previewUrl });
  };

  const handleSubmit = async () => {
    try {
      const dateToUse = form.date || todayFormatted();
      //here we are updating the already existed posts
      if (editSlug) {
        const data: UploadedPost = {
          image: imageFile,
          title: form.title,
          date: dateToUse,
          category: form.category,
          excerpt: form.excerpt,
          content: form.content,
        };

        const updated = await updateBlog(editSlug, data);

        setPosts((prev) =>
          prev.map((p) => (p.slug === editSlug ? updated : p)),
        );
        setEditSlug(null);
      }
      //here we are addming new post
      else {
        if (
          !form.title ||
          !form.excerpt ||
          !form.content ||
          !form.category ||
          !form.date ||
          !form.image
        ) {
          alert("Missing required feilds");
          return;
        }

        const data: UploadedPost = {
          image: imageFile,
          title: form.title,
          date: form.date,
          category: form.category,
          excerpt: form.excerpt,
          content: form.content,
        };

        const response = await createBlog(data);

        setPosts((prev) => [...prev, response]);
      }
    } catch (error) {
      console.error("Failed to post a blogs:", error);
    }

    // here we are reseting the form
    setForm(empty);
    setImagePreview("");
    setImageFile(null);
    setShowForm(false);
    setButtonText("+ Add Post");
  };

  const handleEdit = (p: Post) => {
    setForm({ ...p });
    setEditSlug(p.slug);
    setImagePreview(p.image);
    setShowForm(true);
    setButtonText("Cancel");

    // in the above sets since the admin clicks on Edit we need to set the values to the old values
    //also we need to diplay the alreadt posted image thats why we have the setImagePreview
  };


  //handler in order to delet the post.
  const handleDelete = async (slug: string) => {
    try {
      await deletePost(slug);

      setPosts((prev) => prev.filter((post) => post.slug !== slug));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditSlug(null);
    setForm(empty);
    setImagePreview("");
    //the above could be not important since the form is already closed and they are also handled whether the user clicks on + Add Post or Edit
    setButtonText("+ Add Post");
  };

  //fetching the services from the backend to be displayed
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        //getting the posts then setting them to the post state array
        const response = await getAllBlogs();
        setPosts(response);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <div>
          <h2>Blog Posts</h2>
          {/* showing the total number of the blog posts based on the post state array length */}
          <p className={styles.subtitle}>{posts.length} total</p>
        </div>

        <button
          className={styles.addBtn}
          onClick={() => {
            if (
              (showForm && editSlug === null) ||
              (showForm && editSlug !== null)
            ) {
              handleCancelForm();
              // setShowForm(false);
              // setEditSlug(null);
              // setForm(empty);
              // setImagePreview("");
            } else {
              setShowForm(true);
              setEditSlug(null);
              setForm(empty);
              setImagePreview("");
              setButtonText("Cancel");
            }
          }}
        >
          {/*for the below button the value of the text is initially + Add Post when the user clicks on it, the value change to cancel which is normal 
        the showForm becomes true which lead to displaying the form and since the slug value is null since the admin click dirctly on Add Post then the first condition is skipped (showForm = false initially)
        the form also set to empty and default values 
        and fro the imagePreview it is intially null and if the admin wants to add new post then it should anways set to null since 
        there is no preview image to be displayed*/}

          {/* {showForm && editSlug === null ? "Cancel" : "+ Add Post"} same functionlity but is*/}
          {buttonText}

          {/* also for the above button when form is already open and there is or no slug it will call the handle cancel form to bring back everything to the intial state
          in the cancel handler we bring back the valur to it iniall state which is + Add Post, reseting the */}
        </button>
      </div>

      {showForm && (
        <div className={styles.form}>
          {/* this form will be used for both the adding new and editing the old posts so the texts will be displayed based on the editSlug value */}
          <h3>{editSlug !== null ? "Edit Post" : "New Blog Post"}</h3>

          <div className={styles.fields}>
            {/* Title — full width */}
            <div className={styles.fieldGroup} style={{ gridColumn: "span 2" }}>
              <label>Title *</label>
              <input
                placeholder="e.g. Smart Home Trends to Watch in 2026"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            {/* Category */}
            <div className={styles.fieldGroup}>
              <label>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {categoryOptions.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className={styles.fieldGroup}>
              <label>Date (leave blank for today)</label>
              <input
                placeholder="e.g. Mar 10, 2026"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>

            {/* Image upload — full width */}
            <div className={styles.fieldGroup} style={{ gridColumn: "span 2" }}>
              <label>Cover Image *</label>

              {/* Upload area */}
              <div
                //this is the hidden area that is used to upload the image and controlled by the useRef
                className={styles.uploadArea}
                onClick={() => fileInputRef.current?.click()}
                //fileInputRef.current is the actual hidden button
              >
                {imagePreview ? (
                  // if there is image preview which means the admin clicked on edit
                  //then set the imagePreview in the handle edit
                  //then display the first option
                  <div className={styles.previewWrap}>
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className={styles.previewImage}
                      unoptimized
                    />
                    <div className={styles.previewOverlay}>
                      <span>Click to change image</span>
                    </div>
                  </div>
                ) : (
                  // if there is no image preview which means the admin clicked on + Add Post
                  //then set the imagePreview to "" in bulck of button
                  //then display the first second
                  <div className={styles.uploadPlaceholder}>
                    <div className={styles.uploadIcon}>↑</div>
                    <p className={styles.uploadText}>Click to upload image</p>
                    <p className={styles.uploadHint}>
                      JPG, PNG, WEBP up to 10MB
                    </p>
                  </div>
                )}
                {/* all of these the two options are added into one big div that represents the container where the user will view old image incase of editing 
                or upload the image incase posting a new post */}
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />

              {/* Show stored path */}
              {form.image && (
                <p className={styles.imagePath}>
                  Stored as: <code>{imagePreview}</code>
                </p>
              )}
            </div>

            {/* Excerpt — full width */}
            <div className={styles.fieldGroup} style={{ gridColumn: "span 2" }}>
              <label>Excerpt * (shown on blog grid card)</label>
              <textarea
                placeholder="A short description shown on the blog listing page..."
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                rows={3}
              />
            </div>

            {/* Content — full width */}
            <div className={styles.fieldGroup} style={{ gridColumn: "span 2" }}>
              <label>Content * (full article body)</label>
              <textarea
                placeholder="Write the full blog post content here..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={8}
              />
            </div>
          </div>

          {!editSlug && form.title && (
            <p className={styles.slugPreview}>
              URL slug: <code>/blog/{slugify(form.title)}</code>
            </p>
          )}

          <div className={styles.formActions}>
            <button className={styles.saveBtn} onClick={handleSubmit}>
              {editSlug !== null ? "Save Changes" : "Publish Post"}
            </button>
            <button className={styles.cancelBtn} onClick={handleCancelForm}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className={styles.tableWrapper}>
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
              <tr key={p.slug}>
                <td>
                  <span className={styles.primaryCell}>{p.title}</span>
                  <span className={styles.slugCell}>{p.slug}</span>
                </td>
                <td>
                  <span className={`${styles.badge}`}>{p.category}</span>
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
                      onClick={() => handleDelete(p.slug)}
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
