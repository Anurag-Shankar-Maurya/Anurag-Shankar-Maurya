import React from 'react';

export interface SkeletonLoaderProps {
  type:
    | 'home'
    | 'projects-list'
    | 'project-detail'
    | 'blog-list'
    | 'blog-detail'
    | 'contact'
    | 'list'
    | 'detail'
    | 'gallery';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type }) => {
  // Common pulsing background bar style
  const pulseBar = "bg-[#eeeeee] rounded-md animate-pulse";
  
  // Custom Home Page Skeleton Layout
  const HomeSkeleton = () => (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-[120px] relative z-10">
      {/* Hero Skeleton */}
      <section className="min-h-[75vh] flex flex-col justify-center relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
            <div className="h-6 w-48 bg-[#eeeeee] border border-[#cfc4c5] rounded-full animate-pulse" />
            <div className="space-y-4">
              <div className="h-16 w-3/4 sm:w-2/3 bg-[#eeeeee] rounded-2xl animate-pulse" />
              <div className="h-8 w-1/2 bg-[#eeeeee] rounded-xl animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-[#eeeeee] rounded-lg animate-pulse" />
              <div className="h-4 w-5/6 bg-[#eeeeee] rounded-lg animate-pulse" />
              <div className="h-4 w-4/5 bg-[#eeeeee] rounded-lg animate-pulse" />
            </div>
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="h-12 w-40 bg-[#eeeeee] rounded-full animate-pulse" />
              <div className="h-12 w-48 bg-[#eeeeee] rounded-full animate-pulse" />
            </div>
            {/* Social badges skeleton */}
            <div className="flex flex-wrap gap-2.5 pt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-9 w-28 bg-[#eeeeee] border border-[#cfc4c5] rounded-full animate-pulse" />
              ))}
            </div>
          </div>
          {/* Right Identity Card Hero */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[380px] sm:max-w-[420px] bg-white border border-[#E5E5E5] rounded-[3rem] p-8 flex flex-col space-y-6">
              {/* Photo placeholder */}
              <div className="self-center w-40 h-40 sm:w-48 sm:h-48 rounded-[2rem] bg-[#eeeeee] border border-[#E5E5E5] animate-pulse" />
              <div className="text-center space-y-3 flex flex-col items-center">
                <div className="h-6 w-1/2 bg-[#eeeeee] rounded-md animate-pulse" />
                <div className="h-4 w-3/4 bg-[#eeeeee] rounded-md animate-pulse" />
                <div className="h-3 w-1/3 bg-[#eeeeee] rounded-md animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E5E5E5]">
                <div className="bg-[#f9f9f9] border border-[#E5E5E5] rounded-[2.5rem] p-4 flex flex-col items-center space-y-2">
                  <div className="h-8 w-1/3 bg-[#eeeeee] rounded-md animate-pulse" />
                  <div className="h-3 w-3/4 bg-[#eeeeee] rounded-md animate-pulse" />
                </div>
                <div className="bg-[#f9f9f9] border border-[#E5E5E5] rounded-[2.5rem] p-4 flex flex-col items-center space-y-2">
                  <div className="h-8 w-1/3 bg-[#eeeeee] rounded-md animate-pulse" />
                  <div className="h-3 w-3/4 bg-[#eeeeee] rounded-md animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Skeleton */}
      <section className="space-y-10">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <div className="h-8 w-44 bg-[#eeeeee] rounded-lg animate-pulse" />
            <div className="h-4 w-72 bg-[#eeeeee] rounded-md animate-pulse" />
          </div>
          <div className="h-8 w-20 bg-[#eeeeee] rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#E5E5E5] rounded-[3rem] p-10 flex flex-col space-y-6">
              <div className="aspect-video bg-[#eeeeee] rounded-[2rem] animate-pulse" />
              <div className="space-y-3 flex-grow">
                <div className="h-6 w-3/4 bg-[#eeeeee] rounded-md animate-pulse" />
                <div className="h-4 w-full bg-[#eeeeee] rounded-md animate-pulse" />
                <div className="h-4 w-5/6 bg-[#eeeeee] rounded-md animate-pulse" />
              </div>
              <div className="flex gap-2 pt-2">
                <div className="h-6 w-16 bg-[#eeeeee] rounded-full animate-pulse" />
                <div className="h-6 w-16 bg-[#eeeeee] rounded-full animate-pulse" />
                <div className="h-6 w-16 bg-[#eeeeee] rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Arsenal Skeleton */}
      <section className="space-y-10">
        <div className="space-y-2">
          <div className="h-8 w-52 bg-[#eeeeee] rounded-lg animate-pulse" />
          <div className="h-4 w-80 bg-[#eeeeee] rounded-md animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#E5E5E5] rounded-[3rem] p-10 flex flex-col space-y-4">
              <div className="h-5 w-1/3 bg-[#eeeeee] rounded animate-pulse mb-2" />
              <div className="flex flex-wrap gap-2.5">
                {Array.from({ length: 8 }).map((_, j) => (
                  <div key={j} className="h-9 w-24 bg-[#eeeeee] rounded-full animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  // Projects Index Skeleton Layout
  const ProjectsSkeleton = () => (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-pulse">
      <div className="space-y-4">
        <div className="h-10 w-64 bg-[#eeeeee] rounded-xl" />
        <div className="h-4 w-96 bg-[#eeeeee] rounded-md" />
      </div>
      {/* Search and filters placeholder */}
      <div className="h-12 w-full bg-[#eeeeee] rounded-full" />
      <div className="flex items-center justify-between">
        <div className="h-10 w-44 bg-[#eeeeee] rounded-full" />
        <div className="h-10 w-28 bg-[#eeeeee] rounded-full" />
      </div>
      <div className="space-y-4">
        <div className="h-4 w-20 bg-[#eeeeee] rounded" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 w-16 bg-[#eeeeee] rounded-full" />
          ))}
        </div>
      </div>
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#E5E5E5] rounded-[3rem] p-10 flex flex-col space-y-6">
            <div className="aspect-video bg-[#eeeeee] rounded-[2rem]" />
            <div className="space-y-3">
              <div className="h-6 w-3/4 bg-[#eeeeee] rounded" />
              <div className="h-4 w-full bg-[#eeeeee] rounded" />
              <div className="h-4 w-2/3 bg-[#eeeeee] rounded" />
            </div>
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-16 bg-[#eeeeee] rounded-full" />
              <div className="h-6 w-20 bg-[#eeeeee] rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Project Detail Skeleton Layout
  const ProjectDetailSkeleton = () => (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="h-5 w-48 bg-[#eeeeee] rounded" />
      {/* Hero banner block */}
      <div className="w-full aspect-video rounded-[3rem] bg-white border border-[#E5E5E5] p-4 flex">
        <div className="w-full h-full rounded-[2rem] bg-[#eeeeee]" />
      </div>
      {/* Content Split */}
      <div className="flex flex-col md:flex-row gap-12 pt-4">
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
            <div className="h-4 w-1/2 bg-[#eeeeee] rounded" />
            <div className="space-y-3">
              <div className="h-5 w-full bg-[#eeeeee] rounded" />
              <div className="h-5 w-full bg-[#eeeeee] rounded" />
            </div>
          </div>
          <div className="p-10 bg-white border border-[#E5E5E5] rounded-[3rem] space-y-4">
            <div className="h-4 w-1/2 bg-[#eeeeee] rounded" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-8 w-16 bg-[#eeeeee] rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Blog Feed Index Skeleton Layout
  const BlogSkeleton = () => (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-white border border-[#E5E5E5] rounded-[1.5rem] flex items-center justify-center shrink-0">
          <div className="w-8 h-8 bg-[#eeeeee] rounded-lg" />
        </div>
        <div className="space-y-2">
          <div className="h-10 w-52 bg-[#eeeeee] rounded-xl" />
          <div className="h-4 w-80 bg-[#eeeeee] rounded" />
        </div>
      </div>
      {/* Search Bar */}
      <div className="h-12 w-full bg-[#eeeeee] rounded-full" />
      {/* Category List */}
      <div className="space-y-3">
        <div className="h-4 w-16 bg-[#eeeeee] rounded" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 w-20 bg-[#eeeeee] rounded-full" />
          ))}
        </div>
      </div>
      {/* View Toggle */}
      <div className="h-10 w-28 bg-[#eeeeee] rounded-full self-end ml-auto" />
      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#E5E5E5] rounded-[3rem] p-10 flex flex-col space-y-6">
            <div className="aspect-video bg-[#eeeeee] rounded-[2rem]" />
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-4 w-20 bg-[#eeeeee] rounded" />
                <div className="h-4 w-16 bg-[#eeeeee] rounded" />
              </div>
              <div className="h-6 w-11/12 bg-[#eeeeee] rounded" />
              <div className="h-4 w-full bg-[#eeeeee] rounded" />
              <div className="h-4 w-3/4 bg-[#eeeeee] rounded" />
            </div>
            <div className="flex gap-2 pt-4 border-t border-[#E5E5E5]">
              <div className="h-6 w-16 bg-[#eeeeee] rounded-full" />
              <div className="h-6 w-16 bg-[#eeeeee] rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Blog Details Page Skeleton Layout
  const BlogDetailSkeleton = () => (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8 animate-pulse">
      {/* Breadcrumb */}
      <div className="h-5 w-40 bg-[#eeeeee] rounded" />
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="h-8 w-24 bg-[#eeeeee] rounded-full" />
        <div className="h-12 w-11/12 bg-[#eeeeee] rounded-xl" />
        <div className="flex items-center gap-4">
          <div className="h-5 w-28 bg-[#eeeeee] rounded" />
          <div className="h-5 w-20 bg-[#eeeeee] rounded" />
        </div>
      </div>
      {/* Image Banner */}
      <div className="w-full aspect-[16/10] sm:aspect-video rounded-[3rem] bg-white border border-[#E5E5E5] p-4">
        <div className="w-full h-full bg-[#eeeeee] rounded-[2rem]" />
      </div>
      {/* Main Blog Post content paragraphs */}
      <div className="space-y-4 pt-4">
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
    </div>
  );

  // Contact Page Skeleton Layout
  const ContactSkeleton = () => (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Left Side Details */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="h-12 w-64 bg-[#eeeeee] rounded-xl" />
            <div className="h-4 w-full bg-[#eeeeee] rounded" />
            <div className="h-4 w-5/6 bg-[#eeeeee] rounded" />
          </div>
          {/* Card Skeletons */}
          <div className="space-y-6">
            <div className="bg-white border border-[#E5E5E5] p-5 rounded-[2rem] flex items-center gap-5">
              <div className="w-12 h-12 rounded-full bg-[#eeeeee]" />
              <div className="space-y-2 flex-grow">
                <div className="h-3 w-16 bg-[#eeeeee] rounded" />
                <div className="h-5 w-40 bg-[#eeeeee] rounded" />
              </div>
            </div>
            <div className="bg-white border border-[#E5E5E5] p-5 rounded-[2rem] flex items-center gap-5">
              <div className="w-12 h-12 rounded-full bg-[#eeeeee]" />
              <div className="space-y-2 flex-grow">
                <div className="h-3 w-16 bg-[#eeeeee] rounded" />
                <div className="h-5 w-28 bg-[#eeeeee] rounded" />
              </div>
            </div>
          </div>
          {/* Social icons header + buttons */}
          <div className="space-y-4 pt-4 border-t border-[#E5E5E5]">
            <div className="h-4 w-32 bg-[#eeeeee] rounded" />
            <div className="flex gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-12 h-12 rounded-full bg-white border border-[#E5E5E5] p-3">
                  <div className="w-full h-full bg-[#eeeeee] rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Right Side Form Panel */}
        <div className="bg-white border border-[#E5E5E5] rounded-[3rem] p-10 space-y-6">
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
    </div>
  );

  // Generic List Timelines Page Skeleton Layout
  const ListSkeleton = () => (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12 animate-pulse">
      {/* Title */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-white border border-[#E5E5E5] rounded-[1.5rem]" />
        <div className="space-y-2">
          <div className="h-10 w-48 bg-[#eeeeee] rounded-xl" />
          <div className="h-4 w-80 bg-[#eeeeee] rounded" />
        </div>
      </div>
      {/* Timeline or list container */}
      <div className="relative border-l border-[#E5E5E5] ml-6 space-y-12 pl-12">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="relative">
            {/* Timeline bullet dot */}
            <div className="absolute -left-[53px] top-8 w-2.5 h-2.5 rounded-full bg-[#eeeeee] ring-4 ring-[#f9f9f9]" />
            <div className="bg-white border border-[#E5E5E5] p-10 rounded-[3rem] space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#eeeeee]" />
                  <div className="space-y-2">
                    <div className="h-6 w-36 bg-[#eeeeee] rounded" />
                    <div className="h-4 w-28 bg-[#eeeeee] rounded" />
                  </div>
                </div>
                <div className="h-8 w-24 bg-[#eeeeee] rounded-full" />
              </div>
              <div className="h-4 w-full bg-[#eeeeee] rounded" />
              <div className="h-4 w-11/12 bg-[#eeeeee] rounded" />
              <div className="flex gap-2 pt-2">
                <div className="h-6 w-16 bg-[#eeeeee] rounded-full" />
                <div className="h-6 w-20 bg-[#eeeeee] rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Generic Detail Panel Page Skeleton Layout
  const DetailSkeleton = () => (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 animate-pulse">
      {/* Back Button */}
      <div className="h-10 w-28 bg-[#eeeeee] rounded-full" />
      {/* Detail Card Frame */}
      <div className="bg-white border border-[#E5E5E5] rounded-[3rem] p-10 md:p-12 space-y-8">
        <div className="flex flex-col md:flex-row gap-6 items-start justify-between border-b border-[#E5E5E5] pb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[1.5rem] bg-[#eeeeee]" />
            <div className="space-y-2">
              <div className="h-8 w-44 bg-[#eeeeee] rounded-lg" />
              <div className="h-6 w-36 bg-[#eeeeee] rounded-md" />
            </div>
          </div>
          <div className="space-y-2 text-right">
            <div className="h-8 w-36 bg-[#eeeeee] rounded-full" />
            <div className="h-4 w-24 bg-[#eeeeee] rounded ml-auto" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-4 w-32 bg-[#eeeeee] rounded" />
          <div className="h-4 w-full bg-[#eeeeee] rounded" />
          <div className="h-4 w-full bg-[#eeeeee] rounded" />
          <div className="h-4 w-11/12 bg-[#eeeeee] rounded" />
        </div>
        <div className="space-y-3 pt-4">
          <div className="h-4 w-36 bg-[#eeeeee] rounded" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 w-20 bg-[#eeeeee] rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Gallery visual log grid loader skeleton
  const GallerySkeleton = () => (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-10 w-44 bg-[#eeeeee] rounded-xl" />
        <div className="h-4 w-80 bg-[#eeeeee] rounded" />
      </div>
      <div className="h-10 w-24 bg-[#eeeeee] rounded-full self-end ml-auto" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-[2rem] bg-white border border-[#E5E5E5] p-3">
            <div className="w-full h-full bg-[#eeeeee] rounded-[1.5rem]" />
          </div>
        ))}
      </div>
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
    case 'list':
      return <ListSkeleton />;
    case 'detail':
      return <DetailSkeleton />;
    case 'gallery':
      return <GallerySkeleton />;
    default:
      return <HomeSkeleton />;
  }
};
