import { Column, Text, Heading, Grid } from "@once-ui-system/core";
import { ProjectCard } from "@/components";
import { projectsApi } from "@/lib";

interface ProjectsProps {
  range?: [number, number?];
  exclude?: string[];
}

export async function Projects({ range, exclude }: ProjectsProps) {
  let allProjects;
  
  try {
    const response = await projectsApi.list({
      ordering: '-is_featured,-order,-created_at',
    });
    allProjects = response.results;
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
    allProjects = allProjects.filter((project) => !exclude.includes(project.slug));
  }

  // Apply range if specified
  const projects = range
    ? allProjects.slice(range[0] - 1, range[1] ?? allProjects.length)
    : allProjects;

  if (projects.length === 0) {
    return (
      <Column fillWidth gap="xl" marginBottom="40" paddingX="l">
        <Text>No projects available.</Text>
      </Column>
    );
  }

  // Separate featured and regular projects
  const featuredProjects = projects.filter(p => p.is_featured);
  const regularProjects = projects.filter(p => !p.is_featured);

  return (
    <Column fillWidth gap="48" marginBottom="40">
      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <Column fillWidth gap="24">
          <Heading as="h2" variant="heading-strong-l" paddingX="l">
            Featured Projects
          </Heading>
          <Column fillWidth gap="24" paddingX="l">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                featured={true}
              />
            ))}
          </Column>
        </Column>
      )}

      {/* Regular Projects Section */}
      {regularProjects.length > 0 && (
        <Column fillWidth gap="24">
          {featuredProjects.length > 0 && (
            <Heading as="h2" variant="heading-strong-l" paddingX="l">
              All Projects
            </Heading>
          )}
          <Grid
            columns="repeat(auto-fill, minmax(min(100%, 400px), 1fr))"
            gap="24"
            paddingX="l"
          >
            {regularProjects.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                featured={false}
              />
            ))}
          </Grid>
        </Column>
      )}
    </Column>
  );
}
