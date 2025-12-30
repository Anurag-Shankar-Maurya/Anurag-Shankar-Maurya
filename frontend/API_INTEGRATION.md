# Portfolio API Integration

Complete TypeScript API client for the Django Portfolio backend, generated from OpenAPI specification.

## 📁 Structure

```
src/
├── lib/
│   ├── api/                    # API service modules
│   │   ├── profile.ts         # Profile endpoints
│   │   ├── projects.ts        # Projects endpoints
│   │   ├── blog.ts            # Blog endpoints
│   │   ├── work-experience.ts # Work experience endpoints
│   │   ├── education.ts       # Education endpoints
│   │   ├── certificates.ts    # Certificates endpoints
│   │   ├── achievements.ts    # Achievements endpoints
│   │   ├── testimonials.ts    # Testimonials endpoints
│   │   ├── skills.ts          # Skills endpoints
│   │   ├── social-links.ts    # Social links endpoints
│   │   ├── images.ts          # Gallery images endpoints
│   │   └── contact.ts         # Contact form endpoint
│   ├── api-client.ts          # Base HTTP client
│   ├── hooks.ts               # React hooks for API calls
│   ├── api-examples.ts        # Usage examples
│   └── index.ts               # Main export file
└── types/
    └── api.types.ts           # TypeScript types from OpenAPI spec
```

## 🚀 Quick Start

### 1. Environment Configuration

The `.env.local` file is already configured with:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_API_BASE_PATH=/api
NEXT_PUBLIC_API_TIMEOUT=10000
```

### 2. Import API Services

```typescript
import { profileApi, projectsApi, blogApi } from '@/lib';
```

### 3. Use in Server Components

```typescript
// app/page.tsx
import { projectsApi } from '@/lib';

export default async function HomePage() {
  const projects = await projectsApi.list({ is_featured: true });
  
  return (
    <div>
      {projects?.results.map((project) => (
        <div key={project.id}>{project.title}</div>
      ))}
    </div>
  );
}
```

### 4. Use in Client Components

```typescript
'use client';

import { useApi } from '@/lib/hooks';
import { blogApi } from '@/lib';

export function BlogList() {
  const { data, loading, error } = useApi(
    () => blogApi.list({ ordering: '-published_at' }),
    []
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {data?.results.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

## 📚 API Services

### Profile API

```typescript
import { profileApi } from '@/lib';

// Get all profiles
const profiles = await profileApi.list({ page: 1, search: 'john' });

// Get profile by ID with full details
const profile = await profileApi.get(1);

// Download resume
const resume = await profileApi.getResume(1);
```

### Projects API

```typescript
import { projectsApi } from '@/lib';

// List all projects with filters
const projects = await projectsApi.list({
  is_featured: true,
  status: 'completed',
  ordering: '-created_at',
  page: 1
});

// Get project by slug
const project = await projectsApi.get('my-awesome-project');

// Get featured projects
const featured = await projectsApi.getFeatured();
```

### Blog API

```typescript
import { blogApi } from '@/lib';

// List blog posts
const posts = await blogApi.list({
  page: 1,
  ordering: '-published_at',
  is_featured: true,
  search: 'react'
});

// Get single post by slug (increments view count)
const post = await blogApi.get('my-blog-post');

// Get featured posts
const featured = await blogApi.getFeatured();

// Get posts by category
const categoryPosts = await blogApi.getByCategory('technology');

// Get posts by tag
const tagPosts = await blogApi.getByTag('javascript');

// Categories
const categories = await blogApi.categories.list();
const category = await blogApi.categories.get('technology');

// Tags
const tags = await blogApi.tags.list();
const tag = await blogApi.tags.get('javascript');
```

### Work Experience API

```typescript
import { workExperienceApi } from '@/lib';

// List work experience
const experience = await workExperienceApi.list({
  employment_type: 'full-time',
  work_mode: 'remote',
  is_current: true,
  ordering: '-start_date'
});

// Get single experience
const job = await workExperienceApi.get(1);
```

### Education API

```typescript
import { educationApi } from '@/lib';

// List education
const education = await educationApi.list({
  is_current: true,
  show_on_home: true
});

// Get single education record
const degree = await educationApi.get(1);
```

### Certificates API

```typescript
import { certificatesApi } from '@/lib';

// List certificates
const certificates = await certificatesApi.list({
  does_not_expire: false,
  show_on_home: true
});

// Get single certificate
const cert = await certificatesApi.get(1);
```

### Achievements API

```typescript
import { achievementsApi } from '@/lib';

// List achievements
const achievements = await achievementsApi.list({
  achievement_type: 'award',
  show_on_home: true,
  ordering: '-date'
});

// Get single achievement
const achievement = await achievementsApi.get(1);
```

### Testimonials API

```typescript
import { testimonialsApi } from '@/lib';

// List testimonials
const testimonials = await testimonialsApi.list({
  rating: 5,
  is_featured: true,
  ordering: '-date'
});

// Get single testimonial
const testimonial = await testimonialsApi.get(1);

// Get featured testimonials
const featured = await testimonialsApi.getFeatured();
```

### Skills API

```typescript
import { skillsApi } from '@/lib';

// List skills
const skills = await skillsApi.list({
  skill_type: 'technical',
  proficiency: 'expert',
  show_on_home: true
});

// Get single skill
const skill = await skillsApi.get(1);
```

### Social Links API

```typescript
import { socialLinksApi } from '@/lib';

// List social links
const links = await socialLinksApi.list({
  platform: 'github',
  show_on_home: true
});

// Get single link
const link = await socialLinksApi.get(1);
```

### Images API

```typescript
import { imagesApi } from '@/lib';

// List images
const images = await imagesApi.list({
  image_type: 'gallery',
  show_on_home: true
});

// Get single image
const image = await imagesApi.get(1);
```

### Contact API

```typescript
import { contactApi } from '@/lib';

// Submit contact form
await contactApi.submit({
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Inquiry',
  message: 'Hello!',
  phone: '+1234567890' // optional
});
```

## 🪝 React Hooks

### useApi Hook

For automatic data fetching on component mount:

```typescript
'use client';

import { useApi } from '@/lib/hooks';
import { projectsApi } from '@/lib';

function ProjectsList() {
  const { data, loading, error } = useApi(
    () => projectsApi.list({ is_featured: true }),
    [] // dependencies
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{/* render data */}</div>;
}
```

### useLazyApi Hook

For manual/triggered API calls (e.g., form submissions):

```typescript
'use client';

import { useLazyApi } from '@/lib/hooks';
import { contactApi } from '@/lib';

function ContactForm() {
  const { data, loading, error, execute, reset } = useLazyApi(contactApi.submit);

  const handleSubmit = async (formData) => {
    try {
      await execute(formData);
      alert('Success!');
      reset();
    } catch (err) {
      console.error('Failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={loading}>Submit</button>
    </form>
  );
}
```

## 🎯 TypeScript Types

All types are auto-generated from the OpenAPI spec:

```typescript
import type {
  Profile,
  ProfileDetail,
  Project,
  ProjectDetail,
  BlogPost,
  BlogPostDetail,
  WorkExperience,
  Education,
  Certificate,
  Achievement,
  Testimonial,
  Skill,
  SocialLink,
  Image,
  ContactMessage,
  // Enums
  AchievementType,
  BlogStatus,
  ProjectStatus,
  EmploymentType,
  WorkMode,
  ProficiencyLevel,
  SkillType,
  SocialPlatform,
  ImageType,
  // Paginated responses
  PaginatedProjects,
  PaginatedBlogPosts,
  // Filter types
  ProjectFilters,
  BlogFilters,
} from '@/lib';
```

## 🔧 Advanced Usage

### Error Handling

```typescript
import { fetchWithErrorHandling, APIError } from '@/lib';

const data = await fetchWithErrorHandling(
  () => projectsApi.list(),
  (error: APIError) => {
    if (error.status === 404) {
      console.log('Not found');
    }
  }
);
```

### Parallel Requests

```typescript
const [profile, projects, posts] = await Promise.all([
  profileApi.get(1),
  projectsApi.list({ is_featured: true }),
  blogApi.list({ page: 1 })
]);
```

### Server Actions (Next.js)

```typescript
'use server';

import { contactApi } from '@/lib';

export async function submitContact(formData: FormData) {
  try {
    await contactApi.submit({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to send' };
  }
}
```

### Revalidation (Next.js)

```typescript
import { revalidatePath } from 'next/cache';

// After data mutation
await contactApi.submit(data);
revalidatePath('/contact');
```

## 🔐 Authentication

The API client automatically includes credentials (cookies) for session-based authentication:

```typescript
// Credentials are automatically included
const profile = await profileApi.get(1);
```

## ⚡ Performance

### ISR (Incremental Static Regeneration)

```typescript
// app/blog/page.tsx
export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage() {
  const posts = await blogApi.list();
  return <div>{/* render */}</div>;
}
```

### Dynamic Routes

```typescript
// app/projects/[slug]/page.tsx
export async function generateStaticParams() {
  const projects = await projectsApi.list();
  return projects.results.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await projectsApi.get(params.slug);
  return <div>{project.title}</div>;
}
```

## 🐛 Debugging

Enable detailed logging:

```typescript
import { apiClient } from '@/lib';

// Errors are automatically logged to console
// Check browser DevTools Network tab for requests
```

## 📝 Notes

- All endpoints support pagination with `page` parameter
- Many endpoints support `ordering` (e.g., `-created_at` for descending)
- Use `show_on_home` filter to get items marked for homepage
- Image URLs are returned as full URLs or data URIs
- Blog post view counts are incremented automatically when fetching by slug
- All dates are in ISO 8601 format

## 🔗 Related Files

- [OpenAPI Specification](../../backend/openapi.yaml)
- [Backend API Documentation](../../backend/API_README.md)
- [Type Definitions](./src/types/api.types.ts)
- [API Examples](./src/lib/api-examples.ts)

## 🤝 Contributing

When the backend API changes:
1. Update the OpenAPI spec
2. Regenerate TypeScript types from the spec
3. Update API service functions if needed
4. Update this documentation
