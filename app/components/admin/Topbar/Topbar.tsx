import styles from "./Topbar.module.css";

interface TopbarProps {
  username?: string;
}

export default function Topbar({ username = "Admin" }: TopbarProps) {
  return (
    <div className={styles.topbar}>
      <div>
        <p className={styles.welcome}>
          Welcome back, <strong>{username}</strong>
        </p>
        <h1 className={styles.heading}>Dashboard</h1>
      </div>
    </div>
  );
}
