
import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 1,
    slug: 'aws-certified-solutions-architect',
    title: 'AWS Certified Solutions Architect',
    description: 'Validated expertise in designing distributed systems on AWS. Covered advanced networking, security, and architectural best practices.',
    date: '2023-11-15',
    achievement_type: 'Certification',
    image: 'https://picsum.photos/400/300',
    issuer: 'AWS',
    url: '#'
  },
  {
    id: 2,
    slug: 'full-stack-ecommerce',
    title: 'Enterprise E-Commerce Platform',
    description: 'Led the frontend development of a high-traffic e-commerce solution using React and Node.js. Improved load times by 40%.',
    date: '2023-08-20',
    achievement_type: 'Project',
    image: 'https://picsum.photos/401/300',
    issuer: 'Self',
    url: '#'
  },
  {
    id: 3,
    slug: 'hackathon-winner-2023',
    title: 'Global AI Hackathon Winner',
    description: 'First place winner out of 500+ teams. Built a generative AI tool for accessible education resources.',
    date: '2023-05-10',
    achievement_type: 'Award',
    image: 'https://picsum.photos/402/300',
    issuer: 'Global AI',
    url: '#'
  },
  {
    id: 4,
    slug: 'open-source-contributor',
    title: 'Core Contributor to React-Lib',
    description: 'Authored 5 major PRs for a popular React UI library, fixing critical rendering bugs and improving accessibility.',
    date: '2024-01-12',
    achievement_type: 'Project',
    image: 'https://picsum.photos/403/300',
    issuer: 'React Lib',
    url: '#'
  }
];

export const getAchievementBySlug = (slug: string): Achievement | undefined => {
  return ACHIEVEMENTS.find(a => a.slug === slug);
};
