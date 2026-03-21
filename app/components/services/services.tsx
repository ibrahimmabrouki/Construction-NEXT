import styles from "./services.module.css";
import SectionHeading from "../ui/SectionHeading/SectionHeading";
import { ICON_MAP, IconName } from "@/lib/iconMap";

//Type
type Service = {
  icon: IconName;
  title: string;
  desc: string;
};

//Fetch
export async function getAllServices(): Promise<Service[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${process.env.SERVICE_PUBLIC_URL}`,
  );

  const data = await response.json();

  return data.services ?? [];
}

export default async function Services() {
  const services = await getAllServices();

  return (
    <main className="page">
      <section className={styles.section}>
        <div style={{ color: "white" }}>
          <SectionHeading
            label="Services"
            title="What We Offer"
            description="Comprehensive luxury construction and design services tailored to discerning clients."
          />
        </div>

        <div className={styles.grid}>
          {services.map((s) => {
            const Icon = ICON_MAP[s.icon];

            return (
              <div className={styles.card} key={s.title}>
                {Icon && <Icon className={styles.icon} />}
                <h3 className={styles.title}>{s.title}</h3>
                <p className={styles.description}>{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
