from django.contrib import admin
from django.utils.html import format_html
from django.contrib.contenttypes.admin import GenericTabularInline
from django import forms
import base64

from .models import (
    Image, Profile, SocialLink, Skill, Education,
    WorkExperience, Project, Certificate, Achievement,
    BlogCategory, BlogTag, BlogPost, Testimonial, ContactMessage
)


# ============================================
# CUSTOM FORMS WITH FILE UPLOAD
# ============================================

class ImageAdminForm(forms.ModelForm):
    """Custom form for Image model with file upload"""
    image_file = forms.FileField(required=False, label='Upload Image', help_text='Upload an image file')
    
    class Meta:
        model = Image
        fields = '__all__'
        widgets = {
            'image_data': forms.HiddenInput(),
        }
    
    def save(self, commit=True):
        instance = super().save(commit=False)
        image_file = self.cleaned_data.get('image_file')
        
        if image_file:
            from PIL import Image as PILImage
            import io
            
            # Read file data
            file_data = image_file.read()
            instance.image_data = file_data
            instance.filename = image_file.name
            instance.mime_type = image_file.content_type or 'image/jpeg'
            instance.file_size = len(file_data)
            
            # Get dimensions
            try:
                img = PILImage.open(io.BytesIO(file_data))
                instance.width, instance.height = img.size
            except Exception:
                pass
        
        if commit:
            instance.save()
        return instance


class ProfileAdminForm(forms.ModelForm):
    """Custom form for Profile model with file uploads"""
    profile_image_file = forms.ImageField(
        required=False, 
        label='Upload Profile Image',
        help_text='Current profile image will be replaced if new file is uploaded'
    )
    resume_file = forms.FileField(
        required=False, 
        label='Upload Resume',
        help_text='Upload PDF, DOC, DOCX or TXT file. Current resume will be replaced if new file is uploaded'
    )
    
    class Meta:
        model = Profile
        fields = '__all__'
        widgets = {
            'profile_image_data': forms.HiddenInput(),
            'resume_data': forms.HiddenInput(),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Show current file status
        if self.instance and self.instance.pk:
            if self.instance.profile_image_data:
                self.fields['profile_image_file'].help_text = f'✓ Current: Profile image uploaded ({len(self.instance.profile_image_data)} bytes). Upload new file to replace.'
            if self.instance.resume_data:
                resume_name = self.instance.resume_filename or 'resume file'
                self.fields['resume_file'].help_text = f'✓ Current: {resume_name} ({len(self.instance.resume_data)} bytes). Upload new file to replace.'
    
    def save(self, commit=True):
        instance = super().save(commit=False)
        
        # Handle profile image
        profile_image = self.cleaned_data.get('profile_image_file')
        if profile_image:
            image_data = profile_image.read()
            instance.profile_image_data = image_data
            instance.profile_image_mime = profile_image.content_type or 'image/jpeg'
        
        # Handle resume - accept various file types
        resume = self.cleaned_data.get('resume_file')
        if resume:
            resume_data = resume.read()
            instance.resume_data = resume_data
            instance.resume_filename = resume.name
            # Determine MIME type
            content_type = resume.content_type
            if not content_type:
                # Fallback based on file extension
                if resume.name.lower().endswith('.pdf'):
                    content_type = 'application/pdf'
                elif resume.name.lower().endswith('.doc'):
                    content_type = 'application/msword'
                elif resume.name.lower().endswith('.docx'):
                    content_type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                elif resume.name.lower().endswith('.txt'):
                    content_type = 'text/plain'
                else:
                    content_type = 'application/octet-stream'
            instance.resume_mime = content_type
        
        if commit:
            instance.save()
        return instance


class EducationAdminForm(forms.ModelForm):
    """Custom form for Education model with logo upload"""
    logo_file = forms.ImageField(required=False, label='Upload Institution Logo')
    
    class Meta:
        model = Education
        fields = '__all__'
        widgets = {
            'logo_data': forms.HiddenInput(),
        }
    
    def save(self, commit=True):
        instance = super().save(commit=False)
        logo = self.cleaned_data.get('logo_file')
        
        if logo:
            instance.logo_data = logo.read()
            instance.logo_mime = logo.content_type or 'image/png'
        
        if commit:
            instance.save()
        return instance


class WorkExperienceAdminForm(forms.ModelForm):
    """Custom form for WorkExperience model with logo upload"""
    company_logo_file = forms.ImageField(required=False, label='Upload Company Logo')
    
    class Meta:
        model = WorkExperience
        fields = '__all__'
        widgets = {
            'company_logo_data': forms.HiddenInput(),
        }
    
    def save(self, commit=True):
        instance = super().save(commit=False)
        logo = self.cleaned_data.get('company_logo_file')
        
        if logo:
            instance.company_logo_data = logo.read()
            instance.company_logo_mime = logo.content_type or 'image/png'
        
        if commit:
            instance.save()
        return instance


class ProjectAdminForm(forms.ModelForm):
    """Custom form for Project model with featured image upload"""
    featured_image_file = forms.ImageField(required=False, label='Upload Featured Image')
    
    class Meta:
        model = Project
        fields = '__all__'
        widgets = {
            'featured_image_data': forms.HiddenInput(),
        }
    
    def save(self, commit=True):
        instance = super().save(commit=False)
        image = self.cleaned_data.get('featured_image_file')
        
        if image:
            instance.featured_image_data = image.read()
            instance.featured_image_mime = image.content_type or 'image/jpeg'
        
        if commit:
            instance.save()
        return instance


class CertificateAdminForm(forms.ModelForm):
    """Custom form for Certificate model with image uploads"""
    organization_logo_file = forms.ImageField(required=False, label='Upload Organization Logo')
    certificate_image_file = forms.ImageField(required=False, label='Upload Certificate Image')
    
    class Meta:
        model = Certificate
        fields = '__all__'
        widgets = {
            'organization_logo_data': forms.HiddenInput(),
            'certificate_image_data': forms.HiddenInput(),
        }
    
    def save(self, commit=True):
        instance = super().save(commit=False)
        
        # Handle org logo
        org_logo = self.cleaned_data.get('organization_logo_file')
        if org_logo:
            instance.organization_logo_data = org_logo.read()
            instance.organization_logo_mime = org_logo.content_type or 'image/png'
        
        # Handle certificate image
        cert_image = self.cleaned_data.get('certificate_image_file')
        if cert_image:
            instance.certificate_image_data = cert_image.read()
            instance.certificate_image_mime = cert_image.content_type or 'image/jpeg'
        
        if commit:
            instance.save()
        return instance


class AchievementAdminForm(forms.ModelForm):
    """Custom form for Achievement model with image upload"""
    image_file = forms.ImageField(required=False, label='Upload Achievement Image')
    
    class Meta:
        model = Achievement
        fields = '__all__'
        widgets = {
            'image_data': forms.HiddenInput(),
        }
    
    def save(self, commit=True):
        instance = super().save(commit=False)
        image = self.cleaned_data.get('image_file')
        
        if image:
            instance.image_data = image.read()
            instance.image_mime = image.content_type or 'image/jpeg'
        
        if commit:
            instance.save()
        return instance


class BlogPostAdminForm(forms.ModelForm):
    """Custom form for BlogPost model with image uploads"""
    featured_image_file = forms.ImageField(required=False, label='Upload Featured Image')
    og_image_file = forms.ImageField(required=False, label='Upload OG Image')
    
    class Meta:
        model = BlogPost
        fields = '__all__'
        widgets = {
            'featured_image_data': forms.HiddenInput(),
            'og_image_data': forms.HiddenInput(),
        }
    
    def save(self, commit=True):
        instance = super().save(commit=False)
        
        # Handle featured image
        featured = self.cleaned_data.get('featured_image_file')
        if featured:
            instance.featured_image_data = featured.read()
            instance.featured_image_mime = featured.content_type or 'image/jpeg'
        
        # Handle OG image
        og_image = self.cleaned_data.get('og_image_file')
        if og_image:
            instance.og_image_data = og_image.read()
            instance.og_image_mime = og_image.content_type or 'image/jpeg'
        
        if commit:
            instance.save()
        return instance


class TestimonialAdminForm(forms.ModelForm):
    """Custom form for Testimonial model with author image upload"""
    author_image_file = forms.ImageField(required=False, label='Upload Author Image')
    
    class Meta:
        model = Testimonial
        fields = '__all__'
        widgets = {
            'author_image_data': forms.HiddenInput(),
        }
    
    def save(self, commit=True):
        instance = super().save(commit=False)
        image = self.cleaned_data.get('author_image_file')
        
        if image:
            instance.author_image_data = image.read()
            instance.author_image_mime = image.content_type or 'image/jpeg'
        
        if commit:
            instance.save()
        return instance


# ============================================
# HELPER FUNCTIONS
# ============================================

def get_image_preview(image_data, mime_type, width=50, height=50):
    """Generate HTML image preview from BLOB data"""
    if image_data:
        b64 = base64.b64encode(image_data).decode('utf-8')
        return format_html(
            '<img src="data:{};base64,{}" style="width:{}px; height:{}px; object-fit:cover; border-radius:4px;" />',
            mime_type or 'image/jpeg', b64, width, height
        )
    return format_html('<span style="color:#999;">No image</span>')


# ============================================
# GENERIC IMAGE INLINE
# ============================================

class ImageInline(GenericTabularInline):
    model = Image
    form = ImageAdminForm
    extra = 1
    fields = ['image_preview', 'image_file', 'image_type', 'alt_text', 'caption', 'order']
    readonly_fields = ['image_preview']
    ordering = ['order']

    def image_preview(self, obj):
        if obj.pk:
            return get_image_preview(obj.image_data, obj.mime_type, 60, 60)
        return format_html('<span style="color:#999;">Upload to preview</span>')
    image_preview.short_description = 'Preview'


# ============================================
# IMAGE ADMIN
# ============================================

@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    form = ImageAdminForm
    list_display = ['image_preview', 'filename', 'image_type', 'content_type', 'file_size_display', 'created_at']
    list_display_links = ['filename']
    list_filter = ['image_type', 'content_type', 'created_at']
    search_fields = ['filename', 'alt_text', 'caption']
    readonly_fields = ['image_preview_large', 'file_size', 'width', 'height', 'created_at', 'updated_at']
    ordering = ['-created_at']

    fieldsets = (
        ('Image Preview', {
            'fields': ('image_preview_large',)
        }),
        ('Upload Image', {
            'fields': ('image_file',)
        }),
        ('Image Data', {
            'fields': ('filename', 'mime_type'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('file_size', 'width', 'height')
        }),
        ('Classification', {
            'fields': ('image_type', 'alt_text', 'caption', 'order')
        }),
        ('Linked Object', {
            'fields': ('content_type', 'object_id')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def image_preview(self, obj):
        return get_image_preview(obj.image_data, obj.mime_type, 50, 50)
    image_preview.short_description = 'Preview'

    def image_preview_large(self, obj):
        return get_image_preview(obj.image_data, obj.mime_type, 200, 200)
    image_preview_large.short_description = 'Preview'

    def file_size_display(self, obj):
        if obj.file_size:
            if obj.file_size < 1024:
                return f"{obj.file_size} B"
            elif obj.file_size < 1024 * 1024:
                return f"{obj.file_size / 1024:.1f} KB"
            else:
                return f"{obj.file_size / (1024 * 1024):.1f} MB"
        return "-"
    file_size_display.short_description = 'Size'


# ============================================
# PROFILE SECTION
# ============================================

class SocialLinkAdminForm(forms.ModelForm):
    """Custom form for SocialLink with auto icon assignment"""
    class Meta:
        model = SocialLink
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Get the current platform if editing
        platform = self.instance.platform if self.instance.pk else None
        
        # Auto-fill icon based on platform
        if platform and platform in SocialLink.ICON_MAPPING:
            icon_value = SocialLink.ICON_MAPPING[platform]
            self.fields['icon'].initial = icon_value
            self.fields['icon'].help_text = f"Auto-assigned icon for {platform}: {icon_value}"
    
    def clean(self):
        cleaned_data = super().clean()
        platform = cleaned_data.get('platform')
        
        # Auto-fill icon based on platform when saving
        if platform and platform in SocialLink.ICON_MAPPING:
            cleaned_data['icon'] = SocialLink.ICON_MAPPING[platform]
        
        return cleaned_data


class SocialLinkInline(admin.TabularInline):
    model = SocialLink
    form = SocialLinkAdminForm
    extra = 1
    ordering = ['order']
    readonly_fields = ['icon_display']
    
    def icon_display(self, obj):
        if obj.icon:
            return f"{obj.icon}"
        return "-"
    icon_display.short_description = "Icon (Auto-filled)"


class SkillInline(admin.TabularInline):
    model = Skill
    extra = 1
    ordering = ['order', 'name']


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    form = ProfileAdminForm
    list_display = ['profile_preview', 'full_name', 'headline', 'email', 'available_for_hire', 'updated_at']
    list_display_links = ['full_name']
    list_filter = ['available_for_hire', 'created_at']
    search_fields = ['full_name', 'headline', 'email', 'bio']
    readonly_fields = ['profile_preview_large', 'resume_info', 'created_at', 'updated_at']
    inlines = [SocialLinkInline, SkillInline, ImageInline]

    fieldsets = (
        ('Profile Image', {
            'fields': ('profile_preview_large', 'profile_image_file')
        }),
        ('Basic Information', {
            'fields': ('full_name', 'headline', 'bio')
        }),
        ('Contact', {
            'fields': ('email', 'phone', 'location')
        }),
        ('Professional Details', {
            'fields': ('current_role', 'current_company', 'years_of_experience', 'available_for_hire')
        }),
        ('Resume', {
            'fields': ('resume_info', 'resume_file', 'resume_filename'),
            'description': 'Upload PDF, DOC, DOCX, or TXT files. The resume filename will be auto-filled from uploaded file.'
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def profile_preview(self, obj):
        return get_image_preview(obj.profile_image_data, obj.profile_image_mime, 40, 40)
    profile_preview.short_description = 'Photo'

    def profile_preview_large(self, obj):
        return get_image_preview(obj.profile_image_data, obj.profile_image_mime, 150, 150)
    profile_preview_large.short_description = 'Profile Image'

    def resume_info(self, obj):
        """Display current resume information"""
        if obj.resume_data and obj.resume_filename:
            size_kb = len(obj.resume_data) / 1024
            download_url = f'/api/profiles/{obj.pk}/resume/' if obj.pk else '#'
            return format_html(
                '<div style="padding: 10px; background: #e8f5e9; border-radius: 4px;">'
                '<strong>✓ Resume Uploaded</strong><br>'
                'Filename: {}<br>'
                'Size: {:.2f} KB<br>'
                'Type: {}<br>'
                '<a href="{}" target="_blank" style="color: #1976d2;">Download Current Resume</a>'
                '</div>',
                obj.resume_filename,
                size_kb,
                obj.resume_mime or 'Unknown',
                download_url
            )
        return format_html(
            '<div style="padding: 10px; background: #fff3e0; border-radius: 4px;">'
            '<strong>⚠ No Resume Uploaded</strong><br>'
            'Use the "Upload Resume" field below to add a resume file.'
            '</div>'
        )
    resume_info.short_description = 'Current Resume Status'


@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    form = SocialLinkAdminForm
    list_display = ['platform', 'profile', 'url', 'icon_display', 'order']
    list_filter = ['platform']
    search_fields = ['profile__full_name', 'url']
    ordering = ['profile', 'order']
    readonly_fields = ['icon_display']
    fieldsets = (
        ('Social Link', {
            'fields': ('profile', 'platform', 'url', 'order')
        }),
        ('Icon (Auto-assigned)', {
            'fields': ('icon', 'icon_display'),
            'description': 'Icon is automatically assigned based on the selected platform'
        }),
        ('Display', {
            'fields': ('show_on_home',)
        }),
    )
    
    def icon_display(self, obj):
        if obj.icon:
            return f"✓ {obj.icon}"
        return "-"
    icon_display.short_description = "Auto-filled Icon"


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'profile', 'skill_type', 'proficiency', 'order']
    list_filter = ['skill_type', 'proficiency']
    search_fields = ['name', 'profile__full_name']
    ordering = ['profile', 'order', 'name']


# ============================================
# EDUCATION SECTION
# ============================================

@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    form = EducationAdminForm
    list_display = ['logo_preview', 'degree', 'institution', 'field_of_study', 'start_date', 'end_date', 'is_current']
    list_display_links = ['degree']
    list_filter = ['is_current', 'start_date']
    search_fields = ['institution', 'degree', 'field_of_study']
    readonly_fields = ['logo_preview_large']
    inlines = [ImageInline]
    ordering = ['-start_date']

    fieldsets = (
        ('Institution Logo', {
            'fields': ('logo_preview_large', 'logo_file')
        }),
        ('Education Details', {
            'fields': ('profile', 'institution', 'degree', 'field_of_study', 'grade')
        }),
        ('Duration', {
            'fields': ('start_date', 'end_date', 'is_current')
        }),
        ('Additional Info', {
            'fields': ('location', 'description'),
            'classes': ('collapse',)
        }),
    )

    def logo_preview(self, obj):
        return get_image_preview(obj.logo_data, obj.logo_mime, 40, 40)
    logo_preview.short_description = 'Logo'

    def logo_preview_large(self, obj):
        return get_image_preview(obj.logo_data, obj.logo_mime, 100, 100)
    logo_preview_large.short_description = 'Institution Logo'


# ============================================
# WORK EXPERIENCE SECTION
# ============================================

@admin.register(WorkExperience)
class WorkExperienceAdmin(admin.ModelAdmin):
    form = WorkExperienceAdminForm
    list_display = ['company_logo_preview', 'job_title', 'company_name', 'employment_type', 'work_mode', 'start_date', 'is_current']
    list_display_links = ['job_title']
    list_filter = ['is_current', 'employment_type', 'work_mode', 'start_date']
    search_fields = ['company_name', 'job_title', 'description', 'technologies_used']
    readonly_fields = ['company_logo_preview_large']
    inlines = [ImageInline]
    ordering = ['-is_current', '-start_date']

    fieldsets = (
        ('Company Logo', {
            'fields': ('company_logo_preview_large', 'company_logo_file')
        }),
        ('Company Information', {
            'fields': ('profile', 'company_name', 'company_url', 'location')
        }),
        ('Position Details', {
            'fields': ('job_title', 'employment_type', 'work_mode')
        }),
        ('Duration', {
            'fields': ('start_date', 'end_date', 'is_current')
        }),
        ('Description', {
            'fields': ('description', 'achievements', 'technologies_used')
        }),
        ('Display', {
            'fields': ('order',),
            'classes': ('collapse',)
        }),
    )

    def company_logo_preview(self, obj):
        return get_image_preview(obj.company_logo_data, obj.company_logo_mime, 40, 40)
    company_logo_preview.short_description = 'Logo'

    def company_logo_preview_large(self, obj):
        return get_image_preview(obj.company_logo_data, obj.company_logo_mime, 100, 100)
    company_logo_preview_large.short_description = 'Company Logo'


# ============================================
# PROJECTS SECTION
# ============================================

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    form = ProjectAdminForm
    list_display = ['featured_preview', 'title', 'status', 'is_featured', 'is_visible', 'order', 'created_at']
    list_display_links = ['title']
    list_filter = ['status', 'is_featured', 'is_visible', 'created_at']
    search_fields = ['title', 'short_description', 'description', 'technologies']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['featured_preview_large', 'created_at', 'updated_at']
    inlines = [ImageInline]
    ordering = ['-is_featured', 'order', '-created_at']
    list_editable = ['is_featured', 'is_visible', 'order']

    fieldsets = (
        ('Featured Image', {
            'fields': ('featured_preview_large', 'featured_image_file', 'featured_image_alt')
        }),
        ('Basic Information', {
            'fields': ('profile', 'title', 'slug', 'short_description', 'description')
        }),
        ('Links', {
            'fields': ('live_url', 'github_url', 'demo_url')
        }),
        ('Technical Details', {
            'fields': ('technologies', 'role', 'team_size')
        }),
        ('Timeline', {
            'fields': ('start_date', 'end_date', 'status')
        }),
        ('Display Options', {
            'fields': ('is_featured', 'is_visible', 'order')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def featured_preview(self, obj):
        return get_image_preview(obj.featured_image_data, obj.featured_image_mime, 60, 40)
    featured_preview.short_description = 'Image'

    def featured_preview_large(self, obj):
        return get_image_preview(obj.featured_image_data, obj.featured_image_mime, 300, 200)
    featured_preview_large.short_description = 'Featured Image'


# ============================================
# CERTIFICATES & ACHIEVEMENTS
# ============================================

@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    form = CertificateAdminForm
    list_display = ['org_logo_preview', 'title', 'issuing_organization', 'issue_date', 'does_not_expire', 'order']
    list_display_links = ['title']
    list_filter = ['does_not_expire', 'issue_date']
    search_fields = ['title', 'issuing_organization', 'credential_id', 'skills']
    readonly_fields = ['org_logo_preview_large', 'cert_preview_large']
    inlines = [ImageInline]
    ordering = ['order', '-issue_date']

    fieldsets = (
        ('Images Preview', {
            'fields': (
                ('org_logo_preview_large', 'cert_preview_large'),
            )
        }),
        ('Upload Images', {
            'fields': ('organization_logo_file', 'certificate_image_file')
        }),
        ('Certificate Details', {
            'fields': ('profile', 'title', 'issuing_organization', 'description')
        }),
        ('Validity', {
            'fields': ('issue_date', 'expiry_date', 'does_not_expire')
        }),
        ('Credential', {
            'fields': ('credential_id', 'credential_url')
        }),
        ('Additional', {
            'fields': ('skills', 'order'),
            'classes': ('collapse',)
        }),
    )

    def org_logo_preview(self, obj):
        return get_image_preview(obj.organization_logo_data, obj.organization_logo_mime, 40, 40)
    org_logo_preview.short_description = 'Logo'

    def org_logo_preview_large(self, obj):
        return get_image_preview(obj.organization_logo_data, obj.organization_logo_mime, 100, 100)
    org_logo_preview_large.short_description = 'Organization Logo'

    def cert_preview_large(self, obj):
        return get_image_preview(obj.certificate_image_data, obj.certificate_image_mime, 200, 150)
    cert_preview_large.short_description = 'Certificate Image'


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    form = AchievementAdminForm
    list_display = ['image_preview', 'title', 'achievement_type', 'issuer', 'date', 'order']
    list_display_links = ['title']
    list_filter = ['achievement_type', 'date']
    search_fields = ['title', 'issuer', 'description']
    readonly_fields = ['image_preview_large']
    inlines = [ImageInline]
    ordering = ['order', '-date']

    fieldsets = (
        ('Achievement Image', {
            'fields': ('image_preview_large', 'image_file')
        }),
        ('Details', {
            'fields': ('profile', 'title', 'achievement_type', 'issuer', 'date')
        }),
        ('Additional Info', {
            'fields': ('description', 'url', 'order')
        }),
    )

    def image_preview(self, obj):
        return get_image_preview(obj.image_data, obj.image_mime, 40, 40)
    image_preview.short_description = 'Image'

    def image_preview_large(self, obj):
        return get_image_preview(obj.image_data, obj.image_mime, 150, 150)
    image_preview_large.short_description = 'Achievement Image'


# ============================================
# BLOG SECTION
# ============================================

@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'post_count', 'order']
    list_editable = ['order']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['order', 'name']

    def post_count(self, obj):
        return obj.posts.count()
    post_count.short_description = 'Posts'


@admin.register(BlogTag)
class BlogTagAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'post_count']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['name']

    def post_count(self, obj):
        return obj.posts.count()
    post_count.short_description = 'Posts'


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    form = BlogPostAdminForm
    list_display = ['featured_preview', 'title', 'category', 'status', 'is_featured', 'views_count', 'published_at']
    list_display_links = ['title']
    list_filter = ['status', 'is_featured', 'category', 'published_at', 'allow_comments']
    search_fields = ['title', 'excerpt', 'content', 'meta_keywords']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['featured_preview_large', 'og_preview', 'views_count', 'created_at', 'updated_at']
    filter_horizontal = ['tags']
    inlines = [ImageInline]
    ordering = ['-published_at', '-created_at']
    date_hierarchy = 'published_at'
    list_editable = ['status', 'is_featured']

    fieldsets = (
        ('Featured Image', {
            'fields': ('featured_preview_large', 'featured_image_file', 'featured_image_alt')
        }),
        ('Content', {
            'fields': ('profile', 'title', 'slug', 'excerpt', 'content')
        }),
        ('Categorization', {
            'fields': ('category', 'tags')
        }),
        ('Publishing', {
            'fields': ('status', 'published_at', 'is_featured', 'allow_comments')
        }),
        ('Engagement', {
            'fields': ('reading_time', 'views_count'),
            'classes': ('collapse',)
        }),
        ('SEO - Meta Tags', {
            'fields': ('meta_title', 'meta_description', 'meta_keywords', 'canonical_url'),
            'classes': ('collapse',)
        }),
        ('SEO - Open Graph', {
            'fields': ('og_preview', 'og_title', 'og_description', 'og_image_file'),
            'classes': ('collapse',)
        }),
        ('Schema.org', {
            'fields': ('schema_type',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def featured_preview(self, obj):
        return get_image_preview(obj.featured_image_data, obj.featured_image_mime, 60, 40)
    featured_preview.short_description = 'Image'

    def featured_preview_large(self, obj):
        return get_image_preview(obj.featured_image_data, obj.featured_image_mime, 300, 200)
    featured_preview_large.short_description = 'Featured Image'

    def og_preview(self, obj):
        return get_image_preview(obj.og_image_data, obj.og_image_mime, 300, 157)
    og_preview.short_description = 'OG Image Preview'

    actions = ['make_published', 'make_draft']

    @admin.action(description='Publish selected posts')
    def make_published(self, request, queryset):
        from django.utils import timezone
        queryset.update(status='published', published_at=timezone.now())

    @admin.action(description='Set selected posts to draft')
    def make_draft(self, request, queryset):
        queryset.update(status='draft')


# ============================================
# TESTIMONIALS SECTION
# ============================================

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    form = TestimonialAdminForm
    list_display = ['author_preview', 'author_name', 'author_title', 'author_company', 'rating_display', 'is_featured', 'is_visible', 'order']
    list_display_links = ['author_name']
    list_filter = ['is_featured', 'is_visible', 'rating', 'date']
    search_fields = ['author_name', 'author_company', 'content']
    readonly_fields = ['author_preview_large']
    inlines = [ImageInline]
    ordering = ['-is_featured', 'order', '-date']
    list_editable = ['is_featured', 'is_visible', 'order']

    fieldsets = (
        ('Author Image', {
            'fields': ('author_preview_large', 'author_image_file')
        }),
        ('Author Info', {
            'fields': ('profile', 'author_name', 'author_title', 'author_company', 'linkedin_url')
        }),
        ('Testimonial', {
            'fields': ('content', 'rating', 'relationship', 'date')
        }),
        ('Display', {
            'fields': ('is_featured', 'is_visible', 'order')
        }),
    )

    def author_preview(self, obj):
        return get_image_preview(obj.author_image_data, obj.author_image_mime, 40, 40)
    author_preview.short_description = 'Photo'

    def author_preview_large(self, obj):
        return get_image_preview(obj.author_image_data, obj.author_image_mime, 100, 100)
    author_preview_large.short_description = 'Author Image'

    def rating_display(self, obj):
        stars = '★' * obj.rating + '☆' * (5 - obj.rating)
        return format_html('<span style="color:#f5a623;">{}</span>', stars)
    rating_display.short_description = 'Rating'


# ============================================
# CONTACT MESSAGES SECTION
# ============================================

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['status_badge', 'name', 'email', 'subject', 'created_at', 'replied_at']
    list_display_links = ['name']
    list_filter = ['status', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['created_at']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    list_editable = []

    fieldsets = (
        ('Contact Info', {
            'fields': ('name', 'email', 'phone')
        }),
        ('Message', {
            'fields': ('subject', 'message')
        }),
        ('Status', {
            'fields': ('status', 'replied_at')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

    def status_badge(self, obj):
        colors = {
            'new': '#e74c3c',
            'read': '#3498db',
            'replied': '#27ae60',
            'archived': '#95a5a6'
        }
        color = colors.get(obj.status, '#95a5a6')
        return format_html(
            '<span style="background:{}; color:white; padding:3px 8px; border-radius:3px; font-size:11px;">{}</span>',
            color, obj.status.upper()
        )
    status_badge.short_description = 'Status'

    actions = ['mark_as_read', 'mark_as_replied', 'archive']

    @admin.action(description='Mark as read')
    def mark_as_read(self, request, queryset):
        queryset.update(status='read')

    @admin.action(description='Mark as replied')
    def mark_as_replied(self, request, queryset):
        from django.utils import timezone
        queryset.update(status='replied', replied_at=timezone.now())

    @admin.action(description='Archive selected messages')
    def archive(self, request, queryset):
        queryset.update(status='archived')


# ============================================
# ADMIN SITE CUSTOMIZATION
# ============================================

admin.site.site_header = "Portfolio Management"
admin.site.site_title = "Portfolio Admin"
admin.site.index_title = "Welcome to Portfolio Management Dashboard"
