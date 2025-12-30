import { notFound } from "next/navigation";
import {
  Meta,
  Schema,
  Button,
  Column,
  Flex,
  Heading,
  Text,
  SmartLink,
  Tag,
  Line,
} from "@once-ui-system/core";
import { baseURL, about, person, work } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { Metadata } from "next";
import { Projects } from "@/components/work/Projects";
import { projectsApi } from "@/lib";
import type { ProjectDetail } from "@/types/api.types";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}): Promise<Metadata> {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  try {
    const project = await projectsApi.get(slugPath);
    
    return Meta.generate({
      title: project.title,
      description: project.short_description,
      baseURL: baseURL,
      image: project.featured_image || `/api/og/generate?title=${encodeURIComponent(project.title)}`,
      path: `${work.path}/${project.slug}`,
    });
  } catch (error) {
    return {};
  }
}

export default async function Project({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}) {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  let project: ProjectDetail;

  try {
    project = await projectsApi.get(slugPath);
  } catch (error) {
    console.error("Failed to fetch project:", error);
    notFound();
  }

  const technologies = project.technologies
    ? project.technologies.split(",").map((t) => t.trim())
    : [];

  const statusColors: Record<string, "green" | "yellow" | "gray" | "red"> = {
    completed: "green",
    "in-progress": "yellow",
    "on-hold": "gray",
    archived: "red",
  };

  return (
    <Column as="section" maxWidth="m" horizontal="center" gap="l">
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        path={`${work.path}/${project.slug}`}
        title={project.title}
        description={project.short_description}
        datePublished={project.created_at}
        dateModified={project.updated_at}
        image={
          project.featured_image || `/api/og/generate?title=${encodeURIComponent(project.title)}`
        }
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      {/* Header */}
      <Column maxWidth="s" gap="16" horizontal="center" align="center">
        <SmartLink href="/work">
          <Text variant="label-strong-m">Projects</Text>
        </SmartLink>
        <Text variant="body-default-xs" onBackground="neutral-weak" marginBottom="12">
          {project.created_at && formatDate(project.created_at)}
          {project.updated_at && project.updated_at !== project.created_at && (
            <> • Updated {formatDate(project.updated_at)}</>
          )}
        </Text>
        <Heading variant="display-strong-m">{project.title}</Heading>
      </Column>

      {/* Status and metadata */}
      <Flex horizontal="center" gap="16" wrap>
        {project.status && (
          <Tag variant={statusColors[project.status] || "neutral"} size="m">
            {project.status.replace("-", " ")}
          </Tag>
        )}
        {project.role && (
          <Text variant="label-default-m" onBackground="neutral-weak">
            Role: {project.role}
          </Text>
        )}
        {project.team_size && (
          <Text variant="label-default-m" onBackground="neutral-weak">
            Team: {project.team_size} members
          </Text>
        )}
      </Flex>

      {/* Featured Image */}
      {project.featured_image && (
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: "var(--radius-l)", overflow: "hidden" }}>
          <Image
            priority
            src={project.featured_image}
            alt={project.featured_image_alt || project.title}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      )}

      {/* Project Links */}
      <Flex gap="16" horizontal="center" wrap>
        {project.live_url && (
          <Button
            href={project.live_url}
            variant="secondary"
            suffixIcon="arrowUpRightFromSquare"
          >
            View Live
          </Button>
        )}
        {project.github_url && (
          <Button
            href={project.github_url}
            variant="secondary"
            suffixIcon="arrowUpRightFromSquare"
          >
            GitHub
          </Button>
        )}
        {project.demo_url && (
          <Button
            href={project.demo_url}
            variant="secondary"
            suffixIcon="arrowUpRightFromSquare"
          >
            Demo
          </Button>
        )}
      </Flex>

      {/* Description */}
      <Column style={{ margin: "auto" }} as="article" maxWidth="xs" gap="24">
        <Column gap="16">
          <Heading as="h2" variant="heading-strong-l">
            About
          </Heading>
          <Text variant="body-default-m" onBackground="neutral-weak">
            {project.description}
          </Text>
        </Column>

        {/* Technologies */}
        {technologies.length > 0 && (
          <Column gap="16">
            <Heading as="h3" variant="heading-strong-m">
              Technologies Used
            </Heading>
            <Flex gap="8" wrap>
              {technologies.map((tech, idx) => (
                <Tag key={idx} size="m">
                  {tech}
                </Tag>
              ))}
            </Flex>
          </Column>
        )}

        {/* Project Timeline */}
        {(project.start_date || project.end_date) && (
          <Column gap="16">
            <Heading as="h3" variant="heading-strong-m">
              Timeline
            </Heading>
            <Text variant="body-default-m" onBackground="neutral-weak">
              {project.start_date && formatDate(project.start_date)}
              {project.start_date && project.end_date && " - "}
              {project.end_date && formatDate(project.end_date)}
              {project.start_date && !project.end_date && " - Present"}
            </Text>
          </Column>
        )}

        {/* Additional Images */}
        {project.images && project.images.length > 0 && (
          <Column gap="16">
            <Heading as="h3" variant="heading-strong-m">
              Gallery
            </Heading>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
              }}
            >
              {project.images.map((img) => (
                <Column key={img.id} gap="8">
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "16/9",
                      borderRadius: "var(--radius-m)",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={img.data_uri || img.image_url}
                      alt={img.alt_text || img.caption || project.title}
                      fill
                      style={{ objectFit: "cover" }}
                      unoptimized={!!img.data_uri}
                    />
                  </div>
                  {img.caption && (
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      {img.caption}
                    </Text>
                  )}
                </Column>
              ))}
            </div>
          </Column>
        )}
      </Column>

      {/* Related Projects */}
      <Column fillWidth gap="40" horizontal="center" marginTop="40">
        <Line maxWidth="40" />
        <Heading as="h2" variant="heading-strong-xl" marginBottom="24">
          Related projects
        </Heading>
        <Projects exclude={[project.slug]} range={[1, 3]} />
      </Column>
    </Column>
  );
}
