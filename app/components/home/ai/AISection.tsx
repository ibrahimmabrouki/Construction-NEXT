import styles from "./AISection.module.css";
import Link from "next/link";

/* 🔥 Simulated fetch (future DB ready) */
async function getSteps() {
  await new Promise((resolve) => setTimeout(resolve, 800));

  return [
    "Location & Land",
    "Rooms & Features",
    "Style & Budget",
    "Your Concept",
  ];
}

export default async function AISection() {
  const steps = await getSteps();

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* LEFT SIDE */}
          <div className={styles.left}>
            <span className={styles.label}>AI-POWERED</span>

            <h2 className={styles.title}>Design Your Dream Home</h2>

            <p className={styles.text}>
              Use our intelligent design wizard to configure your perfect living
              space. Get instant concepts, layouts, and cost estimates tailored
              to your vision.
            </p>

            <Link href="/ai-design" className={styles.button}>
              Start Designing
            </Link>
          </div>

          {/* RIGHT SIDE */}
          <div className={styles.card}>
            {steps.map((step, i) => (
              <div key={step} className={styles.step}>
                <div
                  className={`${styles.circle} ${i === 0 ? styles.active : ""}`}
                >
                  {i + 1}
                </div>

                <span
                  className={`${styles.stepText} ${
                    i === 0 ? styles.activeText : ""
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
