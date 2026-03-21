import styles from "./About.module.css";
import Image from "next/image";
import SectionHeading from "../ui/SectionHeading/SectionHeading";
import TeamSection from "./TeamSection";
import { Suspense } from "react";

export default function About() {
  const loadingTSX = <p className="loading">Loading team...</p>; // Simulate loading state for team section
  return (
    <main className="page">
      {/* story */}
      <section className={styles.section}>
        <div className={styles.grid}>
          <div>
            <span className={styles.label}>Our Story</span>

            <h1 className={styles.title}>Building Excellence Since 2008</h1>

            <p className={styles.textLarge}>
              LuxVera was founded with a singular vision: to redefine luxury
              residential construction. What began as a boutique firm in
              Southern France has grown into an internationally recognized name
              in premium villa construction and smart living.
            </p>

            <p className={styles.text}>
              We believe that a home should be more than shelter — it should be
              a statement of taste, a sanctuary of comfort, and a marvel of
              engineering.
            </p>
          </div>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/hero-villa.jpg"
              alt="Construction site"
              fill
              className={styles.image}
            />
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className={`${styles.section} ${styles.surface}`}>
        <div className={styles.center}>
          <span className={styles.label}>Our Vision</span>

          <h2 className={styles.heading}>
            Where Architecture Meets Innovation
          </h2>

          <p className={styles.textLarge}>
            We envision a future where every home is intelligent, sustainable,
            and breathtakingly beautiful.
          </p>
        </div>
      </section>

      {/* Team (Suspense) */}
      <section className={styles.section}>
        <SectionHeading
          label="Leadership"
          title="Meet Our Team"
          description="The visionaries behind every LuxVera project."
        />
      </section>

      <Suspense fallback={loadingTSX}>
        <TeamSection />
      </Suspense>
    </main>
  );
}
