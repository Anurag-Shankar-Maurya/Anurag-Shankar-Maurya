
import React from 'react';
import { ArrowRight, Download } from 'lucide-react';
import Lightbox from '../components/Lightbox';
import { Button } from '../components/Button';
import { ViewState, ProfileDetail, Project, BlogPost, Skill } from '../types';
import { getSocialIcon } from '../utils/helpers';
import { Icons, SocialIcons } from '../components/Icons';

interface HomeProps {
  profile: ProfileDetail | null;
  featuredProjects: Project[];
  blogPosts: BlogPost[];
  skills: Skill[];
  onNavigate: (view: ViewState) => void;
}

export const Home: React.FC<HomeProps> = ({ profile, featuredProjects, blogPosts, skills, onNavigate }) => {
  const [lbOpen, setLbOpen] = React.useState(false);
  const [lbImages, setLbImages] = React.useState<{ src: string; alt?: string }[]>([]);

  const openSingle = (src: string, alt?: string) => {
    setLbImages([{ src, alt }]);
    setLbOpen(true);
  };

  return (
    <main className="pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-32">
      {/* Hero */}
      <section className="min-h-[70vh] flex flex-col justify-center">
        {profile?.available_for_hire && (
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400 mb-6 w-fit shadow-[0_0_10px_rgba(34,197,94,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              Available for new opportunities
            </div>
          </div>
        )}
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1] animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {profile?.headline.split(' ').map((word, i) => (
            <span key={i} className={`inline-block mr-3 ${i > 2 ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400" : ""}`}>
              {word} 
            </span>
          ))}
        </h1>
        
        <div className="prose prose-invert max-w-2xl mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <p className="text-xl text-gray-400 leading-relaxed font-light">
            {profile?.bio}
          </p>
        </div>
        
        <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4"/>} onClick={() => onNavigate({ type: 'PROJECTS' })}>
              View Work
            </Button>
            {profile?.resume_url && (
              <Button variant="secondary" onClick={() => window.open(profile.resume_url, '_blank')}>
                <Download className="w-4 h-4 mr-2"/> Resume
              </Button>
            )}
          </div>

          {/* Dynamic Social Pills */}
          {profile?.social_links && profile.social_links.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {profile.social_links.map((link, i) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-card flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-400 hover:text-white transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${0.5 + i * 0.05}s` }}
                >
                  {getSocialIcon(link.platform, "w-4 h-4")}
                  <span className="capitalize">{link.platform === 'twitter' ? 'X (Twitter)' : link.platform}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <div className="flex items-end justify-between mb-10">
          <div>
             <h2 className="text-3xl font-bold text-white mb-2">Featured Work</h2>
             <p className="text-gray-400">Selected projects that define my expertise.</p>
          </div>
          <Button variant="ghost" onClick={() => onNavigate({ type: 'PROJECTS' })} rightIcon={<ArrowRight className="w-4 h-4"/>}>
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="group relative rounded-2xl glass-card overflow-hidden transition-all duration-500 hover:-translate-y-1 cursor-pointer"
              onClick={() => onNavigate({ type: 'PROJECT_DETAIL', slug: project.slug })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') onNavigate({ type: 'PROJECT_DETAIL', slug: project.slug }); }}
            >
              <div className="aspect-video w-full bg-black/50 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity"></div>

                <img src={project.featured_image || 'https://placehold.co/600x400/18181b/FFF?text=Project'} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />

                {/* Overlay icons */}
                <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
                  {project.live_url && (
                    <button onClick={(e) => { e.stopPropagation(); window.open(project.live_url, '_blank'); }} className="p-2 rounded-md bg-black/50 text-white hover:bg-black/60" aria-label={`Open live site for ${project.title}`}>
                      {React.createElement(Icons.globe, { className: 'w-4 h-4' })}
                    </button>
                  )}
                  {project.github_url && (
                    <button onClick={(e) => { e.stopPropagation(); window.open(project.github_url, '_blank'); }} className="p-2 rounded-md bg-black/50 text-white hover:bg-black/60" aria-label={`Open source for ${project.title}`}>
                      {React.createElement(SocialIcons.github, { className: 'w-4 h-4' })}
                    </button>
                  )}
                  {project.demo_url && (
                    <button onClick={(e) => { e.stopPropagation(); window.open(project.demo_url, '_blank'); }} className="p-2 rounded-md bg-black/50 text-white hover:bg-black/60" aria-label={`Open demo for ${project.title}`}>
                      {React.createElement(Icons.play, { className: 'w-4 h-4' })}
                    </button>
                  )}
                  {project.images && project.images.length > 0 && (
                    <button onClick={(e) => { e.stopPropagation(); const imgs = [{ src: project.featured_image, alt: project.title }, ...(project.images?.map((i) => ({ src: i.data_uri || i.image_url, alt: i.alt_text, caption: i.caption })) || [])]; setLbImages(imgs); setLbOpen(true); }} className="p-2 rounded-md bg-black/50 text-white hover:bg-black/60" aria-label={`Open gallery for ${project.title}`}>
                      {React.createElement(Icons.gallery, { className: 'w-4 h-4' })}
                    </button>
                  )}
                </div>

                <div className="absolute top-2 left-3 z-20 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-md text-xs font-medium text-white border border-white/10 capitalize shadow-lg">{project.status}</div>
              </div>
              <div className="p-6 relative z-20">
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{project.title}</h3>
                <p className="text-gray-400 mb-4 line-clamp-2">{project.short_description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.split(',').slice(0, 3).map((tech, i) => (
                    <span key={i} className="px-2.5 py-1 text-xs font-medium rounded-md bg-white/5 text-gray-300 border border-white/5">{tech.trim()}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Lightbox images={lbImages} isOpen={lbOpen} onClose={() => setLbOpen(false)} />

      {/* Skills Marquee */}
      <section className="animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
        <div className="flex items-end justify-between mb-10">
           <h2 className="text-3xl font-bold text-white mb-2 text-center w-full md:w-auto">Technical Arsenal</h2>
           <Button variant="ghost" className="hidden md:flex" onClick={() => onNavigate({ type: 'SKILLS' })} rightIcon={<ArrowRight className="w-4 h-4"/>}>
            View All Skills
          </Button>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {skills.slice(0, 15).map((skill, index) => (
            <div key={skill.id} 
              className="glass-card flex items-center gap-2 px-4 py-2 rounded-full text-gray-300 hover:text-white hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {skill.icon && <img src={skill.icon} className="w-4 h-4 object-contain" alt="" />}
              <span className="text-sm font-medium">{skill.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Insights */}
      {blogPosts.length > 0 && (
        <section className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Latest Insights</h2>
              <p className="text-gray-400">Thoughts on technology, design, and engineering.</p>
            </div>
            <Button variant="ghost" onClick={() => onNavigate({ type: 'BLOG' })} rightIcon={<ArrowRight className="w-4 h-4"/>}>
              Read Blog
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.slice(0, 3).map((post) => (
              <div key={post.id} className="group cursor-pointer glass-card rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1" onClick={() => onNavigate({ type: 'BLOG_DETAIL', slug: post.slug })}>
                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 relative">
                   <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                   <button onClick={(e) => { e.stopPropagation(); openSingle(post.featured_image || 'https://placehold.co/600x400/18181b/FFF?text=Blog', post.title); }} className="w-full h-full block">
                   <img src={post.featured_image || 'https://placehold.co/600x400/18181b/FFF?text=Blog'} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer" />
                </button>
                </div>
                <div className="px-2">
                  <div className="text-xs text-blue-400 font-medium mb-2 uppercase tracking-wider">{post.category.name}</div>
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors leading-snug">{post.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{post.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};
