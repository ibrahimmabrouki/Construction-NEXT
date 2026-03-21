import styles from "./BlogList.module.css";
import Image from "next/image";
import Link from "next/link";

type Blog = {
  slug: string;
  image: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
};

//Fetch
async function getAllBlogs(): Promise<Blog[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${process.env.BLOG_PUBLIC_URL}`,
  );
  const data = await response.json();

  return data.blogs ?? [];
}

// Simulate DB fetch
// async function getPosts() {
//   await new Promise((res) => setTimeout(res, 1500));

//   return [
//     {
//       id: "smart-home-trends-2026",
//       image: "/images/project-1.jpg",
//       title: "Smart Home Trends to Watch in 2026",
//       date: "Mar 10, 2026",
//       category: "Technology",
//       excerpt:
//         "From AI-powered climate control to integrated wellness systems, discover what's shaping the future of smart living.",
//     },
//     {
//       id: "sustainable-luxury-building",
//       image: "/images/project-2.jpg",
//       title: "Sustainable Luxury: Building Without Compromise",
//       date: "Feb 28, 2026",
//       category: "Sustainability",
//       excerpt:
//         "How modern construction techniques allow for environmentally responsible luxury homes.",
//     },
//     {
//       id: "choosing-right-architect",
//       image: "/images/project-3.jpg",
//       title: "How to Choose the Right Architect",
//       date: "Feb 15, 2026",
//       category: "Guide",
//       excerpt:
//         "Essential criteria and questions to ask when selecting an architect.",
//     },
//   ];
// }

export default async function BlogList() {
  const posts = await getAllBlogs();

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className={styles.card}
          >
            <div className={styles.imageWrapper}>
              <Image
                src={post.image}
                alt={post.title}
                fill
                className={styles.image}
              />
            </div>

            <span className={styles.category}>{post.category}</span>

            <h3 className={styles.title}>{post.title}</h3>

            <p className={styles.excerpt}>{post.excerpt}</p>

            <span className={styles.date}>{post.date}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
