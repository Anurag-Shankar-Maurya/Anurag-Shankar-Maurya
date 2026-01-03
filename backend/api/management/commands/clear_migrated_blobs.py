"""Clear migrated binary BLOBs after files have been copied to FileFields (e.g., Cloudinary).

Usage:
  # Dry-run: shows what would be cleared (default behavior unless --confirm is passed)
  python manage.py clear_migrated_blobs --dry-run

  # Dry-run + verify that the storage object exists before clearing:
  python manage.py clear_migrated_blobs --dry-run --verify

  # Apply changes (destructive):
  python manage.py clear_migrated_blobs --confirm --verify

Safety:
- This does NOT drop any columns; it only sets BinaryFields to NULL (if the field allows it) or to empty bytes (b'')
  for non-nullable BinaryFields.
- Always take a DB backup before running with --confirm.
"""
from django.core.management.base import BaseCommand
from django.apps import apps
from django.db import transaction

# (app_label, ModelName, binary_field, file_field)
FIELD_MAP = [
    ('api', 'Image', 'image_data', 'image_file'),
    ('api', 'Profile', 'profile_image_data', 'profile_image_file'),
    ('api', 'Profile', 'resume_data', 'resume_file'),
    ('api', 'Education', 'logo_data', 'logo_file'),
    ('api', 'WorkExperience', 'company_logo_data', 'company_logo_file'),
    ('api', 'Project', 'featured_image_data', 'featured_image_file'),
    ('api', 'Certificate', 'organization_logo_data', 'organization_logo_file'),
    ('api', 'Certificate', 'certificate_image_data', 'certificate_image_file'),
    ('api', 'Achievement', 'image_data', 'image_file'),
    ('api', 'BlogPost', 'featured_image_data', 'featured_image_file'),
    ('api', 'BlogPost', 'og_image_data', 'og_image_file'),
    ('api', 'Testimonial', 'author_image_data', 'author_image_file'),
]

class Command(BaseCommand):
    help = 'Clear BinaryField blobs for objects that have a migrated FileField'

    def add_arguments(self, parser):
        parser.add_argument('--dry-run', action='store_true', help='Show what would be cleared (default)')
        parser.add_argument('--verify', action='store_true', help='Verify file exists in storage before clearing')
        parser.add_argument('--confirm', action='store_true', help='Actually perform the clears')
        parser.add_argument('--batch-size', '-b', type=int, default=500, help='Batch size for updates')

    def handle(self, *args, **opts):
        dry = opts['dry_run'] or not opts['confirm']
        verify = opts['verify']
        batch = opts['batch_size']

        total_to_clear = 0
        for app_label, model_name, binary_field, file_field in FIELD_MAP:
            Model = apps.get_model(app_label, model_name)
            if not Model:
                self.stdout.write(self.style.WARNING(f"Model {app_label}.{model_name} not found - skipping"))
                continue

            to_clear = []
            for obj in Model.objects.all().iterator(chunk_size=batch):
                f = getattr(obj, file_field, None)
                fname = getattr(f, 'name', None)
                if not fname:
                    continue
                # optional verification that the file actually exists in storage
                if verify:
                    try:
                        exists = getattr(f, 'storage', None) and f.storage.exists(fname)
                    except Exception:
                        exists = False
                    if not exists:
                        continue
                val = getattr(obj, binary_field)
                if val in (None, b''):
                    continue
                to_clear.append(obj.pk)

            self.stdout.write(f"{model_name}: {len(to_clear)} rows eligible to clear")
            total_to_clear += len(to_clear)

            if dry or len(to_clear) == 0:
                continue

            # perform clear in batches
            null_allowed = Model._meta.get_field(binary_field).null
            clear_val = None if null_allowed else b''
            for i in range(0, len(to_clear), batch):
                chunk = to_clear[i:i+batch]
                # Use transaction per chunk for safety
                with transaction.atomic():
                    Model.objects.filter(pk__in=chunk).update(**{binary_field: clear_val})
            self.stdout.write(self.style.SUCCESS(f"Cleared {len(to_clear)} rows for {model_name}"))

        self.stdout.write(self.style.SUCCESS(f"Total rows eligible: {total_to_clear}"))
        if dry:
            self.stdout.write(self.style.WARNING("Dry-run (no changes made). Re-run with --confirm to apply changes."))
