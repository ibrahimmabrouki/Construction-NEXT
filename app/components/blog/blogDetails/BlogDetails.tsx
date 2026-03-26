import styles from "./BlogDetials.module.css";
import Link from "next/link";

type BlogDetails = {
  title: string;
  date: string;
  category: string;
  content: string;
};

async function fetchBlogDetails(slug: string): Promise<BlogDetails | null> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${process.env.BLOG_PUBLIC_URL}/${slug}`,
  );
  const data = await response.json();
  return data.blog;
}

export default async function BlogDetail({ slug }: { slug: string }) {
  const post = await fetchBlogDetails(slug);

  if (!post) {
    return (
      <main className="page-blog">
        <div className={styles.notFound}>
          <h1>Article Not Found</h1>

          <Link href="/blog" className={styles.backBtn}>
            Back to Blog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-blog">
      <article className={styles.article}>
        <div className={styles.container}>
          <span className={styles.category}>{post.category}</span>

          <h1 className={styles.title}>{post.title}</h1>

          <p className={styles.date}>
            {new Date(post.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <div className={styles.content} style={{ whiteSpace: "pre-line" }}>
            {post.content}
          </div>

          <div className={styles.footer}>
            <Link href="/blog" className={styles.backBtn}>
              ← Back to Blog
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
