import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
import { ViewState } from './types';
import { usePortfolioData } from './hooks/usePortfolioData';
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';

// Components
import { Layout } from './components/Layout';
import { ReducedMotionWrapper } from './components/PageTransition';

// Lazy Loaded Pages
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const ProjectsView = lazy(() => import('./pages/Projects').then(m => ({ default: m.ProjectsView })));
const ProjectDetailView = lazy(() => import('./pages/Projects').then(m => ({ default: m.ProjectDetailView })));
const BlogView = lazy(() => import('./pages/Blog').then(m => ({ default: m.BlogView })));
const BlogDetailView = lazy(() => import('./pages/Blog').then(m => ({ default: m.BlogDetailView })));
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
  <div className="min-h-screen bg-background text-slate-100 flex flex-col justify-center pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 animate-pulse">
    {/* Header / Hero skeleton */}
    <div className="space-y-6">
      <div className="h-6 w-44 bg-white/5 rounded-full" />
      <div className="h-16 w-3/4 sm:w-1/2 bg-white/10 rounded-2xl" />
      <div className="h-8 w-2/3 sm:w-1/3 bg-white/5 rounded-xl" />
      <div className="space-y-3 pt-2">
        <div className="h-4 w-full sm:w-2/3 bg-white/5 rounded-lg" />
        <div className="h-4 w-5/6 sm:w-1/2 bg-white/5 rounded-lg" />
      </div>
      <div className="flex gap-4 pt-4">
        <div className="h-12 w-36 bg-white/10 rounded-xl" />
        <div className="h-12 w-36 bg-white/5 rounded-xl" />
      </div>
    </div>

    {/* Section grid skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="glass-card rounded-2xl overflow-hidden border border-white/5 flex flex-col space-y-4">
          <div className="aspect-video w-full bg-white/5" />
          <div className="p-6 space-y-3">
            <div className="h-6 w-3/4 bg-white/10 rounded-lg" />
            <div className="h-4 w-full bg-white/5 rounded-md" />
            <div className="h-4 w-2/3 bg-white/5 rounded-md" />
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-12 bg-white/5 rounded-md" />
              <div className="h-6 w-16 bg-white/5 rounded-md" />
              <div className="h-6 w-14 bg-white/5 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
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
      <ReducedMotionWrapper>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home profile={profile} featuredProjects={featuredProjects} blogPosts={blogPosts} skills={skills} experience={experience} education={education} certificates={certificates} achievements={achievements} testimonials={testimonials} galleryImages={images} onNavigate={navigateTo} />} />
            <Route path="/projects" element={<ProjectsView projects={projects} onNavigate={navigateTo} />} />
            <Route path="/projects/:slug" element={<ProjectDetailRoute />} />
            <Route path="/blog" element={<BlogView posts={blogPosts} onNavigate={navigateTo} />} />
            <Route path="/blog/:slug" element={<BlogDetailRoute />} />
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
      </ReducedMotionWrapper>
    </Layout>
  );
};

export default App;
