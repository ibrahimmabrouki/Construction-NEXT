import styles from "./HomeServices.module.css";
import SectionHeading from "../../ui/SectionHeading/SectionHeading";
import { ICON_MAP, IconName } from "@/lib/iconMap";
import { Suspense } from "react";
import { wait } from "@/utils/delay";
import Loader from "../../ui/Loader/Loader";

//Type
type Service = {
  icon: IconName;
  title: string;
  desc: string;
};

//Fetch
export async function getFeaturedServices(): Promise<Service[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${process.env.HOME_PUBLIC_URL}/featured-services`,
  );

  const data = await response.json();

  return data.services ?? [];
}

/*Simulated fetch */
// async function getServices() {
//   await new Promise((resolve) => setTimeout(resolve, 1200));

//   return [
//     {
//       icon: Building2,
//       title: "Villa Construction",
//       desc: "Bespoke luxury villas crafted with precision and premium materials.",
//     },
//     {
//       icon: Home,
//       title: "Smart Home Integration",
//       desc: "Cutting-edge automation for modern living comfort.",
//     },
//     {
//       icon: Paintbrush,
//       title: "Interior Design",
//       desc: "Curated interiors that blend elegance with functionality.",
//     },
//     {
//       icon: Lightbulb,
//       title: "Renovation",
//       desc: "Transforming existing spaces into modern masterpieces.",
//     },
//   ];
// }

/* Async Component */
export default async function HomeServices() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionHeading
          label="What We Do"
          title="Our Services"
          description="End-to-end solutions for luxury living."
        />
      </div>

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
          <ServiceList />
        </Suspense>
      </div>
    </section>
  );
}

async function ServiceList() {
  const start = Date.now();
  const services = await getFeaturedServices();

  const elapsed = Date.now() - start;
  if (elapsed < 1000) {
    await wait(1000 - elapsed);
  }
  return (
    <div className={styles.grid}>
      {services.map((s) => {
        const Icon = ICON_MAP[s.icon];

        return (
          <div key={s.title} className={styles.card}>
            {Icon && <Icon className={styles.icon} />}
            <h3 className={styles.title}>{s.title}</h3>
            <p className={styles.desc}>{s.desc}</p>
          </div>
        );
      })}
    </div>
  );
}
