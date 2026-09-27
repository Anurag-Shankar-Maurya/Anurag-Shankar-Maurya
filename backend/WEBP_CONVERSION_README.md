# Client-Side WebP Image Conversion for Django Admin

This project includes a client-side WebP conversion feature for Django Admin that automatically converts uploaded images to WebP format before form submission, reducing file sizes while maintaining quality.

## Features

- **Automatic WebP Conversion**: Images are converted to WebP format in the browser before upload
- **Configurable Quality**: Adjustable compression quality (default 85%)
- **Responsive Resizing**: Optional max width/height constraints
- **Drag & Drop Support**: Intuitive file selection with drag-and-drop
- **Live Preview**: See original and converted images with size comparison
- **Progress Feedback**: Real-time conversion status
- **Non-Destructive**: Original files preserved until conversion succeeds

## How It Works

1. User selects image file(s) via file input or drag-and-drop
2. JavaScript creates preview thumbnails
3. User clicks "Convert to WebP" button
4. Images are converted using HTML5 Canvas API
5. Converted WebP files replace originals in the file input
6. Form submits WebP files to Django backend

## Supported Models & Fields

| Model | Field | Max Dimensions | Quality |
|-------|-------|----------------|---------|
| Image | upload_image | 1920×1080 | 85% |
| Profile | upload_profile_image | 800×800 | 90% |
| Education | upload_logo | 400×400 | 85% |
| WorkExperience | upload_company_logo | 400×400 | 85% |
| Project | upload_featured_image | 1200×800 | 85% |
| Certificate | upload_organization_logo | 400×400 | 85% |
| Certificate | upload_certificate_image | 1200×1600 | 85% |
| Achievement | upload_achievement_image | 800×800 | 85% |
| BlogPost | upload_featured_image | 1200×800 | 85% |
| BlogPost | upload_og_image | 1200×630 | 85% |
| Testimonial | upload_author_image | 400×400 | 90% |

## Files Added/Modified

### New Files
- `backend/static/admin/js/webp-converter.js` - Core conversion logic
- `backend/templates/admin/base_site.html` - Template override to include JS

### Modified Files
- `backend/api/admin.py` - Added WebP conversion attributes to form fields
- `backend/portfolio/settings.py` - Added templates directory to TEMPLATES DIRS

## Usage in Django Admin

1. Navigate to any model with image upload fields (e.g., Profile, Project, BlogPost)
2. Click "Choose File" or drag an image onto the upload field
3. Preview appears showing original file info
4. Click "Convert to WebP" button
5. Wait for conversion (shows progress)
6. Preview updates showing WebP file with size savings
7. Save the model - WebP file is uploaded to server

## Configuration Options

Add these data attributes to any file input to enable WebP conversion:

```html
<input type="file" 
       data-webp-convert="true"
       data-webp-quality="0.85"
       data-webp-max-width="1920"
       data-webp-max-height="1080"
       accept="image/*">
```

| Attribute | Description | Default |
|-----------|-------------|---------|
| `data-webp-convert` | Enable WebP conversion | `false` |
| `data-webp-quality` | Compression quality (0-1) | `0.85` |
| `data-webp-max-width` | Maximum width in pixels | `1920` |
| `data-webp-max-height` | Maximum height in pixels | `1080` |

## Browser Support

- Chrome 23+
- Firefox 65+
- Safari 14+
- Edge 79+
- Opera 44+

Requires: Canvas API, File API, Blob, URL.createObjectURL

## Fallback Behavior

- If browser doesn't support WebP conversion: Original file uploaded unchanged
- If conversion fails: Original file kept, error shown to user
- If user doesn't click "Convert": Original file uploaded (no auto-conversion)

## Server-Side Considerations

The Django backend receives WebP files and stores them normally. The `mime_type` field will be `image/webp` and filename will have `.webp` extension.

No server-side changes required - works with existing:
- Local file storage
- Cloudinary storage
- Any Django storage backend

## Testing

1. Start Django development server: `python manage.py runserver`
2. Open admin: `http://localhost:8000/admin/`
3. Edit any model with image fields (Profile, Project, etc.)
4. Upload a JPEG/PNG image
5. Click "Convert to WebP"
6. Verify size reduction in preview
7. Save and check stored file is WebP

## Troubleshooting

**Conversion button not showing:**
- Ensure `data-webp-convert="true"` on file input
- Check browser console for JavaScript errors
- Verify `webp-converter.js` is loaded (check Network tab)

**Conversion fails:**
- Check file type is supported (JPEG, PNG, GIF, BMP, TIFF)
- Ensure file isn't corrupted
- Check browser console for error details

**Files not saving as WebP:**
- Verify form is using the custom admin forms (ImageAdminForm, ProfileAdminForm, etc.)
- Check that `enctype="multipart/form-data"` on form (Django admin handles this)

## Performance Notes

- Conversion happens client-side, no server load
- Large images (>5MB) may take a few seconds
- Consider setting lower max dimensions for faster conversion
- Quality 0.85 provides good balance of size/quality

## Security

- Only runs in admin interface (authenticated users)
- No file data sent to external services
- All processing in browser memory
- Original files never leave browser unless user saves