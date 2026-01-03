import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
import { ViewState } from './types';
import { usePortfolioData } from './hooks/usePortfolioData';
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';

// Components
import { Layout } from './components/Layout';

// Lazy Loaded Pages
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const ProjectsView = lazy(() => import('./pages/Projects').then(m => ({ default: m.ProjectsView })));
const ProjectDetailView = lazy(() => import('./pages/Projects').then(m => ({ default: m.ProjectDetailView })));
const BlogView = lazy(() => import('./pages/Blog').then(m => ({ default: m.BlogView })));
const BlogDetailView = lazy(() => import('./pages/Blog').then(m => ({ default: m.BlogDetailView })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const ExperienceView = lazy(() => import('./pages/Experience').then(m => ({ default: m.ExperienceView })));
const ExperienceDetailView = lazy(() => import('./pages/Experience').then(m => ({ default: m.ExperienceDetailView })));
const EducationView = lazy(() => import('./pages/Education').then(m => ({ default: m.EducationView })));
const EducationDetailView = lazy(() => import('./pages/Education').then(m => ({ default: m.EducationDetailView })));
const SkillsView = lazy(() => import('./pages/Skills').then(m => ({ default: m.SkillsView })));
const SkillDetailView = lazy(() => import('./pages/Skills').then(m => ({ default: m.SkillDetailView })));
const CertificatesView = lazy(() => import('./pages/Certificates').then(m => ({ default: m.CertificatesView })));
const CertificateDetailView = lazy(() => import('./pages/Certificates').then(m => ({ default: m.CertificateDetailView })));
const AchievementsView = lazy(() => import('./pages/Achievements').then(m => ({ default: m.AchievementsView })));
const AchievementDetailView = lazy(() => import('./pages/Achievements').then(m => ({ default: m.AchievementDetailView })));
const TestimonialsView = lazy(() => import('./pages/Testimonials').then(m => ({ default: m.TestimonialsView })));
const TestimonialDetailView = lazy(() => import('./pages/Testimonials').then(m => ({ default: m.TestimonialDetailView })));
const GalleryView = lazy(() => import('./pages/Gallery').then(m => ({ default: m.GalleryView })));

const LoadingFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <Loader2 className="w-8 h-8 text-primary animate-spin" />
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>({ type: 'HOME' });
  const { 
    loading, profile, projects, featuredProjects, blogPosts, 
    experience, education, certificates, achievements, testimonials, skills, images
  } = usePortfolioData();

  const navigateHook = useNavigate();
  const location = useLocation();

  const pathFromView = (v: ViewState) => {
    switch (v.type) {
      case 'HOME': return '/';
      case 'PROJECTS': return '/projects';
      case 'PROJECT_DETAIL': return `/projects/${v.slug}`;
      case 'BLOG': return '/blog';
      case 'BLOG_DETAIL': return `/blog/${v.slug}`;
      case 'ABOUT': return '/about';
      case 'EXPERIENCE': return '/experience';
      case 'EXPERIENCE_DETAIL': return `/experience/${v.id}`;
      case 'EDUCATION': return '/education';
      case 'EDUCATION_DETAIL': return `/education/${v.slug}`;
      case 'SKILLS': return '/skills';
      case 'SKILL_DETAIL': return `/skills/${v.slug}`;
      case 'CERTIFICATES': return '/certificates';
      case 'CERTIFICATE_DETAIL': return `/certificates/${v.slug}`;
      case 'ACHIEVEMENTS': return '/achievements';
      case 'ACHIEVEMENT_DETAIL': return `/achievements/${v.slug}`;
      case 'TESTIMONIALS': return '/testimonials';
      case 'TESTIMONIAL_DETAIL': return `/testimonials/${v.slug}`;
      case 'CONTACT': return '/contact';
      case 'GALLERY': return '/gallery';
      default: return '/';
    }
  };

  const getViewFromPath = (pathname: string): ViewState => {
    if (pathname === '/' || pathname === '') return { type: 'HOME' };
    if (pathname === '/projects') return { type: 'PROJECTS' };
    if (pathname.startsWith('/projects/')) return { type: 'PROJECT_DETAIL', slug: pathname.split('/')[2] };
    if (pathname === '/blog') return { type: 'BLOG' };
    if (pathname.startsWith('/blog/')) return { type: 'BLOG_DETAIL', slug: pathname.split('/')[2] };
    if (pathname === '/about') return { type: 'ABOUT' };
    if (pathname === '/contact') return { type: 'CONTACT' };
    if (pathname === '/experience') return { type: 'EXPERIENCE' };
    if (pathname.startsWith('/experience/')) return { type: 'EXPERIENCE_DETAIL', id: Number(pathname.split('/')[2]) };
    if (pathname === '/education') return { type: 'EDUCATION' };
    if (pathname.startsWith('/education/')) return { type: 'EDUCATION_DETAIL', slug: pathname.split('/')[2] };
    if (pathname === '/skills') return { type: 'SKILLS' };
    if (pathname.startsWith('/skills/')) return { type: 'SKILL_DETAIL', slug: pathname.split('/')[2] };
    if (pathname === '/certificates') return { type: 'CERTIFICATES' };
    if (pathname.startsWith('/certificates/')) return { type: 'CERTIFICATE_DETAIL', slug: pathname.split('/')[2] };
    if (pathname === '/achievements') return { type: 'ACHIEVEMENTS' };
    if (pathname.startsWith('/achievements/')) return { type: 'ACHIEVEMENT_DETAIL', slug: pathname.split('/')[2] };
    if (pathname === '/testimonials') return { type: 'TESTIMONIALS' };
    if (pathname.startsWith('/testimonials/')) return { type: 'TESTIMONIAL_DETAIL', slug: pathname.split('/')[2] };
    if (pathname === '/gallery') return { type: 'GALLERY' };
    return { type: 'HOME' };
  };

  useEffect(() => {
    setView(getViewFromPath(location.pathname));
  }, [location.pathname]);

  const navigateTo = (newView: ViewState) => {
    const path = pathFromView(newView);
    navigateHook(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setView(newView);
  };

  if (loading && !profile) {
    return <LoadingFallback />;
  }

  // small wrappers to extract params for detail routes
  const ProjectDetailRoute = () => { const { slug } = useParams(); if (!slug) return <div>Project not found</div>; return <ProjectDetailView slug={slug} onNavigate={navigateTo} />; };
  const BlogDetailRoute = () => { const { slug } = useParams(); if (!slug) return <div>Post not found</div>; return <BlogDetailView slug={slug} onNavigate={navigateTo} />; };
  const ExperienceDetailRoute = () => { const { id } = useParams(); if (!id) return <div>Not found</div>; return <ExperienceDetailView id={Number(id)} onNavigate={navigateTo} />; };
  const EducationDetailRoute = () => { const { slug } = useParams(); if (!slug) return <div>Not found</div>; return <EducationDetailView slug={slug} onNavigate={navigateTo} />; };
  const SkillDetailRoute = () => { const { slug } = useParams(); if (!slug) return <div>Not found</div>; return <SkillDetailView slug={slug} onNavigate={navigateTo} />; };
  const CertificateDetailRoute = () => { const { slug } = useParams(); if (!slug) return <div>Not found</div>; return <CertificateDetailView slug={slug} onNavigate={navigateTo} />; };
  const AchievementDetailRoute = () => { const { slug } = useParams(); if (!slug) return <div>Not found</div>; return <AchievementDetailView slug={slug} onNavigate={navigateTo} />; };
  const TestimonialDetailRoute = () => { const { slug } = useParams(); if (!slug) return <div>Not found</div>; return <TestimonialDetailView slug={slug} onNavigate={navigateTo} />; };

  return (
    <Layout view={view} onNavigate={navigateTo} profile={profile}>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home profile={profile} featuredProjects={featuredProjects} blogPosts={blogPosts} skills={skills} experience={experience} education={education} certificates={certificates} achievements={achievements} testimonials={testimonials} galleryImages={images} onNavigate={navigateTo} />} />
          <Route path="/projects" element={<ProjectsView projects={projects} onNavigate={navigateTo} />} />
          <Route path="/projects/:slug" element={<ProjectDetailRoute />} />
          <Route path="/blog" element={<BlogView posts={blogPosts} onNavigate={navigateTo} />} />
          <Route path="/blog/:slug" element={<BlogDetailRoute />} />
          <Route path="/about" element={<About profile={profile} experience={experience} onNavigate={navigateTo} />} />
          <Route path="/contact" element={<Contact profile={profile} />} />
          <Route path="/experience" element={<ExperienceView experience={experience} onNavigate={navigateTo} />} />
          <Route path="/experience/:id" element={<ExperienceDetailRoute />} />
          <Route path="/education" element={<EducationView education={education} onNavigate={navigateTo} />} />
          <Route path="/education/:slug" element={<EducationDetailRoute />} />
          <Route path="/skills" element={<SkillsView skills={skills} onNavigate={navigateTo} />} />
          <Route path="/skills/:slug" element={<SkillDetailRoute />} />
          <Route path="/certificates" element={<CertificatesView certificates={certificates} onNavigate={navigateTo} />} />
          <Route path="/certificates/:slug" element={<CertificateDetailRoute />} />
          <Route path="/achievements" element={<AchievementsView achievements={achievements} onNavigate={navigateTo} />} />
          <Route path="/achievements/:slug" element={<AchievementDetailRoute />} />
          <Route path="/testimonials" element={<TestimonialsView testimonials={testimonials} onNavigate={navigateTo} />} />
          <Route path="/testimonials/:slug" element={<TestimonialDetailRoute />} />
          <Route path="/gallery" element={<GalleryView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default App;
