from django.db import models
from django.utils.text import slugify
from django.utils import timezone
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
import base64
from django.db.models import F, Max
from django.db.models.signals import post_delete
from django.dispatch import receiver


def reorder_model_items(model_class, filter_kwargs, order_field='order'):
    """
    Utility to reorder items of a model to ensure no gaps and consistent sequence.
    """
    items = model_class.objects.filter(**filter_kwargs).order_by(order_field, 'pk')
    for i, item in enumerate(items):
        if getattr(item, order_field) != i:
            model_class.objects.filter(pk=item.pk).update(**{order_field: i})


# ============================================
# IMAGE STORAGE (BLOB)
# ============================================

class Image(models.Model):
    """
    Generic image storage table using BLOB format.
    Can be linked to any model using GenericForeignKey.
    """
    IMAGE_TYPE_CHOICES = [
        ('cover', 'Cover Image'),
        ('gallery', 'Gallery Image'),
        ('thumbnail', 'Thumbnail'),
        ('logo', 'Logo'),
        ('avatar', 'Avatar'),
        ('og', 'Open Graph Image'),
        ('other', 'Other'),
    ]
    
    # Image data stored as BLOB
    image_data = models.BinaryField(editable=True, help_text="Image stored as binary data")
    # FileField for external storage (Cloudinary/S3). Use this to migrate away from BinaryField.
    image_file = models.ImageField(upload_to='images/', null=True, blank=True)
    
    # Image metadata
    filename = models.CharField(max_length=255)
    mime_type = models.CharField(max_length=50, default='image/jpeg')
    file_size = models.PositiveIntegerField(default=0, help_text="Size in bytes")
    width = models.PositiveIntegerField(blank=True, null=True)
    height = models.PositiveIntegerField(blank=True, null=True)
    
    # Image classification
    image_type = models.CharField(max_length=20, choices=IMAGE_TYPE_CHOICES, default='gallery')
    alt_text = models.CharField(max_length=255, blank=True, help_text="Alt text for accessibility/SEO")
    caption = models.CharField(max_length=500, blank=True)
    
    # Generic relation to any model
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    
    # Ordering and timestamps
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Display on homepage
    show_on_home = models.BooleanField(default=False, help_text="Display this image on homepage gallery")

    class Meta:
        ordering = ['order', '-created_at']
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
            models.Index(fields=['image_type']),
        ]

    def __str__(self):
        return f"{self.filename} ({self.image_type})"

    def get_base64(self):
        """Return image as base64 encoded string for frontend use"""
        if self.image_data:
            return base64.b64encode(self.image_data).decode('utf-8')
        return None

    def get_data_uri(self):
        """Return image as data URI for direct embedding in HTML"""
        if self.image_data:
            b64 = self.get_base64()
            return f"data:{self.mime_type};base64,{b64}"
        return None

    @classmethod
    def create_from_file(cls, file, content_object, image_type='gallery', alt_text='', caption='', order=0):
        """Helper method to create Image from uploaded file"""
        from PIL import Image as PILImage
        import io
        
        file_data = file.read()
        
        # Get image dimensions
        width, height = None, None
        try:
            img = PILImage.open(io.BytesIO(file_data))
            width, height = img.size
        except Exception:
            pass
        
        content_type = ContentType.objects.get_for_model(content_object)
        
        return cls.objects.create(
            image_data=file_data,
            filename=file.name,
            mime_type=file.content_type or 'image/jpeg',
            file_size=len(file_data),
            width=width,
            height=height,
            image_type=image_type,
            alt_text=alt_text,
            caption=caption,
            content_type=content_type,
            object_id=content_object.pk,
            order=order
        )


# ============================================
# ABOUT / PROFILE SECTION
# ============================================

class Profile(models.Model):
    """Main profile/about information"""
    full_name = models.CharField(max_length=100)
    headline = models.CharField(max_length=200, help_text="Short professional headline")
    bio = models.TextField(help_text="About me section content")
    
    # Cover image stored as BLOB
    profile_image_data = models.BinaryField(blank=True, null=True, editable=True, help_text="Profile image as binary")
    profile_image_mime = models.CharField(max_length=50, blank=True, default='image/jpeg')
    # File-based profile image (for external storage)
    profile_image_file = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    
    # Resume as BLOB
    resume_data = models.BinaryField(blank=True, null=True, editable=True, help_text="Resume file as binary")
    resume_filename = models.CharField(max_length=255, blank=True)
    resume_mime = models.CharField(max_length=100, blank=True)
    # File-based resume
    resume_file = models.FileField(upload_to='resumes/', null=True, blank=True)
    
    # Related images (gallery)
    images = GenericRelation(Image)
    
    # Contact Information
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    location = models.CharField(max_length=100, blank=True)
    
    # Professional Details
    years_of_experience = models.PositiveIntegerField(default=0)
    current_role = models.CharField(max_length=100, blank=True)
    current_company = models.CharField(max_length=100, blank=True)
    available_for_hire = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Profile"
        verbose_name_plural = "Profile"

    def __str__(self):
        return self.full_name


class SocialLink(models.Model):
    """Social media and professional links"""
    PLATFORM_CHOICES = [
        ('linkedin', 'LinkedIn'),
        ('github', 'GitHub'),
        ('twitter', 'Twitter/X'),
        ('instagram', 'Instagram'),
        ('facebook', 'Facebook'),
        ('youtube', 'YouTube'),
        ('dribbble', 'Dribbble'),
        ('behance', 'Behance'),
        ('medium', 'Medium'),
        ('dev', 'Dev.to'),
        ('stackoverflow', 'Stack Overflow'),
        ('website', 'Personal Website'),
        ('discord', 'Discord'),
        ('threads', 'Threads'),
        ('pinterest', 'Pinterest'),
        ('reddit', 'Reddit'),
        ('telegram', 'Telegram'),
        ('whatsapp', 'WhatsApp'),
        ('email', 'Email'),
        ('other', 'Other'),
    ]
    
    # Mapping of platform to icon name
    ICON_MAPPING = {
        'linkedin': 'linkedin',
        'github': 'github',
        'twitter': 'twitter',
        'instagram': 'instagram',
        'facebook': 'facebook',
        'youtube': 'youtube',
        'dribbble': 'dribbble',
        'behance': 'behance',
        'medium': 'medium',
        'dev': 'dev',
        'stackoverflow': 'stackoverflow',
        'website': 'website',
        'discord': 'discord',
        'threads': 'threads',
        'pinterest': 'pinterest',
        'reddit': 'reddit',
        'telegram': 'telegram',
        'whatsapp': 'whatsapp',
        'email': 'email',
        'other': 'other',
    }
    
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='social_links')
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    url = models.URLField()
    icon = models.CharField(max_length=50, blank=True, help_text="Icon class or name (leave blank for default)")
    order = models.PositiveIntegerField(default=0)
    
    # Display on homepage
    show_on_home = models.BooleanField(default=True, help_text="Display this social link on homepage")

    class Meta:
        ordering = ['order']

    def save(self, *args, **kwargs):
        # Auto-fill icon based on platform if not provided
        if not self.icon and self.platform in self.ICON_MAPPING:
            self.icon = self.ICON_MAPPING[self.platform]
        
        if not self.pk and self.order == 0:
            max_order = SocialLink.objects.filter(profile=self.profile).aggregate(Max('order'))['order__max']
            self.order = (max_order + 1) if max_order is not None else 0
        
        # Shift others if order is taken
        if self.pk:
            old_instance = SocialLink.objects.get(pk=self.pk)
            if old_instance.order != self.order:
                SocialLink.objects.filter(profile=self.profile, order__gte=self.order).exclude(pk=self.pk).update(order=F('order') + 1)
        elif self.order != 0:
            SocialLink.objects.filter(profile=self.profile, order__gte=self.order).update(order=F('order') + 1)
            
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.platform} - {self.profile.full_name}"


class Skill(models.Model):
    """Technical and soft skills"""
    SKILL_TYPE_CHOICES = [
        ('language', 'Language'),
        ('frontend-dev', 'Frontend Development'),
        ('backend-dev', 'Backend Development'),
        ('mobile-app-dev', 'Mobile App Development'),
        ('ai-ml', 'AI/ML'),
        ('database', 'Database'),
        ('data-visualization', 'Data Visualization'),
        ('devops', 'DevOps'),
        ('baas', 'Backend Services (BaaS)'),
        ('frameworks', 'Frameworks'),
        ('testing', 'Testing'),
        ('softwares', 'Softwares'),
        ('static-site-generator', 'Static Site Generator'),
        ('game-engine', 'Game Engine'),
        ('automation', 'Automation'),
        ('others', 'Others'),
    ]
    
    PROFICIENCY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('expert', 'Expert'),
    ]
    
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='skills')
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    skill_type = models.CharField(max_length=25, choices=SKILL_TYPE_CHOICES, default='language')
    proficiency = models.CharField(max_length=20, choices=PROFICIENCY_CHOICES, default='intermediate')
    icon = models.CharField(max_length=50, blank=True)
    order = models.PositiveIntegerField(default=0)
    
    # Display on homepage
    show_on_home = models.BooleanField(default=False, help_text="Display this skill on homepage")

    # Mapping of common skill names to icon keys in frontend
    ICON_MAPPING = {
        # Programming Languages
        'C': 'c',
        'C++': 'cplusplus',
        'C#': 'csharp',
        'Go': 'go',
        'Java': 'java',
        'JavaScript': 'javascript',
        'TypeScript': 'typescript',
        'PHP': 'php',
        'Perl': 'perl',
        'Ruby': 'ruby',
        'Scala': 'scala',
        'Python': 'python',
        'Swift': 'swift',
        'Objective-C': 'objectivec',
        'Clojure': 'clojure',
        'Rust': 'rust',
        'Haskell': 'haskell',
        'CoffeeScript': 'coffeescript',
        'Elixir': 'elixir',
        'Erlang': 'erlang',
        'Nim': 'nim',

        # Frontend
        'Vue.js': 'vuejs',
        'Vue': 'vuejs',
        'React': 'react',
        'Svelte': 'svelte',
        'Angular': 'angular',
        'AngularJS': 'angularjs',
        'Backbone.js': 'backbonejs',
        'Bootstrap': 'bootstrap',
        'Vuetify': 'vuetify',
        'CSS': 'css3',
        'CSS3': 'css3',
        'HTML': 'html5',
        'HTML5': 'html5',
        'Pug': 'pug',
        'Gulp': 'gulp',
        'Sass': 'sass',
        'Redux': 'redux',
        'Webpack': 'webpack',
        'Babel': 'babel',
        'Tailwind': 'tailwind',
        'Materialize': 'materialize',
        'Bulma': 'bulma',
        'GTK': 'gtk',
        'Qt': 'qt',
        'wxWidgets': 'wx_widgets',
        'Ember': 'ember',

        # Backend / APIs
        'Node.js': 'nodejs',
        'Spring': 'spring',
        'Express': 'express',
        'GraphQL': 'graphql',
        'Kafka': 'kafka',
        'Solr': 'solr',
        'RabbitMQ': 'rabbitmq',
        'Hadoop': 'hadoop',
        'Nginx': 'nginx',
        'OpenResty': 'openresty',
        'NestJS': 'nestjs',

        # Mobile
        'Android': 'android',
        'Flutter': 'flutter',
        'Dart': 'dart',
        'Kotlin': 'kotlin',
        'NativeScript': 'nativescript',
        'Xamarin': 'xamarin',
        'React Native': 'reactnative',
        'Ionic': 'ionic',
        'Apache Cordova': 'apachecordova',

        # AI / ML / Data
        'TensorFlow': 'tensorflow',
        'PyTorch': 'pytorch',
        'Pandas': 'pandas',
        'Seaborn': 'seaborn',
        'OpenCV': 'opencv',
        'Scikit-learn': 'scikit_learn',

        # Databases
        'MongoDB': 'mongodb',
        'MySQL': 'mysql',
        'PostgreSQL': 'postgresql',
        'Redis': 'redis',
        'Oracle': 'oracle',
        'Cassandra': 'cassandra',
        'CouchDB': 'couchdb',
        'Hive': 'hive',
        'Realm': 'realm',
        'MariaDB': 'mariadb',
        'CockroachDB': 'cockroachdb',
        'Elasticsearch': 'elasticsearch',
        'SQLite': 'sqlite',
        'MSSQL': 'mssql',

        # Data Visualization
        'D3.js': 'd3js',
        'Chart.js': 'chartjs',
        'CanvasJS': 'canvasjs',
        'Kibana': 'kibana',
        'Grafana': 'grafana',

        # DevOps / Cloud
        'AWS': 'aws',
        'Docker': 'docker',
        'Jenkins': 'jenkins',
        'GCP': 'gcp',
        'Kubernetes': 'kubernetes',
        'Bash': 'bash',
        'Azure': 'azure',
        'Vagrant': 'vagrant',
        'CircleCI': 'circleci',
        'TravisCI': 'travisci',

        # BaaS / Hosting
        'Firebase': 'firebase',
        'Appwrite': 'appwrite',
        'Amplify': 'amplify',
        'Heroku': 'heroku',

        # Frameworks / Backend frameworks
        'Django': 'django',
        '.NET': 'dotnet',
        'DotNet': 'dotnet',
        'Electron': 'electron',
        'Symfony': 'symfony',
        'Laravel': 'laravel',
        'CodeIgniter': 'codeigniter',
        'Rails': 'rails',
        'Flask': 'flask',
        'Quasar': 'quasar',

        # Testing
        'Cypress': 'cypress',
        'Selenium': 'selenium',
        'Jest': 'jest',
        'Mocha': 'mocha',
        'Puppeteer': 'puppeteer',
        'Karma': 'karma',
        'Jasmine': 'jasmine',

        # Tools / Design / Others
        'Illustrator': 'illustrator',
        'Photoshop': 'photoshop',
        'XD': 'xd',
        'Figma': 'figma',
        'Blender': 'blender',
        'Sketch': 'sketch',
        'Invision': 'invision',
        'Framer': 'framer',
        'MATLAB': 'matlab',
        'Postman': 'postman',

        # Static sites / SSGs
        'Gatsby': 'gatsby',
        'Gridsome': 'gridsome',
        'Hugo': 'hugo',
        'Jekyll': 'jekyll',
        'Next.js': 'nextjs',
        'Nuxt.js': 'nuxtjs',
        '11ty': '_11ty',
        'Scully': 'scully',
        'Sculpin': 'sculpin',
        'Sapper': 'sapper',
        'VuePress': 'vuepress',
        'Hexo': 'hexo',
        'Middleman': 'middleman',

        # Game Engines
        'Unity': 'unity',
        'Unreal Engine': 'unreal',

        # Automation
        'Zapier': 'zapier',
        'IFTTT': 'ifttt',

        # Misc
        'Linux': 'linux',
        'Git': 'git',
        'Arduino': 'arduino',
    }

    SKILL_CHOICES = [(name, name) for name in sorted(ICON_MAPPING.keys())] + [('other', 'Other (Manual Entry)')]

    class Meta:
        ordering = ['order', 'name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
            
            # Ensure slug uniqueness
            original_slug = self.slug
            queryset = Skill.objects.all()
            if self.pk:
                queryset = queryset.exclude(pk=self.pk)
            
            counter = 1
            while queryset.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1

        # Auto-fill icon based on name if not provided
        if not self.icon and self.name in self.ICON_MAPPING:
            self.icon = self.ICON_MAPPING[self.name]
            
        if not self.pk and self.order == 0:
            max_order = Skill.objects.filter(profile=self.profile).aggregate(Max('order'))['order__max']
            self.order = (max_order + 1) if max_order is not None else 0
            
        # Shift others if order is taken
        if self.pk:
            old_instance = Skill.objects.get(pk=self.pk)
            if old_instance.order != self.order:
                Skill.objects.filter(profile=self.profile, order__gte=self.order).exclude(pk=self.pk).update(order=F('order') + 1)
        else:
            Skill.objects.filter(profile=self.profile, order__gte=self.order).update(order=F('order') + 1)
            
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


# ============================================
# EDUCATION SECTION
# ============================================

class Education(models.Model):
    """Educational qualifications"""
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='education')
    institution = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    degree = models.CharField(max_length=200)
    field_of_study = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    is_current = models.BooleanField(default=False)
    grade = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    
    # Logo stored as BLOB
    logo_data = models.BinaryField(blank=True, null=True, editable=True, help_text="Institution logo as binary")
    logo_mime = models.CharField(max_length=50, blank=True, default='image/png')
    # File-based logo
    logo_file = models.ImageField(upload_to='education_logos/', null=True, blank=True)
    
    # Display on homepage
    show_on_home = models.BooleanField(default=False, help_text="Display this education on homepage")
    
    # Related images (gallery)
    images = GenericRelation(Image)
    
    class Meta:
        ordering = ['-start_date']
        verbose_name_plural = "Education"

    def __str__(self):
        return f"{self.degree} - {self.institution}"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.institution}-{self.degree}")
            
            # Ensure slug uniqueness
            original_slug = self.slug
            queryset = Education.objects.all()
            if self.pk:
                queryset = queryset.exclude(pk=self.pk)
            
            counter = 1
            while queryset.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)


# ============================================
# WORK EXPERIENCE SECTION
# ============================================

class WorkExperience(models.Model):
    """Work experience and employment history"""
    EMPLOYMENT_TYPE_CHOICES = [
        ('full-time', 'Full-time'),
        ('part-time', 'Part-time'),
        ('contract', 'Contract'),
        ('freelance', 'Freelance'),
        ('internship', 'Internship'),
        ('volunteer', 'Volunteer'),
    ]
    
    WORK_MODE_CHOICES = [
        ('onsite', 'On-site'),
        ('remote', 'Remote'),
        ('hybrid', 'Hybrid'),
    ]
    
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='work_experiences')
    company_name = models.CharField(max_length=200)
    
    # Company logo stored as BLOB
    company_logo_data = models.BinaryField(blank=True, null=True, editable=True, help_text="Company logo as binary")
    company_logo_mime = models.CharField(max_length=50, blank=True, default='image/png')
    # File-based company logo
    company_logo_file = models.ImageField(upload_to='company_logos/', null=True, blank=True)
    
    company_url = models.URLField(blank=True)
    job_title = models.CharField(max_length=200)
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPE_CHOICES, default='full-time')
    work_mode = models.CharField(max_length=20, choices=WORK_MODE_CHOICES, default='onsite')
    location = models.CharField(max_length=100, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    is_current = models.BooleanField(default=False)
    description = models.TextField(help_text="Job description and responsibilities")
    achievements = models.TextField(blank=True, help_text="Key achievements in this role")
    technologies_used = models.CharField(max_length=500, blank=True, help_text="Comma-separated list")
    order = models.PositiveIntegerField(default=0)
    
    # Display on homepage
    show_on_home = models.BooleanField(default=False, help_text="Display this work experience on homepage")
    
    # Related images (gallery)
    images = GenericRelation(Image)
    
    class Meta:
        ordering = ['-is_current', '-start_date']
        verbose_name = "Work Experience"
        verbose_name_plural = "Work Experiences"

    def __str__(self):
        return f"{self.job_title} at {self.company_name}"


# ============================================
# PROJECTS SECTION
# ============================================

class Project(models.Model):
    """Portfolio projects"""
    STATUS_CHOICES = [
        ('in-progress', 'In Progress'),
        ('completed', 'Completed'),
        ('on-hold', 'On Hold'),
        ('archived', 'Archived'),
    ]
    
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='projects')
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    short_description = models.CharField(max_length=300, help_text="Brief description for cards")
    description = models.TextField(help_text="Detailed project description")
    
    # Featured/Cover image stored as BLOB
    featured_image_data = models.BinaryField(blank=True, null=True, editable=True, help_text="Featured image as binary")
    featured_image_mime = models.CharField(max_length=50, blank=True, default='image/jpeg')
    # File-based featured image
    featured_image_file = models.ImageField(upload_to='project_images/', null=True, blank=True)
    featured_image_alt = models.CharField(max_length=255, blank=True, help_text="Alt text for SEO")
    
    # Related images (gallery) - replaces ProjectImage model
    images = GenericRelation(Image)
    
    # Links
    live_url = models.URLField(blank=True, help_text="Live project URL")
    github_url = models.URLField(blank=True, help_text="GitHub repository URL")
    demo_url = models.URLField(blank=True, help_text="Demo or video URL")
    
    # Technical Details
    technologies = models.CharField(max_length=500, help_text="Comma-separated list of technologies")
    role = models.CharField(max_length=100, blank=True, help_text="Your role in the project")
    team_size = models.PositiveIntegerField(default=1)
    
    # Dates
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='completed')
    
    # Display options
    is_featured = models.BooleanField(default=False)
    is_visible = models.BooleanField(default=True)
    show_on_home = models.BooleanField(default=False, help_text="Display this project on homepage")
    order = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_featured', 'order', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
            
            # Ensure slug uniqueness
            original_slug = self.slug
            queryset = Project.objects.all()
            if self.pk:
                queryset = queryset.exclude(pk=self.pk)
            
            counter = 1
            while queryset.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
                
        if not self.pk and self.order == 0:
            max_order = Project.objects.filter(profile=self.profile).aggregate(Max('order'))['order__max']
            self.order = (max_order + 1) if max_order is not None else 0
            
        # Shift others if order is taken
        if self.pk:
            old_instance = Project.objects.get(pk=self.pk)
            if old_instance.order != self.order:
                Project.objects.filter(profile=self.profile, order__gte=self.order).exclude(pk=self.pk).update(order=F('order') + 1)
        else:
            Project.objects.filter(profile=self.profile, order__gte=self.order).update(order=F('order') + 1)
            
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


# ============================================
# CERTIFICATES & ACHIEVEMENTS SECTION
# ============================================

class Certificate(models.Model):
    """Professional certifications"""
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='certificates')
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    issuing_organization = models.CharField(max_length=200)
    
    # Organization logo stored as BLOB
    organization_logo_data = models.BinaryField(blank=True, null=True, editable=True, help_text="Organization logo as binary")
    organization_logo_mime = models.CharField(max_length=50, blank=True, default='image/png')
    # File-based organization logo
    organization_logo_file = models.ImageField(upload_to='certificate_org_logos/', null=True, blank=True)
    
    issue_date = models.DateField()
    expiry_date = models.DateField(blank=True, null=True)
    does_not_expire = models.BooleanField(default=False)
    credential_id = models.CharField(max_length=100, blank=True)
    credential_url = models.URLField(blank=True, help_text="URL to verify certificate")
    
    # Certificate image stored as BLOB
    certificate_image_data = models.BinaryField(blank=True, null=True, editable=True, help_text="Certificate image as binary")
    certificate_image_mime = models.CharField(max_length=50, blank=True, default='image/jpeg')
    # File-based certificate image
    certificate_image_file = models.ImageField(upload_to='certificate_images/', null=True, blank=True)
    
    description = models.TextField(blank=True)
    skills = models.CharField(max_length=500, blank=True, help_text="Related skills, comma-separated")
    order = models.PositiveIntegerField(default=0)
    
    # Display on homepage
    show_on_home = models.BooleanField(default=False, help_text="Display this certificate on homepage")
    
    # Related images (gallery)
    images = GenericRelation(Image)

    class Meta:
        ordering = ['order', '-issue_date']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
            
            # Ensure slug uniqueness
            original_slug = self.slug
            queryset = Certificate.objects.all()
            if self.pk:
                queryset = queryset.exclude(pk=self.pk)
            
            counter = 1
            while queryset.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
                
        if not self.pk and self.order == 0:
            max_order = Certificate.objects.filter(profile=self.profile).aggregate(Max('order'))['order__max']
            self.order = (max_order + 1) if max_order is not None else 0
            
        # Shift others if order is taken
        if self.pk:
            old_instance = Certificate.objects.get(pk=self.pk)
            if old_instance.order != self.order:
                Certificate.objects.filter(profile=self.profile, order__gte=self.order).exclude(pk=self.pk).update(order=F('order') + 1)
        else:
            Certificate.objects.filter(profile=self.profile, order__gte=self.order).update(order=F('order') + 1)
            
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} - {self.issuing_organization}"


class Achievement(models.Model):
    """Awards, honors, and achievements"""
    ACHIEVEMENT_TYPE_CHOICES = [
        ('award', 'Award'),
        ('honor', 'Honor'),
        ('recognition', 'Recognition'),
        ('publication', 'Publication'),
        ('patent', 'Patent'),
        ('speaker', 'Speaking Engagement'),
        ('other', 'Other'),
    ]
    
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='achievements')
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    achievement_type = models.CharField(max_length=20, choices=ACHIEVEMENT_TYPE_CHOICES, default='award')
    issuer = models.CharField(max_length=200, blank=True)
    date = models.DateField()
    description = models.TextField(blank=True)
    url = models.URLField(blank=True, help_text="Link to achievement or proof")
    
    # Achievement image stored as BLOB
    image_data = models.BinaryField(blank=True, null=True, editable=True, help_text="Achievement image as binary")
    image_mime = models.CharField(max_length=50, blank=True, default='image/jpeg')
    # File-based achievement image
    image_file = models.ImageField(upload_to='achievements/', null=True, blank=True)
    
    order = models.PositiveIntegerField(default=0)
    
    # Display on homepage
    show_on_home = models.BooleanField(default=False, help_text="Display this achievement on homepage")
    
    # Related images (gallery)
    images = GenericRelation(Image)

    class Meta:
        ordering = ['order', '-date']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
            
            # Ensure slug uniqueness
            original_slug = self.slug
            queryset = Achievement.objects.all()
            if self.pk:
                queryset = queryset.exclude(pk=self.pk)
            
            counter = 1
            while queryset.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
                
        if not self.pk and self.order == 0:
            max_order = Achievement.objects.filter(profile=self.profile).aggregate(Max('order'))['order__max']
            self.order = (max_order + 1) if max_order is not None else 0
            
        # Shift others if order is taken
        if self.pk:
            old_instance = Achievement.objects.get(pk=self.pk)
            if old_instance.order != self.order:
                Achievement.objects.filter(profile=self.profile, order__gte=self.order).exclude(pk=self.pk).update(order=F('order') + 1)
        else:
            Achievement.objects.filter(profile=self.profile, order__gte=self.order).update(order=F('order') + 1)
            
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


# ============================================
# BLOG SECTION (with SEO)
# ============================================

class BlogCategory(models.Model):
    """Categories for blog posts"""
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    show_on_home = models.BooleanField(default=False, help_text="Display this category on homepage")

    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = "Blog Categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
            
            # Ensure slug uniqueness
            original_slug = self.slug
            queryset = BlogCategory.objects.all()
            if self.pk:
                queryset = queryset.exclude(pk=self.pk)
            
            counter = 1
            while queryset.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
                
        if not self.pk and self.order == 0:
            max_order = BlogCategory.objects.all().aggregate(Max('order'))['order__max']
            self.order = (max_order + 1) if max_order is not None else 0
            
        # Shift others if order is taken
        if self.pk:
            old_instance = BlogCategory.objects.get(pk=self.pk)
            if old_instance.order != self.order:
                BlogCategory.objects.filter(order__gte=self.order).exclude(pk=self.pk).update(order=F('order') + 1)
        else:
            BlogCategory.objects.filter(order__gte=self.order).update(order=F('order') + 1)
            
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class BlogTag(models.Model):
    """Tags for blog posts"""
    name = models.CharField(max_length=50)
    slug = models.SlugField(max_length=60, unique=True, blank=True)
    show_on_home = models.BooleanField(default=False, help_text="Display this tag on homepage")

    class Meta:
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
            
            # Ensure slug uniqueness
            original_slug = self.slug
            queryset = BlogTag.objects.all()
            if self.pk:
                queryset = queryset.exclude(pk=self.pk)
            
            counter = 1
            while queryset.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class BlogPost(models.Model):
    """Blog posts with SEO support"""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('scheduled', 'Scheduled'),
        ('archived', 'Archived'),
    ]
    
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='blog_posts')
    
    # Content
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    excerpt = models.TextField(max_length=500, help_text="Short summary for previews")
    content = models.TextField(help_text="Full blog post content (supports Markdown)")
    
    # Featured image stored as BLOB
    featured_image_data = models.BinaryField(blank=True, null=True, editable=True, help_text="Featured image as binary")
    featured_image_mime = models.CharField(max_length=50, blank=True, default='image/jpeg')
    # File-based featured image
    featured_image_file = models.ImageField(upload_to='blog_featured/', null=True, blank=True)
    featured_image_alt = models.CharField(max_length=200, blank=True, help_text="Alt text for SEO")
    
    # Related images (gallery)
    images = GenericRelation(Image)
    
    # Categorization
    category = models.ForeignKey(BlogCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='posts')
    tags = models.ManyToManyField(BlogTag, blank=True, related_name='posts')
    
    # Publishing
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    published_at = models.DateTimeField(blank=True, null=True)
    
    # Engagement
    reading_time = models.PositiveIntegerField(default=5, help_text="Estimated reading time in minutes")
    views_count = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    show_on_home = models.BooleanField(default=False, help_text="Display this blog post on homepage")
    allow_comments = models.BooleanField(default=True)
    
    # SEO Fields
    meta_title = models.CharField(max_length=70, blank=True, help_text="SEO title (max 70 chars)")
    meta_description = models.CharField(max_length=160, blank=True, help_text="SEO description (max 160 chars)")
    meta_keywords = models.CharField(max_length=255, blank=True, help_text="Comma-separated keywords")
    canonical_url = models.URLField(blank=True, help_text="Canonical URL if republished elsewhere")
    
    # Open Graph / Social
    og_title = models.CharField(max_length=100, blank=True, help_text="Open Graph title for social sharing")
    og_description = models.CharField(max_length=200, blank=True, help_text="Open Graph description")
    
    # OG image stored as BLOB
    og_image_data = models.BinaryField(blank=True, null=True, editable=True, help_text="Social sharing image as binary (1200x630)")
    og_image_mime = models.CharField(max_length=50, blank=True, default='image/jpeg')
    # File-based OG image
    og_image_file = models.ImageField(upload_to='blog_og/', null=True, blank=True)
    
    # Schema.org structured data
    schema_type = models.CharField(max_length=50, default='BlogPosting', help_text="Schema.org type")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_at', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
            
            # Ensure slug uniqueness
            original_slug = self.slug
            queryset = BlogPost.objects.all()
            if self.pk:
                queryset = queryset.exclude(pk=self.pk)
            
            counter = 1
            while queryset.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        if self.status == 'published' and not self.published_at:
            self.published_at = timezone.now()
        # Auto-populate SEO fields if empty
        if not self.meta_title:
            self.meta_title = self.title[:70]
        if not self.meta_description:
            self.meta_description = self.excerpt[:160]
        if not self.og_title:
            self.og_title = self.title[:100]
        if not self.og_description:
            self.og_description = self.excerpt[:200]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    def increment_views(self):
        self.views_count += 1
        self.save(update_fields=['views_count'])


# ============================================
# TESTIMONIALS SECTION (Bonus)
# ============================================

class Testimonial(models.Model):
    """Client/colleague testimonials"""
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='testimonials')
    author_name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    author_title = models.CharField(max_length=100, help_text="Job title")
    author_company = models.CharField(max_length=100, blank=True)
    
    # Author image stored as BLOB
    author_image_data = models.BinaryField(blank=True, null=True, editable=True, help_text="Author image as binary")
    author_image_mime = models.CharField(max_length=50, blank=True, default='image/jpeg')
    # File-based author image
    author_image_file = models.ImageField(upload_to='testimonial_authors/', null=True, blank=True)
    
    content = models.TextField()
    rating = models.PositiveIntegerField(default=5, help_text="Rating out of 5")
    relationship = models.CharField(max_length=100, blank=True, help_text="e.g., Former Manager, Client")
    linkedin_url = models.URLField(blank=True)
    is_featured = models.BooleanField(default=False)
    is_visible = models.BooleanField(default=True)
    show_on_home = models.BooleanField(default=False, help_text="Display this testimonial on homepage")
    date = models.DateField(default=timezone.now)
    order = models.PositiveIntegerField(default=0)
    
    # Related images (gallery)
    images = GenericRelation(Image)

    class Meta:
        ordering = ['-is_featured', 'order', '-date']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.author_name}-{self.date.isoformat()}")
            
            # Ensure slug uniqueness
            original_slug = self.slug
            queryset = Testimonial.objects.all()
            if self.pk:
                queryset = queryset.exclude(pk=self.pk)
            
            counter = 1
            while queryset.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
                
        if not self.pk and self.order == 0:
            max_order = Testimonial.objects.filter(profile=self.profile).aggregate(Max('order'))['order__max']
            self.order = (max_order + 1) if max_order is not None else 0
            
        # Shift others if order is taken
        if self.pk:
            old_instance = Testimonial.objects.get(pk=self.pk)
            if old_instance.order != self.order:
                Testimonial.objects.filter(profile=self.profile, order__gte=self.order).exclude(pk=self.pk).update(order=F('order') + 1)
        else:
            Testimonial.objects.filter(profile=self.profile, order__gte=self.order).update(order=F('order') + 1)
            
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Testimonial by {self.author_name}"


# ============================================
# CONTACT MESSAGES (Bonus)
# ============================================

class ContactMessage(models.Model):
    """Contact form submissions"""
    STATUS_CHOICES = [
        ('new', 'New'),
        ('read', 'Read'),
        ('replied', 'Replied'),
        ('archived', 'Archived'),
    ]
    
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(auto_now_add=True)
    replied_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Message from {self.name} - {self.subject}"


# ============================================
# SITE CONFIGURATION
# ============================================

class SiteConfiguration(models.Model):
    """
    Centralized site configuration manageable from Django admin.
    This allows frontend configuration to be managed from the backend.
    """
    # Base settings
    site_name = models.CharField(max_length=255, default='Magic Portfolio')
    site_description = models.TextField(default='A portfolio website')
    base_url = models.URLField(default='https://demo.magic-portfolio.com')
    
    # Theme configuration (JSON)
    theme = models.CharField(
        max_length=20, 
        choices=[('dark', 'Dark'), ('light', 'Light'), ('system', 'System')],
        default='system'
    )
    neutral_color = models.CharField(
        max_length=20,
        choices=[('sand', 'Sand'), ('gray', 'Gray'), ('slate', 'Slate'), ('custom', 'Custom')],
        default='gray'
    )
    brand_color = models.CharField(
        max_length=20,
        choices=[('blue', 'Blue'), ('indigo', 'Indigo'), ('violet', 'Violet'), ('magenta', 'Magenta'),
                 ('pink', 'Pink'), ('red', 'Red'), ('orange', 'Orange'), ('yellow', 'Yellow'),
                 ('moss', 'Moss'), ('green', 'Green'), ('emerald', 'Emerald'), ('aqua', 'Aqua'),
                 ('cyan', 'Cyan'), ('custom', 'Custom')],
        default='cyan'
    )
    accent_color = models.CharField(
        max_length=20,
        choices=[('blue', 'Blue'), ('indigo', 'Indigo'), ('violet', 'Violet'), ('magenta', 'Magenta'),
                 ('pink', 'Pink'), ('red', 'Red'), ('orange', 'Orange'), ('yellow', 'Yellow'),
                 ('moss', 'Moss'), ('green', 'Green'), ('emerald', 'Emerald'), ('aqua', 'Aqua'),
                 ('cyan', 'Cyan'), ('custom', 'Custom')],
        default='red'
    )
    solid_style = models.CharField(
        max_length=20,
        choices=[('flat', 'Flat'), ('plastic', 'Plastic')],
        default='flat'
    )
    border_style = models.CharField(
        max_length=20,
        choices=[('rounded', 'Rounded'), ('playful', 'Playful'), ('conservative', 'Conservative')],
        default='playful'
    )
    surface_style = models.CharField(
        max_length=20,
        choices=[('filled', 'Filled'), ('translucent', 'Translucent')],
        default='translucent'
    )
    transition_style = models.CharField(
        max_length=20,
        choices=[('all', 'All'), ('micro', 'Micro'), ('macro', 'Macro')],
        default='all'
    )
    scaling = models.PositiveIntegerField(
        default=100,
        choices=[(90, '90%'), (95, '95%'), (100, '100%'), (105, '105%'), (110, '110%')]
    )
    viz_style = models.CharField(
        max_length=20,
        choices=[('flat', 'Flat'), ('gradient', 'Gradient'), ('outline', 'Outline')],
        default='gradient',
        help_text='Visualization style for charts and data displays'
    )
    
    # Display options
    display_location = models.BooleanField(default=True)
    display_time = models.BooleanField(default=True)
    display_theme_switcher = models.BooleanField(default=True)
    
    # Mailchimp configuration
    mailchimp_action = models.URLField(blank=True, help_text='Mailchimp subscribe form action URL')
    
    # Schema/SEO
    schema_type = models.CharField(
        max_length=50,
        choices=[('Organization', 'Organization'), ('Person', 'Person')],
        default='Organization'
    )
    schema_email = models.EmailField(blank=True)
    
    # Social links
    threads_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    discord_url = models.URLField(blank=True)
    
    # Social sharing
    enable_social_sharing = models.BooleanField(default=True)
    share_on_x = models.BooleanField(default=True)
    share_on_linkedin = models.BooleanField(default=True)
    share_on_facebook = models.BooleanField(default=False)
    share_on_pinterest = models.BooleanField(default=False)
    share_on_whatsapp = models.BooleanField(default=False)
    share_on_reddit = models.BooleanField(default=False)
    share_on_telegram = models.BooleanField(default=False)
    share_email = models.BooleanField(default=True)
    share_copy_link = models.BooleanField(default=True)
    
    # Protected routes (JSON field would be better, but using text for simplicity)
    protected_routes = models.TextField(
        blank=True,
        help_text='JSON array of protected routes, e.g., ["/work/automate-design-handovers-with-a-figma-to-code-pipeline"]'
    )
    
    # Available routes
    enable_route_home = models.BooleanField(default=True)
    enable_route_about = models.BooleanField(default=True)
    enable_route_work = models.BooleanField(default=True)
    enable_route_blog = models.BooleanField(default=True)
    enable_route_gallery = models.BooleanField(default=True)
    
    # Metadata
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Site Configuration'
        verbose_name_plural = 'Site Configuration'
    
    def __str__(self):
        return 'Site Configuration'
    
    @classmethod
    def get_config(cls):
        """Get or create the singleton configuration object"""
        config, created = cls.objects.get_or_create(pk=1)
        return config


# ============================================
# SIGNALS FOR AUTO-REORDERING ON DELETE
# ============================================

@receiver(post_delete, sender=SocialLink)
def reorder_social_links(sender, instance, **kwargs):
    reorder_model_items(SocialLink, {'profile': instance.profile})

@receiver(post_delete, sender=Skill)
def reorder_skills(sender, instance, **kwargs):
    reorder_model_items(Skill, {'profile': instance.profile})

@receiver(post_delete, sender=Project)
def reorder_projects(sender, instance, **kwargs):
    reorder_model_items(Project, {'profile': instance.profile})

@receiver(post_delete, sender=Certificate)
def reorder_certificates(sender, instance, **kwargs):
    reorder_model_items(Certificate, {'profile': instance.profile})

@receiver(post_delete, sender=Achievement)
def reorder_achievements(sender, instance, **kwargs):
    reorder_model_items(Achievement, {'profile': instance.profile})

@receiver(post_delete, sender=BlogCategory)
def reorder_blog_categories(sender, instance, **kwargs):
    reorder_model_items(BlogCategory, {})

@receiver(post_delete, sender=Testimonial)
def reorder_testimonials(sender, instance, **kwargs):
    reorder_model_items(Testimonial, {'profile': instance.profile})

@receiver(post_delete, sender=Image)
def reorder_images(sender, instance, **kwargs):
    reorder_model_items(Image, {'content_type': instance.content_type, 'object_id': instance.object_id})
