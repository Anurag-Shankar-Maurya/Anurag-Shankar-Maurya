
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, Loader2, Search, X } from 'lucide-react';
import Lightbox from '../components/Lightbox';
import Gallery from '../components/Gallery';
import { Button } from '../components/Button';
import { MetaTags } from '../components/MetaTags';
import { Project, ViewState, PaginatedResponse } from '../types';
import { api } from '../services/api';
import { Icons, SocialIcons } from '../components/Icons';

export const ProjectsView: React.FC<{ projects: Project[], onNavigate: (view: ViewState) => void }> = ({ projects, onNavigate }) => {
  const [lbOpen, setLbOpen] = useState(false);
  const [lbImages, setLbImages] = useState<{ src: string; alt?: string; caption?: string }[]>([]);
  const [lbIndex, setLbIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState<PaginatedResponse<Project> | null>(null);
  const [loading, setLoading] = useState(false);
  const ITEMS_PER_PAGE = 15;

  // Fetch paginated data when filters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params: any = { page: currentPage };
        if (searchQuery) params.search = searchQuery;
        if (selectedStatus) params.status = selectedStatus;
        params.limit = ITEMS_PER_PAGE;
        
        const data = await api.getProjects(params);
        setPaginatedData(data);
      } catch (error) {
        console.error('Failed to fetch projects', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchQuery, selectedStatus, currentPage]);

  // Extract unique statuses from initial projects
  const statuses = Array.from(new Set(projects.map(p => p.status)));

  const handleOpenGallery = (project: Project, index = 0) => {
    const imgs = [
      { src: project.featured_image, alt: project.title },
      ...(project.images?.map((i) => ({ src: i.data_uri || i.image_url, alt: i.alt_text, caption: i.caption })) || []),
    ];
    setLbImages(imgs);
    setLbIndex(index);
    setLbOpen(true);
  };

  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in-up">
      <MetaTags 
        title="Portfolio Projects | Anurag Shankar Maurya"
        description="A complete archive of my open source contributions, client work, and side projects."
        keywords="projects, portfolio, software development, open source"
      />
      <h1 className="text-4xl font-bold text-white mb-4">All Projects</h1>
      <p className="text-gray-400 max-w-2xl mb-12">A complete archive of my open source contributions, client work, and side projects.</p>
      
      {/* Search Bar */}
      <div className="mb-8 relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search projects by title, description, or technology..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Status Filter */}
      {statuses.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Status</h3>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => { setSelectedStatus(null); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-lg transition-colors capitalize ${!selectedStatus ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              All
            </button>
            {statuses.map(status => (
              <button 
                key={status}
                onClick={() => { setSelectedStatus(status); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-lg transition-colors capitalize ${selectedStatus === status ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-400" /></div>
      ) : paginatedData && paginatedData.results.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedData.results.map((project, index) => (
              <div 
                key={project.id} 
                className="group flex flex-col glass-card rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => onNavigate({ type: 'PROJECT_DETAIL', slug: project.slug })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') onNavigate({ type: 'PROJECT_DETAIL', slug: project.slug }); }}
              >
                <div className="aspect-video bg-black/50 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <img src={project.featured_image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />

                  {/* Overlay icons: Live, Source, Demo, Gallery */}
                  <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
                    {project.live_url && (
                      <button
                        onClick={(e) => { e.stopPropagation(); window.open(project.live_url, '_blank'); }}
                        className="p-2 rounded-md bg-black/50 text-white hover:bg-black/60"
                        aria-label={`Open live site for ${project.title}`}
                      >
                        {React.createElement(Icons.globe, { className: 'w-4 h-4' })}
                      </button>
                    )}

                    {project.github_url && (
                      <button
                        onClick={(e) => { e.stopPropagation(); window.open(project.github_url, '_blank'); }}
                        className="p-2 rounded-md bg-black/50 text-white hover:bg-black/60"
                        aria-label={`Open source for ${project.title}`}
                      >
                        {React.createElement(SocialIcons.github, { className: 'w-4 h-4' })}
                      </button>
                    )}

                    {project.demo_url && (
                      <button
                        onClick={(e) => { e.stopPropagation(); window.open(project.demo_url, '_blank'); }}
                        className="p-2 rounded-md bg-black/50 text-white hover:bg-black/60"
                        aria-label={`Open demo for ${project.title}`}
                      >
                        {React.createElement(Icons.play, { className: 'w-4 h-4' })}
                      </button>
                    )}

                    {project.images && project.images.length > 0 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleOpenGallery(project); }}
                        className="p-2 rounded-md bg-black/50 text-white hover:bg-black/60"
                        aria-label={`Open gallery for ${project.title}`}
                      >
                        {React.createElement(Icons.gallery, { className: 'w-4 h-4' })}
                      </button>
                    )}
                  </div>

                  <div className="absolute top-2 left-3 z-20 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-md text-xs font-medium text-white border border-white/10 capitalize shadow-lg">
                    {project.status}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">{project.short_description}</p>
                  {/* tech badges */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.split(',').slice(0, 3).map(t => (
                      <span key={t} className="px-2 py-1 text-xs bg-white/5 rounded-md text-gray-300 border border-white/5">{t.trim()}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {paginatedData.count > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={!paginatedData.previous}
                className="px-4 py-2 rounded-lg bg-white/5 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.ceil(paginatedData.count / ITEMS_PER_PAGE) }, (_, i) => i + 1).map(page => (
                  <button 
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg transition-colors ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={!paginatedData.next}
                className="px-4 py-2 rounded-lg bg-white/5 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400">No projects found matching your filters.</p>
        </div>
      )}

      <Lightbox images={lbImages} initialIndex={lbIndex} isOpen={lbOpen} onClose={() => setLbOpen(false)} />
    </main>
  );
};

export const ProjectDetailView: React.FC<{ slug: string, onNavigate: (view: ViewState) => void }> = ({ slug, onNavigate }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);
  const [lbImages, setLbImages] = useState<{ src: string; alt?: string; caption?: string }[]>([]);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [needsTruncate, setNeedsTruncate] = useState(false);
  const [maxHeight, setMaxHeight] = useState<number | null>(null);

  useEffect(() => {
    api.getProjectDetail(slug).then(setProject).catch(console.error).finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!project) return;
    const el = contentRef.current;
    if (!el) return;
    const style = window.getComputedStyle(el);
    const lineHeight = parseFloat(style.lineHeight || '20');
    const height = el.scrollHeight;
    const lines = Math.round(height / lineHeight);
    if (lines > 15) {
      setNeedsTruncate(true);
      setMaxHeight(lineHeight * 15);
    } else {
      setNeedsTruncate(false);
      setMaxHeight(null);
    }
  }, [project]);

  if (loading) return <div className="pt-32 text-center text-white"><Loader2 className="w-8 h-8 animate-spin mx-auto"/></div>;
  if (!project) return <div>Project not found</div>;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.short_description,
    "image": project.featured_image,
    "url": window.location.href,
    "author": {
      "@type": "Person",
      "name": "Anurag Shankar Maurya"
    }
  };

  const openGallery = (startIndex = 0) => {
    const imgs = [
      { src: project.featured_image, alt: project.title },
      ...(project.images?.map((i) => ({ src: i.data_uri || i.image_url, alt: i.alt_text, caption: i.caption })) || []),
    ];
    setLbImages(imgs);
    setLbIndex(startIndex);
    setLbOpen(true);
  };

  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-fade-in-up">
      <MetaTags 
        title={`${project.title} | Projects | Anurag Shankar Maurya`}
        description={project.short_description}
        keywords={`${project.technologies}, project detail`}
        ogImage={project.featured_image}
        schemaData={schemaData}
      />
      <Button variant="ghost" onClick={() => onNavigate({ type: 'PROJECTS' })} className="mb-8 pl-0 hover:pl-2 transition-all">
        <ArrowLeft className="w-4 h-4 mr-2"/> Back to Projects
      </Button>
      
      <div className="glass-card p-2 rounded-3xl mb-12">
        <button onClick={() => openGallery(0)} className="w-full block">
          <img src={project.featured_image} alt={project.title} className="w-full aspect-video object-cover rounded-2xl cursor-pointer" />
        </button>
      </div>

      <Lightbox images={lbImages} initialIndex={lbIndex} isOpen={lbOpen} onClose={() => setLbOpen(false)} />

      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{project.title}</h1>
          <div ref={contentRef} className="prose prose-invert prose-lg max-w-none text-gray-300" style={expanded ? undefined : { maxHeight: maxHeight ? `${maxHeight}px` : undefined, overflow: 'hidden' }}>
             <p className="whitespace-pre-wrap">{project.description}</p>
          </div>
          {needsTruncate && (
            <div className="mt-6">
              <Button variant="ghost" onClick={() => setExpanded(prev => !prev)}>{expanded ? 'Read less' : 'Read more'}</Button>
            </div>
          )}
        </div>
        <div className="w-full md:w-80 space-y-6">
          <div className="p-6 glass-card rounded-2xl">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Project Links</h3>
            <div className="space-y-4">
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noreferrer" className="flex items-center justify-between text-blue-400 hover:text-blue-300 transition-colors group" onClick={(e) => e.stopPropagation()}>
                  <span className="flex items-center">{React.createElement(Icons.globe, { className: 'w-4 h-4 mr-2' })} Live Site</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"/>
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noreferrer" className="flex items-center justify-between text-gray-300 hover:text-white transition-colors group" onClick={(e) => e.stopPropagation()}>
                  <span className="flex items-center">{React.createElement(SocialIcons.github, { className: 'w-4 h-4 mr-2' })} Source Code</span>
                   <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"/>
                </a>
              )}
              {project.demo_url && (
                <a href={project.demo_url} target="_blank" rel="noreferrer" className="flex items-center justify-between text-gray-300 hover:text-white transition-colors group" onClick={(e) => e.stopPropagation()}>
                  <span className="flex items-center">{React.createElement(Icons.play, { className: 'w-4 h-4 mr-2' })} Demo</span>
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

      {project.images && project.images.length > 0 && (
        <div className="mt-8 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">Project Gallery</h3>
          <Gallery images={project.images} columns={3} />
        </div>
      )}

    </main>
  );
};
