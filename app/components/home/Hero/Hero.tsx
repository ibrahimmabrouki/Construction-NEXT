import Link from "next/link";
import Image from "next/image";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <Image
        src="/images/hero-villa.jpg"
        alt="Modern luxury villa"
        fill
        priority
        className={styles.image}
      />

      <div className={styles.overlay}></div>

      <div className={styles.content}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>We Design the Future of Living</h1>

          <p className={styles.subtitle}>
            Premium construction and smart home solutions for those who demand
            excellence.
          </p>

          <div className={styles.buttons}>
            <Link href="/projects" className={styles.primaryBtn}>
              Explore Projects
            </Link>

            <Link href="/ai-design" className={styles.secondaryBtn}>
              Design Your Home (AI)
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}