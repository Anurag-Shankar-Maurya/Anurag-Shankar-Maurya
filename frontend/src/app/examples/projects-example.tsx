/**
 * Example: Projects Page Component
 * Demonstrates server-side data fetching with the API
 */

import { projectsApi } from '@/lib';
import { notFound } from 'next/navigation';

export const revalidate = 3600; // Revalidate every hour

export default async function ProjectsPage() {
  // Fetch projects from the API
  const projectsData = await projectsApi.list({
    ordering: '-created_at',
    show_on_home: true,
  });

  if (!projectsData) {
    notFound();
  }

  return (
    <div className="projects-container">
      <h1>Projects</h1>
      <p>Total projects: {projectsData.count}</p>
      
      <div className="projects-grid">
        {projectsData.results.map((project) => (
          <article key={project.id} className="project-card">
            <img 
              src={project.featured_image} 
              alt={project.featured_image_alt || project.title}
            />
            <h2>{project.title}</h2>
            <p>{project.short_description}</p>
            <div className="technologies">
              {project.technologies.split(',').map((tech) => (
                <span key={tech.trim()} className="tech-tag">
                  {tech.trim()}
                </span>
              ))}
            </div>
            <div className="links">
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                  View Live
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      {(projectsData.next || projectsData.previous) && (
        <div className="pagination">
          {projectsData.previous && <button>Previous</button>}
          {projectsData.next && <button>Next</button>}
        </div>
      )}
    </div>
  );
}
