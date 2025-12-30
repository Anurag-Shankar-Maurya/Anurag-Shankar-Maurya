import { Grid, Text } from "@once-ui-system/core";
import Post from "./Post";
import { blogApi } from "@/lib";

interface PostsProps {
  range?: [number] | [number, number];
  columns?: "1" | "2" | "3";
  thumbnail?: boolean;
  direction?: "row" | "column";
  exclude?: string[];
}

export async function Posts({
  range,
  columns = "1",
  thumbnail = false,
  exclude = [],
  direction,
}: PostsProps) {
  let posts;

  try {
    const response = await blogApi.list({
      ordering: '-published_at',
      show_on_home: true
    });
    posts = response.results;
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return <Text>Unable to load blog posts. Please try again later.</Text>;
  }

  // Exclude by slug (exact match)
  if (exclude.length) {
    posts = posts.filter((post) => !exclude.includes(post.slug));
  }

  const displayedBlogs = range
    ? posts.slice(range[0] - 1, range.length === 2 ? range[1] : posts.length)
    : posts;

  return (
    <>
      {displayedBlogs.length > 0 ? (
        <Grid columns={columns} s={{ columns: 1 }} fillWidth marginBottom="40" gap="16">
          {displayedBlogs.map((post) => (
            <Post 
              key={post.slug} 
              post={{
                slug: post.slug,
                metadata: {
                  title: post.title,
                  publishedAt: post.published_at || post.created_at,
                  summary: post.excerpt,
                  images: post.featured_image ? [post.featured_image] : [],
                  tag: post.category?.name || '',
                },
                content: ''
              }} 
              thumbnail={thumbnail} 
              direction={direction} 
            />
          ))}
        </Grid>
      ) : (
        <Text>No blog posts available.</Text>
      )}
    </>
  );
}
