import React from 'react';
import { ArrowRight, Download, Briefcase, GraduationCap, Award, Star, Image as ImageIcon, Calendar, MapPin, Trophy } from 'lucide-react';
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

  // Filtering and slicing for home page display
  const homeProjects = featuredProjects.filter((p) => p.show_on_home).slice(0, 4);
  const homeBlogPosts = blogPosts.slice(0, 3);
  const homeExperience = experience.filter(e => e.show_on_home).slice(0, 3);
  const homeEducation = education.filter(e => e.show_on_home).slice(0, 2);
  const homeTestimonials = testimonials.filter(t => t.show_on_home).slice(0, 3);
  
  // Combine awards and certs for a unified section
  const homeAwards = [
    ...certificates.filter(c => c.show_on_home).map(c => ({ ...c, type: 'certificate' as const })),
    ...achievements.filter(a => a.show_on_home).map(a => ({ ...a, type: 'achievement' as const }))
  ].sort((a, b) => new Date(b.date || (a as any).issue_date).getTime() - new Date(a.date || (b as any).issue_date).getTime())
   .slice(0, 4);

  const homeGallery = galleryImages.filter(img => img.show_on_home).slice(0, 6);

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

  return (
    <main className="pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-32">
      <MetaTags 
        title={`${profile?.full_name || "Anurag Shankar Maurya"} | Portfolio`}
        description={profile?.bio}
        keywords={`portfolio, ${profile?.full_name}, ${profile?.headline}, developer, projects`}
        ogImage={profile?.profile_image}
        schemaData={schemaData}
      />
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
      <section className="animate-fade-in-up">
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
          {homeProjects.map((project) => (
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

      {/* Skills Marquee */}
      <section className="animate-fade-in-up">
        <div className="flex items-end justify-between mb-10">
           <h2 className="text-3xl font-bold text-white mb-2 text-center w-full md:w-auto">Technical Arsenal</h2>
           <Button variant="ghost" className="hidden md:flex" onClick={() => onNavigate({ type: 'SKILLS' })} rightIcon={<ArrowRight className="w-4 h-4"/>}>
            View All Skills
          </Button>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {skills.slice(0, 15).map((skill, index) => (
            <div key={skill.id} 
              className="glass-card flex items-center gap-2 px-4 py-2 rounded-full text-gray-300 hover:text-white hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer"
              onClick={() => onNavigate({ type: 'SKILL_DETAIL', slug: skill.slug })}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {(() => {
                const IconComponent = Icons[skill.name.toLowerCase().replace(/[\s\.\-\+]/g, '') as IconName] || Icons.skills;
                return <IconComponent className="w-4 h-4" />;
              })()}
              <span className="text-sm font-medium">{skill.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Experience & Education */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Experience */}
        {homeExperience.length > 0 && (
          <section className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Briefcase className="w-5 h-5"/></div>
                <h2 className="text-2xl font-bold text-white">Experience</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onNavigate({ type: 'EXPERIENCE' })}>View All</Button>
            </div>
            <div className="space-y-4">
              {homeExperience.map((exp) => (
                <div key={exp.id} className="glass-card p-4 rounded-xl flex gap-4 hover:border-blue-500/30 transition-colors cursor-pointer" onClick={() => onNavigate({ type: 'EXPERIENCE_DETAIL', id: exp.id })}>
                   <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      {exp.company_logo ? <img src={exp.company_logo} alt={exp.company_name} className="w-8 h-8 object-contain" /> : <Briefcase className="w-6 h-6 text-gray-500"/>}
                   </div>
                   <div className="min-w-0">
                      <h3 className="text-white font-bold truncate">{exp.job_title}</h3>
                      <p className="text-gray-400 text-sm truncate">{exp.company_name}</p>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3"/> {new Date(exp.start_date).getFullYear()} - {exp.is_current ? 'Present' : exp.end_date ? new Date(exp.end_date).getFullYear() : ''}
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {homeEducation.length > 0 && (
          <section className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><GraduationCap className="w-5 h-5"/></div>
                <h2 className="text-2xl font-bold text-white">Education</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onNavigate({ type: 'EDUCATION' })}>View All</Button>
            </div>
            <div className="space-y-4">
              {homeEducation.map((edu) => (
                <div key={edu.id} className="glass-card p-4 rounded-xl flex gap-4 hover:border-purple-500/30 transition-colors cursor-pointer" onClick={() => onNavigate({ type: 'EDUCATION_DETAIL', slug: edu.slug })}>
                   <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      {edu.logo ? <img src={edu.logo} alt={edu.institution} className="w-8 h-8 object-contain" /> : <GraduationCap className="w-6 h-6 text-gray-500"/>}
                   </div>
                   <div className="min-w-0">
                      <h3 className="text-white font-bold truncate">{edu.degree}</h3>
                      <p className="text-gray-400 text-sm truncate">{edu.institution}</p>
                      <div className="text-xs text-gray-500 mt-1">Class of {new Date(edu.end_date || edu.start_date).getFullYear()}</div>
                   </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Awards & Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Awards */}
        <div className="lg:col-span-5 space-y-12 animate-fade-in-up">
           <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500"><Award className="w-5 h-5"/></div>
                  <h2 className="text-2xl font-bold text-white">Certificates</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onNavigate({ type: 'CERTIFICATES' })}>View All</Button>
              </div>
              <div className="space-y-4">
                 {homeAwards.map((award: any) => (
                   <div key={award.id} className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer" onClick={() => onNavigate({ type: award.type === 'certificate' ? 'CERTIFICATE_DETAIL' : 'ACHIEVEMENT_DETAIL', slug: award.slug })}>
                      <div className={`w-10 h-10 rounded-lg ${award.type === 'certificate' ? 'bg-blue-500/10 text-blue-500' : 'bg-yellow-500/10 text-yellow-500'} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                         {award.type === 'certificate' ? <Award className="w-5 h-5"/> : <Trophy className="w-5 h-5"/>}
                      </div>
                      <div className="min-w-0">
                         <div className="text-white font-medium truncate text-sm">{award.title}</div>
                         <div className="text-gray-500 text-xs truncate">{award.issuing_organization || award.issuer}</div>
                      </div>
                   </div>
                 ))}
              </div>
           </section>

           {/* Testimonials Snippet */}
           {homeTestimonials.length > 0 && (
             <section>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400"><Star className="w-5 h-5"/></div>
                    <h2 className="text-2xl font-bold text-white">Testimonials</h2>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => onNavigate({ type: 'TESTIMONIALS' })}>View All</Button>
                </div>
                <div className="relative">
                   <div className="glass-card p-6 rounded-2xl border-orange-500/20">
                      <div className="text-orange-400 mb-4 flex gap-1">
                         {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < homeTestimonials[0].rating ? 'fill-orange-400' : ''}`}/>)}
                      </div>
                      <p className="text-gray-300 italic text-sm line-clamp-3 mb-4">"{homeTestimonials[0].content}"</p>
                      <div className="flex items-center gap-3">
                         <img src={homeTestimonials[0].author_image} alt={homeTestimonials[0].author_name} className="w-8 h-8 rounded-full object-cover" />
                         <div>
                            <div className="text-white text-xs font-bold">{homeTestimonials[0].author_name}</div>
                            <div className="text-gray-500 text-[10px]">{homeTestimonials[0].author_title}</div>
                         </div>
                      </div>
                   </div>
                </div>
             </section>
           )}
        </div>

        {/* Gallery */}
        <div className="lg:col-span-7 animate-fade-in-up">
           <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400"><ImageIcon className="w-5 h-5"/></div>
                  <h2 className="text-2xl font-bold text-white">Gallery</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onNavigate({ type: 'GALLERY' })}>View More</Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                 {homeGallery.slice(0, 6).map((img) => (
                   <div key={img.id} className="aspect-square rounded-xl overflow-hidden glass-card group cursor-pointer" onClick={() => openSingle(img.data_uri || img.image_url, img.alt_text)}>
                      <img src={img.data_uri || img.image_url} alt={img.alt_text} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   </div>
                 ))}
              </div>
           </section>
        </div>
      </div>

      <Lightbox images={lbImages} isOpen={lbOpen} onClose={() => setLbOpen(false)} />

      {/* Latest Insights */}
      {blogPosts.length > 0 && (
        <section className="animate-fade-in-up">
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
            {homeBlogPosts.map((post) => (
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
