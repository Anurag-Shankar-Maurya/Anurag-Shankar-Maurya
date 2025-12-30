from django.db import models
from django.utils.text import slugify
from django.utils import timezone
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
import base64


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
    
    # Resume as BLOB
    resume_data = models.BinaryField(blank=True, null=True, editable=True, help_text="Resume file as binary")
    resume_filename = models.CharField(max_length=255, blank=True)
    resume_mime = models.CharField(max_length=100, blank=True)
    
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
        ('other', 'Other'),
    ]
    
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='social_links')
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    url = models.URLField()
    icon = models.CharField(max_length=50, blank=True, help_text="Icon class or name")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.platform} - {self.profile.full_name}"


class Skill(models.Model):
    """Technical and soft skills"""
    SKILL_TYPE_CHOICES = [
        ('technical', 'Technical'),
        ('soft', 'Soft Skill'),
        ('tool', 'Tool/Software'),
        ('language', 'Programming Language'),
        ('framework', 'Framework'),
        ('other', 'Other'),
    ]
    
    PROFICIENCY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('expert', 'Expert'),
    ]
    
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='skills')
    name = models.CharField(max_length=100)
    skill_type = models.CharField(max_length=20, choices=SKILL_TYPE_CHOICES, default='technical')
    proficiency = models.CharField(max_length=20, choices=PROFICIENCY_CHOICES, default='intermediate')
    icon = models.CharField(max_length=50, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


# ============================================
# EDUCATION SECTION
# ============================================

class Education(models.Model):
    """Educational qualifications"""
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='education')
    institution = models.CharField(max_length=200)
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
    
    # Related images (gallery)
    images = GenericRelation(Image)
    
    class Meta:
        ordering = ['-start_date']
        verbose_name_plural = "Education"

    def __str__(self):
        return f"{self.degree} - {self.institution}"


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
    order = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_featured', 'order', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
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
    issuing_organization = models.CharField(max_length=200)
    
    # Organization logo stored as BLOB
    organization_logo_data = models.BinaryField(blank=True, null=True, editable=True, help_text="Organization logo as binary")
    organization_logo_mime = models.CharField(max_length=50, blank=True, default='image/png')
    
    issue_date = models.DateField()
    expiry_date = models.DateField(blank=True, null=True)
    does_not_expire = models.BooleanField(default=False)
    credential_id = models.CharField(max_length=100, blank=True)
    credential_url = models.URLField(blank=True, help_text="URL to verify certificate")
    
    # Certificate image stored as BLOB
    certificate_image_data = models.BinaryField(blank=True, null=True, editable=True, help_text="Certificate image as binary")
    certificate_image_mime = models.CharField(max_length=50, blank=True, default='image/jpeg')
    
    description = models.TextField(blank=True)
    skills = models.CharField(max_length=500, blank=True, help_text="Related skills, comma-separated")
    order = models.PositiveIntegerField(default=0)
    
    # Related images (gallery)
    images = GenericRelation(Image)

    class Meta:
        ordering = ['order', '-issue_date']

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
    achievement_type = models.CharField(max_length=20, choices=ACHIEVEMENT_TYPE_CHOICES, default='award')
    issuer = models.CharField(max_length=200, blank=True)
    date = models.DateField()
    description = models.TextField(blank=True)
    url = models.URLField(blank=True, help_text="Link to achievement or proof")
    
    # Achievement image stored as BLOB
    image_data = models.BinaryField(blank=True, null=True, editable=True, help_text="Achievement image as binary")
    image_mime = models.CharField(max_length=50, blank=True, default='image/jpeg')
    
    order = models.PositiveIntegerField(default=0)
    
    # Related images (gallery)
    images = GenericRelation(Image)

    class Meta:
        ordering = ['order', '-date']

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

    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = "Blog Categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class BlogTag(models.Model):
    """Tags for blog posts"""
    name = models.CharField(max_length=50)
    slug = models.SlugField(max_length=60, unique=True, blank=True)

    class Meta:
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
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
    
    # Schema.org structured data
    schema_type = models.CharField(max_length=50, default='BlogPosting', help_text="Schema.org type")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_at', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
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
    author_title = models.CharField(max_length=100, help_text="Job title")
    author_company = models.CharField(max_length=100, blank=True)
    
    # Author image stored as BLOB
    author_image_data = models.BinaryField(blank=True, null=True, editable=True, help_text="Author image as binary")
    author_image_mime = models.CharField(max_length=50, blank=True, default='image/jpeg')
    
    content = models.TextField()
    rating = models.PositiveIntegerField(default=5, help_text="Rating out of 5")
    relationship = models.CharField(max_length=100, blank=True, help_text="e.g., Former Manager, Client")
    linkedin_url = models.URLField(blank=True)
    is_featured = models.BooleanField(default=False)
    is_visible = models.BooleanField(default=True)
    date = models.DateField(default=timezone.now)
    order = models.PositiveIntegerField(default=0)
    
    # Related images (gallery)
    images = GenericRelation(Image)

    class Meta:
        ordering = ['-is_featured', 'order', '-date']

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
