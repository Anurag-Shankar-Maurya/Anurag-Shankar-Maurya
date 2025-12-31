import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import {
  Meta,
  Schema,
  Column,
  Heading,
  Text,
  Row,
  Avatar,
  Line,
  Tag,
} from "@once-ui-system/core";
import { baseURL, about, person, blog } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { ShareSection } from "@/components/blog/ShareSection";
import { Posts } from "@/components/blog/Posts";
import { blogApi } from "@/lib";
import type { BlogPostDetail } from "@/types";
import { BlogGallery } from "./BlogGallery";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const post = await blogApi.get(params.slug);
    
    return Meta.generate({
      title: post.title,
      description: post.excerpt,
      baseURL: baseURL,
      image: post.featured_image || `/api/og/generate?title=${encodeURIComponent(post.title)}`,
      path: `${blog.path}/${post.slug}`,
    });
  } catch (error) {
    return {};
  }
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  let post: BlogPostDetail;

  try {
    post = await blogApi.get(params.slug);
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    notFound();
  }

  return (
    <Column as="section" maxWidth="m" horizontal="center" gap="l" paddingY="40">
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        path={`${blog.path}/${post.slug}`}
        title={post.title}
        description={post.excerpt}
        datePublished={post.published_at || post.created_at}
        dateModified={post.updated_at}
        image={
          post.featured_image || `/api/og/generate?title=${encodeURIComponent(post.title)}`
        }
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      {/* Header */}
      <Column maxWidth="s" gap="16" horizontal="center" align="center" paddingX="l">
        <Text variant="label-strong-m" onBackground="neutral-weak">
          {post.category?.name || 'Uncategorized'}
        </Text>
        <Heading variant="display-strong-m" align="center">{post.title}</Heading>
        <Row vertical="center" gap="16" marginTop="12">
          <Avatar src={person.avatar} size="s" />
          <Text variant="label-default-s">{person.name}</Text>
          <Text variant="body-default-xs" onBackground="neutral-weak">
            {formatDate(post.published_at || post.created_at, false)}
          </Text>
        </Row>
        <Row vertical="center" gap="16" marginTop="12">
          {post.reading_time && (
            <Text variant="body-default-xs" onBackground="neutral-weak">
              {post.reading_time} min read
            </Text>
          )}
          {post.views_count && (
            <>
              <Text variant="body-default-xs" onBackground="neutral-weak">•</Text>
              <Text variant="body-default-xs" onBackground="neutral-weak">
                {post.views_count} views
              </Text>
            </>
          )}
        </Row>
      </Column>

      {/* Featured Image */}
      {post.featured_image && (
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: "var(--radius-l)", overflow: "hidden", marginTop: "24" }}>
          <Image
            priority
            src={post.featured_image}
            alt={post.title}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      )}

      {/* Post Content */}
      <Column 
        as="article" 
        maxWidth="s" 
        gap="24"
        paddingX="l"
        style={{ margin: "auto", marginTop: "40" }}
      >
        <div 
          className="prose"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </Column>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <Row horizontal="center" gap="8" wrap>
          {post.tags.map((tag) => (
            <Tag key={tag.id} size="m">{tag.name}</Tag>
          ))}
        </Row>
      )}

      {/* Image Gallery */}
      {post.images && post.images.length > 0 && (
        <Column fillWidth gap="16" marginTop="40">
          <Heading as="h2" variant="heading-strong-l" align="center">Gallery</Heading>
          <BlogGallery images={post.images} postTitle={post.title} />
        </Column>
      )}

      {/* Share Section */}
      <ShareSection title={post.title} url={`${baseURL}${blog.path}/${post.slug}`} />

      {/* Related Posts */}
      <Column fillWidth gap="40" horizontal="center" marginTop="40">
        <Line maxWidth="40" />
        <Heading as="h2" variant="heading-strong-xl" marginBottom="24">
          Recent posts
        </Heading>
        <Posts exclude={[post.slug]} range={[1, 3]} thumbnail={true} columns="3" />
      </Column>
    </Column>
  );
}
