"""Migration command to move BinaryField blobs into File/ImageFields.

Run with Cloudinary enabled (set USE_CLOUDINARY=True and CLOUDINARY_URL in your env) if you want files uploaded to Cloudinary.

Usage:
    python manage.py migrate_binary_to_cloudinary

This command will iterate models/fields listed in FIELD_MAP and, for each object that has binary data but no file in the new FileField,
create a ContentFile and save it to the FileField (which triggers the configured storage backend to store the file).

It is safe to run multiple times; it will skip items that already have the new file field populated.
"""
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.apps import apps
import mimetypes
import os

# Mapping: (app_label.ModelName, binary_field_name, file_field_name, fallback_basename)
FIELD_MAP = [
    ('api', 'Image', 'image_data', 'image_file', 'image'),
    ('api', 'Profile', 'profile_image_data', 'profile_image_file', 'profile'),
    ('api', 'Profile', 'resume_data', 'resume_file', 'resume'),
    ('api', 'Education', 'logo_data', 'logo_file', 'logo'),
    ('api', 'WorkExperience', 'company_logo_data', 'company_logo_file', 'company_logo'),
    ('api', 'Project', 'featured_image_data', 'featured_image_file', 'project'),
    ('api', 'Certificate', 'organization_logo_data', 'organization_logo_file', 'org_logo'),
    ('api', 'Certificate', 'certificate_image_data', 'certificate_image_file', 'certificate'),
    ('api', 'Achievement', 'image_data', 'image_file', 'achievement'),
    ('api', 'BlogPost', 'featured_image_data', 'featured_image_file', 'blog_featured'),
    ('api', 'BlogPost', 'og_image_data', 'og_image_file', 'blog_og'),
    ('api', 'Testimonial', 'author_image_data', 'author_image_file', 'author'),
]

# Common mapping from mime to extension fallback
MIME_EXT_MAP = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'application/pdf': '.pdf',
}


def ext_from_mime(mime, fallback='.bin'):
    if not mime:
        return fallback
    if mime in MIME_EXT_MAP:
        return MIME_EXT_MAP[mime]
    ext = mimetypes.guess_extension(mime)
    return ext or fallback


class Command(BaseCommand):
    help = 'Move binary media fields into FileFields (Cloudinary/local based on USE_CLOUDINARY).'

    def add_arguments(self, parser):
        parser.add_argument(
            '--batch-size', '-b', type=int, default=50,
            help='How many records to fetch in each query iterator chunk.'
        )

    def handle(self, *args, **options):
        batch_size = options['batch_size']

        for app_label, model_name, binary_field, file_field, fallback_name in FIELD_MAP:
            Model = apps.get_model(app_label, model_name)
            if not Model:
                self.stdout.write(self.style.WARNING(f"Model {app_label}.{model_name} not found - skipping"))
                continue

            qs = Model.objects.all()
            total = qs.count()
            self.stdout.write(f"Processing {model_name}: {total} objects")

            migrated = 0
            skipped = 0

            for obj in qs.iterator(chunk_size=batch_size):
                try:
                    blob = getattr(obj, binary_field, None)
                except AttributeError:
                    skipped += 1
                    continue

                # Check if file field already present
                have_file = False
                try:
                    val = getattr(obj, file_field)
                    # For FileField, check if there is a name
                    have_file = bool(getattr(val, 'name', None))
                except Exception:
                    have_file = False

                if not blob or have_file:
                    skipped += 1
                    continue

                # Determine filename from existing fields if possible
                filename = None
                # Try common filename fields
                for candidate in ('filename', 'resume_filename', 'certificate_image_filename'):
                    if hasattr(obj, candidate) and getattr(obj, candidate):
                        filename = getattr(obj, candidate)
                        break

                if not filename:
                    # Build fallback name using model name and pk plus extension from mime if available
                    mime_attr = None
                    # common mime fields
                    for mfield in (binary_field.replace('_data', '_mime'), 'image_mime', 'certificate_image_mime', 'og_image_mime'):
                        if hasattr(obj, mfield):
                            mime_attr = getattr(obj, mfield)
                            break

                    ext = ext_from_mime(mime_attr, fallback='.bin')
                    filename = f"{fallback_name}_{obj.pk}{ext}"

                # Save to file field using ContentFile
                try:
                    content = ContentFile(blob)
                    getattr(obj, file_field).save(filename, content, save=True)
                    migrated += 1
                    self.stdout.write(self.style.SUCCESS(f"Migrated {model_name} id={obj.pk} -> {file_field} as {filename}"))
                except Exception as exc:
                    self.stdout.write(self.style.ERROR(f"Failed to migrate {model_name} id={obj.pk}: {exc}"))

            self.stdout.write(self.style.SUCCESS(f"Finished {model_name}: migrated={migrated}, skipped={skipped}"))

        self.stdout.write(self.style.SUCCESS('All migrations complete.'))
