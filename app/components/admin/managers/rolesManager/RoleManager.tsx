"use client";

import { useEffect, useState } from "react";
import styles from "./RolesManager.module.css";
import {
  getAllRoles,
  createRole,
  deleteRole,
  updateRole,
} from "@/client-services/roles";
import Loader from "../../../ui/Loader/Loader";
import { wait } from "../../../../../utils/delay";

//these are the set of actions that could be done in the website.
type Action = "create" | "read" | "update" | "delete";

//this is the permission that represents the bulk of the role
//where it defines the resource <=> the table the user created by the admin have access to, and what actions the user can perform on that table.
type Permission = {
  resource: string;
  actions: Action[];
};

//this is how the role looks like
type Role = {
  _id: string;
  name: string;
  description?: string;
  permissions: Permission[];
};

const resourcesList = [
  "projects",
  "blogs",
  "services",
  "users",
  "inquiries",
  "activities",
];
const actionsList: Action[] = ["create", "read", "update", "delete"];

export default function RolesManager() {
  //use state that holds the role fetched from the data base
  const [roles, setRoles] = useState<Role[]>([]);

  //use state that represents the data when the user wants to create a new role or update an old role
  const [form, setForm] = useState<Partial<Role>>({});

  //use state that represents the id or the role the user wants to edit.
  const [editingId, setEditingId] = useState<string | null>(null);

  //use state that represents a boolean value whether the edit or the create form is open or not
  const [showForm, setShowForm] = useState(false);

  const [buttonText, setButtonText] = useState("+ Add Role");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  //here we are fetching and setting the roles in the roles state
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoadingMessage("Loading roles...");
        setLoading(true);
        const start = Date.now();

        // getting the roles then setting them to the roles state array
        const response = await getAllRoles();
        setRoles(response);

        //holding the loading for at least one sec
        const elapsed = Date.now() - start;
        if (elapsed < 1000) {
          await wait(1000 - elapsed);
        }
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  //this method is handline the submit of the final form that represents the data beind selected on the screen
  //this method handles both the update and the create states. decided based on the value of the state editId
  const handleSubmit = async () => {
    if (!form.name) {
      alert("Name field is required.");
      return;
    }

    const payload = {
      name: form.name,
      description: form.description || "",
      permissions: form.permissions || [],
    };

    try {
      setLoading(true);

      if (editingId) {
        setLoadingMessage("Updating role...");
        setLoading(true);
        const start = Date.now();

        const updatedRole = await updateRole(payload, editingId);

        setRoles((prev) =>
          prev.map((r) => (r._id === editingId ? updatedRole : r)),
        );
        const elapsed = Date.now() - start;
        if (elapsed < 1000) {
          await wait(1000 - elapsed);
        }
      } else {
        setLoadingMessage("Creating role...");
        setLoading(true);
        const start = Date.now();
        const newRole = await createRole(payload);
        setRoles((prev) => [...prev, newRole]);
        const elapsed = Date.now() - start;
        if (elapsed < 1000) {
          await wait(1000 - elapsed);
        }
      }

      // reset form
      setForm({});
      setEditingId(null);
      setShowForm(false);
      setButtonText("+ Add Role");
      setLoading(true);
    } catch (error) {
      console.error("Submit Role Error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (_id: string) => {
    try {
      setLoadingMessage("Deleting role...");
      setLoading(true);
      const start = Date.now();

      await deleteRole(_id);

      setRoles((prev) => prev.filter((r) => r._id !== _id));
      const elapsed = Date.now() - start;
      if (elapsed < 1000) {
        await wait(1000 - elapsed);
      }
    } catch (error) {
      console.error("Deleting Role Error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (role: Role) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setForm({ ...role });
    setEditingId(role._id);
    setShowForm(true);
    setButtonText("Cancel");
  };

  //the toggle action it recives the action and the resource it belongs to
  const toggleAction = (resource: string, action: Action) => {
    // here we are getting the current permissions from the form
    // the form could be filled either when editing where we setFrom({...role}) as in the above method
    // or it could be empty object where permission is undefied so the permission variable below will take the value [] empty array
    const permissions = form.permissions || [];
    // creating a variable of type permission
    let updatedPermissions: Permission[];
    //this will be mainly important incase of editing if the form permission array includes permission objects
    //so we find the permission that the action we click belongs to
    const existing = permissions.find((p) => p.resource === resource);

    //if the permission of that resource does not exist then we need push
    if (!existing) {
      updatedPermissions = [
        ...permissions, //if no existing persmission we need to add the old permission
        //+ adding the new permission object
        { resource: resource, actions: [action] },
      ];
    }

    //if that resource exits that means that the user has persmission to the table
    else {
      let newActions: Action[]; //creating array of type action
      //then we need to check if the action array of that resource already include the action
      if (existing.actions.includes(action)) {
        //if it includes the action we need to remove it so we use filter (since it is toggle)
        newActions = existing.actions.filter((a) => a !== action);
      }
      //if the action is not their the we need push it
      else {
        newActions = [...existing.actions, action];
      }

      //incase the newAction is empty after the toggle then the permisson(resource) should be omitted
      if (newActions.length === 0) {
        updatedPermissions = permissions.filter((p) => p.resource !== resource);
      } else {
        updatedPermissions = permissions.map((p) =>
          p.resource === resource ? { ...p, actions: newActions } : p,
        );
      }
    }

    setForm({ ...form, permissions: updatedPermissions });
  };

  //to know if a certian action is checked or not
  // if there a permission(resource object) which means not null
  //this will move over each of the resources to find the resource passed (which the action belongs)
  //after finding the resource it is going to check if the action list for that permission includes the action
  //if it includes the action then it is checked otherwise it unchecked
  const isChecked = (resource: string, action: Action) =>
    form.permissions
      ?.find((p) => p.resource === resource)
      ?.actions.includes(action) || false;

  return (
    <>
      <Loader loading={loading} message={loadingMessage} variant="overlay" />
      <div className={styles.manager}>
        {/* HEADER */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Roles</h2>
            <p className={styles.subtitle}>{roles.length} total</p>
          </div>

          <button
            className={styles.addBtn}
            onClick={() => {
              if (showForm) {
                setShowForm(false);
                setEditingId(null);
                setForm({});
                setButtonText("+ Add Role");
              } else {
                setShowForm(true);
                setButtonText("Cancel");
              }
            }}
          >
            {buttonText}
          </button>
        </div>

        {/* FORM */}
        {showForm && (
          <div className={styles.form}>
            <h3>{editingId ? "Edit Role" : "New Role"}</h3>

            <div className={styles.fields}>
              <div className={styles.fieldGroup}>
                <label>Name</label>
                <input
                  className={styles.input}
                  value={form.name || ""}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label>Description</label>
                <input
                  className={styles.input}
                  value={form.description || ""}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              {/* PERMISSIONS */}
              <div
                className={styles.fieldGroup}
                style={{ gridColumn: "span 2" }}
              >
                <label>Permissions</label>

                <div className={styles.permissions}>
                  {/* here the looping over the predefined list of the resources (tables) to display them */}
                  {resourcesList.map((res) => (
                    // this card is for the resource and it is goind to hold the permissions inside it
                    <div key={res} className={styles.permissionCard}>
                      {/* displying the permission title */}
                      <p className={styles.permissionTitle}>{res}</p>
                      {/* this will be the frame */}
                      <div className={styles.checkboxGroup}>
                        {/* here it is looping over the items that are found inside the actions array in the permission objec */}
                        {actionsList.map((act) => (
                          <button
                            key={act}
                            type="button"
                            className={`${styles.actionTag} ${
                              //after knowing if the action for this resource is checked or not
                              //if true => display the action as active other wise give it empty string
                              isChecked(res, act) ? styles.activeAction : ""
                            }`}
                            //on click this is going to toggle the action which means adding the new permission if it is not there
                            //or removing if it is not there.
                            //the activation check above is the indication
                            onClick={() => toggleAction(res, act)}
                          >
                            {act}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.formActions}>
              <button className={styles.saveBtn} onClick={handleSubmit}>
                {editingId ? "Update Role" : "Create Role"}
              </button>
            </div>
          </div>
        )}

        {/* LIST */}
        <div className={styles.list}>
          {roles.map((role) => (
            <div key={role._id} className={styles.row}>
              <div>
                <p className={styles.roleName}>{role.name}</p>
                <p className={styles.roleDesc}>{role.description}</p>
              </div>

              <div className={styles.actions}>
                <button
                  className={styles.editBtn}
                  onClick={() => handleEdit(role)}
                >
                  Edit
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(role._id)}
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
