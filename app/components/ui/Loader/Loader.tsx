"use client";

import styles from "./Loader.module.css";

type LoaderProps = {
  loading: boolean;
  message?: string;
  variant?: "fullscreen" | "overlay" | "inline";
};

export default function Loader({
  loading,
  message = "Loading...",
  variant = "inline",
}: LoaderProps) {
  if (!loading) return null;

  return (
    <div
      className={
        variant === "fullscreen"
          ? styles.fullscreen
          : variant === "overlay"
          ? styles.overlay
          : styles.inline
      }
    >
      <div className={styles.loaderBox}>
        <div className={styles.spinner}></div>
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
}