import styles from "./TeamSection.module.css";

// Simulate DB fetch (later replace with real DB)
async function getTeam() {
  await new Promise((res) => setTimeout(res, 1500));

  return [
    {
      name: "Alexander Dumont",
      role: "CEO & Founder",
      bio: "20+ years in luxury construction across Europe and Asia.",
    },
    {
      name: "Sofia Castellano",
      role: "Head of Design",
      bio: "Award-winning interior architect specializing in minimalist luxury.",
    },
    {
      name: "Marcus Wei",
      role: "Chief Engineer",
      bio: "Structural engineering expert with smart home integration experience.",
    },
    {
      name: "Elena Vasquez",
      role: "Project Director",
      bio: "Oversees all active projects ensuring excellence in delivery.",
    },
  ];
}

export default async function TeamSection() {
  const team = await getTeam();

  return (
    <div className={`${styles.grid} ${styles.section}`}>
      {team.map((t) => (
        <div key={t.name} className={styles.card}>
          <div className={styles.avatar}>
            {t.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>

          <h3 className={styles.name}>{t.name}</h3>
          <p className={styles.role}>{t.role}</p>
          <p className={styles.bio}>{t.bio}</p>
        </div>
      ))}
    </div>
  );
}
