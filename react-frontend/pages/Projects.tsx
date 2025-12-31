
import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Globe, Github, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { Project, ViewState } from '../types';
import { api } from '../services/api';

export const ProjectsView: React.FC<{ projects: Project[], onNavigate: (view: ViewState) => void }> = ({ projects, onNavigate }) => (
  <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in-up">
    <h1 className="text-4xl font-bold text-white mb-4">All Projects</h1>
    <p className="text-gray-400 max-w-2xl mb-12">A complete archive of my open source contributions, client work, and side projects.</p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <div 
          key={project.id} 
          className="group flex flex-col glass-card rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="aspect-video bg-black/50 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <img src={project.featured_image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute top-2 right-2 z-20 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-md text-xs font-medium text-white border border-white/10 capitalize shadow-lg">
              {project.status}
            </div>
          </div>
          <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{project.title}</h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">{project.short_description}</p>
            <div className="pt-4 border-t border-white/5 mt-auto">
              <Button variant="ghost" className="w-full justify-between group-hover:text-blue-400 px-0" onClick={() => onNavigate({ type: 'PROJECT_DETAIL', slug: project.slug })}>
                View Details <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"/>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </main>
);

export const ProjectDetailView: React.FC<{ slug: string, onNavigate: (view: ViewState) => void }> = ({ slug, onNavigate }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProjectDetail(slug).then(setProject).catch(console.error).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="pt-32 text-center text-white"><Loader2 className="w-8 h-8 animate-spin mx-auto"/></div>;
  if (!project) return <div>Project not found</div>;

  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-fade-in-up">
      <Button variant="ghost" onClick={() => onNavigate({ type: 'PROJECTS' })} className="mb-8 pl-0 hover:pl-2 transition-all">
        <ArrowLeft className="w-4 h-4 mr-2"/> Back to Projects
      </Button>
      
      <div className="glass-card p-2 rounded-3xl mb-12">
        <img src={project.featured_image} alt={project.title} className="w-full aspect-video object-cover rounded-2xl" />
      </div>
      
      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{project.title}</h1>
          <div className="prose prose-invert prose-lg max-w-none text-gray-300">
             <p>{project.description}</p>
          </div>
        </div>
        <div className="w-full md:w-80 space-y-6">
          <div className="p-6 glass-card rounded-2xl">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Project Links</h3>
            <div className="space-y-4">
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noreferrer" className="flex items-center justify-between text-blue-400 hover:text-blue-300 transition-colors group">
                  <span className="flex items-center"><Globe className="w-4 h-4 mr-2"/> Live Site</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"/>
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noreferrer" className="flex items-center justify-between text-gray-300 hover:text-white transition-colors group">
                  <span className="flex items-center"><Github className="w-4 h-4 mr-2"/> Source Code</span>
                   <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"/>
                </a>
              )}
            </div>
          </div>
          <div className="p-6 glass-card rounded-2xl">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.split(',').map(t => (
                <span key={t} className="px-3 py-1.5 bg-white/5 rounded-lg text-xs font-medium text-gray-300 border border-white/5">{t.trim()}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
