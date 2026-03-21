import styles from "./ProjectDetail.module.css";
import Image from "next/image";
import Link from "next/link";
import InquiryForm from "./InquiryForm";

// async function getProject(slug: string) {
//   const data: Record<
//     string,
//     {
//       title: string;
//       location: string;
//       price: string;
//       status: string;
//       description: string;
//       images: string[];
//     }
//   > = {
//     "villa-azure": {
//       title: "Villa Azure",
//       location: "Marbella, Spain",
//       price: "€2.4M",
//       status: "Completed",
//       description:
//         "A stunning Mediterranean villa featuring 5 bedrooms, infinity pool, and panoramic sea views. Built with natural stone and sustainable materials, this residence embodies coastal luxury at its finest.",
//       images: [
//         "/images/project-1.jpg",
//         "/images/project-2.jpg",
//         "/images/project-3.jpg",
//       ],
//     },
//     "skyline-penthouse": {
//       title: "Skyline Penthouse",
//       location: "Dubai, UAE",
//       price: "€5.1M",
//       status: "In Progress",
//       description:
//         "An ultra-modern penthouse with floor-to-ceiling glass walls, rooftop terrace, and smart home integration throughout. 360-degree city views define this architectural masterpiece.",
//       images: [
//         "/images/project-2.jpg",
//         "/images/project-1.jpg",
//         "/images/project-3.jpg",
//       ],
//     },
//     "horizon-retreat": {
//       title: "Horizon Retreat",
//       location: "Bali, Indonesia",
//       price: "€1.8M",
//       status: "Completed",
//       description:
//         "A tropical sanctuary blending modern minimalism with Balinese craftsmanship. Features an infinity pool, open-air living spaces, and lush tropical gardens.",
//       images: [
//         "/images/project-3.jpg",
//         "/images/project-1.jpg",
//         "/images/project-2.jpg",
//       ],
//     },
//     "alpine-lodge": {
//       title: "Alpine Lodge",
//       location: "Zurich, Switzerland",
//       price: "€3.2M",
//       status: "Planning",
//       description:
//         "A contemporary mountain retreat designed to blend seamlessly with the Alpine landscape. Floor-to-ceiling glazing, natural timber interiors, and geothermal heating throughout.",
//       images: [
//         "/images/project-1.jpg",
//         "/images/project-2.jpg",
//         "/images/project-3.jpg",
//       ],
//     },
//   };

//   return data[slug] ?? null;
// }

type Project = {
  slug: string;
  title: string;
  location: string;
  price: string;
  status: string;
  description: string;
  images: string[];
};

//the reason why i did not use the method written in client services is that
//this component is server componenet which can talk directly to the database and fetch the table
//if we used the controller
//while we can use axios but not recommended

//in the following case server is going to send api request to the server itself the it will fetch the data
//to return it to it self.
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${process.env.PROJECT_PUBLIC_URL}/${slug}`,
  );
  const data = await response.json();
  return data.project;
}

const statusClass: Record<string, string> = {
  Completed: "statusCompleted",
  "In Progress": "statusInProgress",
  Planning: "statusPlanning",
};

export default async function ProjectDetail({ slug }: { slug: string }) {
  console.log(slug);
  const project = await getProjectBySlug(slug);

  if (!project) {
    return (
      <main className="page-project-details">
        <div className={styles.notFound}>
          <h1 className={styles.notFoundTitle}>Project Not Found</h1>
          <p className={styles.notFoundText}>
            The project you are looking for does not exist.
          </p>
          <Link href="/projects" className={styles.backBtn}>
            ← Back to Projects
          </Link>
        </div>
      </main>
    );
  }

  const statusKey = statusClass[project.status] ?? "statusPlanning";

  return (
  <main className="page-project-details">
    <section
      className={styles.hero}
      style={{
        backgroundImage: "url('/images/dubai-bg.png')",
      }}
    >
      <div className={styles.overlay} />

      <div className={styles.container}>
        <div className={styles.grid}>
          
          {/* LEFT */}
          <div className={styles.left}>
            <span className={`${styles.statusBadge} ${styles[statusKey]}`}>
              {project.status}
            </span>

            <h1 className={styles.title}>{project.title}</h1>

            <p className={styles.meta}>
              {project.location}
              <span className={styles.metaDot}>·</span>
              {project.price}
            </p>

            <p className={styles.description}>{project.description}</p>

            <div className={styles.details}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Location</span>
                <span className={styles.detailValue}>{project.location}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Investment</span>
                <span className={styles.detailValue}>{project.price}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Status</span>
                <span className={styles.detailValue}>{project.status}</span>
              </div>
            </div>

            <Link href="/projects" className={styles.allProjectsLink}>
              ← All Projects
            </Link>
          </div>

          {/* RIGHT */}
          <div className={styles.right}>
            <InquiryForm projectTitle={project.title} slug={project.slug} />
          </div>
        </div>
      </div>
    </section>
  </main>
);
}
