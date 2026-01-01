
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ViewState } from './types';
import { usePortfolioData } from './hooks/usePortfolioData';

// Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileNav } from './components/MobileNav';

// Pages
import { Home } from './pages/Home';
import { ProjectsView, ProjectDetailView } from './pages/Projects';
import { BlogView, BlogDetailView } from './pages/Blog';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { ExperienceView, ExperienceDetailView } from './pages/Experience';
import { EducationView, EducationDetailView } from './pages/Education';
import { SkillsView, SkillDetailView } from './pages/Skills';
import { AwardsView, CertificateDetailView, AchievementDetailView } from './pages/Awards';
import { TestimonialsView, TestimonialDetailView } from './pages/Testimonials';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>({ type: 'HOME' });
  const { 
    loading, profile, projects, featuredProjects, blogPosts, 
    experience, education, certificates, achievements, testimonials, skills 
  } = usePortfolioData();

  const navigateTo = (newView: ViewState) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setView(newView);
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const renderContent = () => {
    switch (view.type) {
      case 'HOME':
        return <Home profile={profile} featuredProjects={featuredProjects} blogPosts={blogPosts} skills={skills} onNavigate={navigateTo} />;
      case 'PROJECTS':
        return <ProjectsView projects={projects} onNavigate={navigateTo} />;
      case 'PROJECT_DETAIL':
        return <ProjectDetailView slug={view.slug} onNavigate={navigateTo} />;
      case 'BLOG':
        return <BlogView posts={blogPosts} onNavigate={navigateTo} />;
      case 'BLOG_DETAIL':
        return <BlogDetailView slug={view.slug} onNavigate={navigateTo} />;
      case 'ABOUT':
        return <About profile={profile} experience={experience} onNavigate={navigateTo} />;
      case 'EXPERIENCE':
        return <ExperienceView experience={experience} onNavigate={navigateTo} />;
      case 'EXPERIENCE_DETAIL':
        return <ExperienceDetailView id={view.id} onNavigate={navigateTo} />;
      case 'EDUCATION':
        return <EducationView education={education} onNavigate={navigateTo} />;
      case 'EDUCATION_DETAIL':
        return <EducationDetailView slug={view.slug} onNavigate={navigateTo} />;
      case 'SKILLS':
        return <SkillsView skills={skills} onNavigate={navigateTo} />;
      case 'SKILL_DETAIL':
        return <SkillDetailView slug={view.slug} onNavigate={navigateTo} />;
      case 'AWARDS_CERTS':
        return <AwardsView certificates={certificates} achievements={achievements} onNavigate={navigateTo} />;
      case 'CERTIFICATE_DETAIL':
        return <CertificateDetailView slug={view.slug} onNavigate={navigateTo} />;
      case 'ACHIEVEMENT_DETAIL':
        return <AchievementDetailView slug={view.slug} onNavigate={navigateTo} />;
      case 'TESTIMONIALS':
        return <TestimonialsView testimonials={testimonials} onNavigate={navigateTo} />;
      case 'TESTIMONIAL_DETAIL':
        return <TestimonialDetailView slug={view.slug} onNavigate={navigateTo} />;
      case 'CONTACT':
        return <Contact profile={profile} />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background text-white selection:bg-blue-500/30 font-sans flex flex-col relative z-10 overflow-hidden">
      {/* Ambient Background Blobs (placed behind content but above page background) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
         <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-blob"></div>
         <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
         <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <Header view={view} onNavigate={navigateTo} profile={profile} />
      
      <div className="relative z-10 animate-fade-in">
        {renderContent()}
      </div>
      
      <MobileNav currentView={view} onNavigate={navigateTo} />
      <Footer profile={profile} />
    </div>
  );
};

export default App;
