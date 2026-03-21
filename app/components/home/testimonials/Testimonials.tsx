import styles from "./Testimonials.module.css";
import SectionHeading from "../../ui/SectionHeading/SectionHeading";

/* 🔥 Simulated fetch */
async function getTestimonials() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    {
      name: "Sarah Mitchell",
      role: "Homeowner",
      text: "LuxVera transformed our vision into a breathtaking reality. Every detail was flawless.",
    },
    {
      name: "James Chen",
      role: "Property Developer",
      text: "Their attention to quality and timeline is unmatched in the industry.",
    },
    {
      name: "Elena Rossi",
      role: "Interior Designer",
      text: "A pleasure to collaborate with. They bring architectural dreams to life.",
    },
  ];
}

export default async function Testimonials() {
  const testimonials = await getTestimonials();

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionHeading label="Testimonials" title="What Our Clients Say" />

        <div className={styles.grid}>
          {testimonials.map((t) => (
            <div key={t.name} className={styles.card}>
              <p className={styles.text}>“{t.text}”</p>

              <div className={styles.user}>
                <p className={styles.name}>{t.name}</p>
                <p className={styles.role}>{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
