/**
 * Client-side WebP Image Converter for Django Admin
 * Converts uploaded images to WebP format before form submission
 * Supports drag-and-drop, file input, and preview
 */

(function() {
    'use strict';

    // Inject responsive CSS styles
    const style = document.createElement('style');
    style.textContent = `
        .webp-preview-container {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 8px !important;
        }
        .webp-preview {
            flex: 0 0 auto !important;
            min-width: 120px !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
        }
        .webp-preview img {
            max-width: 100% !important;
            height: auto !important;
        }
        .webp-convert-btn {
            width: 100% !important;
            max-width: 200px !important;
            box-sizing: border-box !important;
        }
        @media (max-width: 600px) {
            .webp-preview {
                flex: 0 0 calc(50% - 4px) !important;
                min-width: 100px !important;
            }
        }
        @media (max-width: 400px) {
            .webp-preview {
                flex: 0 0 100% !important;
                min-width: 100% !important;
            }
        }
    `;
    document.head.appendChild(style);

    // Configuration
    const CONFIG = {
        quality: 0.85,           // WebP quality (0-1)
        maxWidth: 1920,          // Max width for conversion
        maxHeight: 1080,         // Max height for conversion
        supportedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff'],
        outputType: 'image/webp',
        outputExtension: '.webp'
    };

    // State
    const converters = new Map(); // input element -> converter instance

    /**
     * Convert image file to WebP using canvas
     * @param {File} file - Original image file
     * @param {Object} options - Conversion options
     * @returns {Promise<File>} - Converted WebP file
     */
    async function convertToWebP(file, options = {}) {
        const quality = options.quality ?? CONFIG.quality;
        const maxWidth = options.maxWidth ?? CONFIG.maxWidth;
        const maxHeight = options.maxHeight ?? CONFIG.maxHeight;

        return new Promise((resolve, reject) => {
            // Check if already WebP and no resize needed
            if (file.type === 'image/webp' && 
                (!options.maxWidth || (file.width <= maxWidth && file.height <= maxHeight))) {
                resolve(file);
                return;
            }

            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            img.onload = () => {
                // Calculate new dimensions maintaining aspect ratio
                let { width, height } = img;
                
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }

                canvas.width = width;
                canvas.height = height;

                // Draw image on canvas
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to WebP blob
                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('WebP conversion failed'));
                        return;
                    }

                    // Create new file with .webp extension
                    const originalName = file.name.replace(/\.[^/.]+$/, '');
                    const webpFile = new File([blob], `${originalName}${CONFIG.outputExtension}`, {
                        type: CONFIG.outputType,
                        lastModified: Date.now()
                    });

                    resolve(webpFile);
                }, CONFIG.outputType, quality);
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = URL.createObjectURL(file);
        });
    }

    /**
     * Create preview element for an image file
     * @param {File} file - Image file
     * @returns {HTMLElement} - Preview container
     */
    function createPreview(file) {
        const container = document.createElement('div');
        container.className = 'webp-preview';
        container.style.cssText = `
            display: inline-flex;
            flex-direction: column;
            margin: 5px;
            position: relative;
            border: 1px solid #ddd;
            border-radius: 4px;
            overflow: hidden;
            background: #f5f5f5;
            max-width: 100%;
            box-sizing: border-box;
        `;

        const img = document.createElement('img');
        img.style.cssText = `
            max-width: 100%;
            max-height: 120px;
            height: auto;
            display: block;
            object-fit: contain;
        `;
        img.src = URL.createObjectURL(file);

        const info = document.createElement('div');
        info.style.cssText = `
            padding: 4px 8px;
            font-size: 11px;
            color: #666;
            background: #fff;
            border-top: 1px solid #eee;
            word-break: break-word;
            min-width: 0;
        `;
        
        const sizeKB = (file.size / 1024).toFixed(1);
        info.innerHTML = `
            <strong>${file.name}</strong><br>
            ${file.type} • ${sizeKB} KB
        `;

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.innerHTML = '×';
        removeBtn.style.cssText = `
            position: absolute;
            top: 2px;
            right: 2px;
            width: 20px;
            height: 20px;
            border: none;
            border-radius: 50%;
            background: rgba(0,0,0,0.5);
            color: white;
            cursor: pointer;
            font-size: 14px;
            line-height: 18px;
            text-align: center;
            z-index: 10;
        `;
        removeBtn.title = 'Remove';

        container.appendChild(img);
        container.appendChild(info);
        container.appendChild(removeBtn);

        return { container, removeBtn, file };
    }

    /**
     * WebP Converter class for a file input
     */
    class WebPConverter {
        constructor(inputElement, options = {}) {
            this.input = inputElement;
            this.options = { ...CONFIG, ...options };
            this.previews = [];
            this.originalFiles = [];
            this.convertedFiles = [];
            this.previewContainer = null;
            this.init();
        }

        init() {
            // Create preview container
            this.previewContainer = document.createElement('div');
            this.previewContainer.className = 'webp-preview-container';
            this.previewContainer.style.cssText = `
                margin-top: 8px;
                padding: 10px;
                border: 1px dashed #ccc;
                border-radius: 4px;
                min-height: 50px;
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
                align-content: flex-start;
            `;

            // Insert after input
            this.input.parentNode.insertBefore(this.previewContainer, this.input.nextSibling);

            // Add convert button
            this.convertBtn = document.createElement('button');
            this.convertBtn.type = 'button';
            this.convertBtn.className = 'button webp-convert-btn';
            this.convertBtn.textContent = 'Convert to WebP';
            this.convertBtn.style.cssText = `
                margin-top: 8px;
                display: none;
                width: 100%;
                max-width: 200px;
                box-sizing: border-box;
            `;
            this.convertBtn.addEventListener('click', () => this.convertAll());
            this.input.parentNode.insertBefore(this.convertBtn, this.previewContainer);

            // Add status message
            this.statusEl = document.createElement('div');
            this.statusEl.className = 'webp-status';
            this.statusEl.style.cssText = `
                margin-top: 8px;
                font-size: 12px;
                color: #666;
                word-break: break-word;
            `;
            this.input.parentNode.insertBefore(this.statusEl, this.convertBtn);

            // Handle file selection
            this.input.addEventListener('change', (e) => this.handleFiles(e.target.files));

            // Handle drag and drop
            this.setupDragDrop();

            // Store reference
            converters.set(this.input, this);
        }

        setupDragDrop() {
            const dropZone = this.input.parentNode;
            
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }, false);
            });

            ['dragenter', 'dragover'].forEach(eventName => {
                dropZone.addEventListener(eventName, () => {
                    dropZone.style.borderColor = '#007bff';
                    dropZone.style.backgroundColor = '#f0f8ff';
                }, false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, () => {
                    dropZone.style.borderColor = '';
                    dropZone.style.backgroundColor = '';
                }, false);
            });

            dropZone.addEventListener('drop', (e) => {
                const files = e.dataTransfer.files;
                if (files.length) {
                    this.handleFiles(files);
                    // Update input files
                    this.updateInputFiles();
                }
            }, false);
        }

        handleFiles(fileList) {
            this.previewContainer.innerHTML = '';
            this.previews = [];
            this.originalFiles = [];
            this.convertedFiles = [];

            Array.from(fileList).forEach(file => {
                if (!this.options.supportedTypes.includes(file.type)) {
                    this.showStatus(`Skipped ${file.name}: Unsupported file type`, 'error');
                    return;
                }

                this.originalFiles.push(file);
                const preview = createPreview(file);
                this.previews.push(preview);
                this.previewContainer.appendChild(preview.container);

                preview.removeBtn.addEventListener('click', () => {
                    this.removeFile(file);
                });
            });

            if (this.originalFiles.length > 0) {
                this.convertBtn.style.display = 'inline-block';
                this.showStatus(`${this.originalFiles.length} file(s) ready for conversion`);
            } else {
                this.convertBtn.style.display = 'none';
                this.showStatus('');
            }
        }

        removeFile(file) {
            const index = this.originalFiles.findIndex(f => f === file);
            if (index !== -1) {
                this.originalFiles.splice(index, 1);
                this.previews[index].container.remove();
                this.previews.splice(index, 1);
                this.updateInputFiles();
            }
        }

        updateInputFiles() {
            // Create a new FileList-like object for the input
            const dt = new DataTransfer();
            this.originalFiles.forEach(file => dt.items.add(file));
            this.input.files = dt.files;
        }

        async convertAll() {
            this.convertBtn.disabled = true;
            this.convertBtn.textContent = 'Converting...';
            this.showStatus('Converting images to WebP...');

            this.convertedFiles = [];

            for (let i = 0; i < this.originalFiles.length; i++) {
                const file = this.originalFiles[i];
                try {
                    this.showStatus(`Converting ${file.name}...`);
                    const webpFile = await convertToWebP(file, this.options);
                    this.convertedFiles.push(webpFile);
                    
                    // Update preview
                    const preview = this.previews[i];
                    const sizeKB = (webpFile.size / 1024).toFixed(1);
                    const originalSizeKB = (file.size / 1024).toFixed(1);
                    const savings = ((1 - webpFile.size / file.size) * 100).toFixed(1);
                    
                    preview.container.querySelector('div').innerHTML = `
                        <strong>${webpFile.name}</strong><br>
                        ${webpFile.type} • ${sizeKB} KB (was ${originalSizeKB} KB, -${savings}%)
                    `;
                    preview.container.querySelector('img').src = URL.createObjectURL(webpFile);
                } catch (error) {
                    console.error('Conversion failed:', error);
                    this.showStatus(`Failed to convert ${file.name}: ${error.message}`, 'error');
                    this.convertedFiles.push(file); // Keep original on failure
                }
            }

            // Update input with converted files
            const dt = new DataTransfer();
            this.convertedFiles.forEach(file => dt.items.add(file));
            this.input.files = dt.files;

            this.convertBtn.disabled = false;
            this.convertBtn.textContent = 'Convert to WebP';
            this.showStatus(`Converted ${this.convertedFiles.length} image(s) to WebP`);
        }

        showStatus(message, type = 'info') {
            this.statusEl.textContent = message;
            this.statusEl.style.color = type === 'error' ? '#dc3545' : '#666';
        }

        destroy() {
            this.previewContainer.remove();
            this.convertBtn.remove();
            this.statusEl.remove();
            converters.delete(this.input);
        }
    }

    /**
     * Initialize WebP conversion for all file inputs with data-webp-convert attribute
     */
    function initWebPConversion() {
        // Find all file inputs that should have WebP conversion
        const inputs = document.querySelectorAll('input[type="file"][data-webp-convert="true"]');
        
        inputs.forEach(input => {
            // Get options from data attributes
            const options = {
                quality: parseFloat(input.dataset.webpQuality) || CONFIG.quality,
                maxWidth: parseInt(input.dataset.webpMaxWidth) || CONFIG.maxWidth,
                maxHeight: parseInt(input.dataset.webpMaxHeight) || CONFIG.maxHeight,
            };
            
            new WebPConverter(input, options);
        });
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWebPConversion);
    } else {
        initWebPConversion();
    }

    // Also initialize for dynamically added content (e.g., inlines)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Check the node itself
                    if (node.matches && node.matches('input[type="file"][data-webp-convert="true"]')) {
                        const options = {
                            quality: parseFloat(node.dataset.webpQuality) || CONFIG.quality,
                            maxWidth: parseInt(node.dataset.webpMaxWidth) || CONFIG.maxWidth,
                            maxHeight: parseInt(node.dataset.webpMaxHeight) || CONFIG.maxHeight,
                        };
                        new WebPConverter(node, options);
                    }
                    // Check children
                    const inputs = node.querySelectorAll?.('input[type="file"][data-webp-convert="true"]');
                    if (inputs) {
                        inputs.forEach(input => {
                            if (!converters.has(input)) {
                                const options = {
                                    quality: parseFloat(input.dataset.webpQuality) || CONFIG.quality,
                                    maxWidth: parseInt(input.dataset.webpMaxWidth) || CONFIG.maxWidth,
                                    maxHeight: parseInt(input.dataset.webpMaxHeight) || CONFIG.maxHeight,
                                };
                                new WebPConverter(input, options);
                            }
                        });
                    }
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Expose for manual initialization
    window.WebPConverter = WebPConverter;
    window.initWebPConversion = initWebPConversion;

})();