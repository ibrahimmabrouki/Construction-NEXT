import Link from "next/link";
import Image from "next/image";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  slug: string;
  image: string[];
  title: string;
  location: string;
  price: string;
  status?: string;
}

export default function ProjectCard({
  slug,
  image,
  title,
  location,
  price,
  status,
}: ProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={image?.[0] || "/images/project-1.jpg"}
          alt={title}
          fill
          className={styles.image}
        />

        {/* Hover overlay */}
        <div className={styles.overlay}>
          <span className={styles.price}>{price}</span>
        </div>

        {/* Status badge */}
        {status && <span className={styles.status}>{status}</span>}
      </div>

      <div className={styles.info}>
        <h3>{title}</h3>
        <p>
          {location} <span>·</span> {price}
        </p>
      </div>
    </Link>
  );
}
