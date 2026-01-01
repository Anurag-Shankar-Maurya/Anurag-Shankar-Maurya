"""
Management command to populate the database with Anurag Shankar Maurya's portfolio data
Run: python manage.py populate_sample_data
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from django.utils.text import slugify
from api.models import (
    Profile, Project, BlogPost, BlogCategory, BlogTag,
    WorkExperience, Education, Skill, SocialLink,
    Certificate, Achievement, Testimonial
)
from datetime import datetime, timedelta


class Command(BaseCommand):
    help = 'Populate database with Anurag Shankar Maurya portfolio data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Populating database with portfolio data...\n')

        # Create Profile
        profile, created = Profile.objects.get_or_create(
            id=1,
            defaults={
                'full_name': 'Anurag Shankar Maurya',
                'headline': 'Django Backend Developer — Full-Stack AI Engineer — Generative AI & Prompt Engineer',
                'bio': '''Expert Django Backend Developer & Full-Stack AI Engineer specializing in Generative AI integration, LLM prompt engineering, RAG systems, and custom AI solutions. Proven expertise in designing scalable backend architectures, building AI-powered web applications, and delivering enterprise-grade solutions. Experienced in managing international client relationships across UK, Taiwan, and India regions. Passionate about building intelligent, data-driven, and user-centric applications.''',
                'email': 'anuragshankarmaurya@gmail.com',
                'phone': '+91 8707297564',
                'location': 'Mahendragarh, Haryana, India',
                'years_of_experience': 2,
                'current_role': 'Software Developer Intern',
                'current_company': 'TechOTD Solutions Pvt. Ltd.',
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

        # Create Skills - Comprehensive skill set
        skills_data = [
            # Programming Languages
            {'name': 'Python', 'skill_type': 'language', 'proficiency': 'expert'},
            {'name': 'Kotlin', 'skill_type': 'language', 'proficiency': 'advanced'},
            {'name': 'Java', 'skill_type': 'language', 'proficiency': 'intermediate'},
            {'name': 'JavaScript', 'skill_type': 'language', 'proficiency': 'intermediate'},
            
            # Frontend Development
            {'name': 'HTML/CSS', 'skill_type': 'frontend-dev', 'proficiency': 'advanced'},
            {'name': 'React.js', 'skill_type': 'frontend-dev', 'proficiency': 'intermediate'},
            {'name': 'Bootstrap 5', 'skill_type': 'frontend-dev', 'proficiency': 'advanced'},
            {'name': 'Frontend Development', 'skill_type': 'frontend-dev', 'proficiency': 'intermediate'},
            
            # Backend Development
            {'name': 'REST APIs', 'skill_type': 'backend-dev', 'proficiency': 'expert'},
            {'name': 'WebSocket', 'skill_type': 'backend-dev', 'proficiency': 'advanced'},
            {'name': 'Nginx', 'skill_type': 'backend-dev', 'proficiency': 'intermediate'},
            
            # Mobile App Development
            {'name': 'Android SDK', 'skill_type': 'mobile-app-dev', 'proficiency': 'advanced'},
            {'name': 'Mobile App Development', 'skill_type': 'mobile-app-dev', 'proficiency': 'advanced'},
            
            # AI/ML
            {'name': 'Prompt Engineering', 'skill_type': 'ai-ml', 'proficiency': 'expert'},
            {'name': 'OpenAI API', 'skill_type': 'ai-ml', 'proficiency': 'advanced'},
            {'name': 'Google Gemini API', 'skill_type': 'ai-ml', 'proficiency': 'advanced'},
            {'name': 'RAG Systems', 'skill_type': 'ai-ml', 'proficiency': 'advanced'},
            {'name': 'Pinecone', 'skill_type': 'ai-ml', 'proficiency': 'intermediate'},
            {'name': 'Vector Databases', 'skill_type': 'ai-ml', 'proficiency': 'intermediate'},
            {'name': 'Speech-to-Text', 'skill_type': 'ai-ml', 'proficiency': 'advanced'},
            
            # Database
            {'name': 'PostgreSQL', 'skill_type': 'database', 'proficiency': 'advanced'},
            {'name': 'SQLite', 'skill_type': 'database', 'proficiency': 'advanced'},
            {'name': 'MongoDB', 'skill_type': 'database', 'proficiency': 'intermediate'},
            {'name': 'Room Database', 'skill_type': 'database', 'proficiency': 'intermediate'},
            
            # DevOps
            {'name': 'Docker', 'skill_type': 'devops', 'proficiency': 'intermediate'},
            {'name': 'Docker Compose', 'skill_type': 'devops', 'proficiency': 'intermediate'},
            {'name': 'Vercel', 'skill_type': 'devops', 'proficiency': 'intermediate'},
            {'name': 'Render', 'skill_type': 'devops', 'proficiency': 'intermediate'},
            
            # Backend as a Service (BaaS)
            {'name': 'Firebase', 'skill_type': 'baas', 'proficiency': 'intermediate'},
            {'name': 'Deepgram', 'skill_type': 'baas', 'proficiency': 'advanced'},
            
            # Framework
            {'name': 'Django 5.x', 'skill_type': 'frameworks', 'proficiency': 'expert'},
            {'name': 'Django REST Framework', 'skill_type': 'frameworks', 'proficiency': 'expert'},
            {'name': 'LangChain', 'skill_type': 'frameworks', 'proficiency': 'advanced'},
            
            # Software
            {'name': 'Figma', 'skill_type': 'softwares', 'proficiency': 'intermediate'},
            {'name': 'Canva', 'skill_type': 'softwares', 'proficiency': 'intermediate'},
            {'name': 'Material Design', 'skill_type': 'softwares', 'proficiency': 'intermediate'},
            {'name': 'TinkerCAD', 'skill_type': 'softwares', 'proficiency': 'intermediate'},
            
            # Other
            {'name': 'Git', 'skill_type': 'others', 'proficiency': 'advanced'},
            {'name': 'GitHub', 'skill_type': 'others', 'proficiency': 'advanced'},
            {'name': 'Linux/Unix', 'skill_type': 'others', 'proficiency': 'intermediate'},
            {'name': 'Arduino Programming', 'skill_type': 'others', 'proficiency': 'intermediate'},
            {'name': 'Embedded Systems', 'skill_type': 'others', 'proficiency': 'intermediate'},
        ]

        for idx, skill_data in enumerate(skills_data):
            name = skill_data['name']
            slug = slugify(name)

            # Resolve icon: prefer explicit entry, else try exact match or partial match against Skill.ICON_MAPPING
            icon = skill_data.get('icon', '') or ''
            if not icon:
                mapping = Skill.ICON_MAPPING
                if name in mapping:
                    icon = mapping[name]
                else:
                    name_lower = name.lower()
                    for key, val in mapping.items():
                        if key.lower() in name_lower or name_lower in key.lower():
                            icon = val
                            break

            # Set show_on_home for top skills (expert/advanced) unless explicitly provided
            show_on_home = skill_data.get('show_on_home', skill_data.get('proficiency') in ('expert', 'advanced'))

            skill, created = Skill.objects.get_or_create(
                profile=profile,
                name=name,
                defaults={
                    'slug': slug,
                    'skill_type': skill_data['skill_type'],
                    'proficiency': skill_data['proficiency'],
                    'icon': icon,
                    'order': idx,
                    'show_on_home': show_on_home
                }
            )

            # If the skill existed but lacked an icon or slug, update it
            if not created:
                changed = False
                if not skill.icon and icon:
                    skill.icon = icon
                    changed = True
                if not skill.slug:
                    skill.slug = slug
                    changed = True
                if changed:
                    skill.save()

            self.stdout.write(f'  {"Created" if created else "Exists"} skill: {skill.name} (icon: {skill.icon})')

        # Create Work Experience
        work_data = [
            {
                'company_name': 'TechOTD Solutions Pvt. Ltd.',
                'job_title': 'Software Developer Intern',
                'employment_type': 'internship',
                'work_mode': 'remote',
                'location': 'India',
                'start_date': '2025-03-01',
                'end_date': None,
                'is_current': True,
                'description': '''Architected AI-powered compliance platform with GDPR/CCPA adherence, building sophisticated RAG systems leveraging MongoDB & Pinecone vector database.

Developed advanced prompt engineering strategies for contextual AI responses using LangChain, enabling intelligent email compliance chatbots.

Engineered real-time speech transcription system with speaker diarization using Django WebSocket, Deepgram, and custom backend pipeline.

Built responsive frontend interfaces with React.js & Bootstrap, ensuring seamless user experience for complex AI workflows.

Collaborated with international clients from UK and Taiwan, managing requirements and delivering production-ready solutions.''',
                'technologies_used': 'Django, Python, LangChain, OpenAI, Pinecone, MongoDB, WebSocket, Deepgram, React.js, Bootstrap',
            },
            {
                'company_name': 'Institute of Engineering & Technology, Lucknow',
                'job_title': 'Android Application Development Intern',
                'employment_type': 'internship',
                'work_mode': 'onsite',
                'location': 'Lucknow, India',
                'start_date': '2024-06-01',
                'end_date': '2024-08-31',
                'is_current': False,
                'description': '''Developed AI-enhanced Android applications using Gemini API for personalized user interactions and intelligent features.

Optimized UI/UX for performance and accessibility across diverse user bases.

Collaborated on real-world problems with a focus on modern UI/UX and efficient app performance.''',
                'technologies_used': 'Kotlin, Android, Gemini API, Firebase, Material Design',
            },
            {
                'company_name': 'ByteCode Learners Club, Mahendragarh',
                'job_title': 'Tutor',
                'employment_type': 'part-time',
                'work_mode': 'onsite',
                'location': 'Mahendragarh, India',
                'start_date': '2022-11-01',
                'end_date': None,
                'is_current': True,
                'description': '''Conducted workshops on Arduino programming and robotics fundamentals.

Mentored students in designing embedded systems projects and debugging microcontroller programs.

Organized hands-on sessions, introducing TinkerCAD for rapid prototyping.''',
                'technologies_used': 'Arduino, TinkerCAD, Embedded Systems, C/C++, Python',
            },
            {
                'company_name': 'Sanchar Mitra, DOT (Govt. of India)',
                'job_title': 'Public Outreach Intern',
                'employment_type': 'internship',
                'work_mode': 'hybrid',
                'location': 'India',
                'start_date': '2024-02-01',
                'end_date': '2024-08-31',
                'is_current': False,
                'description': '''Conducted workshops on cybersecurity & digital tools, impacting 500+ participants.

Delivered workshops on digital tools and cybersecurity, emphasizing online safety and data privacy.''',
                'technologies_used': 'Cybersecurity, Digital Tools, Public Speaking',
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
                'institution': 'Central University of Haryana, Mahendragarh',
                'degree': 'Bachelor of Technology',
                'field_of_study': 'Computer Science & Engineering',
                'start_date': '2021-08-01',
                'end_date': '2025-06-01',
                'is_current': False,
                'grade': '8+/10 GPA',
                'description': 'Relevant Coursework: AI, DBMS, Web Development, Algorithms, Data Structures, Software Engineering',
            },
            {
                'institution': 'Parvati Prema Jagati Saraswati Vihar, Nainital, Uttarakhand',
                'degree': 'Senior Secondary (XII)',
                'field_of_study': 'Science (Mathematics)',
                'start_date': '2018-04-01',
                'end_date': '2020-03-01',
                'is_current': False,
                'grade': '93.4%',
                'description': 'CBSE Board',
            },
            {
                'institution': 'Parvati Prema Jagati Saraswati Vihar, Nainital, Uttarakhand',
                'degree': 'Secondary (X)',
                'field_of_study': 'General',
                'start_date': '2016-04-01',
                'end_date': '2018-03-01',
                'is_current': False,
                'grade': '93.2%',
                'description': 'CBSE Board',
            }
        ]

        for idx, edu in enumerate(edu_data):
            education, created = Education.objects.get_or_create(
                profile=profile,
                institution=edu['institution'],
                degree=edu['degree'],
                defaults={
                    **edu,
                    'show_on_home': idx == 0  # Only show B.Tech on home
                }
            )
            self.stdout.write(f'  {"Created" if created else "Exists"} education: {education.degree}')

        # Create Blog Categories
        categories = ['Technology', 'Development', 'Tutorial', 'AI/ML', 'Django', 'Android', 'Robotics']
        blog_categories = []
        for idx, cat_name in enumerate(categories):
            category, created = BlogCategory.objects.get_or_create(
                name=cat_name,
                defaults={
                    'slug': cat_name.lower().replace('/', '-').replace(' ', '-'),
                    'order': idx,
                    'show_on_home': True
                }
            )
            blog_categories.append(category)
            self.stdout.write(f'  {"Created" if created else "Exists"} category: {category.name}')

        # Create Blog Tags
        tags_names = ['Python', 'Django', 'Android', 'Kotlin', 'AI', 'Tutorial', 'LangChain', 'OpenAI', 'Gemini', 'RAG', 'WebSocket', 'Arduino', 'React']
        blog_tags = []
        for tag_name in tags_names:
            tag, created = BlogTag.objects.get_or_create(
                name=tag_name,
                defaults={'slug': tag_name.lower().replace(' ', '-')}
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

        # Create Projects - Real portfolio projects
        projects_data = [
            {
                'title': 'GDA (Global Development Alliance)',
                'slug': 'gda-global-development-alliance',
                'short_description': 'Enterprise Django CMS with AI Integration serving 500+ projects',
                'description': '''Built enterprise CMS with Django 5.2 & React.js serving 500+ projects, 10,000+ users across 50+ organizations.

Implemented Django REST API with advanced filtering, authentication, and permission systems.

Integrated generative AI for intelligent recommendations, automated FAQ generation, and analytics.

Designed real-time analytics dashboard with Chart.js visualizations and business intelligence.

Deployed using Docker, Docker-Compose, Nginx with PostgreSQL and production security.

Built comprehensive testing suite, CI/CD pipelines, and security configurations.''',
                'technologies': 'Django 5.2, React.js, PostgreSQL, REST API, Docker, Docker-Compose, Nginx, Generative AI, Chart.js',
                'github_url': 'https://github.com/Anurag-Shankar-Maurya/gda',
                'status': 'completed',
                'is_featured': True,
            },
            {
                'title': 'Julia English Kids Talk',
                'slug': 'julia-english-kids-talk',
                'short_description': 'AI-Powered Educational Platform with Generative AI for English learning',
                'description': '''Built AI-powered educational app using advanced generative AI models for English learning.

Engineered prompt engineering for adaptive conversations personalized to proficiency levels.

Created curriculum-aligned content with dynamic lesson generation and AI-powered storytelling.

Implemented progress tracking & analytics for real-time learning outcome monitoring.

Deployed on Render platform with optimized backend for concurrent sessions.''',
                'technologies': 'Django, LLM Integration, Prompt Engineering, Interactive Learning, Render',
                'github_url': 'https://github.com/Anurag-Shankar-Maurya/julia-english-kids-talk',
                'status': 'completed',
                'is_featured': True,
            },
            {
                'title': 'DeepTranscribe',
                'slug': 'deep-transcribe',
                'short_description': 'Real-Time Speech Transcription & AI Chatbot with speaker diarization',
                'description': '''Built real-time transcription backend with speaker diarization using Deepgram & Django WebSocket.

Implemented RAG-based chatbot with LangChain & Pinecone for intelligent Q&A.

Designed efficient message queue system for concurrent requests and context management.

Integrated LangChain & Pinecone for contextual memory in chatbot responses.''',
                'technologies': 'Django, Deepgram, WebSocket, LangChain, RAG, Pinecone',
                'github_url': 'https://github.com/Anurag-Shankar-Maurya/deep-transcribe',
                'status': 'completed',
                'is_featured': True,
            },
            {
                'title': 'Censor AI',
                'slug': 'censor-ai',
                'short_description': 'Email Compliance & Risk Mitigation Tool with AI-driven validation',
                'description': '''Built AI-driven email validator with custom OpenAI prompt engineering for GDPR/CCPA compliance.

Designed intelligent workflow automation for manager approvals with AI risk assessment.

Implemented contextual risk scoring using LLM prompt chains for multi-level email analysis.

Implemented automated manager approval workflows for high-risk emails.''',
                'technologies': 'Python, Django, OpenAI, Custom Prompt Engineering, REST APIs',
                'github_url': 'https://github.com/Anurag-Shankar-Maurya/censor-ai',
                'status': 'completed',
                'is_featured': True,
            },
            {
                'title': 'Sparkle AI',
                'slug': 'sparkle-ai',
                'short_description': 'Personalized Chat Android App with AI personalities',
                'description': '''Integrated Google's Gemini API for dynamic AI personalities and chat interactions.

Included diverse personalities for interactive user experiences.

Integrated advanced AI functionalities into a mobile app using Gemini API.''',
                'technologies': 'Kotlin, Gemini API, Firebase, Android, Material Design',
                'github_url': 'https://github.com/Anurag-Shankar-Maurya/sparkle-ai',
                'status': 'completed',
                'is_featured': True,
            },
            {
                'title': 'FakeHai',
                'slug': 'fakehai',
                'short_description': 'Fake News Detection Android App with AI analysis',
                'description': '''Designed an AI model to detect fake news with real-time analysis and visual indicators.

Built using fine-tuned AI model for accurate fake news detection.

Implemented visual indicators for credibility scoring.''',
                'technologies': 'Kotlin, Gemini API, Fine-Tuned AI Model, Android',
                'github_url': 'https://github.com/Anurag-Shankar-Maurya/fakehai',
                'status': 'completed',
                'is_featured': False,
            },
            {
                'title': 'We Parcel',
                'slug': 'we-parcel',
                'short_description': 'Courier Service Landing Page with real-time tracking',
                'description': '''Created a responsive UI with real-time tracking and booking system.

Built modern landing page for courier service with intuitive user interface.''',
                'technologies': 'HTML, CSS, JavaScript, Responsive Design',
                'github_url': 'https://github.com/Anurag-Shankar-Maurya/we-parcel',
                'status': 'completed',
                'is_featured': False,
            },
            {
                'title': 'Arduino Burglar Alarm System',
                'slug': 'arduino-burglar-alarm',
                'short_description': 'Motion-sensing alarm system using ultrasonic sensor',
                'description': '''Developed a motion-sensing alarm using an ultrasonic sensor and buzzer.

Designed the system to detect unauthorized entry and sound an alert.''',
                'technologies': 'Arduino, Ultrasonic Sensor, Buzzer, Embedded Systems',
                'status': 'completed',
                'is_featured': False,
            },
            {
                'title': 'Auto Street Light with Dusk Detection',
                'slug': 'auto-street-light',
                'short_description': 'Smart street light system with automatic dusk detection',
                'description': '''Built a smart street light system that turns on automatically at dusk using an LDR (Light Dependent Resistor) or mini photocell.

Demonstrated energy efficiency by automating lighting based on ambient light levels.''',
                'technologies': 'Arduino, LDR, Photocell, Embedded Systems',
                'status': 'completed',
                'is_featured': False,
            },
            {
                'title': 'Portfolio Website',
                'slug': 'portfolio-website',
                'short_description': 'Personal portfolio built with Next.js and Django REST API',
                'description': '''Full-stack portfolio website featuring a React/Next.js frontend and Django REST API backend.

Modern, responsive design with dark mode support and dynamic content management.''',
                'technologies': 'Next.js, TypeScript, Django, Python, REST API, Tailwind CSS',
                'github_url': 'https://github.com/Anurag-Shankar-Maurya/portfolio',
                'status': 'completed',
                'is_featured': True,
            },
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

        # Create Certificates
        certificates_data = [
            {
                'title': 'Android App Development Training',
                'issuing_organization': 'Internshala Trainings',
                'issue_date': '2024-01-01',
                'description': 'Comprehensive training on Android application development fundamentals and best practices.',
            },
        ]

        for idx, cert_data in enumerate(certificates_data):
            cert, created = Certificate.objects.get_or_create(
                profile=profile,
                title=cert_data['title'],
                defaults={
                    **cert_data,
                    'show_on_home': True
                }
            )
            self.stdout.write(f'  {"Created" if created else "Exists"} certificate: {cert.title}')

        # Create Achievements
        achievements_data = [
            {
                'title': 'Top Performer - National Science Day',
                'achievement_type': 'recognition',
                'issuer': 'Central University of Haryana',
                'description': 'Developed Smart Irrigation System and Attendance Management App, recognized as top performer at Central University of Haryana.',
                'date': '2024-02-28',
            },
            {
                'title': 'Smart India Hackathon - AI Career Guidance System',
                'achievement_type': 'award',
                'issuer': 'Smart India Hackathon',
                'description': 'Built an AI-powered career guidance system for Smart India Hackathon competition.',
                'date': '2024-01-01',
            },
            {
                'title': 'Intra-College Hackathon - Direct Market Access for Farmers',
                'achievement_type': 'award',
                'issuer': 'Central University of Haryana',
                'description': 'Developed a mobile application providing direct market access for farmers, enabling them to sell produce directly to consumers.',
                'date': '2023-01-01',
            },
        ]

        for idx, ach_data in enumerate(achievements_data):
            achievement, created = Achievement.objects.get_or_create(
                profile=profile,
                title=ach_data['title'],
                defaults={
                    **ach_data,
                    'order': idx,
                    'show_on_home': True
                }
            )
            self.stdout.write(f'  {"Created" if created else "Exists"} achievement: {achievement.title}')

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
        self.stdout.write(f'  - {Certificate.objects.count()} Certificates')
        self.stdout.write(f'  - {Achievement.objects.count()} Achievements')
