import React from 'react';
import { ArrowRight, Download, Briefcase, GraduationCap, Award, Star, Image as ImageIcon, Calendar, MapPin, Trophy, Quote, Linkedin, Compass, Sparkles } from 'lucide-react';
import Lightbox from '../components/Lightbox';
import { Button } from '../components/Button';
import { MetaTags } from '../components/MetaTags';
import { ViewState, ProfileDetail, Project, BlogPost, Skill, WorkExperience, Education, Certificate, Achievement, Testimonial, Image } from '../types';
import { getSocialIcon } from '../utils/helpers';
import { Icons, SocialIcons, IconName } from '../components/Icons';

interface HomeProps {
  profile: ProfileDetail | null;
  featuredProjects: Project[];
  blogPosts: BlogPost[];
  skills: Skill[];
  experience: WorkExperience[];
  education: Education[];
  certificates: Certificate[];
  achievements: Achievement[];
  testimonials: Testimonial[];
  galleryImages: Image[];
  onNavigate: (view: ViewState) => void;
}

const skillTypeLabels: Record<string, string> = {
  'language': 'Languages',
  'frontend-dev': 'Frontend Dev',
  'backend-dev': 'Backend Dev',
  'mobile-app-dev': 'Mobile Development',
  'ai-ml': 'AI / ML',
  'database': 'Databases',
  'data-visualization': 'Data Viz',
  'devops': 'DevOps & Infra',
  'baas': 'Backend Services',
  'frameworks': 'Frameworks',
  'testing': 'Testing & QA',
  'softwares': 'Tools & Software',
  'static-site-generator': 'Static Site Generators',
  'game-engine': 'Game Engines',
  'automation': 'Automation',
  'others': 'Other Skills'
};

export const Home: React.FC<HomeProps> = ({ 
  profile, featuredProjects, blogPosts, skills, 
  experience, education, certificates, achievements, testimonials,
  galleryImages,
  onNavigate 
}) => {
  const [lbOpen, setLbOpen] = React.useState(false);
  const [lbImages, setLbImages] = React.useState<{ src: string; alt?: string }[]>([]);

  const openSingle = (src: string, alt?: string) => {
    setLbImages([{ src, alt }]);
    setLbOpen(true);
  };

  // Filter & Slice home page elements
  const homeProjects = featuredProjects.filter((p) => p.show_on_home).slice(0, 3);
  const homeBlogPosts = blogPosts.filter(b => b.show_on_home).slice(0, 3);
  const homeExperience = experience.filter(e => e.show_on_home).slice(0, 3);
  const homeEducation = education.filter(e => e.show_on_home).slice(0, 2);
  const homeTestimonials = testimonials.filter(t => t.show_on_home).slice(0, 3);
  
  // Combine achievements and certificates for dynamic unified rendering
  const homeAwards = [
    ...certificates.filter(c => c.show_on_home).map(c => ({ ...c, type: 'certificate' as const })),
    ...achievements.filter(a => a.show_on_home).map(a => ({ ...a, type: 'achievement' as const }))
  ].sort((a, b) => new Date(b.date || (a as any).issue_date).getTime() - new Date(a.date || (b as any).issue_date).getTime())
   .slice(0, 4);

  const homeGallery = galleryImages.filter(img => img.show_on_home).slice(0, 6);

  // Group skills by category for modern grid visualization
  const skillsToRender = skills.filter(s => s.show_on_home || true); // fall back to all if none explicitly homepage configured
  const groupedSkills = skillsToRender.reduce((acc, skill) => {
    const type = skill.skill_type || 'others';
    if (!acc[type]) acc[type] = [];
    acc[type].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  // Sort groupings to put main tech components first
  const sortedSkillTypes = Object.keys(groupedSkills).sort((a, b) => {
    const priority = ['language', 'frontend-dev', 'backend-dev', 'ai-ml', 'database', 'devops'];
    const idxA = priority.indexOf(a);
    const idxB = priority.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": profile?.full_name || "Anurag Shankar Maurya",
    "jobTitle": profile?.headline,
    "description": profile?.bio,
    "image": profile?.profile_image,
    "url": window.location.origin,
    "email": profile?.email,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": profile?.location
    },
    "sameAs": profile?.social_links.map(l => l.url) || []
  };

  const hasTimelineData = homeExperience.length > 0 || homeEducation.length > 0;

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Decorative Premium Glow Blobs */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute top-[35%] right-[-10%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[20%] w-[450px] h-[450px] bg-blue-600/5 rounded-full blur-[130px] pointer-events-none animate-pulse-slow"></div>

      <main className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-36 relative z-10">
        <MetaTags 
          title={`${profile?.full_name || "Anurag Shankar Maurya"} | Portfolio`}
          description={profile?.bio}
          keywords={`portfolio, ${profile?.full_name}, ${profile?.headline}, developer, projects`}
          ogImage={profile?.profile_image}
          schemaData={schemaData}
        />

        {/* Hero Section - Always Visible */}
        <section className="min-h-[75vh] flex flex-col justify-center relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Bold Copy & Actions */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
              {profile?.available_for_hire && (
                <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400 w-fit shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-ping"></span>
                    Available for projects & hire
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.05] animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  Hi, I'm <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">{profile?.full_name || "Anurag Shankar Maurya"}</span>
                </h1>
                
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-300 tracking-tight animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
                  {profile?.headline}
                </h2>
              </div>

              <div className="prose prose-invert max-w-xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <p className="text-lg sm:text-xl text-slate-400 leading-relaxed font-light">
                  {profile?.bio}
                </p>
              </div>
              
              <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4"/>} onClick={() => onNavigate({ type: 'PROJECTS' })}>
                    Explore Portfolio
                  </Button>
                  {profile?.resume_url && (
                    <Button variant="secondary" onClick={() => window.open(profile.resume_url, '_blank')}>
                      <Download className="w-4 h-4 mr-2"/> Download Resume
                    </Button>
                  )}
                </div>

                {/* Dynamic Social Badges */}
                {profile?.social_links && profile.social_links.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 pt-2">
                    {profile.social_links.map((link, i) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="glass-card flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500/30"
                        style={{ animationDelay: `${0.5 + i * 0.05}s` }}
                      >
                        {getSocialIcon(link.platform, "w-4 h-4 text-blue-400/80")}
                        <span className="capitalize">{link.platform === 'twitter' ? 'X (Twitter)' : link.platform}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Premium Interactive Identity Card */}
            <div className="lg:col-span-5 flex justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="relative group w-full max-w-[380px] sm:max-w-[420px]">
                {/* Glow Backdrop */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                
                {/* ID Card Wrapper */}
                <div className="relative glass-card p-8 rounded-[2rem] border border-white/5 bg-zinc-950/60 backdrop-blur-xl flex flex-col space-y-6">
                  {/* Photo Frame */}
                  <div className="relative self-center w-40 h-40 sm:w-48 sm:h-48 rounded-[1.75rem] overflow-hidden border border-white/10 shadow-2xl group/photo cursor-pointer" onClick={() => profile?.profile_image && openSingle(profile.profile_image, profile.full_name)}>
                    <img 
                      src={profile?.profile_image || 'https://placehold.co/400x400/18181b/FFF?text=Avatar'} 
                      alt={profile?.full_name} 
                      className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-500" 
                      fetchPriority="high"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-end justify-center pb-3">
                      <span className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5"/> View Photo
                      </span>
                    </div>
                  </div>

                  {/* Identification Details */}
                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-bold text-white tracking-tight">{profile?.full_name}</h3>
                    <p className="text-sm text-blue-400 font-medium">{profile?.current_role} @ {profile?.current_company}</p>
                    {profile?.location && (
                      <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" /> {profile.location}
                      </p>
                    )}
                  </div>

                  {/* Core Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div className="glass-card p-4 rounded-2xl text-center border-white/[0.02]">
                      <div className="text-2xl sm:text-3xl font-extrabold text-white">{profile?.years_of_experience || 0}+</div>
                      <div className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Years Exp.</div>
                    </div>
                    <div className="glass-card p-4 rounded-2xl text-center border-white/[0.02]">
                      <div className="text-2xl sm:text-3xl font-extrabold text-white">{featuredProjects.length}+</div>
                      <div className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Projects</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Featured Projects Section - Conditional */}
        {homeProjects.length > 0 && (
          <section className="space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                 <h2 className="text-3xl font-bold text-white tracking-tight">Featured Work</h2>
                 <p className="text-slate-400 text-sm mt-1">A curated showcase of engineering excellence and product design.</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onNavigate({ type: 'PROJECTS' })}>
                View All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {homeProjects.map((project, index) => (
                <div 
                  key={project.id} 
                  className="group glass-card rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 cursor-pointer flex flex-col"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => onNavigate({ type: 'PROJECT_DETAIL', slug: project.slug })}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') onNavigate({ type: 'PROJECT_DETAIL', slug: project.slug }); }}
                >
                  <div className="aspect-video bg-black/50 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <img src={project.featured_image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />

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
                          onClick={(e) => { e.stopPropagation(); const imgs = [{ src: project.featured_image, alt: project.title }, ...(project.images?.map((i) => ({ src: i.image_url, alt: i.alt_text, caption: i.caption })) || [])]; setLbImages(imgs); setLbOpen(true); }}
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
                      {project.technologies.split(',').length > 3 && (
                        <span className="px-2 py-1 text-xs text-gray-400 bg-white/5 rounded-md border border-dashed border-white/20">
                          +{project.technologies.split(',').length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Technical Arsenal Section - Conditional */}
        {skills.length > 0 && (
          <section className="space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
               <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Technical Arsenal</h2>
                  <p className="text-slate-400 text-sm mt-1">A dynamic directory of tools, frameworks, and programming paradigms.</p>
               </div>
               <Button variant="ghost" size="sm" onClick={() => onNavigate({ type: 'SKILLS' })}>
                View All
              </Button>
            </div>

            {/* Categorized Skills Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedSkillTypes.map((type) => {
                const group = groupedSkills[type];
                if (!group || group.length === 0) return null;
                return (
                  <div key={type} className="glass-card p-6 rounded-2xl border border-white/5 bg-zinc-950/20 backdrop-blur-md flex flex-col space-y-4">
                    <h3 className="text-md font-bold text-blue-400 tracking-wider uppercase border-b border-white/5 pb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400/80" />
                      {skillTypeLabels[type] || type}
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {group.map((skill) => {
                        const IconComponent = Icons[skill.name.toLowerCase().replace(/[\s\.\-\+]/g, '') as IconName] || Icons.skills;
                        return (
                          <div 
                            key={skill.id} 
                            onClick={() => onNavigate({ type: 'SKILL_DETAIL', slug: skill.slug })}
                            className="glass-card flex items-center gap-2 px-3 py-1.5 rounded-xl text-slate-300 hover:text-white border-white/[0.03] hover:border-blue-500/30 transition-all duration-300 hover:bg-blue-500/[0.03] cursor-pointer"
                          >
                            <IconComponent className="w-4 h-4 text-slate-400" />
                            <span className="text-xs font-semibold">{skill.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Unified Timeline of Impact - Conditional */}
        {hasTimelineData && (
          <section className="space-y-12">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-3xl font-bold text-white tracking-tight">Timeline of Impact</h2>
              <p className="text-slate-400 text-sm">A linear narrative of my professional milestones and academic credentials.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
              {/* Decorative Timeline Center Thread */}
              <div className="absolute top-8 bottom-8 left-4 lg:left-1/2 w-0.5 bg-gradient-to-b from-blue-500/30 via-purple-500/20 to-transparent pointer-events-none hidden lg:block transform -translate-x-1/2"></div>

              {/* Left Column: Work Experience */}
              <div className="lg:col-span-6 space-y-8">
                {homeExperience.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400"><Briefcase className="w-5 h-5"/></div>
                        <h3 className="text-xl font-bold text-white">Experience</h3>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => onNavigate({ type: 'EXPERIENCE' })}>View All</Button>
                    </div>
                    
                    <div className="space-y-4">
                      {homeExperience.map((exp) => (
                        <div 
                          key={exp.id} 
                          className="glass-card p-5 rounded-2xl border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/[0.01] transition-all duration-300 cursor-pointer flex gap-4" 
                          onClick={() => onNavigate({ type: 'EXPERIENCE_DETAIL', id: exp.id })}
                        >
                           <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-lg">
                              {exp.company_logo ? <img src={exp.company_logo} alt={exp.company_name} className="w-8 h-8 object-contain" loading="lazy" /> : <Briefcase className="w-6 h-6 text-slate-500"/>}
                           </div>
                           <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="text-white font-bold truncate text-base">{exp.job_title}</h4>
                                <span className="shrink-0 text-[10px] font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded-md mt-0.5">
                                  {new Date(exp.start_date).getFullYear()} - {exp.is_current ? 'Present' : exp.end_date ? new Date(exp.end_date).getFullYear() : ''}
                                </span>
                              </div>
                              <p className="text-blue-400 font-semibold text-xs truncate mt-0.5">{exp.company_name}</p>
                              <p className="text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed">{exp.description}</p>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Education & Qualifications */}
              <div className="lg:col-span-6 space-y-8">
                {homeEducation.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400"><GraduationCap className="w-5 h-5"/></div>
                        <h3 className="text-xl font-bold text-white">Education</h3>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => onNavigate({ type: 'EDUCATION' })}>View All</Button>
                    </div>
                    
                    <div className="space-y-4">
                      {homeEducation.map((edu) => (
                        <div 
                          key={edu.id} 
                          className="glass-card p-5 rounded-2xl border border-white/5 hover:border-purple-500/30 hover:bg-purple-500/[0.01] transition-all duration-300 cursor-pointer flex gap-4" 
                          onClick={() => onNavigate({ type: 'EDUCATION_DETAIL', slug: edu.slug })}
                        >
                           <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-lg">
                              {edu.logo ? <img src={edu.logo} alt={edu.institution} className="w-8 h-8 object-contain" loading="lazy" /> : <GraduationCap className="w-6 h-6 text-slate-500"/>}
                           </div>
                           <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="text-white font-bold truncate text-base">{edu.degree}</h4>
                                <span className="shrink-0 text-[10px] font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded-md mt-0.5">
                                  Class of {new Date(edu.end_date || edu.start_date).getFullYear()}
                                </span>
                              </div>
                              <p className="text-purple-400 font-semibold text-xs truncate mt-0.5">{edu.institution}</p>
                              <p className="text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed">{edu.description}</p>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </section>
        )}

        {/* Awards, Testimonials & Gallery Layout - Conditional */}
        {(homeAwards.length > 0 || homeTestimonials.length > 0 || homeGallery.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Awards & Testimonials Column */}
            <div className="lg:col-span-5 space-y-12">
               {/* Awards Section */}
               {homeAwards.length > 0 && (
                 <section className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500"><Award className="w-5 h-5"/></div>
                        <h2 className="text-xl font-bold text-white">Awards & Honors</h2>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => onNavigate({ type: 'CERTIFICATES' })}>View All</Button>
                    </div>

                    <div className="space-y-3">
                       {homeAwards.slice(0, 3).map((award: any) => (
                         <div 
                           key={award.id} 
                           className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition-all duration-300 cursor-pointer" 
                           onClick={() => onNavigate({ type: award.type === 'certificate' ? 'CERTIFICATE_DETAIL' : 'ACHIEVEMENT_DETAIL', slug: award.slug })}
                         >
                            <div className={`w-10 h-10 rounded-lg ${award.type === 'certificate' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                               {award.type === 'certificate' ? <Award className="w-5 h-5"/> : <Trophy className="w-5 h-5"/>}
                            </div>
                            <div className="min-w-0 flex-1">
                               <div className="text-white font-semibold truncate text-sm leading-tight group-hover:text-blue-400 transition-colors">{award.title}</div>
                               <div className="text-slate-500 text-xs truncate mt-0.5">{award.issuing_organization || award.issuer}</div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </section>
               )}

               {/* Testimonials Section */}
               {homeTestimonials.length > 0 && (
                 <section className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/10 rounded-xl text-orange-400"><Star className="w-5 h-5"/></div>
                        <h2 className="text-xl font-bold text-white">Endorsements</h2>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => onNavigate({ type: 'TESTIMONIALS' })}>View All</Button>
                    </div>

                    <div className="space-y-4">
                       {homeTestimonials.map((testimonial) => (
                         <div 
                           key={testimonial.id} 
                           className="glass-card p-6 rounded-2xl border-white/5 hover:border-orange-500/20 hover:bg-orange-500/[0.01] transition-all duration-300 cursor-pointer group flex flex-col space-y-4" 
                           onClick={() => onNavigate({ type: 'TESTIMONIAL_DETAIL', slug: testimonial.slug || String(testimonial.id) })}
                         >
                            {/* Stars */}
                            <div className="flex justify-between items-center">
                               <div className="flex gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`w-3.5 h-3.5 ${i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} 
                                    />
                                  ))}
                               </div>
                               <div className="text-[9px] font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">
                                  {new Date(testimonial.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                </div>
                            </div>

                            <div className="relative">
                              <Quote className="absolute -top-1 -left-1 w-5 h-5 text-white/5 transform -scale-x-100" />
                              <p className="text-slate-400 text-xs pl-4 border-l border-white/10 group-hover:border-orange-500/30 line-clamp-3 leading-relaxed transition-colors">
                                 {testimonial.content}
                              </p>
                            </div>

                            <div className="pt-3 border-t border-white/5 flex items-center gap-3 mt-auto">
                              <img 
                                src={testimonial.author_image} 
                                alt={testimonial.author_name} 
                                className="w-8 h-8 rounded-full object-cover bg-white/10 ring-2 ring-white/5"
                                loading="lazy"
                              />
                              <div className="flex-1 min-w-0">
                                 <div className="flex items-center justify-between">
                                    <div className="font-bold text-white text-xs truncate group-hover:text-orange-400 transition-colors">{testimonial.author_name}</div>
                                    {testimonial.linkedin_url && <Linkedin className="w-3 h-3 text-blue-400/50 group-hover:text-blue-400 shrink-0 transition-opacity" />}
                                 </div>
                                 <div className="text-[10px] text-slate-500 truncate leading-normal">{testimonial.author_title}</div>
                                 {testimonial.author_company && <div className="text-[9px] text-orange-400/80 font-bold truncate mt-0.5">{testimonial.author_company}</div>}
                              </div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </section>
               )}
            </div>

            {/* Gallery Column */}
            <div className="lg:col-span-7">
               {homeGallery.length > 0 && (
                 <section className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-pink-500/10 rounded-xl text-pink-400"><ImageIcon className="w-5 h-5"/></div>
                        <h2 className="text-xl font-bold text-white">Visual Log</h2>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => onNavigate({ type: 'GALLERY' })}>View All</Button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                       {homeGallery.map((img) => (
                         <div 
                           key={img.id} 
                           className="aspect-square rounded-xl overflow-hidden glass-card group cursor-pointer border border-white/5" 
                           onClick={() => openSingle(img.image_url, img.alt_text)}
                         >
                            <img 
                              src={img.image_url} 
                              alt={img.alt_text} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                              loading="lazy"
                            />
                         </div>
                       ))}
                    </div>
                 </section>
               )}
            </div>

          </div>
        )}

        <Lightbox images={lbImages} isOpen={lbOpen} onClose={() => setLbOpen(false)} />

        {/* Latest Insights Section - Conditional */}
        {blogPosts.length > 0 && (
          <section className="space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Latest Insights</h2>
                <p className="text-slate-400 text-sm mt-1">Articles, deep dives, and technical investigations.</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onNavigate({ type: 'BLOG' })}>
                View All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {homeBlogPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="group cursor-pointer glass-card rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 bg-zinc-950/20 border border-white/5 flex flex-col" 
                  onClick={() => onNavigate({ type: 'BLOG_DETAIL', slug: post.slug })}
                >
                  <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4 relative bg-zinc-900/60">
                     <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                     <button 
                       onClick={(e) => { e.stopPropagation(); openSingle(post.featured_image || 'https://placehold.co/600x400/18181b/FFF?text=Blog', post.title); }} 
                       className="w-full h-full block"
                     >
                       <img 
                         src={post.featured_image || 'https://placehold.co/600x400/18181b/FFF?text=Blog'} 
                         alt={post.title} 
                         className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 cursor-pointer" 
                         loading="lazy"
                       />
                     </button>
                  </div>
                  <div className="px-1 flex flex-col flex-grow">
                    <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-2">{post.category.name}</div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">{post.title}</h3>
                    <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mb-4">{post.excerpt}</p>
                    
                    <div className="text-[10px] text-slate-500 font-semibold mt-auto flex items-center gap-3 pt-3 border-t border-white/5">
                      <span>{new Date(post.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                      <span>{post.reading_time} min read</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
