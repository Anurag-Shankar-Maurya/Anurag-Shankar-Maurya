import React from 'react';

export interface SkeletonLoaderProps {
  type:
    | 'home'
    | 'projects-list'
    | 'project-detail'
    | 'blog-list'
    | 'blog-detail'
    | 'contact'
    | 'experience-list'
    | 'experience-detail'
    | 'education-list'
    | 'education-detail'
    | 'skills-list'
    | 'skill-detail'
    | 'certificates-list'
    | 'certificate-detail'
    | 'achievements-list'
    | 'achievement-detail'
    | 'testimonials-list'
    | 'testimonials-detail'
    | 'gallery'
    | 'gallery-grid';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type }) => {
  // Common light-theme pulsing elements
  const pulseBar = "bg-[#eeeeee] rounded-md animate-pulse";

  // 1. Home Page Skeleton - Matches Home.tsx exactly
  const HomeSkeleton = () => (
    <div className="relative overflow-hidden min-h-screen">
      <main className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-[120px] relative z-10 animate-pulse">
        {/* Hero Section */}
        <section className="min-h-[75vh] flex flex-col justify-center relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
              <div className="h-8 w-48 bg-[#eeeeee] border border-[#cfc4c5] rounded-full" />
              <div className="space-y-4">
                <div className="h-16 w-3/4 sm:w-2/3 bg-[#eeeeee] rounded-2xl" />
                <div className="h-8 w-1/2 bg-[#eeeeee] rounded-xl" />
              </div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-[#eeeeee] rounded-lg" />
                <div className="h-4 w-5/6 bg-[#eeeeee] rounded-lg" />
                <div className="h-4 w-4/5 bg-[#eeeeee] rounded-lg" />
              </div>
              <div className="space-y-6 pt-2">
                <div className="flex flex-wrap gap-4">
                  <div className="h-12 w-44 bg-[#eeeeee] rounded-full" />
                  <div className="h-12 w-48 bg-[#eeeeee] rounded-full" />
                </div>
                <div className="flex flex-wrap gap-2.5 pt-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-9 w-28 bg-[#eeeeee] border border-[#cfc4c5] rounded-full" />
                  ))}
                </div>
              </div>
            </div>
            {/* Right Hero ID Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative bg-white border border-[#E5E5E5] rounded-[3rem] p-8 shadow-none flex flex-col space-y-6 w-full max-w-[380px] sm:max-w-[420px]">
                <div className="self-center w-40 h-40 sm:w-48 sm:h-48 rounded-[2rem] bg-[#eeeeee] border border-[#E5E5E5]" />
                <div className="text-center space-y-2 flex flex-col items-center">
                  <div className="h-6 w-1/2 bg-[#eeeeee] rounded-md" />
                  <div className="h-4 w-2/3 bg-[#eeeeee] rounded-md" />
                  <div className="h-3.5 w-1/3 bg-[#eeeeee] rounded-md" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E5E5E5]">
                  <div className="bg-[#f9f9f9] border border-[#E5E5E5] rounded-[2.5rem] p-4 flex flex-col items-center space-y-2">
                    <div className="h-8 w-1/2 bg-[#eeeeee] rounded-md" />
                    <div className="h-3 w-3/4 bg-[#eeeeee] rounded-md" />
                  </div>
                  <div className="bg-[#f9f9f9] border border-[#E5E5E5] rounded-[2.5rem] p-4 flex flex-col items-center space-y-2">
                    <div className="h-8 w-1/2 bg-[#eeeeee] rounded-md" />
                    <div className="h-3 w-3/4 bg-[#eeeeee] rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="h-8 w-44 bg-[#eeeeee] rounded-lg" />
              <div className="h-4 w-72 bg-[#eeeeee] rounded-md" />
            </div>
            <div className="h-8 w-20 bg-[#eeeeee] rounded-full animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border border-[#E5E5E5] rounded-[3rem] p-10 flex flex-col shadow-none">
                <div className="aspect-video bg-[#F2F2F2] rounded-[2rem]" />
                <div className="pt-6 flex flex-col flex-grow space-y-4">
                  <div className="h-6 w-3/4 bg-[#eeeeee] rounded-md animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-[#eeeeee] rounded-md animate-pulse" />
                    <div className="h-4 w-5/6 bg-[#eeeeee] rounded-md animate-pulse" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <div className="h-6 w-16 bg-[#eeeeee] rounded-full animate-pulse" />
                    <div className="h-6 w-16 bg-[#eeeeee] rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );

  // 2. Projects List Skeleton - Matches ProjectsView in Projects.tsx exactly
  const ProjectsSkeleton = () => (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-pulse">
      <div className="h-10 w-64 bg-[#eeeeee] rounded-xl mb-4" />
      <div className="h-4 w-[500px] max-w-full bg-[#eeeeee] rounded-md mb-12" />
      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="h-12 w-full bg-[#eeeeee] rounded-full" />
      </div>
      {/* View Toggle */}
      <div className="mb-8 flex items-center justify-end">
        <div className="h-10 w-36 bg-[#eeeeee] rounded-full" />
      </div>
      {/* Status Filter */}
      <div className="mb-8 space-y-3">
        <div className="h-3.5 w-16 bg-[#eeeeee] rounded" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 w-20 bg-[#eeeeee] rounded-full" />
          ))}
        </div>
      </div>
      {/* Tech Filter */}
      <div className="mb-10 space-y-3">
        <div className="h-3.5 w-24 bg-[#eeeeee] rounded" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 w-16 bg-[#eeeeee] rounded-full" />
          ))}
        </div>
      </div>
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#E5E5E5] rounded-[3rem] p-10 flex flex-col shadow-none">
            <div className="aspect-video bg-[#F2F2F2] rounded-[2rem]" />
            <div className="pt-6 flex flex-col flex-grow space-y-4">
              <div className="h-6 w-3/4 bg-[#eeeeee] rounded" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-[#eeeeee] rounded" />
                <div className="h-4 w-2/3 bg-[#eeeeee] rounded" />
              </div>
              <div className="flex gap-2 pt-2">
                <div className="h-6 w-16 bg-[#eeeeee] rounded-full" />
                <div className="h-6 w-20 bg-[#eeeeee] rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );

  // 3. Project Detail Skeleton - Matches ProjectDetailView exactly
  const ProjectDetailSkeleton = () => (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-pulse">
      {/* Breadcrumb */}
      <div className="h-5 w-48 bg-[#eeeeee] rounded mb-6" />
      {/* Main image banner block */}
      <div className="bg-white border border-[#E5E5E5] p-4 rounded-[3rem] mb-12 shadow-none">
        <div className="w-full aspect-video bg-[#F2F2F2] rounded-[2rem]" />
      </div>
      {/* Content Columns */}
      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex-1 space-y-6">
          <div className="h-12 w-2/3 bg-[#eeeeee] rounded-xl" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-[#eeeeee] rounded" />
            <div className="h-4 w-full bg-[#eeeeee] rounded" />
            <div className="h-4 w-11/12 bg-[#eeeeee] rounded" />
            <div className="h-4 w-full bg-[#eeeeee] rounded" />
            <div className="h-4 w-5/6 bg-[#eeeeee] rounded" />
          </div>
        </div>
        <div className="w-full md:w-80 space-y-6">
          <div className="p-10 bg-white border border-[#E5E5E5] rounded-[3rem] space-y-6">
            <div className="h-3.5 w-1/3 bg-[#eeeeee] rounded" />
            <div className="space-y-4">
              <div className="h-5 w-full bg-[#eeeeee] rounded" />
              <div className="h-5 w-3/4 bg-[#eeeeee] rounded" />
            </div>
          </div>
          <div className="p-10 bg-white border border-[#E5E5E5] rounded-[3rem] space-y-4">
            <div className="h-3.5 w-1/3 bg-[#eeeeee] rounded" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-8 w-16 bg-[#eeeeee] rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );

  // 4. Blog Index Skeleton - Matches BlogView exactly
  const BlogSkeleton = () => (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-pulse">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-white border border-[#E5E5E5] rounded-[1.5rem] shrink-0">
          <div className="w-8 h-8 bg-[#eeeeee] rounded-lg" />
        </div>
        <div className="space-y-2">
          <div className="h-10 w-52 bg-[#eeeeee] rounded-xl" />
          <div className="h-4 w-80 bg-[#eeeeee] rounded" />
        </div>
      </div>
      {/* Search Bar */}
      <div className="mb-8 relative">
        <div className="h-12 w-full bg-[#eeeeee] rounded-full" />
      </div>
      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="space-y-2">
          <div className="h-3.5 w-16 bg-[#eeeeee] rounded" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-9 w-20 bg-[#eeeeee] rounded-full" />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3.5 w-12 bg-[#eeeeee] rounded" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 w-16 bg-[#eeeeee] rounded-full" />
            ))}
          </div>
        </div>
      </div>
      <div className="mb-8 flex items-center justify-end">
        <div className="h-10 w-36 bg-[#eeeeee] rounded-full" />
      </div>
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#E5E5E5] rounded-[3rem] p-10 flex flex-col space-y-6">
            <div className="aspect-video bg-[#F2F2F2] rounded-[2rem]" />
            <div className="flex flex-col flex-grow">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-4 w-16 bg-[#eeeeee] rounded" />
                <div className="h-4 w-16 bg-[#eeeeee] rounded" />
              </div>
              <h3 className="h-6 w-11/12 bg-[#eeeeee] rounded mb-3" />
              <p className="h-4 w-full bg-[#eeeeee] rounded mb-2" />
              <p className="h-4 w-5/6 bg-[#eeeeee] rounded mb-4" />
              <div className="mt-auto flex flex-wrap gap-2 pt-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="h-8 w-16 bg-[#eeeeee] rounded-full" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );

  // 5. Blog Detail Skeleton - Matches BlogDetailView exactly
  const BlogDetailSkeleton = () => (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto animate-pulse">
      {/* Breadcrumb */}
      <div className="h-5 w-44 bg-[#eeeeee] rounded mb-8" />
      <div className="mb-10 text-center flex flex-col items-center">
        <div className="h-8 w-24 bg-[#eeeeee] rounded-full mb-6" />
        <div className="h-12 w-11/12 bg-[#eeeeee] rounded-xl mb-6" />
        <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 w-16 bg-[#eeeeee] rounded-full" />
          ))}
        </div>
        <div className="flex items-center justify-center gap-6">
          <div className="h-5 w-28 bg-[#eeeeee] rounded" />
          <div className="h-5 w-20 bg-[#eeeeee] rounded" />
        </div>
      </div>
      {/* Cover banner image */}
      <div className="w-full rounded-[3rem] overflow-hidden bg-white border border-[#E5E5E5] p-4 mb-12 shadow-none">
        <div className="w-full aspect-video bg-[#F2F2F2] rounded-[2rem]" />
      </div>
      {/* Content body paragraphs */}
      <div className="space-y-4">
        <div className="h-4 w-full bg-[#eeeeee] rounded" />
        <div className="h-4 w-full bg-[#eeeeee] rounded" />
        <div className="h-4 w-11/12 bg-[#eeeeee] rounded" />
        <div className="h-4 w-full bg-[#eeeeee] rounded" />
        <div className="h-4 w-4/5 bg-[#eeeeee] rounded" />
        <br />
        <div className="h-4 w-full bg-[#eeeeee] rounded" />
        <div className="h-4 w-full bg-[#eeeeee] rounded" />
        <div className="h-4 w-5/6 bg-[#eeeeee] rounded" />
      </div>
    </main>
  );

  // 6. Contact Page Skeleton - Matches Contact.tsx exactly
  const ContactSkeleton = () => (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <div className="h-12 w-64 bg-[#eeeeee] rounded-xl mb-6" />
          <div className="space-y-3 mb-10">
            <div className="h-4 w-full bg-[#eeeeee] rounded" />
            <div className="h-4 w-5/6 bg-[#eeeeee] rounded" />
          </div>
          {/* Email / Location Cards */}
          <div className="space-y-8">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-white border border-[#E5E5E5] p-5 rounded-[2rem] flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-[#eeeeee]" />
                <div className="space-y-1.5 flex-grow">
                  <div className="h-3 w-16 bg-[#eeeeee] rounded" />
                  <div className="h-5 w-40 bg-[#eeeeee] rounded" />
                </div>
              </div>
            ))}
          </div>
          {/* Socials Connection */}
          <div className="mt-12 pt-10 border-t border-[#E5E5E5]">
            <div className="h-4 w-36 bg-[#eeeeee] rounded mb-6" />
            <div className="flex gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-12 h-12 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center p-3">
                  <div className="w-full h-full bg-[#eeeeee] rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Contact Form Wrapper */}
        <div className="bg-white border border-[#E5E5E5] rounded-[3rem] p-10 space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-16 bg-[#eeeeee] rounded" />
              <div className="h-12 w-full bg-[#eeeeee] rounded-full" />
            </div>
          ))}
          <div className="space-y-2">
            <div className="h-4 w-16 bg-[#eeeeee] rounded" />
            <div className="h-28 w-full bg-[#eeeeee] rounded-[2rem]" />
          </div>
          <div className="h-14 w-full bg-[#eeeeee] rounded-full" />
        </div>
      </div>
    </main>
  );

  // 7. Experience List Skeleton - Matches ExperienceView exactly
  const ExperienceListSkeleton = () => (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-pulse">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-white border border-[#E5E5E5] rounded-[1.5rem] shrink-0">
          <div className="w-8 h-8 bg-[#eeeeee] rounded-lg" />
        </div>
        <div className="space-y-2">
          <div className="h-10 w-48 bg-[#eeeeee] rounded-xl" />
          <div className="h-4 w-72 bg-[#eeeeee] rounded" />
        </div>
      </div>
      <div className="relative border-l border-[#E5E5E5] ml-6 space-y-16 pl-12">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-[53px] top-8 w-2.5 h-2.5 rounded-full bg-[#eeeeee] ring-4 ring-[#f9f9f9]" />
            <div className="bg-white border border-[#E5E5E5] p-10 rounded-[3rem] space-y-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#eeeeee] border border-[#E5E5E5]" />
                  <div className="space-y-2">
                    <div className="h-6 w-36 bg-[#eeeeee] rounded" />
                    <div className="h-4 w-24 bg-[#eeeeee] rounded" />
                  </div>
                </div>
                <div className="h-8 w-24 bg-[#eeeeee] rounded-full" />
              </div>
              <div className="h-4 w-full bg-[#eeeeee] rounded mb-2" />
              <div className="h-4 w-11/12 bg-[#eeeeee] rounded mb-6" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-7 w-16 bg-[#eeeeee] rounded-full animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );

  // 8. Experience Detail Skeleton - Matches ExperienceDetailView exactly
  const ExperienceDetailSkeleton = () => (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-pulse">
      {/* Back button */}
      <div className="h-10 w-28 bg-[#eeeeee] rounded-full mb-8" />
      <div className="bg-white border border-[#E5E5E5] rounded-[3rem] p-10 md:p-12 relative overflow-hidden shadow-none">
        <div className="flex flex-col md:flex-row gap-6 items-start justify-between mb-8 border-b border-[#E5E5E5] pb-8 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[1.5rem] bg-[#eeeeee] border border-[#E5E5E5]" />
            <div className="space-y-2">
              <div className="h-8 w-48 bg-[#eeeeee] rounded-lg" />
              <div className="h-6 w-36 bg-[#eeeeee] rounded-md" />
            </div>
          </div>
          <div className="space-y-2 text-right">
            <div className="h-8 w-44 bg-[#eeeeee] rounded-full inline-block" />
            <div className="h-4 w-28 bg-[#eeeeee] rounded ml-auto" />
          </div>
        </div>
        <div className="space-y-4 mb-10">
          <div className="h-5 w-28 bg-[#eeeeee] rounded" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-[#eeeeee] rounded" />
            <div className="h-4 w-full bg-[#eeeeee] rounded" />
            <div className="h-4 w-11/12 bg-[#eeeeee] rounded" />
          </div>
        </div>
        <div>
          <div className="h-3.5 w-32 bg-[#eeeeee] rounded mb-4" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 w-20 bg-[#eeeeee] rounded-full animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );

  // 9. Education List Skeleton - Matches EducationView exactly
  const EducationListSkeleton = () => (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-pulse">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-white border border-[#E5E5E5] rounded-[1.5rem] shrink-0">
          <div className="w-8 h-8 bg-[#eeeeee] rounded-lg" />
        </div>
        <div className="space-y-2">
          <div className="h-10 w-40 bg-[#eeeeee] rounded-xl" />
          <div className="h-4 w-72 bg-[#eeeeee] rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#E5E5E5] rounded-[3rem] p-10 shadow-none">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-[1.5rem] bg-[#eeeeee] border border-[#E5E5E5]" />
              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                  <div className="h-7 w-52 bg-[#eeeeee] rounded" />
                  <div className="h-8 w-24 bg-[#eeeeee] rounded-full" />
                </div>
                <div className="h-5 w-72 bg-[#eeeeee] rounded" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-[#eeeeee] rounded" />
                  <div className="h-4 w-5/6 bg-[#eeeeee] rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );

  // 10. Education Detail Skeleton - Matches EducationDetailView exactly
  const EducationDetailSkeleton = () => (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-pulse">
      {/* Back button */}
      <div className="h-10 w-28 bg-[#eeeeee] rounded-full mb-8" />
      <div className="bg-white border border-[#E5E5E5] rounded-[3rem] overflow-hidden shadow-none">
        <div className="h-48 bg-[#F2F2F2] border-b border-[#E5E5E5] relative">
          <div className="absolute bottom-0 left-8 transform translate-y-1/2 rounded-[1.5rem] bg-white border border-[#E5E5E5] p-1">
            <div className="w-24 h-24 rounded-[1.5rem] bg-[#eeeeee]" />
          </div>
        </div>
        <div className="pt-16 pb-12 px-8 md:px-12 space-y-6">
          <div className="h-8 w-64 bg-[#eeeeee] rounded-lg" />
          <div className="h-6 w-80 bg-[#eeeeee] rounded-md" />
          <div className="flex gap-6 border-b border-[#E5E5E5] pb-8">
            <div className="h-8 w-40 bg-[#eeeeee] rounded-full" />
          </div>
          <div className="space-y-4">
            <div className="h-5 w-32 bg-[#eeeeee] rounded" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-[#eeeeee] rounded" />
              <div className="h-4 w-full bg-[#eeeeee] rounded" />
              <div className="h-4 w-5/6 bg-[#eeeeee] rounded" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );

  // 11. Skills List Skeleton - Matches SkillsView exactly
  const SkillsListSkeleton = () => (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-pulse">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-white border border-[#E5E5E5] rounded-[1.5rem] shrink-0">
          <div className="w-8 h-8 bg-[#eeeeee] rounded-lg" />
        </div>
        <div className="space-y-2">
          <div className="h-10 w-48 bg-[#eeeeee] rounded-xl" />
          <div className="h-4 w-72 bg-[#eeeeee] rounded" />
        </div>
      </div>
      {Array.from({ length: 2 }).map((_, i) => (
        <section key={i} className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="h-7 w-32 bg-[#eeeeee] rounded" />
            <div className="h-5 w-20 bg-[#eeeeee] rounded-full" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, j) => (
              <div key={j} className="bg-white border border-[#E5E5E5] p-6 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 aspect-square shadow-none">
                <div className="w-14 h-14 rounded-full bg-[#eeeeee] border border-[#E5E5E5]" />
                <div className="space-y-1.5 text-center flex flex-col items-center w-full">
                  <div className="h-4 w-16 bg-[#eeeeee] rounded" />
                  <div className="h-5 w-14 bg-[#eeeeee] rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );

  // 12. Skill Detail Skeleton - Matches SkillDetailView exactly
  const SkillDetailSkeleton = () => (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center animate-pulse">
      {/* Back button */}
      <div className="h-10 w-32 bg-[#eeeeee] rounded-full mb-12 mx-auto" />
      <div className="bg-white border border-[#E5E5E5] rounded-[3rem] p-12 flex flex-col items-center shadow-none">
        <div className="w-28 h-28 rounded-full bg-[#eeeeee] border border-[#E5E5E5] mb-8" />
        <div className="h-10 w-44 bg-[#eeeeee] rounded-lg mb-6" />
        <div className="h-8 w-40 bg-[#eeeeee] rounded-full mb-10" />
        <div className="space-y-2 w-full max-w-md mx-auto">
          <div className="h-4 w-full bg-[#eeeeee] rounded" />
          <div className="h-4 w-full bg-[#eeeeee] rounded" />
          <div className="h-4 w-3/4 bg-[#eeeeee] rounded mx-auto" />
        </div>
      </div>
    </main>
  );

  // 13. Certificates List Skeleton - Matches CertificatesView exactly
  const CertificatesListSkeleton = () => (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto animate-pulse">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-white border border-[#E5E5E5] rounded-[1.5rem] shrink-0">
          <div className="w-8 h-8 bg-[#eeeeee] rounded-lg" />
        </div>
        <div className="space-y-2">
          <div className="h-10 w-40 bg-[#eeeeee] rounded-xl" />
          <div className="h-4 w-72 bg-[#eeeeee] rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#E5E5E5] rounded-[3rem] overflow-hidden shadow-none">
            <div className="h-40 bg-[#F2F2F2] border-b border-[#E5E5E5]" />
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="h-6 w-36 bg-[#eeeeee] rounded flex-1" />
                <div className="w-10 h-10 rounded-lg bg-[#eeeeee] border border-[#E5E5E5]" />
              </div>
              <div className="h-4 w-28 bg-[#eeeeee] rounded" />
              <div className="flex items-center justify-between pt-4 border-t border-[#E5E5E5]">
                <div className="h-4 w-16 bg-[#eeeeee] rounded" />
                <div className="h-4 w-12 bg-[#eeeeee] rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );

  // 14. Certificate Detail Skeleton - Matches CertificateDetailView exactly
  const CertificateDetailSkeleton = () => (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-pulse">
      {/* Back button */}
      <div className="h-10 w-28 bg-[#eeeeee] rounded-full mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="order-2 md:order-1 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#eeeeee] border border-[#E5E5E5]" />
            <div className="h-4 w-32 bg-[#eeeeee] rounded" />
          </div>
          <div className="h-12 w-3/4 bg-[#eeeeee] rounded-xl" />
          <div className="space-y-4 text-lg">
            <div className="h-4 w-44 bg-[#eeeeee] rounded" />
            <div className="h-4 w-52 bg-[#eeeeee] rounded" />
            <div className="p-4 bg-white border border-[#E5E5E5] rounded-xl space-y-2">
              <div className="h-4 w-full bg-[#eeeeee] rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-[#eeeeee] rounded animate-pulse" />
            </div>
            <div className="h-10 w-36 bg-[#eeeeee] rounded-full" />
          </div>
          <div className="pt-8 border-t border-[#E5E5E5] space-y-4">
            <div className="h-4 w-28 bg-[#eeeeee] rounded" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-8 w-16 bg-[#eeeeee] rounded-full animate-pulse" />
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#E5E5E5] p-2 rounded-[2rem] shadow-none order-1 md:order-2">
          <div className="w-full aspect-[4/3] bg-[#eeeeee] rounded-[1.5rem]" />
        </div>
      </div>
    </main>
  );

  // 15. Achievements List Skeleton - Matches AchievementsView exactly
  const AchievementsSkeleton = () => (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto animate-pulse">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-white border border-[#E5E5E5] rounded-[1.5rem] shrink-0">
          <div className="w-8 h-8 bg-[#eeeeee] rounded-lg" />
        </div>
        <div className="space-y-2">
          <div className="h-10 w-52 bg-[#eeeeee] rounded-xl" />
          <div className="h-4 w-72 bg-[#eeeeee] rounded" />
        </div>
      </div>
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#E5E5E5] flex flex-col md:flex-row md:items-center gap-8 rounded-[3rem] p-10 shadow-none">
            <div className="w-full md:w-56 h-36 md:h-32 rounded-[2rem] bg-[#eeeeee] border border-[#E5E5E5] flex-shrink-0" />
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="h-6 w-52 bg-[#eeeeee] rounded" />
                <div className="h-7 w-24 bg-[#eeeeee] rounded-full" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-4 w-28 bg-[#eeeeee] rounded" />
                <div className="h-4 w-20 bg-[#eeeeee] rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-[#eeeeee] rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-[#eeeeee] rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );

  // 16. Achievement Detail Skeleton - Matches AchievementDetailView exactly
  const AchievementDetailSkeleton = () => (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-pulse">
      {/* Back button */}
      <div className="h-10 w-32 bg-[#eeeeee] rounded-full mb-8" />
      <div className="bg-white border border-[#E5E5E5] rounded-[3rem] overflow-hidden mb-10 shadow-none">
        <div className="w-full h-80 bg-[#F2F2F2] border-b border-[#E5E5E5]" />
        <div className="p-10 md:p-12 space-y-6">
          <div className="h-8 w-24 bg-[#eeeeee] rounded-full" />
          <div className="h-10 w-3/4 bg-[#eeeeee] rounded-xl" />
          <div className="flex items-center gap-3">
            <div className="h-4 w-24 bg-[#eeeeee] rounded" />
            <div className="h-4 w-20 bg-[#eeeeee] rounded" />
          </div>
          <div className="space-y-3 text-lg">
            <div className="h-4 w-full bg-[#eeeeee] rounded animate-pulse" />
            <div className="h-4 w-full bg-[#eeeeee] rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-[#eeeeee] rounded animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  );

  // 17. Testimonials List Skeleton - Matches TestimonialsView exactly
  const TestimonialsSkeleton = () => (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-pulse">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-white border border-[#E5E5E5] rounded-[1.5rem] shrink-0">
          <div className="w-8 h-8 bg-[#eeeeee] rounded-lg" />
        </div>
        <div className="space-y-2">
          <div className="h-10 w-44 bg-[#eeeeee] rounded-xl" />
          <div className="h-4 w-72 bg-[#eeeeee] rounded" />
        </div>
      </div>
      <div className="columns-1 md:columns-2 lg:columns-2 gap-6 space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#E5E5E5] p-10 rounded-[3rem] break-inside-avoid flex flex-col space-y-6 shadow-none mb-6">
            <div className="flex justify-between items-center">
              <div className="h-5 w-24 bg-[#eeeeee] rounded" />
              <div className="h-6 w-16 bg-[#eeeeee] rounded-full" />
            </div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-[#eeeeee] rounded" />
              <div className="h-4 w-full bg-[#eeeeee] rounded" />
              <div className="h-4 w-11/12 bg-[#eeeeee] rounded" />
            </div>
            <div className="pt-5 border-t border-[#E5E5E5] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#eeeeee]" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-28 bg-[#eeeeee] rounded" />
                <div className="h-3.5 w-20 bg-[#eeeeee] rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );

  // 18. Testimonial Detail Skeleton - Matches TestimonialDetailView exactly
  const TestimonialDetailSkeleton = () => (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-pulse">
      {/* Back button */}
      <div className="h-10 w-36 bg-[#eeeeee] rounded-full mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column Author */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#E5E5E5] p-8 rounded-[3rem] text-center flex flex-col items-center space-y-6 shadow-none">
            <div className="w-32 h-32 rounded-full bg-[#eeeeee] border border-[#E5E5E5]" />
            <div className="space-y-2 flex flex-col items-center w-full">
              <div className="h-6 w-1/2 bg-[#eeeeee] rounded" />
              <div className="h-5 w-2/3 bg-[#eeeeee] rounded" />
              <div className="h-4 w-1/2 bg-[#eeeeee] rounded" />
            </div>
            <div className="flex flex-col gap-3 w-full pt-6 border-t border-[#E5E5E5]">
              <div className="flex justify-between">
                <div className="h-4 w-16 bg-[#eeeeee] rounded animate-pulse" />
                <div className="h-4 w-16 bg-[#eeeeee] rounded animate-pulse" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-12 bg-[#eeeeee] rounded animate-pulse" />
                <div className="h-4 w-16 bg-[#eeeeee] rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
        {/* Right Column Testimonial text card */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-[#E5E5E5] p-10 md:p-14 rounded-[3rem] space-y-8 shadow-none">
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-5 w-5 bg-[#eeeeee] rounded animate-pulse" />
              ))}
            </div>
            <div className="space-y-3 text-lg font-light">
              <div className="h-4 w-full bg-[#eeeeee] rounded animate-pulse" />
              <div className="h-4 w-full bg-[#eeeeee] rounded animate-pulse" />
              <div className="h-4 w-11/12 bg-[#eeeeee] rounded animate-pulse" />
              <div className="h-4 w-full bg-[#eeeeee] rounded animate-pulse" />
              <div className="h-4 w-4/5 bg-[#eeeeee] rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );

  // 19. Gallery Index Skeleton - Matches GalleryView in Gallery.tsx exactly
  const GallerySkeleton = () => (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-white border border-[#E5E5E5] rounded-[1.5rem] shrink-0">
            <div className="w-10 h-10 bg-[#eeeeee] rounded-md" />
          </div>
          <div className="space-y-2">
            <div className="h-10 w-48 bg-[#eeeeee] rounded-xl" />
            <div className="h-4.5 w-80 bg-[#eeeeee] rounded" />
          </div>
        </div>
        <div className="h-10 w-24 bg-[#eeeeee] rounded-full" />
      </div>
      
      {/* Modern Filter Bar Skeleton */}
      <div className="bg-white/80 border border-[#E5E5E5] p-3 rounded-full mb-12 flex flex-wrap items-center gap-2 shadow-none">
        <div className="flex flex-wrap items-center gap-2 p-1 grow">
          <div className="flex items-center gap-2 px-3 py-2 mr-2 text-[#7e7576] border-r border-[#E5E5E5]">
            <div className="w-4 h-4 bg-[#eeeeee] rounded" />
            <div className="h-3 w-12 bg-[#eeeeee] rounded" />
          </div>
          <div className="h-9 w-[140px] bg-[#eeeeee] rounded-full" />
          <div className="h-9 w-[140px] bg-[#eeeeee] rounded-full" />
        </div>
      </div>

      <GalleryGridSkeleton />
    </main>
  );

  // 20. Gallery Grid-Only Skeleton (for API load after page is already mounted)
  const GalleryGridSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-[1.5rem] bg-[#eeeeee]"
          style={{ aspectRatio: '16/9' }}
        />
      ))}
    </div>
  );

  // Router dispatcher
  switch (type) {
    case 'home':
      return <HomeSkeleton />;
    case 'projects-list':
      return <ProjectsSkeleton />;
    case 'project-detail':
      return <ProjectDetailSkeleton />;
    case 'blog-list':
      return <BlogSkeleton />;
    case 'blog-detail':
      return <BlogDetailSkeleton />;
    case 'contact':
      return <ContactSkeleton />;
    case 'experience-list':
      return <ExperienceListSkeleton />;
    case 'experience-detail':
      return <ExperienceDetailSkeleton />;
    case 'education-list':
      return <EducationListSkeleton />;
    case 'education-detail':
      return <EducationDetailSkeleton />;
    case 'skills-list':
      return <SkillsListSkeleton />;
    case 'skill-detail':
      return <SkillDetailSkeleton />;
    case 'certificates-list':
      return <CertificatesListSkeleton />;
    case 'certificate-detail':
      return <CertificateDetailSkeleton />;
    case 'achievements-list':
      return <AchievementsSkeleton />;
    case 'achievement-detail':
      return <AchievementDetailSkeleton />;
    case 'testimonials-list':
      return <TestimonialsSkeleton />;
    case 'testimonials-detail':
      return <TestimonialDetailSkeleton />;
    case 'gallery':
      return <GallerySkeleton />;
    case 'gallery-grid':
      return <GalleryGridSkeleton />;
    default:
      return <HomeSkeleton />;
  }
};
