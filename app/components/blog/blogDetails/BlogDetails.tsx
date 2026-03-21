import styles from "./BlogDetials.module.css";
import Link from "next/link";

type BlogDetails = {
  title: string;
  date: string;
  category: string;
  content: string[];
};

async function fetchBlogDetails(slug: string): Promise<BlogDetails | null> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${process.env.BLOG_PUBLIC_URL}/${slug}`,
  );
  const data = await response.json();
  return data.blog;
}

// // Simulate DB fetch
// async function getPost(slug: string) {
//   const data: Record<
//     string,
//     { title: string; date: string; category: string; content: string[] }
//   > = {
//     "smart-home-trends-2026": {
//       title: "Smart Home Trends to Watch in 2026",
//       date: "March 10, 2026",
//       category: "Technology",
//       content: [
//         "The smart home industry continues to evolve at a breathtaking pace...",
//         "AI-powered climate control systems now learn from occupant behavior...",
//         "Integrated wellness monitoring is becoming standard...",
//         "Voice and gesture control have matured beyond simple commands...",
//       ],
//     },
//     "sustainable-luxury-building": {
//       title: "Sustainable Luxury: Building Without Compromise",
//       date: "February 28, 2026",
//       category: "Sustainability",
//       content: [
//         "The notion that sustainability requires sacrifice is outdated...",
//         "Cross-laminated timber and recycled materials now dominate...",
//         "Solar integration has evolved beyond rooftop panels...",
//         "Water reclamation and geothermal systems are now standard...",
//       ],
//     },
//   };

//   return data[slug];
// }

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
          <div className={styles.content}>
            {post.content.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
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
