"""
Management command to populate the database with sample data
Run: python manage.py populate_sample_data
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from api.models import (
    Profile, Project, BlogPost, BlogCategory, BlogTag,
    WorkExperience, Education, Skill, SocialLink,
    Certificate, Achievement, Testimonial
)
from datetime import datetime, timedelta


class Command(BaseCommand):
    help = 'Populate database with sample portfolio data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Populating database with sample data...\n')

        # Create Profile
        profile, created = Profile.objects.get_or_create(
            id=1,
            defaults={
                'full_name': 'Anurag Shankar Maurya',
                'headline': 'Android & Full-Stack Developer — AI & Software Developer',
                'bio': '''Innovative Android & Full-Stack Developer with expertise in Kotlin, Python, Django, 
and AI-driven applications. Experienced in Retrieval-Augmented Generation (RAG), real-time transcription, 
compliance AI, and UI/UX design. Passionate about building scalable, efficient, and user-centric software solutions.''',
                'email': 'anuragshankarmaurya@gmail.com',
                'location': 'India',
                'years_of_experience': 3,
                'current_role': 'Android & Full-Stack Developer',
                'current_company': 'TechOTD Solutions',
                'available_for_hire': True,
            }
        )
        self.stdout.write(f'{"Created" if created else "Updated"} profile: {profile.full_name}')

        # Create Social Links
        social_links = [
            {'platform': 'github', 'url': 'https://github.com/Anurag-Shankar-Maurya', 'icon': 'github'},
            {'platform': 'linkedin', 'url': 'https://www.linkedin.com/in/anurag-shankar-maurya', 'icon': 'linkedin'},
            {'platform': 'twitter', 'url': 'https://twitter.com/anurag_maurya', 'icon': 'twitter'},
        ]
        
        for idx, link_data in enumerate(social_links):
            link, created = SocialLink.objects.get_or_create(
                profile=profile,
                platform=link_data['platform'],
                defaults={
                    'url': link_data['url'],
                    'icon': link_data['icon'],
                    'order': idx,
                    'show_on_home': True
                }
            )
            self.stdout.write(f'  {"Created" if created else "Exists"} social link: {link.platform}')

        # Create Skills
        skills_data = [
            {'name': 'Python', 'skill_type': 'language', 'proficiency': 'expert'},
            {'name': 'Django', 'skill_type': 'framework', 'proficiency': 'expert'},
            {'name': 'Kotlin', 'skill_type': 'language', 'proficiency': 'advanced'},
            {'name': 'Android Development', 'skill_type': 'technical', 'proficiency': 'expert'},
            {'name': 'React', 'skill_type': 'framework', 'proficiency': 'intermediate'},
            {'name': 'TypeScript', 'skill_type': 'language', 'proficiency': 'intermediate'},
            {'name': 'Machine Learning', 'skill_type': 'technical', 'proficiency': 'intermediate'},
            {'name': 'REST APIs', 'skill_type': 'technical', 'proficiency': 'expert'},
        ]

        for idx, skill_data in enumerate(skills_data):
            skill, created = Skill.objects.get_or_create(
                profile=profile,
                name=skill_data['name'],
                defaults={
                    'skill_type': skill_data['skill_type'],
                    'proficiency': skill_data['proficiency'],
                    'order': idx,
                    'show_on_home': True
                }
            )
            self.stdout.write(f'  {"Created" if created else "Exists"} skill: {skill.name}')

        # Create Work Experience
        work_data = [
            {
                'company_name': 'TechOTD Solutions Pvt. Ltd.',
                'job_title': 'Android & Full-Stack Developer',
                'employment_type': 'full-time',
                'work_mode': 'remote',
                'location': 'India',
                'start_date': '2023-01-01',
                'end_date': None,
                'is_current': True,
                'description': 'Developing Android applications and full-stack solutions using Kotlin, Python, and Django.',
                'technologies_used': 'Kotlin, Python, Django, Android, REST APIs',
            },
            {
                'company_name': 'Tech Startup',
                'job_title': 'Software Developer Intern',
                'employment_type': 'internship',
                'work_mode': 'hybrid',
                'location': 'India',
                'start_date': '2022-06-01',
                'end_date': '2022-12-31',
                'is_current': False,
                'description': 'Worked on mobile app development and backend APIs.',
                'technologies_used': 'Python, Django, Android',
            }
        ]

        for idx, work in enumerate(work_data):
            exp, created = WorkExperience.objects.get_or_create(
                profile=profile,
                company_name=work['company_name'],
                job_title=work['job_title'],
                defaults={
                    **work,
                    'order': idx,
                    'show_on_home': True
                }
            )
            self.stdout.write(f'  {"Created" if created else "Exists"} work: {exp.job_title} at {exp.company_name}')

        # Create Education
        edu_data = [
            {
                'institution': 'University Name',
                'degree': 'Bachelor of Technology',
                'field_of_study': 'Computer Science',
                'start_date': '2018-08-01',
                'end_date': '2022-06-01',
                'is_current': False,
                'grade': '8.5 GPA',
            }
        ]

        for idx, edu in enumerate(edu_data):
            education, created = Education.objects.get_or_create(
                profile=profile,
                institution=edu['institution'],
                degree=edu['degree'],
                defaults={
                    **edu,
                    'show_on_home': True
                }
            )
            self.stdout.write(f'  {"Created" if created else "Exists"} education: {education.degree}')

        # Create Blog Categories
        categories = ['Technology', 'Development', 'Tutorial', 'AI/ML']
        blog_categories = []
        for idx, cat_name in enumerate(categories):
            category, created = BlogCategory.objects.get_or_create(
                name=cat_name,
                defaults={
                    'slug': cat_name.lower().replace('/', '-'),
                    'order': idx,
                    'show_on_home': True
                }
            )
            blog_categories.append(category)
            self.stdout.write(f'  {"Created" if created else "Exists"} category: {category.name}')

        # Create Blog Tags
        tags_names = ['Python', 'Django', 'Android', 'Kotlin', 'AI', 'Tutorial']
        blog_tags = []
        for tag_name in tags_names:
            tag, created = BlogTag.objects.get_or_create(
                name=tag_name,
                defaults={'slug': tag_name.lower()}
            )
            blog_tags.append(tag)

        # Create Blog Posts
        posts_data = [
            {
                'title': 'Getting Started with Django REST Framework',
                'slug': 'getting-started-django-rest',
                'excerpt': 'Learn how to build powerful REST APIs with Django REST Framework',
                'content': '''# Introduction to Django REST Framework\n\nDjango REST Framework is a powerful toolkit for building Web APIs...''',
                'category': blog_categories[0],
                'status': 'published',
                'is_featured': True,
            },
            {
                'title': 'Android Development Best Practices',
                'slug': 'android-development-best-practices',
                'excerpt': 'Essential best practices for modern Android development',
                'content': '''# Android Development Best Practices\n\nModern Android development requires...''',
                'category': blog_categories[1],
                'status': 'published',
                'is_featured': True,
            },
            {
                'title': 'Building AI Applications with Python',
                'slug': 'building-ai-applications-python',
                'excerpt': 'A guide to creating AI-powered applications using Python',
                'content': '''# AI Applications with Python\n\nPython is the go-to language for AI development...''',
                'category': blog_categories[3],
                'status': 'published',
                'is_featured': False,
            }
        ]

        for idx, post_data in enumerate(posts_data):
            post, created = BlogPost.objects.get_or_create(
                profile=profile,
                slug=post_data['slug'],
                defaults={
                    'title': post_data['title'],
                    'excerpt': post_data['excerpt'],
                    'content': post_data['content'],
                    'category': post_data['category'],
                    'status': post_data['status'],
                    'is_featured': post_data['is_featured'],
                    'published_at': timezone.now() - timedelta(days=(10 * idx)),
                    'reading_time': 5,
                    'show_on_home': True
                }
            )
            if created:
                post.tags.add(*blog_tags[:3])
            self.stdout.write(f'  {"Created" if created else "Exists"} blog post: {post.title}')

        # Create Projects
        projects_data = [
            {
                'title': 'Portfolio Website',
                'slug': 'portfolio-website',
                'short_description': 'A modern portfolio website built with Next.js and Django',
                'description': 'Full-stack portfolio website featuring a React/Next.js frontend and Django REST API backend.',
                'technologies': 'Next.js, TypeScript, Django, Python, REST API',
                'status': 'completed',
                'is_featured': True,
            },
            {
                'title': 'AI Chat Application',
                'slug': 'ai-chat-application',
                'short_description': 'Real-time chat application with AI integration',
                'description': 'Chat application featuring AI-powered responses using modern NLP models.',
                'technologies': 'Python, Django, WebSocket, AI/ML',
                'status': 'in-progress',
                'is_featured': True,
            },
            {
                'title': 'Android Fitness Tracker',
                'slug': 'android-fitness-tracker',
                'short_description': 'Comprehensive fitness tracking Android application',
                'description': 'Android app for tracking workouts, nutrition, and health metrics.',
                'technologies': 'Kotlin, Android, Room Database, MVVM',
                'status': 'completed',
                'is_featured': False,
            }
        ]

        for idx, proj_data in enumerate(projects_data):
            project, created = Project.objects.get_or_create(
                profile=profile,
                slug=proj_data['slug'],
                defaults={
                    **proj_data,
                    'order': idx,
                    'show_on_home': True
                }
            )
            self.stdout.write(f'  {"Created" if created else "Exists"} project: {project.title}')

        self.stdout.write(self.style.SUCCESS('\n✅ Database populated successfully!'))
        self.stdout.write(f'\nCreated:')
        self.stdout.write(f'  - 1 Profile')
        self.stdout.write(f'  - {SocialLink.objects.count()} Social Links')
        self.stdout.write(f'  - {Skill.objects.count()} Skills')
        self.stdout.write(f'  - {WorkExperience.objects.count()} Work Experiences')
        self.stdout.write(f'  - {Education.objects.count()} Education Records')
        self.stdout.write(f'  - {BlogCategory.objects.count()} Blog Categories')
        self.stdout.write(f'  - {BlogTag.objects.count()} Blog Tags')
        self.stdout.write(f'  - {BlogPost.objects.count()} Blog Posts')
        self.stdout.write(f'  - {Project.objects.count()} Projects')
