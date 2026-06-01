import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, Loader2, Search, X, LayoutGrid, List } from 'lucide-react';
import Lightbox from '../components/Lightbox';
import Gallery from '../components/Gallery';
import { Button } from '../components/Button';
import { MetaTags } from '../components/MetaTags';
import { Breadcrumb, generateBreadcrumbs } from '../components/Breadcrumb';
import { Project, ViewState, PaginatedResponse } from '../types';
import { api } from '../services/api';
import { Icons, SocialIcons } from '../components/Icons';

export const ProjectsView: React.FC<{ projects: Project[], onNavigate: (view: ViewState) => void }> = ({ projects, onNavigate }) => {
  const [lbOpen, setLbOpen] = useState(false);
  const [lbImages, setLbImages] = useState<{ src: string; alt?: string; caption?: string }[]>([]);
  const [lbIndex, setLbIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedTechnology, setSelectedTechnology] = useState<string | null>(null);
  const [techSearchQuery, setTechSearchQuery] = useState('');
  const [showAllTechnologies, setShowAllTechnologies] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
  const technologyCountMap = projects
    .flatMap((p) => p.technologies.split(','))
    .map((t) => t.trim())
    .filter(Boolean)
    .reduce((acc, tech) => {
      acc[tech] = (acc[tech] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const technologies = (Object.entries(technologyCountMap) as Array<[string, number]>)
    .sort((a, b) => b[1] - a[1])
    .map(([tech]) => tech);

  const filteredTechnologies = technologies.filter((tech) =>
    tech.toLowerCase().includes(techSearchQuery.toLowerCase())
  );

  const visibleTechnologies = showAllTechnologies ? filteredTechnologies : filteredTechnologies.slice(0, 8);

  const displayedProjects = (paginatedData?.results || []).filter((project) => {
    if (!selectedTechnology) return true;
    return project.technologies
      .split(',')
      .map((tech) => tech.trim().toLowerCase())
      .includes(selectedTechnology.toLowerCase());
  });

  const handleOpenGallery = (project: Project, index = 0) => {
    const imgs = [
      { src: project.featured_image, alt: project.title },
      ...(project.images?.map((i) => ({ src: i.image_url, alt: i.alt_text, caption: i.caption })) || []),
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
      <h1 className="text-4xl font-extrabold text-black mb-4">All Projects</h1>
      <p className="text-[#4c4546] max-w-2xl mb-12">A complete archive of my open source contributions, client work, and side projects.</p>
      
      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7e7576]" />
          <input 
            type="text" 
            placeholder="Search projects by title, description, or technology..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-12 pr-12 py-3 bg-white border border-[#cfc4c5] rounded-full text-black placeholder-[#7e7576] focus:outline-none focus:border-black focus:border-[2px] transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7e7576] hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-full">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* View Toggle */}
      <div className="mb-8 flex items-center justify-end">
        <div className="inline-flex items-center p-1 rounded-full bg-[#eeeeee] border border-[#cfc4c5]">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-1.5 rounded-full text-sm flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${viewMode === 'grid' ? 'bg-black text-white font-semibold' : 'text-[#4c4546] hover:bg-[#f3f3f3]'}`}
            aria-pressed={viewMode === 'grid'}
          >
            <LayoutGrid className="w-4 h-4" /> Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-1.5 rounded-full text-sm flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${viewMode === 'list' ? 'bg-black text-white font-semibold' : 'text-[#4c4546] hover:bg-[#f3f3f3]'}`}
            aria-pressed={viewMode === 'list'}
          >
            <List className="w-4 h-4" /> List
          </button>
        </div>
      </div>

      {/* Status Filter */}
      {statuses.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xs font-bold text-[#7e7576] uppercase tracking-widest mb-3">Status</h3>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => { setSelectedStatus(null); setCurrentPage(1); }}
              className={`px-4 py-2 text-sm rounded-full transition-all capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${!selectedStatus ? 'bg-black text-white font-semibold' : 'bg-[#F2F2F2] text-[#4c4546] hover:bg-[#eeeeee] border border-transparent hover:border-[#cfc4c5]'}`}
            >
              All
            </button>
            {statuses.map(status => (
              <button 
                key={status}
                onClick={() => { setSelectedStatus(status); setCurrentPage(1); }}
                className={`px-4 py-2 text-sm rounded-full transition-all capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${selectedStatus === status ? 'bg-black text-white font-semibold' : 'bg-[#F2F2F2] text-[#4c4546] hover:bg-[#eeeeee] border border-transparent hover:border-[#cfc4c5]'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Technology Filter */}
      {technologies.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="text-xs font-bold text-[#7e7576] uppercase tracking-widest">Tech Stack</h3>
            {technologies.length > 8 && (
              <button
                onClick={() => setShowAllTechnologies((prev) => !prev)}
                className="text-xs px-3 py-1 rounded-full bg-[#eeeeee] border border-[#cfc4c5] text-black hover:bg-[#e2e2e2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                {showAllTechnologies ? 'Show less' : `Show all (${technologies.length})`}
              </button>
            )}
          </div>

          {technologies.length > 8 && (
            <div className="mb-3">
              <input
                type="text"
                value={techSearchQuery}
                onChange={(e) => setTechSearchQuery(e.target.value)}
                placeholder="Find a technology tag..."
                className="w-full md:max-w-sm px-4 py-2 text-sm bg-white border border-[#cfc4c5] rounded-full text-black placeholder-[#7e7576] focus:outline-none focus:border-black"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTechnology(null)}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${!selectedTechnology ? 'bg-black text-white font-semibold shadow-none' : 'bg-[#F2F2F2] text-[#4c4546] hover:bg-[#eeeeee] border border-transparent hover:border-[#cfc4c5]'}`}
            >
              All Tech
            </button>
            {visibleTechnologies.map((tech) => (
              <button
                key={tech}
                onClick={() => setSelectedTechnology(tech)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${selectedTechnology === tech ? 'bg-black text-white font-semibold shadow-none' : 'bg-[#F2F2F2] text-[#4c4546] hover:bg-[#eeeeee] border border-transparent hover:border-[#cfc4c5]'}`}
              >
                {tech}
              </button>
            ))}
          </div>
          {techSearchQuery && filteredTechnologies.length === 0 && (
            <p className="text-xs text-[#7e7576] mt-2">No technology tags found for “{techSearchQuery}”.</p>
          )}
        </div>
      )}

      {/* Projects Grid */}
      {loading ? (
        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6 mb-8`}>
          {Array.from({ length: viewMode === 'grid' ? 6 : 4 }).map((_, idx) => (
            <div key={idx} className={`bg-white border border-[#E5E5E5] rounded-[3rem] p-10 animate-pulse ${viewMode === 'list' ? 'flex flex-col md:flex-row gap-6' : 'flex flex-col'}`}>
              <div className={`${viewMode === 'list' ? 'w-full md:w-[320px] rounded-[2rem]' : 'w-full aspect-video rounded-[2rem]'} bg-[#eeeeee]`} />
              <div className="flex-grow pt-4">
                <div className="h-6 w-3/4 bg-[#eeeeee] rounded mb-3" />
                <div className="h-4 w-full bg-[#eeeeee] rounded mb-2" />
                <div className="h-4 w-2/3 bg-[#eeeeee] rounded mb-4" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-[#eeeeee] rounded-full" />
                  <div className="h-6 w-20 bg-[#eeeeee] rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : paginatedData && displayedProjects.length > 0 ? (
        <>
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-8 mb-8`}>
            {displayedProjects.map((project, index) => (
              <div 
                key={project.id} 
                className={`group bg-white border border-[#E5E5E5] rounded-[3rem] p-10 hover:border-black hover:border-[2px] transition-all duration-500 cursor-pointer shadow-none ${viewMode === 'list' ? 'flex flex-col md:flex-row gap-6' : 'flex flex-col'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => onNavigate({ type: 'PROJECT_DETAIL', slug: project.slug })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') onNavigate({ type: 'PROJECT_DETAIL', slug: project.slug }); }}
              >
                <div className={`${viewMode === 'list' ? 'md:w-[320px] md:min-w-[320px]' : ''} aspect-video bg-[#F2F2F2] rounded-[2rem] overflow-hidden relative`}>
                  <img src={project.featured_image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-750" />

                  {/* Overlay icons: Live, Source, Demo, Gallery */}
                  <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
                    {project.live_url && (
                      <button
                        onClick={(e) => { e.stopPropagation(); window.open(project.live_url, '_blank'); }}
                        className="p-2 rounded-full bg-white/90 text-black border border-[#cfc4c5] hover:bg-black hover:text-white transition-all"
                        aria-label={`Open live site for ${project.title}`}
                      >
                        {React.createElement(Icons.globe, { className: 'w-4 h-4' })}
                      </button>
                    )}

                    {project.github_url && (
                      <button
                        onClick={(e) => { e.stopPropagation(); window.open(project.github_url, '_blank'); }}
                        className="p-2 rounded-full bg-white/90 text-black border border-[#cfc4c5] hover:bg-black hover:text-white transition-all"
                        aria-label={`Open source for ${project.title}`}
                      >
                        {React.createElement(SocialIcons.github, { className: 'w-4 h-4' })}
                      </button>
                    )}

                    {project.demo_url && (
                      <button
                        onClick={(e) => { e.stopPropagation(); window.open(project.demo_url, '_blank'); }}
                        className="p-2 rounded-full bg-white/90 text-black border border-[#cfc4c5] hover:bg-black hover:text-white transition-all"
                        aria-label={`Open demo for ${project.title}`}
                      >
                        {React.createElement(Icons.play, { className: 'w-4 h-4' })}
                      </button>
                    )}

                    {project.images && project.images.length > 0 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleOpenGallery(project); }}
                        className="p-2 rounded-full bg-white/90 text-black border border-[#cfc4c5] hover:bg-black hover:text-white transition-all"
                        aria-label={`Open gallery for ${project.title}`}
                      >
                        {React.createElement(Icons.gallery, { className: 'w-4 h-4' })}
                      </button>
                    )}
                  </div>

                  <div className="absolute top-2 left-3 z-20 px-3 py-1 bg-white/90 border border-[#cfc4c5] rounded-full text-xs font-semibold text-black capitalize">
                    {project.status}
                  </div>
                </div>
                <div className="pt-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-black mb-2 group-hover:text-black transition-colors">{project.title}</h3>
                  <p className="text-[#4c4546] text-sm mb-4 line-clamp-3 flex-grow leading-[1.6]">{project.short_description}</p>
                  {/* tech badges */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.split(',').slice(0, 3).map(t => (
                      <span key={t} className="px-3 py-1 text-xs bg-[#F2F2F2] rounded-full text-black font-semibold">{t.trim()}</span>
                    ))}
                    {project.technologies.split(',').length > 3 && (
                      <span className="px-3 py-1 text-xs text-[#7e7576] bg-[#F2F2F2] rounded-full border border-dashed border-[#cfc4c5] font-semibold">
                        +{project.technologies.split(',').length - 3} more
                      </span>
                    )}
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
                className="px-5 py-2.5 rounded-full bg-transparent border border-black text-black disabled:opacity-30 hover:bg-neutral-100/50 transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: Math.ceil(paginatedData.count / ITEMS_PER_PAGE) }, (_, i) => i + 1).map(page => (
                  <button 
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-full transition-colors font-semibold ${currentPage === page ? 'bg-black text-white' : 'bg-[#F2F2F2] text-[#4c4546] hover:bg-[#eeeeee]'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={!paginatedData.next}
                className="px-5 py-2.5 rounded-full bg-transparent border border-black text-black disabled:opacity-30 hover:bg-neutral-100/50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-black text-lg font-bold mb-2">No projects match these filters yet.</p>
          <p className="text-[#7e7576] mb-5">Try clearing status, tech stack, or search to view more projects.</p>
          <Button
            variant="secondary"
            onClick={() => {
              setSearchQuery('');
              setSelectedStatus(null);
              setSelectedTechnology(null);
              setCurrentPage(1);
            }}
          >
            Reset Filters
          </Button>
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

  if (loading) return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 animate-pulse">
      {/* Banner Skeleton */}
      <div className="w-full aspect-video rounded-[3rem] bg-[#eeeeee] border border-[#E5E5E5]" />
      {/* Grid Layout Skeleton */}
      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex-1 space-y-4">
          <div className="h-10 w-2/3 bg-[#eeeeee] rounded-xl" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-[#eeeeee] rounded-md" />
            <div className="h-4 w-full bg-[#eeeeee] rounded-md" />
            <div className="h-4 w-5/6 bg-[#eeeeee] rounded-md" />
          </div>
        </div>
        <div className="w-full md:w-80 space-y-6">
          <div className="p-10 bg-white border border-[#E5E5E5] rounded-[3rem] space-y-3">
            <div className="h-4 w-2/3 bg-[#eeeeee] rounded" />
            <div className="h-4 w-full bg-[#eeeeee] rounded" />
            <div className="h-4 w-full bg-[#eeeeee] rounded" />
          </div>
        </div>
      </div>
    </div>
  );
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
      ...(project.images?.map((i) => ({ src: i.image_url, alt: i.alt_text, caption: i.caption })) || []),
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
      <Breadcrumb 
        items={generateBreadcrumbs({ type: 'PROJECT_DETAIL', slug }, project.title)} 
        onNavigate={onNavigate} 
      />
      
      <div className="bg-white border border-[#E5E5E5] p-4 rounded-[3rem] mb-12 shadow-none">
        <button onClick={() => openGallery(0)} className="w-full block">
          <img src={project.featured_image} alt={project.title} className="w-full aspect-video object-cover rounded-[2rem] cursor-pointer" />
        </button>
      </div>

      <Lightbox images={lbImages} initialIndex={lbIndex} isOpen={lbOpen} onClose={() => setLbOpen(false)} />

      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-6">{project.title}</h1>
          <div ref={contentRef} className="prose prose-lg max-w-none text-[#4c4546] leading-[1.6]" style={expanded ? undefined : { maxHeight: maxHeight ? `${maxHeight}px` : undefined, overflow: 'hidden' }}>
             <p className="whitespace-pre-wrap">{project.description}</p>
          </div>
          {needsTruncate && (
            <div className="mt-6">
              <Button variant="ghost" onClick={() => setExpanded(prev => !prev)} className="text-[#7e7576]">{expanded ? 'Read less' : 'Read more'}</Button>
            </div>
          )}
        </div>
        <div className="w-full md:w-80 space-y-6">
          <div className="p-10 bg-white border border-[#E5E5E5] rounded-[3rem] shadow-none">
            <h3 className="text-xs font-bold text-[#7e7576] uppercase tracking-widest mb-6">Project Links</h3>
            <div className="space-y-4">
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noreferrer" className="flex items-center justify-between text-black hover:text-black font-semibold border-b border-transparent hover:border-black pb-0.5 transition-all group" onClick={(e) => e.stopPropagation()}>
                  <span className="flex items-center">{React.createElement(Icons.globe, { className: 'w-4 h-4 mr-2 text-black' })} Live Site</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"/>
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noreferrer" className="flex items-center justify-between text-black hover:text-black font-semibold border-b border-transparent hover:border-black pb-0.5 transition-all group" onClick={(e) => e.stopPropagation()}>
                  <span className="flex items-center">{React.createElement(SocialIcons.github, { className: 'w-4 h-4 mr-2 text-black' })} Source Code</span>
                   <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"/>
                </a>
              )}
              {project.demo_url && (
                <a href={project.demo_url} target="_blank" rel="noreferrer" className="flex items-center justify-between text-black hover:text-black font-semibold border-b border-transparent hover:border-black pb-0.5 transition-all group" onClick={(e) => e.stopPropagation()}>
                  <span className="flex items-center">{React.createElement(Icons.play, { className: 'w-4 h-4 mr-2 text-black' })} Demo</span>
                   <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"/>
                </a>
              )}
            </div>
          </div>
          <div className="p-10 bg-white border border-[#E5E5E5] rounded-[3rem] shadow-none">
            <h3 className="text-xs font-bold text-[#7e7576] uppercase tracking-widest mb-6">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.split(',').map(t => (
                <span key={t} className="px-3.5 py-1.5 bg-[#F2F2F2] rounded-full text-xs font-semibold text-black border border-transparent">{t.trim()}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {project.images && project.images.length > 0 && (
        <div className="mt-12 mb-8 border-t border-[#E5E5E5] pt-12">
          <h3 className="text-2xl font-extrabold text-black mb-6">Project Gallery</h3>
          <Gallery images={project.images} />
        </div>
      )}

    </main>
  );
};
