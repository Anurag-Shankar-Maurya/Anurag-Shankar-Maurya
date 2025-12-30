import { Column, Text } from "@once-ui-system/core";
import { ProjectCard } from "@/components";
import { projectsApi } from "@/lib";

interface ProjectsProps {
  range?: [number, number?];
  exclude?: string[];
}

export async function Projects({ range, exclude }: ProjectsProps) {
  let projects;
  
  try {
    const response = await projectsApi.list({
      ordering: '-created_at',
      show_on_home: true
    });
    projects = response.results;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return (
      <Column fillWidth gap="xl" marginBottom="40" paddingX="l">
        <Text>Unable to load projects. Please try again later.</Text>
      </Column>
    );
  }

  // Exclude by slug (exact match)
  if (exclude && exclude.length > 0) {
    projects = projects.filter((project) => !exclude.includes(project.slug));
  }

  const displayedProjects = range
    ? projects.slice(range[0] - 1, range[1] ?? projects.length)
    : projects;

  if (displayedProjects.length === 0) {
    return (
      <Column fillWidth gap="xl" marginBottom="40" paddingX="l">
        <Text>No projects available.</Text>
      </Column>
    );
  }

  return (
    <Column fillWidth gap="xl" marginBottom="40" paddingX="l">
      {displayedProjects.map((project, index) => (
        <ProjectCard
          priority={index < 2}
          key={project.slug}
          href={`/work/${project.slug}`}
          images={project.featured_image ? [project.featured_image] : []}
          title={project.title}
          description={project.short_description}
          content=""
          avatars={[]}
          link={project.live_url || project.github_url || ""}
        />
      ))}
    </Column>
  );
}
