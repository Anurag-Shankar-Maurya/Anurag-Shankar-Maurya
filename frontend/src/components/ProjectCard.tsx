"use client";

import {
  Column,
  Flex,
  Heading,
  SmartLink,
  Text,
  Tag,
} from "@once-ui-system/core";
import Image from "next/image";
import styles from "./ProjectCard.module.scss";
import type { Project } from "@/types/api.types";

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, featured = false }) => {
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
    <SmartLink
      href={`/work/${project.slug}`}
      className={featured ? styles.featuredCard : styles.regularCard}
    >
      <Column fillWidth gap="m" className={styles.cardContent}>
        {project.featured_image && (
          <div className={styles.imageWrapper}>
            <Image
              src={project.featured_image}
              alt={project.featured_image_alt || project.title}
              fill
              className={styles.image}
              sizes={featured ? "(max-width: 768px) 100vw, 960px" : "(max-width: 768px) 100vw, 480px"}
            />
          </div>
        )}
        <Column fillWidth gap="12" padding="16">
          <Flex fillWidth horizontal="between" vertical="start" gap="8">
            <Heading
              as="h3"
              wrap="balance"
              variant={featured ? "heading-strong-l" : "heading-strong-m"}
            >
              {project.title}
            </Heading>
            {project.status && (
              <Tag variant={statusColors[project.status] || "neutral"} size="s">
                {project.status.replace("-", " ")}
              </Tag>
            )}
          </Flex>

          <Text
            wrap="balance"
            variant={featured ? "body-default-m" : "body-default-s"}
            onBackground="neutral-weak"
          >
            {project.short_description}
          </Text>

          {technologies.length > 0 && (
            <Flex gap="8" wrap>
              {technologies.slice(0, featured ? 8 : 4).map((tech, idx) => (
                <Tag key={idx} size="s">
                  {tech}
                </Tag>
              ))}
              {technologies.length > (featured ? 8 : 4) && (
                <Tag size="s" variant="neutral">
                  +{technologies.length - (featured ? 8 : 4)}
                </Tag>
              )}
            </Flex>
          )}

          <Flex gap="16" marginTop="8">
            {project.live_url && (
              <SmartLink
                href={project.live_url}
                suffixIcon="arrowUpRightFromSquare"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <Text variant="label-default-s">Live Demo</Text>
              </SmartLink>
            )}
            {project.github_url && (
              <SmartLink
                href={project.github_url}
                suffixIcon="arrowUpRightFromSquare"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <Text variant="label-default-s">GitHub</Text>
              </SmartLink>
            )}
            {project.demo_url && (
              <SmartLink
                href={project.demo_url}
                suffixIcon="arrowUpRightFromSquare"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <Text variant="label-default-s">Demo</Text>
              </SmartLink>
            )}
          </Flex>
        </Column>
      </Column>
    </SmartLink>
  );
};
