"""
Data seed command to populate the portfolio database with Anurag Shankar Maurya's data.
Run with: python manage.py seed_anurag
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import date
from api.models import (
    Profile, SocialLink, Skill, Education, WorkExperience,
    Project, Certificate, Achievement, BlogCategory, BlogTag,
    BlogPost, Testimonial, SiteConfiguration
)


class Command(BaseCommand):
    help = 'Seeds the database with Anurag Shankar Maurya portfolio data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Starting database seed for Anurag Shankar Maurya...'))
        
        # Clear existing data (optional - comment out if you want to keep existing data)
        self.clear_existing_data()
        
        # Create profile
        profile = self.create_profile()
        
        # Create social links
        self.create_social_links(profile)
        
        # Create skills
        self.create_skills(profile)
        
        # Create education
        self.create_education(profile)
        
        # Create work experience
        self.create_work_experience(profile)
        
        # Create projects
        self.create_projects(profile)
        
        # Create certificates and achievements
        self.create_certificates(profile)
        self.create_achievements(profile)
        
        # Create blog categories and tags
        self.create_blog_content(profile)
        
        # Create testimonials
        self.create_testimonials(profile)
        
        # Create site configuration
        self.create_site_config()
        
        self.stdout.write(self.style.SUCCESS('✅ Database seeded successfully with Anurag\'s portfolio data!'))

    def clear_existing_data(self):
        """Clear all existing portfolio data"""
        self.stdout.write('Clearing existing data...')
        
        models_to_clear = [
            Testimonial, BlogPost, BlogTag, BlogCategory,
            Achievement, Certificate, Project, WorkExperience,
            Education, Skill, SocialLink, Profile, SiteConfiguration
        ]
        
        for model in models_to_clear:
            count = model.objects.count()
            model.objects.all().delete()
            self.stdout.write(f'  Deleted {count} {model.__name__} records')

    def create_profile(self):
        """Create main profile"""
        self.stdout.write('Creating profile...')
        
        profile = Profile.objects.create(
            full_name="Anurag Shankar Maurya",
            headline="Android & Full-Stack Developer | AI & Software Developer | Django Backend Developer",
            bio="""Innovative Android & Full-Stack Developer with expertise in Kotlin, Python, Django, and AI-driven applications. 

Expert Django Backend Developer & Full-Stack AI Engineer specializing in Generative AI integration, LLM prompt engineering, RAG systems, and custom AI solutions. 

Proven expertise in designing scalable backend architectures, building AI-powered web applications, and delivering enterprise-grade solutions. Experienced in managing international client relationships across UK, Taiwan, and India regions.

Key Areas of Expertise:
• Mobile Development: Kotlin, Java, Android SDK, Firebase, Room DB
• AI & ML: Python, LangChain, OpenAI, Pinecone, Deepgram, Gemini API, RAG Systems
• Backend Development: Django 5.x, Django REST Framework, PostgreSQL, Database Optimization
• Full-Stack: React.js, HTML/CSS, JavaScript, WebSocket, Real-time Features
• DevOps: Docker, Docker-Compose, Nginx, Vercel, Render, CI/CD Pipelines

Passionate about building scalable, efficient, and user-centric software solutions.""",
            email="anuragshankarmaurya@gmail.com",
            phone="+91 8707297564",
            location="Mahendragarh, Haryana, India",
            years_of_experience=3,
            current_role="Software Developer Intern",
            current_company="TechOTD Solutions Pvt. Ltd.",
            available_for_hire=True
        )
        
        self.stdout.write(self.style.SUCCESS(f'  Created profile: {profile.full_name}'))
        return profile

    def create_social_links(self, profile):
        """Create social media links"""
        self.stdout.write('Creating social links...')
        
        social_links = [
            {'platform': 'linkedin', 'url': 'https://linkedin.com/in/anurag-shankar-maurya', 'order': 1, 'show_on_home': True},
            {'platform': 'github', 'url': 'https://github.com/Anurag-Shankar-Maurya', 'order': 2, 'show_on_home': True},
            {'platform': 'email', 'url': 'mailto:anuragshankarmaurya@gmail.com', 'order': 3, 'show_on_home': True},
            {'platform': 'twitter', 'url': 'https://twitter.com/AnuragSMaurya', 'order': 4, 'show_on_home': False},
        ]
        
        for link_data in social_links:
            link = SocialLink.objects.create(profile=profile, **link_data)
            self.stdout.write(f'  Created social link: {link.platform}')

    def create_skills(self, profile):
        """Create skills categorized by type"""
        self.stdout.write('Creating skills...')
        
        skills_data = [
            # Programming Languages
            {'name': 'Python', 'skill_type': 'language', 'proficiency': 'expert', 'order': 1, 'show_on_home': True},
            {'name': 'Kotlin', 'skill_type': 'language', 'proficiency': 'expert', 'order': 2, 'show_on_home': True},
            {'name': 'Java', 'skill_type': 'language', 'proficiency': 'advanced', 'order': 3, 'show_on_home': True},
            {'name': 'JavaScript', 'skill_type': 'language', 'proficiency': 'advanced', 'order': 4, 'show_on_home': True},
            {'name': 'TypeScript', 'skill_type': 'language', 'proficiency': 'intermediate', 'order': 5, 'show_on_home': False},
            {'name': 'C++', 'slug': 'cpp', 'skill_type': 'language', 'proficiency': 'intermediate', 'order': 6, 'show_on_home': False},
            {'name': 'C', 'slug': 'c-lang', 'skill_type': 'language', 'proficiency': 'intermediate', 'order': 7, 'show_on_home': False},
            
            # Frontend Development
            {'name': 'React', 'skill_type': 'frontend-dev', 'proficiency': 'advanced', 'order': 10, 'show_on_home': True},
            {'name': 'HTML5', 'skill_type': 'frontend-dev', 'proficiency': 'expert', 'order': 11, 'show_on_home': True},
            {'name': 'CSS3', 'skill_type': 'frontend-dev', 'proficiency': 'expert', 'order': 12, 'show_on_home': True},
            {'name': 'Bootstrap', 'skill_type': 'frontend-dev', 'proficiency': 'advanced', 'order': 13, 'show_on_home': False},
            {'name': 'Tailwind', 'skill_type': 'frontend-dev', 'proficiency': 'intermediate', 'order': 14, 'show_on_home': False},
            
            # Backend Development
            {'name': 'Django', 'skill_type': 'backend-dev', 'proficiency': 'expert', 'order': 20, 'show_on_home': True},
            {'name': 'Node.js', 'skill_type': 'backend-dev', 'proficiency': 'intermediate', 'order': 21, 'show_on_home': False},
            {'name': 'Express', 'skill_type': 'backend-dev', 'proficiency': 'intermediate', 'order': 22, 'show_on_home': False},
            {'name': 'GraphQL', 'skill_type': 'backend-dev', 'proficiency': 'beginner', 'order': 23, 'show_on_home': False},
            
            # Mobile App Development
            {'name': 'Android', 'skill_type': 'mobile-app-dev', 'proficiency': 'expert', 'order': 30, 'show_on_home': True},
            {'name': 'Flutter', 'skill_type': 'mobile-app-dev', 'proficiency': 'beginner', 'order': 31, 'show_on_home': False},
            
            # AI/ML
            {'name': 'TensorFlow', 'skill_type': 'ai-ml', 'proficiency': 'intermediate', 'order': 40, 'show_on_home': True},
            {'name': 'PyTorch', 'skill_type': 'ai-ml', 'proficiency': 'intermediate', 'order': 41, 'show_on_home': False},
            {'name': 'OpenCV', 'skill_type': 'ai-ml', 'proficiency': 'intermediate', 'order': 42, 'show_on_home': False},
            {'name': 'Pandas', 'skill_type': 'ai-ml', 'proficiency': 'advanced', 'order': 43, 'show_on_home': False},
            
            # Databases
            {'name': 'PostgreSQL', 'skill_type': 'database', 'proficiency': 'advanced', 'order': 50, 'show_on_home': True},
            {'name': 'MongoDB', 'skill_type': 'database', 'proficiency': 'advanced', 'order': 51, 'show_on_home': True},
            {'name': 'SQLite', 'skill_type': 'database', 'proficiency': 'expert', 'order': 52, 'show_on_home': False},
            {'name': 'Firebase', 'skill_type': 'database', 'proficiency': 'advanced', 'order': 53, 'show_on_home': True},
            {'name': 'Redis', 'skill_type': 'database', 'proficiency': 'intermediate', 'order': 54, 'show_on_home': False},
            
            # DevOps
            {'name': 'Docker', 'skill_type': 'devops', 'proficiency': 'advanced', 'order': 60, 'show_on_home': True},
            {'name': 'Git', 'skill_type': 'devops', 'proficiency': 'expert', 'order': 61, 'show_on_home': True},
            {'name': 'Linux', 'skill_type': 'devops', 'proficiency': 'advanced', 'order': 62, 'show_on_home': False},
            {'name': 'Nginx', 'skill_type': 'devops', 'proficiency': 'intermediate', 'order': 63, 'show_on_home': False},
            {'name': 'AWS', 'skill_type': 'devops', 'proficiency': 'beginner', 'order': 64, 'show_on_home': False},
            
            # Frameworks
            {'name': 'Next.js', 'skill_type': 'frameworks', 'proficiency': 'intermediate', 'order': 70, 'show_on_home': False},
            {'name': 'Flask', 'skill_type': 'frameworks', 'proficiency': 'intermediate', 'order': 71, 'show_on_home': False},
            
            # Softwares / Design
            {'name': 'Figma', 'skill_type': 'softwares', 'proficiency': 'advanced', 'order': 80, 'show_on_home': True},
            {'name': 'Photoshop', 'skill_type': 'softwares', 'proficiency': 'intermediate', 'order': 81, 'show_on_home': False},
            {'name': 'Postman', 'skill_type': 'softwares', 'proficiency': 'advanced', 'order': 82, 'show_on_home': False},
            
            # Others
            {'name': 'Arduino', 'skill_type': 'others', 'proficiency': 'advanced', 'order': 90, 'show_on_home': False},
        ]
        
        for skill_data in skills_data:
            # Auto-assign icon from ICON_MAPPING
            icon = Skill.ICON_MAPPING.get(skill_data['name'], '')
            skill = Skill.objects.create(profile=profile, icon=icon, **skill_data)
            self.stdout.write(f'  Created skill: {skill.name}')

    def create_education(self, profile):
        """Create education records"""
        self.stdout.write('Creating education...')
        
        education_data = [
            {
                'institution': 'Central University of Haryana',
                'degree': 'Bachelor of Technology (B.Tech)',
                'field_of_study': 'Computer Science & Engineering',
                'start_date': date(2021, 8, 1),
                'end_date': date(2025, 6, 30),
                'is_current': False,
                'grade': 'GPA: 8+/10',
                'description': 'Relevant Coursework: Artificial Intelligence, Database Management Systems, Web Development, Algorithms, Data Structures, Software Engineering',
                'location': 'Mahendragarh, Haryana',
                'show_on_home': True,
            },
            {
                'institution': 'Parvati Prema Jagati Saraswati Vihar',
                'degree': 'Senior Secondary (XII)',
                'field_of_study': 'Science (Mathematics)',
                'start_date': date(2018, 4, 1),
                'end_date': date(2020, 3, 31),
                'is_current': False,
                'grade': 'Percentage: 93.40%',
                'description': 'CBSE Board - Physics, Chemistry, Mathematics, Computer Science',
                'location': 'Nainital, Uttarakhand',
                'show_on_home': True,
            },
            {
                'institution': 'Parvati Prema Jagati Saraswati Vihar',
                'degree': 'Secondary (X)',
                'field_of_study': 'General',
                'start_date': date(2016, 4, 1),
                'end_date': date(2018, 3, 31),
                'is_current': False,
                'grade': 'Percentage: 93.20%',
                'description': 'CBSE Board',
                'location': 'Nainital, Uttarakhand',
                'show_on_home': False,
            },
        ]
        
        for edu_data in education_data:
            edu = Education.objects.create(profile=profile, **edu_data)
            self.stdout.write(f'  Created education: {edu.degree} at {edu.institution}')

    def create_work_experience(self, profile):
        """Create work experience records"""
        self.stdout.write('Creating work experience...')
        
        experience_data = [
            {
                'company_name': 'TechOTD Solutions Pvt. Ltd.',
                'company_url': 'https://techotd.com',
                'job_title': 'Software Developer Intern',
                'employment_type': 'internship',
                'work_mode': 'remote',
                'location': 'Remote',
                'start_date': date(2025, 3, 1),
                'end_date': None,
                'is_current': True,
                'description': """Architecting AI-powered solutions and building enterprise-grade applications.

Key Responsibilities:
• Architected AI-powered compliance platform with GDPR/CCPA adherence, building sophisticated RAG systems leveraging MongoDB & Pinecone vector database
• Developed advanced prompt engineering strategies for contextual AI responses using LangChain, enabling intelligent email compliance chatbots
• Engineered real-time speech transcription system with speaker diarization using Django WebSocket, Deepgram, and custom backend pipeline
• Built responsive frontend interfaces with React.js & Bootstrap, ensuring seamless user experience for complex AI workflows
• Collaborated with international clients from UK and Taiwan, managing requirements and delivering production-ready solutions""",
                'achievements': 'Successfully delivered AI compliance tools serving international clients. Built RAG systems with 95% accuracy in contextual responses.',
                'technologies_used': 'Python, Django, LangChain, OpenAI, Pinecone, MongoDB, Deepgram, WebSocket, React.js, Bootstrap, REST APIs',
                'order': 1,
                'show_on_home': True,
            },
            {
                'company_name': 'Institute of Engineering & Technology, Lucknow',
                'company_url': '',
                'job_title': 'Android Application Development Intern',
                'employment_type': 'internship',
                'work_mode': 'hybrid',
                'location': 'Lucknow, Uttar Pradesh',
                'start_date': date(2024, 6, 1),
                'end_date': date(2024, 8, 31),
                'is_current': False,
                'description': """Developed AI-enhanced Android applications with focus on modern UI/UX.

Key Responsibilities:
• Designed AI-enhanced Android applications, incorporating Gemini API for personalized interactions
• Collaborated on real-world problems with a focus on modern UI/UX and efficient app performance
• Optimized performance and accessibility for diverse user bases
• Implemented Material Design principles for intuitive user experiences""",
                'achievements': 'Developed multiple AI-integrated Android applications with improved user engagement.',
                'technologies_used': 'Kotlin, Java, Android SDK, Gemini API, Firebase, Material Design, XML',
                'order': 2,
                'show_on_home': True,
            },
            {
                'company_name': 'Sanchar Mitra, Department of Telecommunications (DOT), Government of India',
                'company_url': 'https://dot.gov.in',
                'job_title': 'Public Outreach Intern',
                'employment_type': 'internship',
                'work_mode': 'onsite',
                'location': 'India',
                'start_date': date(2024, 2, 1),
                'end_date': date(2024, 8, 31),
                'is_current': False,
                'description': """Conducted educational workshops on digital literacy and cybersecurity.

Key Responsibilities:
• Delivered workshops on digital tools and cybersecurity, emphasizing online safety and data privacy
• Conducted workshops impacting 500+ participants on cybersecurity awareness
• Created educational materials on safe digital practices
• Collaborated with government officials to spread digital literacy""",
                'achievements': 'Impacted 500+ participants through cybersecurity and digital tools workshops.',
                'technologies_used': 'Public Speaking, Digital Literacy, Cybersecurity Awareness',
                'order': 3,
                'show_on_home': False,
            },
            {
                'company_name': 'ByteCode Learners Club',
                'company_url': '',
                'job_title': 'Tutor',
                'employment_type': 'part-time',
                'work_mode': 'onsite',
                'location': 'Mahendragarh, Haryana',
                'start_date': date(2022, 11, 1),
                'end_date': None,
                'is_current': True,
                'description': """Mentoring students in programming and application development.

Key Responsibilities:
• Conducted workshops on Android application development fundamentals
• Mentored students in designing and debugging mobile applications
• Organized hands-on sessions for building real-world projects
• Conducted workshops on Arduino programming and robotics fundamentals
• Introduced TinkerCAD for rapid prototyping and embedded systems design""",
                'achievements': 'Mentored multiple batches of students in Android development and robotics.',
                'technologies_used': 'Android, Kotlin, Java, Arduino, TinkerCAD, Python',
                'order': 4,
                'show_on_home': False,
            },
        ]
        
        for exp_data in experience_data:
            exp = WorkExperience.objects.create(profile=profile, **exp_data)
            self.stdout.write(f'  Created experience: {exp.job_title} at {exp.company_name}')

    def create_projects(self, profile):
        """Create project records"""
        self.stdout.write('Creating projects...')
        
        projects_data = [
            {
                'title': 'GDA (Global Development Alliance)',
                'short_description': 'Enterprise Django CMS with AI Integration serving 500+ projects and 10,000+ users',
                'description': """Enterprise-grade Content Management System built with Django 5.2 and React.js.

Key Features:
• Built enterprise CMS with Django 5.2 & React.js serving 500+ projects, 10,000+ users across 50+ organizations
• Implemented Django REST API with advanced filtering, authentication, and permission systems
• Integrated generative AI for intelligent recommendations, automated FAQ generation, and analytics
• Designed real-time analytics dashboard with Chart.js visualizations and business intelligence
• Deployed using Docker, Docker-Compose, Nginx with PostgreSQL and production security
• Built comprehensive testing suite, CI/CD pipelines, and security configurations

This project demonstrates expertise in full-stack development, AI integration, and enterprise-level architecture.""",
                'live_url': 'https://gda-demo.example.com',
                'github_url': 'https://github.com/Anurag-Shankar-Maurya/gda',
                'demo_url': '',
                'technologies': 'Django 5.2, React.js, PostgreSQL, REST API, Docker, Docker-Compose, Nginx, Generative AI, Chart.js',
                'role': 'Full-Stack Developer',
                'team_size': 1,
                'start_date': date(2024, 9, 1),
                'end_date': date(2024, 12, 31),
                'status': 'completed',
                'is_featured': True,
                'is_visible': True,
                'show_on_home': True,
                'order': 1,
            },
            {
                'title': 'Julia English Kids Talk',
                'short_description': 'AI-Powered Educational Platform with Generative AI for English learning',
                'description': """AI-powered educational application for English language learning using advanced generative AI models.

Key Features:
• Built AI-powered educational app using advanced generative AI models for English learning
• Engineered prompt engineering for adaptive conversations personalized to proficiency levels
• Created curriculum-aligned content with dynamic lesson generation and AI-powered storytelling
• Implemented progress tracking & analytics for real-time learning outcome monitoring
• Deployed on Render platform with optimized backend for concurrent sessions

The platform uses LLM integration and advanced prompt engineering to create personalized learning experiences.""",
                'live_url': 'https://julia-english.example.com',
                'github_url': 'https://github.com/Anurag-Shankar-Maurya/julia-english-kids-talk',
                'demo_url': '',
                'technologies': 'Django, LLM Integration, Prompt Engineering, Python, Interactive Learning, Render',
                'role': 'Full-Stack AI Developer',
                'team_size': 1,
                'start_date': date(2024, 7, 1),
                'end_date': date(2024, 10, 31),
                'status': 'completed',
                'is_featured': True,
                'is_visible': True,
                'show_on_home': True,
                'order': 2,
            },
            {
                'title': 'DeepTranscribe',
                'short_description': 'Real-Time Speech Transcription & AI Chatbot with Speaker Diarization',
                'description': """Real-time speech transcription system with speaker diarization and AI-powered Q&A capabilities.

Key Features:
• Built a speaker diarization system with real-time transcription using Deepgram
• Integrated LangChain & Pinecone for contextual memory in chatbot responses
• Implemented RAG-based chatbot for intelligent question answering
• Designed efficient message queue system for concurrent requests and context management
• WebSocket-based real-time communication for live transcription

The system combines cutting-edge speech recognition with AI chatbot capabilities for comprehensive audio analysis.""",
                'live_url': '',
                'github_url': 'https://github.com/Anurag-Shankar-Maurya/DeepTranscribe',
                'demo_url': '',
                'technologies': 'Django, Deepgram, WebSocket, LangChain, Pinecone, RAG, Python',
                'role': 'Backend Developer',
                'team_size': 1,
                'start_date': date(2024, 5, 1),
                'end_date': date(2024, 8, 31),
                'status': 'completed',
                'is_featured': True,
                'is_visible': True,
                'show_on_home': True,
                'order': 3,
            },
            {
                'title': 'Censor AI',
                'short_description': 'Email Compliance & Risk Mitigation Tool for GDPR/CCPA adherence',
                'description': """AI-driven email validator for policy compliance with automated approval workflows.

Key Features:
• Developed an AI-driven email validator for policy compliance (GDPR/CCPA)
• Implemented automated manager approval workflows for high-risk emails
• Built custom OpenAI prompt engineering for compliance analysis
• Designed intelligent workflow automation with AI risk assessment
• Implemented contextual risk scoring using LLM prompt chains for multi-level email analysis

Enterprise-grade solution for email compliance ensuring regulatory adherence.""",
                'live_url': '',
                'github_url': 'https://github.com/Anurag-Shankar-Maurya/CensorAI',
                'demo_url': '',
                'technologies': 'Python, Django, OpenAI, REST APIs, Custom Prompt Engineering, GDPR, CCPA',
                'role': 'AI Developer',
                'team_size': 1,
                'start_date': date(2024, 4, 1),
                'end_date': date(2024, 7, 31),
                'status': 'completed',
                'is_featured': True,
                'is_visible': True,
                'show_on_home': True,
                'order': 4,
            },
            {
                'title': 'Sparkle AI',
                'short_description': 'Personalized Chat Android App with AI Personalities',
                'description': """Android chat application with integrated Google Gemini API for dynamic AI interactions.

Key Features:
• Integrated Google's Gemini API for dynamic AI personalities and chat interactions
• Implemented diverse AI personalities for interactive user experiences
• Built with Kotlin and modern Android architecture
• Firebase integration for real-time data synchronization
• Clean Material Design UI for intuitive user experience

The app showcases AI integration in mobile applications with personalized conversational experiences.""",
                'live_url': '',
                'github_url': 'https://github.com/Anurag-Shankar-Maurya/SparkleAI',
                'demo_url': '',
                'technologies': 'Kotlin, XML, Google Gemini API, Firebase, Android SDK, Material Design',
                'role': 'Android Developer',
                'team_size': 1,
                'start_date': date(2024, 3, 1),
                'end_date': date(2024, 5, 31),
                'status': 'completed',
                'is_featured': True,
                'is_visible': True,
                'show_on_home': True,
                'order': 5,
            },
            {
                'title': 'FakeHai',
                'short_description': 'Fake News Detection Android App with Fine-Tuned AI Model',
                'description': """AI-powered Android application for real-time fake news detection.

Key Features:
• Designed an AI model to detect fake news with real-time analysis
• Implemented fine-tuned Gemini model for accurate detection
• Built intuitive UI with clear visual indicators for news authenticity
• Real-time analysis with confidence scoring
• User-friendly interface for easy news verification

Combating misinformation through AI-powered analysis and verification.""",
                'live_url': '',
                'github_url': 'https://github.com/Anurag-Shankar-Maurya/FakeHai',
                'demo_url': '',
                'technologies': 'Kotlin, Gemini API, Fine-Tuned AI Model, Android SDK, XML',
                'role': 'Android & AI Developer',
                'team_size': 1,
                'start_date': date(2024, 2, 1),
                'end_date': date(2024, 4, 30),
                'status': 'completed',
                'is_featured': False,
                'is_visible': True,
                'show_on_home': False,
                'order': 6,
            },
            {
                'title': 'We Parcel',
                'short_description': 'Courier Service Landing Page with Real-time Tracking',
                'description': """Responsive courier service landing page with tracking and booking system.

Key Features:
• Created a responsive UI with modern design principles
• Implemented real-time tracking visualization
• Built booking system interface
• Mobile-first responsive design
• Clean and professional UI/UX

Demonstrates frontend development skills with focus on user experience.""",
                'live_url': '',
                'github_url': 'https://github.com/Anurag-Shankar-Maurya/WeParcel',
                'demo_url': '',
                'technologies': 'HTML, CSS, JavaScript',
                'role': 'Frontend Developer',
                'team_size': 1,
                'start_date': date(2023, 10, 1),
                'end_date': date(2023, 11, 30),
                'status': 'completed',
                'is_featured': False,
                'is_visible': True,
                'show_on_home': False,
                'order': 7,
            },
            {
                'title': 'Arduino Burglar Alarm System',
                'short_description': 'Motion-sensing alarm system using ultrasonic sensor',
                'description': """Arduino-based security system for intrusion detection.

Key Features:
• Developed a motion-sensing alarm using an ultrasonic sensor and buzzer
• Designed the system to detect unauthorized entry and sound an alert
• Implemented distance-based detection algorithms
• Low-cost security solution for home automation

Demonstrates embedded systems and IoT development skills.""",
                'live_url': '',
                'github_url': '',
                'demo_url': '',
                'technologies': 'Arduino, C++, Ultrasonic Sensor, TinkerCAD',
                'role': 'Embedded Systems Developer',
                'team_size': 1,
                'start_date': date(2023, 6, 1),
                'end_date': date(2023, 7, 31),
                'status': 'completed',
                'is_featured': False,
                'is_visible': True,
                'show_on_home': False,
                'order': 8,
            },
            {
                'title': 'Auto Street Light with Dusk Detection',
                'short_description': 'Smart street light system with automatic dusk detection',
                'description': """Energy-efficient smart street light system with ambient light sensing.

Key Features:
• Built a smart street light system that turns on automatically at dusk
• Used LDR (Light Dependent Resistor) for ambient light detection
• Demonstrated energy efficiency by automating lighting
• Implemented threshold-based switching logic

IoT solution for smart city infrastructure.""",
                'live_url': '',
                'github_url': '',
                'demo_url': '',
                'technologies': 'Arduino, C++, LDR Sensor, TinkerCAD',
                'role': 'Embedded Systems Developer',
                'team_size': 1,
                'start_date': date(2023, 5, 1),
                'end_date': date(2023, 6, 30),
                'status': 'completed',
                'is_featured': False,
                'is_visible': True,
                'show_on_home': False,
                'order': 9,
            },
        ]
        
        for project_data in projects_data:
            project = Project.objects.create(profile=profile, **project_data)
            self.stdout.write(f'  Created project: {project.title}')

    def create_certificates(self, profile):
        """Create certificate records"""
        self.stdout.write('Creating certificates...')
        
        certificates_data = [
            {
                'title': 'Android App Development Training',
                'issuing_organization': 'Internshala Trainings',
                'issue_date': date(2024, 1, 15),
                'expiry_date': None,
                'does_not_expire': True,
                'credential_id': 'INT-AND-2024',
                'credential_url': 'https://trainings.internshala.com/verify',
                'description': 'Comprehensive training in Android application development covering Kotlin, Java, and modern Android architecture.',
                'skills': 'Android, Kotlin, Java, XML, Firebase',
                'order': 1,
                'show_on_home': True,
            },
        ]
        
        for cert_data in certificates_data:
            cert = Certificate.objects.create(profile=profile, **cert_data)
            self.stdout.write(f'  Created certificate: {cert.title}')

    def create_achievements(self, profile):
        """Create achievement records"""
        self.stdout.write('Creating achievements...')
        
        achievements_data = [
            {
                'title': 'Top Performer - National Science Day',
                'achievement_type': 'award',
                'issuer': 'Central University of Haryana',
                'date': date(2024, 2, 28),
                'description': 'Mentored placeholder team with Attendance Management App project. Demonstrated leadership and technical excellence.',
                'url': '',
                'order': 1,
                'show_on_home': True,
            },
            {
                'title': 'Smart India Hackathon - AI Career Guidance System',
                'achievement_type': 'recognition',
                'issuer': 'Central University of Haryana',
                'date': date(2023, 9, 15),
                'description': 'Developed AI-powered career guidance system for intra-college Smart India Hackathon. Showcased AI/ML integration skills.',
                'url': '',
                'order': 2,
                'show_on_home': True,
            },
            {
                'title': 'Intra-College Hackathon - Direct Market Access for Farmers',
                'achievement_type': 'recognition',
                'issuer': 'Central University of Haryana',
                'date': date(2023, 8, 20),
                'description': 'Built mobile application for direct market access enabling farmers to sell produce directly to consumers.',
                'url': '',
                'order': 3,
                'show_on_home': True,
            },
            {
                'title': 'National Science Day - Smart Irrigation System',
                'achievement_type': 'award',
                'issuer': 'Central University of Haryana',
                'date': date(2023, 2, 28),
                'description': 'Placeholder position in National Science Day competition with Smart Irrigation System project.',
                'url': '',
                'order': 4,
                'show_on_home': False,
            },
        ]
        
        for achievement_data in achievements_data:
            achievement = Achievement.objects.create(profile=profile, **achievement_data)
            self.stdout.write(f'  Created achievement: {achievement.title}')

    def create_blog_content(self, profile):
        """Create blog categories, tags, and sample posts"""
        self.stdout.write('Creating blog content...')
        
        # Categories
        categories_data = [
            {'name': 'Android Development', 'description': 'Tutorials and insights on Android app development', 'order': 1, 'show_on_home': True},
            {'name': 'AI & Machine Learning', 'description': 'Articles on AI, ML, and LLM technologies', 'order': 2, 'show_on_home': True},
            {'name': 'Django & Backend', 'description': 'Backend development with Django and Python', 'order': 3, 'show_on_home': True},
            {'name': 'Web Development', 'description': 'Frontend and full-stack web development', 'order': 4, 'show_on_home': False},
            {'name': 'Robotics & IoT', 'description': 'Arduino, embedded systems, and IoT projects', 'order': 5, 'show_on_home': False},
        ]
        
        categories = {}
        for cat_data in categories_data:
            cat = BlogCategory.objects.create(**cat_data)
            categories[cat.name] = cat
            self.stdout.write(f'  Created category: {cat.name}')
        
        # Tags
        tags_data = [
            {'name': 'Kotlin', 'show_on_home': True},
            {'name': 'Python', 'show_on_home': True},
            {'name': 'Django', 'show_on_home': True},
            {'name': 'React', 'show_on_home': True},
            {'name': 'AI', 'show_on_home': True},
            {'name': 'LangChain', 'show_on_home': False},
            {'name': 'OpenAI', 'show_on_home': False},
            {'name': 'Firebase', 'show_on_home': False},
            {'name': 'Android', 'show_on_home': True},
            {'name': 'Tutorial', 'show_on_home': False},
            {'name': 'Gemini API', 'show_on_home': False},
            {'name': 'RAG', 'show_on_home': False},
        ]
        
        tags = {}
        for tag_data in tags_data:
            tag = BlogTag.objects.create(**tag_data)
            tags[tag.name] = tag
            self.stdout.write(f'  Created tag: {tag.name}')
        
        # Sample Blog Posts
        posts_data = [
            {
                'title': 'Building AI-Powered Android Apps with Gemini API',
                'excerpt': 'Learn how to integrate Google\'s Gemini API into your Android applications for intelligent conversational experiences.',
                'content': """# Building AI-Powered Android Apps with Gemini API

In this comprehensive guide, we'll explore how to integrate Google's Gemini API into your Android applications to create intelligent, conversational experiences.

## Why Gemini API?

Google's Gemini API offers powerful multimodal AI capabilities that can understand and generate text, images, and more. For Android developers, this opens up exciting possibilities for creating smart applications.

## Getting Started

First, you'll need to set up your project with the necessary dependencies...

## Implementation

Here's how to implement a basic chat interface with Gemini...

## Best Practices

When building AI-powered apps, consider these important factors:
- Handle API rate limits gracefully
- Implement proper error handling
- Cache responses when appropriate
- Design for offline scenarios

## Conclusion

Integrating Gemini API into your Android apps can significantly enhance user experience with intelligent features.""",
                'category': categories['Android Development'],
                'status': 'published',
                'published_at': timezone.now(),
                'reading_time': 8,
                'is_featured': True,
                'show_on_home': True,
                'meta_title': 'Building AI-Powered Android Apps with Gemini API | Tutorial',
                'meta_description': 'Step-by-step guide to integrating Google Gemini API in Android apps for AI-powered features.',
                'meta_keywords': 'Android, Gemini API, AI, Kotlin, Google AI',
            },
            {
                'title': 'Introduction to RAG Systems with LangChain',
                'excerpt': 'Discover how to build Retrieval-Augmented Generation (RAG) systems using LangChain and vector databases.',
                'content': """# Introduction to RAG Systems with LangChain

Retrieval-Augmented Generation (RAG) is revolutionizing how we build AI applications. In this article, we'll explore how to implement RAG systems using LangChain.

## What is RAG?

RAG combines the power of large language models with external knowledge retrieval...

## Setting Up Your Environment

You'll need Python, LangChain, and a vector database like Pinecone...

## Building Your First RAG System

Let's walk through creating a basic RAG pipeline...

## Advanced Techniques

- Chunking strategies for optimal retrieval
- Hybrid search approaches
- Context window optimization

## Conclusion

RAG systems offer a powerful way to ground AI responses in factual, up-to-date information.""",
                'category': categories['AI & Machine Learning'],
                'status': 'published',
                'published_at': timezone.now(),
                'reading_time': 12,
                'is_featured': True,
                'show_on_home': True,
                'meta_title': 'Introduction to RAG Systems with LangChain | AI Tutorial',
                'meta_description': 'Learn to build Retrieval-Augmented Generation systems with LangChain and vector databases.',
                'meta_keywords': 'RAG, LangChain, AI, Python, Vector Database, Pinecone',
            },
        ]
        
        for post_data in posts_data:
            category = post_data.pop('category')
            post = BlogPost.objects.create(profile=profile, category=category, **post_data)
            
            # Add relevant tags
            if 'Android' in post.title:
                post.tags.add(tags['Android'], tags['Kotlin'], tags['AI'], tags['Gemini API'])
            elif 'RAG' in post.title:
                post.tags.add(tags['AI'], tags['Python'], tags['LangChain'], tags['RAG'])
            
            self.stdout.write(f'  Created blog post: {post.title}')

    def create_testimonials(self, profile):
        """Create testimonial records"""
        self.stdout.write('Creating testimonials...')
        
        testimonials_data = [
            {
                'author_name': 'Tech Lead',
                'author_title': 'Senior Software Engineer',
                'author_company': 'TechOTD Solutions',
                'content': 'Anurag demonstrated exceptional skills in AI integration and backend development. His work on our compliance platform was outstanding, delivering production-ready solutions ahead of schedule.',
                'rating': 5,
                'relationship': 'Supervisor at TechOTD',
                'linkedin_url': '',
                'is_featured': True,
                'is_visible': True,
                'show_on_home': True,
                'date': date(2025, 1, 1),
                'order': 1,
            },
            {
                'author_name': 'Faculty Mentor',
                'author_title': 'Assistant Professor',
                'author_company': 'IET Lucknow',
                'content': 'During his internship, Anurag showed remarkable aptitude for Android development and AI integration. His applications demonstrated both technical excellence and great user experience design.',
                'rating': 5,
                'relationship': 'Internship Mentor',
                'linkedin_url': '',
                'is_featured': True,
                'is_visible': True,
                'show_on_home': True,
                'date': date(2024, 8, 31),
                'order': 2,
            },
            {
                'author_name': 'Student Mentee',
                'author_title': 'Computer Science Student',
                'author_company': 'Central University of Haryana',
                'content': 'Anurag is an excellent tutor. His workshops on Android development and Arduino were incredibly helpful. He explains complex concepts in simple terms and is always patient with questions.',
                'rating': 5,
                'relationship': 'Mentee at ByteCode Learners Club',
                'linkedin_url': '',
                'is_featured': False,
                'is_visible': True,
                'show_on_home': False,
                'date': date(2024, 6, 15),
                'order': 3,
            },
        ]
        
        for testimonial_data in testimonials_data:
            testimonial = Testimonial.objects.create(profile=profile, **testimonial_data)
            self.stdout.write(f'  Created testimonial from: {testimonial.author_name}')

    def create_site_config(self):
        """Create site configuration"""
        self.stdout.write('Creating site configuration...')
        
        config, created = SiteConfiguration.objects.get_or_create(
            pk=1,
            defaults={
                'site_name': 'Anurag Shankar Maurya | Portfolio',
                'site_description': 'Android & Full-Stack Developer | AI & Software Developer | Django Backend Developer',
                'base_url': 'https://anurag-portfolio.vercel.app',
                'theme': 'dark',
                'neutral_color': 'slate',
            }
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS('  Created site configuration'))
        else:
            self.stdout.write('  Site configuration already exists')
