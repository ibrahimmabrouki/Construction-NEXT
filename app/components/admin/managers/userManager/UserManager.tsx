"use client";

import { useEffect, useState } from "react";
import api from "@/client-services/axios";
import styles from "./UserManager.module.css";
import {
  getAllUsers,
  getAllRoles,
  deleteUser,
  createUser,
  updateUser,
} from "@/client-services/users";
import { wait } from "@/utils/delay";
import Loader from "@/app/components/ui/Loader/Loader";
type User = {
  _id: string;
  username: string;
  password?: string;
  roles: string[];
};

type Role = {
  _id: string;
  name: string;
};

// const MOCK_USERS: User[] = [
//   { _id: "1", username: "ibrahim", roles: ["admin"] },
//   { _id: "2", username: "editorUser", roles: ["blogeditor", "projecteditor"] },
// ];
// const ROLES = ["admin", "projecteditor", "blogeditor", "manager"];

export default function UsersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<Partial<User>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [globalRoleSet, SetGlobalRoleSet] = useState<Role[]>([]);
  const [loadingMessage, setLodingMessage] = useState("");

  //here we are fetching and setting the users and the roles in the users and the roles state
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLodingMessage("Loading users...");
        setLoading(true);
        const start = Date.now();
        // getting the users then setting them to the roles state array
        const usersResponse = await getAllUsers();
        setUsers(usersResponse);

        // getting the roles then setting them to the roles state array
        const rolesResponse = await getAllRoles();
        SetGlobalRoleSet(rolesResponse);
        const elapsed = Date.now() - start;
        if (elapsed < 1000) {
          await wait(1000 - elapsed);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!form.username || (!editingId && !form.password)) return;

    const payload = {
      username: form.username,
      password: form.password || "",
      roles: form.roles || [],
    };

    try {
      if (editingId) {
        setLodingMessage("Editing users...");
        setLoading(true);
        const start = Date.now();

        const updatedUser = await updateUser(payload, editingId);

        setUsers((prev) =>
          prev.map((u) => (u._id === editingId ? updatedUser : u)),
        );
        const elapsed = Date.now() - start;
        if (elapsed < 1000) {
          await wait(1000 - elapsed);
        }
      } else {
        setLodingMessage("Creating users...");
        setLoading(true);
        const start = Date.now();
        const newUser = await createUser(payload);

        setUsers((prev) => [...prev, newUser]);
        const elapsed = Date.now() - start;
        if (elapsed < 1000) {
          await wait(1000 - elapsed);
        }
      }

      setForm({});
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Submit User Error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setForm(user);
    setEditingId(user._id);
    setShowForm(true);
  };

  const handleDelete = async (_id: string) => {
    try {
      setLodingMessage("Editing users...");
      setLoading(true);
      const start = Date.now();

      await deleteUser(_id);

      setUsers((prev) => prev.filter((u) => u._id !== _id));
      const elapsed = Date.now() - start;
      if (elapsed < 1000) {
        await wait(1000 - elapsed);
      }
    } catch (error) {
      console.error("Deleting User Error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = (role: Role) => {
    const current = form.roles || [];
    if (current.includes(role._id)) {
      setForm({
        ...form,
        roles: current.filter((roleId) => roleId !== role._id),
      });
    } else {
      setForm({ ...form, roles: [...current, role._id] });
    }
  };

  return (
    <>
      <Loader loading={loading} message={loadingMessage} variant="overlay" />
      <div className={styles.manager}>
        {/* HEADER */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Users</h2>
            <p className={styles.subtitle}>{users.length} total</p>
          </div>

          <button
            className={styles.addBtn}
            onClick={() => {
              if (showForm) {
                setShowForm(false);
                setEditingId(null);
                setForm({});
                // setRoles(globalRoleSet);
              } else {
                setShowForm(true);
              }
            }}
          >
            {showForm ? "Cancel" : "+ Add User"}
          </button>
        </div>

        {/* FORM */}
        {showForm && (
          <div className={styles.form}>
            <h3>{editingId ? "Edit User" : "New User"}</h3>

            <div className={styles.fields}>
              <div className={styles.fieldGroup}>
                <label>Username</label>
                <input
                  value={form.username || ""}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                />
              </div>

              {!editingId && (
                <div className={styles.fieldGroup}>
                  <label>Password</label>
                  <input
                    type="password"
                    value={form.password || ""}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                </div>
              )}

              {/* ROLES */}
              <div
                className={styles.fieldGroup}
                style={{ gridColumn: "span 2" }}
              >
                <label>Roles</label>

                <div className={styles.roles}>
                  {globalRoleSet.map((role) => (
                    <button
                      type="button"
                      key={role._id}
                      className={`${styles.roleTag} ${
                        form.roles?.includes(role._id) ? styles.activeRole : ""
                      }`}
                      onClick={() => toggleRole(role)}
                    >
                      {role.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.formActions}>
              <button className={styles.saveBtn} onClick={handleSubmit}>
                {editingId ? "Update User" : "Create User"}
              </button>

              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm({});
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* LIST */}
        <div className={styles.list}>
          {users.map((user) => (
            <div key={user._id} className={styles.row}>
              <div className={styles.info}>
                <p className={styles.userName}>{user.username}</p>
                <p className={styles.userRoles}>
                  {user.roles
                    .map((roleId) => {
                      const role = globalRoleSet.find((r) => r._id === roleId);
                      return role ? role.name : "Unknown";
                    })
                    .join(", ")}
                </p>{" "}
              </div>

              <div className={styles.actions}>
                <button
                  className={styles.editBtn}
                  onClick={() => handleEdit(user)}
                >
                  Edit
                </button>

                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
