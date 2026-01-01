import { Column, Heading, Meta, Schema, Grid } from "@once-ui-system/core";
import { Mailchimp } from "@/components";
import Post from "@/components/blog/Post"; // Import the singular Post component
import { blogApi } from "@/lib";
import { baseURL, blog, person, newsletter } from "@/resources";
import type { BlogPostList } from "@/types";

export async function generateMetadata() {
  return Meta.generate({
    title: blog.title,
    description: blog.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(blog.title)}`,
    path: blog.path,
  });
}

export default async function Blog() {
  let allPosts: BlogPostList[] = [];
  try {
    const response = await blogApi.list({
      ordering: '-is_featured,-published_at',
    });
    allPosts = response.results;
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
  }

  const featuredPost = allPosts.length > 0 ? allPosts[0] : null;
  const otherPosts = allPosts.length > 1 ? allPosts.slice(1) : [];

  return (
    <Column maxWidth="m" paddingTop="24">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={blog.title}
        description={blog.description}
        path={blog.path}
        image={`/api/og/generate?title=${encodeURIComponent(blog.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}/about`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Heading marginBottom="l" variant="heading-strong-xl" marginLeft="24">
        {blog.title}
      </Heading>
      <Column fillWidth flex={1} gap="40" paddingX="l">
        {/* Featured Post */}
        {featuredPost && (
          <Post 
            post={{
              slug: featuredPost.slug,
              metadata: {
                title: featuredPost.title,
                publishedAt: featuredPost.published_at || featuredPost.created_at,
                summary: featuredPost.excerpt,
                image: featuredPost.featured_image,
                tag: featuredPost.category?.name || '',
              },
              content: ''
            }} 
            thumbnail={true} 
            direction="row"
          />
        )}

        {/* Other Posts */}
        {otherPosts.length > 0 && (
          <Grid columns="2" s={{ columns: 1 }} fillWidth gap="24" marginTop="40">
            {otherPosts.map((post) => (
              <Post 
                key={post.slug} 
                post={{
                  slug: post.slug,
                  metadata: {
                    title: post.title,
                    publishedAt: post.published_at || post.created_at,
                    summary: post.excerpt,
                    image: post.featured_image,
                    tag: post.category?.name || '',
                  },
                  content: ''
                }} 
                thumbnail={true} 
                direction="column"
              />
            ))}
          </Grid>
        )}
        
        <Mailchimp marginBottom="l" />
      </Column>
    </Column>
  );
}
