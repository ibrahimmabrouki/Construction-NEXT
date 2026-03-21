import styles from "./FeturedProjects.module.css";
import Link from "next/link";
import Image from "next/image";
import SectionHeading from "../../ui/SectionHeading/SectionHeading";


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
    `${process.env.NEXT_PUBLIC_API_URL}${process.env.HOME_PUBLIC_URL}/featured-projects`
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

export default async function FeaturedProjects() {
  const projects = await getFeaturedProjects();

  return (
    <section className={styles.section}>
      <SectionHeading
        label="Portfolio"
        title="Featured Projects"
        description="A curated selection of our finest work."
      />

      <div className={styles.grid}>
        {projects.map((p) => (
          <Link key={p.slug} href={`/projects/${p.slug}`} className={styles.card}>
            <div className={styles.imageWrapper}>
              <Image src={p.images[0]} alt={p.title} fill className={styles.image} />
            </div>

            <h3>{p.title}</h3>
            <p>{p.location}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
