import styles from "./Blog.module.css";
import SectionHeading from "../../ui/SectionHeading/SectionHeading";
import { Suspense } from "react";
import BlogList from "../blogList/BlogList";
import Loader from "../../ui/Loader/Loader";

export default function Blog() {
  const LoadingPostsTSX = (
    <p className={styles.loading}>Loading blog posts...</p>
  );
  return (
    <main className="page">
      <section className={styles.section}>
        <SectionHeading
          label="Insights"
          title="Our Blog"
          description="Perspectives on luxury construction, design trends, and smart living."
        />
      </section>
      <Suspense
        fallback={
          <Loader loading={true} message="Loading posts..." variant="overlay" />
        }
      >
        <BlogList />
      </Suspense>
    </main>
  );
}
