# API Quick Reference

## 🚀 Import

```typescript
import { profileApi, projectsApi, blogApi, /* ... */ } from '@/lib';
import { useApi, useLazyApi } from '@/lib/hooks';
import type { Project, BlogPost, /* ... */ } from '@/lib';
```

## 📦 Common Patterns

### Server Component (Async)
```typescript
export default async function Page() {
  const data = await profileApi.get(1);
  return <div>{data.full_name}</div>;
}
```

### Client Component (Hook)
```typescript
'use client';
export function Component() {
  const { data, loading, error } = useApi(() => projectsApi.list(), []);
  if (loading) return <div>Loading...</div>;
  return <div>{/* render */}</div>;
}
```

### Form Submit (Lazy Hook)
```typescript
'use client';
export function Form() {
  const { execute, loading } = useLazyApi(contactApi.submit);
  const handleSubmit = async (formData) => {
    await execute(formData);
  };
  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}
```

## 🎯 All API Services

| Service | Endpoints |
|---------|-----------|
| `profileApi` | `.list()` `.get(id)` `.getResume(id)` |
| `projectsApi` | `.list(filters)` `.get(slug)` `.getFeatured()` |
| `blogApi` | `.list(filters)` `.get(slug)` `.getFeatured()` `.getByCategory(slug)` `.getByTag(slug)` |
| `blogApi.categories` | `.list()` `.get(slug)` |
| `blogApi.tags` | `.list()` `.get(slug)` |
| `workExperienceApi` | `.list(filters)` `.get(id)` |
| `educationApi` | `.list(filters)` `.get(id)` |
| `certificatesApi` | `.list(filters)` `.get(id)` |
| `achievementsApi` | `.list(filters)` `.get(id)` |
| `testimonialsApi` | `.list(filters)` `.get(id)` `.getFeatured()` |
| `skillsApi` | `.list(filters)` `.get(id)` |
| `socialLinksApi` | `.list(filters)` `.get(id)` |
| `imagesApi` | `.list(filters)` `.get(id)` |
| `contactApi` | `.submit(data)` |

## 🔍 Common Filters

### Projects
```typescript
projectsApi.list({
  is_featured: true,
  status: 'completed',
  show_on_home: true,
  search: 'react',
  ordering: '-created_at',
  page: 1
})
```

### Blog
```typescript
blogApi.list({
  is_featured: true,
  category: 1,
  tags: [1, 2, 3],
  show_on_home: true,
  search: 'javascript',
  ordering: '-published_at',
  page: 1
})
```

### Work Experience
```typescript
workExperienceApi.list({
  is_current: true,
  employment_type: 'full-time',
  work_mode: 'remote',
  show_on_home: true,
  ordering: '-start_date',
  page: 1
})
```

### Skills
```typescript
skillsApi.list({
  skill_type: 'technical',
  proficiency: 'expert',
  show_on_home: true,
  page: 1
})
```

## 📊 Response Types

### List Response (Paginated)
```typescript
{
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
```

### Access Data
```typescript
const response = await projectsApi.list();
const totalCount = response.count;
const projects = response.results;
const hasNextPage = !!response.next;
```

## 🎨 Common Types

```typescript
// Models
Profile, ProfileDetail
Project, ProjectDetail
BlogPost, BlogPostList, BlogPostDetail
BlogCategory, BlogTag
WorkExperience
Education
Certificate
Achievement
Testimonial
Skill
SocialLink
Image
ContactMessage

// Enums
AchievementType: 'award' | 'honor' | 'recognition' | 'publication' | 'patent' | 'speaker' | 'other'
BlogStatus: 'draft' | 'published' | 'scheduled' | 'archived'
ProjectStatus: 'in-progress' | 'completed' | 'on-hold' | 'archived'
EmploymentType: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship' | 'volunteer'
WorkMode: 'onsite' | 'remote' | 'hybrid'
ProficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
SkillType: 'technical' | 'soft' | 'tool' | 'language' | 'framework' | 'other'
SocialPlatform: 'linkedin' | 'github' | 'twitter' | etc.
ImageType: 'cover' | 'gallery' | 'thumbnail' | 'logo' | 'avatar' | 'og' | 'other'
```

## 🛠️ Utilities

```typescript
import {
  fetchAllPages,
  formatDate,
  calculateDuration,
  parseTechnologies,
  buildProjectFilters,
  buildBlogFilters,
  groupBy,
  sortByOrder,
  truncateText,
  slugify,
  calculateReadingTime
} from '@/lib/api-utils';
```

## 🔐 Error Handling

```typescript
import { APIError, fetchWithErrorHandling } from '@/lib';

try {
  const data = await projectsApi.list();
} catch (error) {
  if (error instanceof APIError) {
    console.log(error.message, error.status);
  }
}

// Or use helper
const data = await fetchWithErrorHandling(
  () => projectsApi.list(),
  (error) => console.error(error)
);
```

## 📝 Environment

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_API_BASE_PATH=/api
NEXT_PUBLIC_API_TIMEOUT=10000
```

## 📚 Full Documentation

See [API_INTEGRATION.md](./API_INTEGRATION.md) for complete guide.
