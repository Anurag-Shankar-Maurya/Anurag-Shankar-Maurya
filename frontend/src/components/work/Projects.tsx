import { Column, Text, Heading } from "@once-ui-system/core";
import { ProjectCard } from "@/components";
import { projectsApi } from "@/lib";

interface ProjectsProps {
  range?: [number, number?];
  exclude?: string[];
  displayMode?: 'unified' | 'detailed';
}

export async function Projects({ range, exclude, displayMode = 'detailed' }: ProjectsProps) {
  let allProjects;
  
  try {
    const apiParams: { ordering: string; show_on_home?: boolean } = {
      ordering: "-is_featured,-order,-created_at",
    };

    if (displayMode === 'unified') {
      apiParams.show_on_home = true;
    }

    const response = await projectsApi.list(apiParams);
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

  // Unified view for home page
  if (displayMode === 'unified') {
    return (
      <Column fillWidth gap="24" marginBottom="40">
        <Heading as="h2" variant="heading-strong-l" paddingX="l">
          Projects
        </Heading>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 400px), 1fr))",
            gap: "24px",
            paddingLeft: "var(--static-space-l)",
            paddingRight: "var(--static-space-l)",
          }}
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              featured={project.is_featured}
            />
          ))}
        </div>
      </Column>
    );
  }

  // Detailed view for work page (default)
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 400px), 1fr))",
              gap: "24px",
              paddingLeft: "var(--static-space-l)",
              paddingRight: "var(--static-space-l)",
            }}
          >
            {regularProjects.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                featured={false}
              />
            ))}
          </div>
        </Column>
      )}
    </Column>
  );
}
