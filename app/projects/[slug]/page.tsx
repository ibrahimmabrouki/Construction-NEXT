import ProjectDetail from "../../components/projects/ProjectDetail/ProjectDetail";

// "async" means this function can use "await" inside it.
// We need async here because params is a Promise and we must await it.

// The function receives one argument which is the props object.
// We destructure it immediately to pull out just the "params" property.
// Instead of: function Page(props) { const params = props.params; }
// We write:   function Page({ params })
// Both are identical, the second is just shorter.

// After the colon is the TypeScript type annotation.
// It tells TypeScript exactly what shape the props object has.
// { params: Promise<{ slug: string }> } means:
//   - props has a property called "params"
//   - that property is a Promise
//   - when that Promise resolves, it gives you { slug: string }
//   - meaning an object with one property called slug which is a string

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // "await params" tells JavaScript to stop here and wait
  // until the Promise resolves and gives us the actual value.
  // Before await:  params = Promise { <pending> }
  // After await:   params = { slug: "villa-azure" }

  // We immediately destructure the result.
  // Instead of: const resolved = await params; const slug = resolved.slug;
  // We write:   const { slug } = await params;
  // Both are identical, the second is just shorter.

  // At this point slug is a plain string: "villa-azure"
  const { slug } = await params;

  // Now we pass the slug string as a prop to our ProjectDetail component.
  // ProjectDetail will use this slug to look up the project data.
  // The prop name "slug" on the left matches the prop name the component expects.
  // The value on the right is the slug variable we just extracted above.
  return <ProjectDetail slug={slug} />;
}

/*What happens step by step when someone visits `/projects/villa-azure`**

1. User types: http://localhost:3000/projects/villa-azure

2. Next.js sees the [slug] folder and knows this is a dynamic route.
   It starts preparing params = Promise { slug: "villa-azure" }

3. Next.js calls your Page function and passes it:
   { params: Promise { slug: "villa-azure" } }

4. Your function hits "await params"
   JavaScript pauses and waits for the Promise to resolve.

5. Promise resolves, you now have:
   { slug: "villa-azure" }

6. You destructure it:
   slug = "villa-azure"

7. You render:
   <ProjectDetail slug="villa-azure" />

8. ProjectDetail receives slug="villa-azure" and fetches the project data.*/
