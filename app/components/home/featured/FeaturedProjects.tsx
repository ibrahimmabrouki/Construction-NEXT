import styles from "./FeturedProjects.module.css";
import Link from "next/link";
import Image from "next/image";
import SectionHeading from "../../ui/SectionHeading/SectionHeading";
import Loader from "../../ui/Loader/Loader";
import { Suspense } from "react";
import { wait } from "@/utils/delay";

type Project = {
  slug: string;
  title: string;
  location: string;
  price: string;
  status: string;
  description: string;
  images: string[];
};
//Fetch
export async function getFeaturedProjects(): Promise<Project[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${process.env.HOME_PUBLIC_URL}/featured-projects`,
  );

  const data = await response.json();

  return data.projects ?? [];
}

// async function getProjects() {
//   await new Promise((res) => setTimeout(res, 3000));

//   return [
//     {
//       id: "villa-azure1",
//       image: "/images/project-1.jpg",
//       title: "Villa Azure",
//       location: "Marbella, Spain",
//       price: "€2.4M",
//     },
//      {
//       id: "villa-azure2",
//       image: "/images/project-1.jpg",
//       title: "Villa Azure",
//       location: "Marbella, Spain",
//       price: "€2.4M",
//     },
//      {
//       id: "villa-azure",
//       image: "/images/project-1.jpg",
//       title: "Villa Azure",
//       location: "Marbella, Spain",
//       price: "€2.4M",
//     },
//   ];
// }

export default function FeaturedProjects() {
  return (
    <section className={styles.section}>
      <SectionHeading
        label="Portfolio"
        title="Featured Projects"
        description="A curated selection of our finest work."
      />

      <div style={{ position: "relative" }}>
        <Suspense
          fallback={
            <Loader
              loading={true}
              message="Loading Featured Projects..."
              variant="overlay"
            />
          }
        >
          <ProjectsList />
        </Suspense>
      </div>
    </section>
  );
}

async function ProjectsList() {
  const start = Date.now();

  const projects = await getFeaturedProjects();
  const elapsed = Date.now() - start;
  if (elapsed < 1000) {
    await wait(1000 - elapsed);
  }
  return (
    <div className={styles.grid}>
      {projects.map((p) => (
        <Link key={p.slug} href={`/projects/${p.slug}`} className={styles.card}>
          <div className={styles.imageWrapper}>
            <Image
              src={p.images[0]}
              alt={p.title}
              fill
              className={styles.image}
            />
          </div>

          <h3>{p.title}</h3>
          <p>{p.location}</p>
        </Link>
      ))}
    </div>
  );
}
