/**
 * Client-side WebP Image Converter for Django Admin
 *
 * Features:
 * - Responsive layout
 * - Desktop / tablet / mobile support
 * - Drag & drop
 * - Image preview
 * - WebP conversion
 * - Image resizing
 * - File removal
 * - Works with Django Admin
 * - Supports dynamically added file inputs
 */

(function () {
    'use strict';

    /* ============================================================
       CONFIGURATION
    ============================================================ */

    const CONFIG = {
        quality: 0.85,
        maxWidth: 1920,
        maxHeight: 1080,

        supportedTypes: [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/bmp',
            'image/tiff'
        ],

        outputType: 'image/webp',
        outputExtension: '.webp'
    };


    /* ============================================================
       GLOBAL STYLES
    ============================================================ */

    const style = document.createElement('style');

    style.textContent = `
        /* ========================================================
           MAIN CONTAINER
        ======================================================== */

        .webp-converter-wrapper {
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
            margin-top: 8px;
        }

        /* ========================================================
           UPLOAD AREA
        ======================================================== */

        .webp-upload-area {
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
            transition:
                background-color 0.2s ease,
                border-color 0.2s ease;
        }

        .webp-upload-area.webp-drag-active {
            border-color: #417690 !important;
            background: rgba(65, 118, 144, 0.08) !important;
        }

        /* ========================================================
           ACTION AREA
        ======================================================== */

        .webp-action-area {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px;
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
            margin-top: 8px;
        }

        .webp-convert-btn {
            box-sizing: border-box !important;
            max-width: 220px !important;
            width: auto !important;
            min-height: 34px;
            white-space: normal;
        }

        .webp-status {
            flex: 1 1 200px;
            min-width: 0;
            max-width: 100%;
            box-sizing: border-box;
            font-size: 12px;
            line-height: 1.5;
            color: #666;
            overflow-wrap: anywhere;
        }

        /* ========================================================
           PREVIEW CONTAINER
        ======================================================== */

        .webp-preview-container {
            display: grid !important;

            /*
             * Responsive grid:
             * Desktop: multiple cards
             * Tablet: 2 cards
             * Mobile: 1 card
             */
            grid-template-columns:
                repeat(auto-fill, minmax(220px, 1fr));

            gap: 10px !important;

            width: 100% !important;
            max-width: 100% !important;

            box-sizing: border-box !important;

            margin-top: 10px;
            padding: 10px;

            border: 1px dashed #aaa;
            border-radius: 4px;

            background: transparent;

            min-height: 0;

            overflow: hidden;
        }

        /* Empty preview area should not take huge space */
        .webp-preview-container:empty {
            display: none !important;
        }

        /* ========================================================
           PREVIEW CARD
        ======================================================== */

        .webp-preview {
            position: relative;

            display: flex !important;
            flex-direction: column !important;

            width: 100% !important;
            min-width: 0 !important;
            max-width: 100% !important;

            box-sizing: border-box !important;

            margin: 0 !important;

            overflow: hidden;

            border: 1px solid #ccc;
            border-radius: 4px;

            background: #fff;

            color: #333;
        }

        /* ========================================================
           IMAGE
        ======================================================== */

        .webp-preview-image {
            display: block;

            width: 100%;
            max-width: 100%;

            height: 180px;

            object-fit: contain;

            background: #f3f3f3;

            box-sizing: border-box;
        }

        /* ========================================================
           FILE INFORMATION
        ======================================================== */

        .webp-preview-info {
            width: 100%;
            min-width: 0;

            box-sizing: border-box;

            padding: 7px 9px;

            border-top: 1px solid #e5e5e5;

            background: #fff;

            font-size: 11px;
            line-height: 1.45;

            color: #555;

            overflow-wrap: anywhere;
            word-break: break-word;
        }

        .webp-preview-name {
            display: block;

            max-width: 100%;

            font-weight: 600;

            overflow-wrap: anywhere;
            word-break: break-word;
        }

        .webp-preview-meta {
            display: block;

            margin-top: 2px;

            color: #777;

            overflow-wrap: anywhere;
            word-break: break-word;
        }

        /* ========================================================
           REMOVE BUTTON
        ======================================================== */

        .webp-remove-btn {
            position: absolute;

            top: 6px;
            right: 6px;

            z-index: 10;

            width: 26px !important;
            height: 26px !important;

            min-width: 26px !important;

            padding: 0 !important;

            border: 0 !important;
            border-radius: 50% !important;

            background: rgba(0, 0, 0, 0.65) !important;

            color: #fff !important;

            cursor: pointer;

            font-size: 17px !important;
            line-height: 26px !important;

            text-align: center;

            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
        }

        .webp-remove-btn:hover {
            background: rgba(180, 0, 0, 0.9) !important;
        }

        /* ========================================================
           DJANGO ADMIN DARK MODE SUPPORT
        ======================================================== */

        @media (prefers-color-scheme: dark) {

            .webp-preview {
                background: #1f1f1f;
                border-color: #444;
                color: #eee;
            }

            .webp-preview-image {
                background: #111;
            }

            .webp-preview-info {
                background: #1f1f1f;
                border-color: #444;
                color: #ddd;
            }

            .webp-preview-meta {
                color: #aaa;
            }

            .webp-preview-container {
                border-color: #555;
            }

            .webp-status {
                color: #aaa;
            }
        }

        /* ========================================================
           LARGE TABLETS
        ======================================================== */

        @media (max-width: 900px) {

            .webp-preview-container {
                grid-template-columns:
                    repeat(2, minmax(0, 1fr));
            }

            .webp-preview-image {
                height: 160px;
            }
        }

        /* ========================================================
           MOBILE
        ======================================================== */

        @media (max-width: 600px) {

            .webp-action-area {
                flex-direction: column;
                align-items: stretch;
            }

            .webp-convert-btn {
                width: 100% !important;
                max-width: none !important;
            }

            .webp-status {
                width: 100%;
                flex: none;
            }

            .webp-preview-container {
                grid-template-columns: 1fr !important;

                padding: 6px;

                gap: 8px !important;
            }

            .webp-preview {
                width: 100% !important;
            }

            .webp-preview-image {
                height: auto;
                max-height: 260px;
                min-height: 120px;
            }
        }

        /* ========================================================
           SMALL MOBILE
        ======================================================== */

        @media (max-width: 400px) {

            .webp-preview-container {
                padding: 4px;
            }

            .webp-preview-info {
                padding: 6px 8px;
                font-size: 10px;
            }

            .webp-preview-image {
                max-height: 220px;
            }

            .webp-remove-btn {
                width: 24px !important;
                height: 24px !important;
                min-width: 24px !important;

                font-size: 15px !important;
                line-height: 24px !important;
            }
        }

        /* ========================================================
           VERY SMALL SCREENS
        ======================================================== */

        @media (max-width: 320px) {

            .webp-preview-image {
                max-height: 180px;
            }

            .webp-preview-info {
                font-size: 9px;
            }
        }
    `;

    document.head.appendChild(style);


    /* ============================================================
       STATE
    ============================================================ */

    const converters = new Map();


    /* ============================================================
       IMAGE CONVERSION
    ============================================================ */

    async function convertToWebP(file, options = {}) {

        const quality = options.quality ?? CONFIG.quality;
        const maxWidth = options.maxWidth ?? CONFIG.maxWidth;
        const maxHeight = options.maxHeight ?? CONFIG.maxHeight;

        return new Promise((resolve, reject) => {

            const img = new Image();

            const objectURL = URL.createObjectURL(file);

            img.onload = () => {

                URL.revokeObjectURL(objectURL);

                let width = img.naturalWidth;
                let height = img.naturalHeight;

                if (!width || !height) {
                    reject(new Error('Unable to determine image dimensions'));
                    return;
                }

                /*
                 * Resize while maintaining aspect ratio
                 */
                if (width > maxWidth || height > maxHeight) {

                    const ratio = Math.min(
                        maxWidth / width,
                        maxHeight / height
                    );

                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }

                const canvas = document.createElement('canvas');

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    reject(new Error('Canvas is not supported'));
                    return;
                }

                /*
                 * White background.
                 *
                 * This prevents transparent PNGs from becoming
                 * black after WebP conversion.
                 */
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, width, height);

                ctx.drawImage(
                    img,
                    0,
                    0,
                    width,
                    height
                );

                canvas.toBlob(
                    (blob) => {

                        if (!blob) {
                            reject(
                                new Error('WebP conversion failed')
                            );
                            return;
                        }

                        const originalName =
                            file.name.replace(/\.[^/.]+$/, '');

                        const webpFile = new File(
                            [blob],
                            `${originalName}${CONFIG.outputExtension}`,
                            {
                                type: CONFIG.outputType,
                                lastModified: Date.now()
                            }
                        );

                        resolve(webpFile);
                    },
                    CONFIG.outputType,
                    quality
                );
            };

            img.onerror = () => {

                URL.revokeObjectURL(objectURL);

                reject(
                    new Error('Failed to load image')
                );
            };

            img.src = objectURL;
        });
    }


    /* ============================================================
       PREVIEW
    ============================================================ */

    function createPreview(file) {

        const container = document.createElement('div');

        container.className = 'webp-preview';

        const img = document.createElement('img');

        img.className = 'webp-preview-image';

        const objectURL = URL.createObjectURL(file);

        img.src = objectURL;

        img.alt = file.name;

        img.loading = 'lazy';


        /* --------------------------------------------------------
           File Information
        -------------------------------------------------------- */

        const info = document.createElement('div');

        info.className = 'webp-preview-info';

        const name = document.createElement('span');

        name.className = 'webp-preview-name';

        name.textContent = file.name;


        const meta = document.createElement('span');

        meta.className = 'webp-preview-meta';

        const sizeKB =
            (file.size / 1024).toFixed(1);

        meta.textContent =
            `${file.type} • ${sizeKB} KB`;


        info.appendChild(name);
        info.appendChild(meta);


        /* --------------------------------------------------------
           Remove Button
        -------------------------------------------------------- */

        const removeBtn =
            document.createElement('button');

        removeBtn.type = 'button';

        removeBtn.className =
            'webp-remove-btn';

        removeBtn.textContent = '×';

        removeBtn.title = 'Remove';


        container.appendChild(img);
        container.appendChild(info);
        container.appendChild(removeBtn);


        return {
            container,
            removeBtn,
            file
        };
    }


    /* ============================================================
       WEBP CONVERTER CLASS
    ============================================================ */

    class WebPConverter {

        constructor(inputElement, options = {}) {

            this.input = inputElement;

            this.options = {
                ...CONFIG,
                ...options
            };

            this.previews = [];

            this.originalFiles = [];

            this.convertedFiles = [];

            this.previewContainer = null;

            this.init();
        }


        /* --------------------------------------------------------
           Initialize
        -------------------------------------------------------- */

        init() {

            /*
             * Main wrapper
             */
            this.wrapper =
                document.createElement('div');

            this.wrapper.className =
                'webp-converter-wrapper';


            /*
             * Upload area
             */
            this.uploadArea =
                document.createElement('div');

            this.uploadArea.className =
                'webp-upload-area';


            /*
             * Move input into wrapper
             */
            this.input.parentNode.insertBefore(
                this.wrapper,
                this.input
            );

            this.wrapper.appendChild(
                this.input
            );

            this.wrapper.appendChild(
                this.uploadArea
            );


            /*
             * Preview container
             */
            this.previewContainer =
                document.createElement('div');

            this.previewContainer.className =
                'webp-preview-container';


            /*
             * Action area
             */
            this.actionArea =
                document.createElement('div');

            this.actionArea.className =
                'webp-action-area';


            /*
             * Convert button
             */
            this.convertBtn =
                document.createElement('button');

            this.convertBtn.type = 'button';

            this.convertBtn.className =
                'button webp-convert-btn';

            this.convertBtn.textContent =
                'Convert to WebP';

            this.convertBtn.style.display =
                'none';


            /*
             * Status
             */
            this.statusEl =
                document.createElement('div');

            this.statusEl.className =
                'webp-status';


            /*
             * Assemble
             */
            this.actionArea.appendChild(
                this.convertBtn
            );

            this.actionArea.appendChild(
                this.statusEl
            );

            this.wrapper.appendChild(
                this.actionArea
            );

            this.wrapper.appendChild(
                this.previewContainer
            );


            /*
             * Events
             */
            this.convertBtn.addEventListener(
                'click',
                () => this.convertAll()
            );

            this.input.addEventListener(
                'change',
                (event) => {
                    this.handleFiles(
                        event.target.files
                    );
                }
            );


            this.setupDragDrop();


            /*
             * Store converter
             */
            converters.set(
                this.input,
                this
            );
        }


        /* --------------------------------------------------------
           Drag & Drop
        -------------------------------------------------------- */

        setupDragDrop() {

            const dropZone =
                this.wrapper;


            [
                'dragenter',
                'dragover',
                'dragleave',
                'drop'
            ].forEach(eventName => {

                dropZone.addEventListener(
                    eventName,
                    event => {

                        event.preventDefault();
                        event.stopPropagation();
                    }
                );
            });


            [
                'dragenter',
                'dragover'
            ].forEach(eventName => {

                dropZone.addEventListener(
                    eventName,
                    () => {

                        this.uploadArea.classList.add(
                            'webp-drag-active'
                        );
                    }
                );
            });


            [
                'dragleave',
                'drop'
            ].forEach(eventName => {

                dropZone.addEventListener(
                    eventName,
                    () => {

                        this.uploadArea.classList.remove(
                            'webp-drag-active'
                        );
                    }
                );
            });


            dropZone.addEventListener(
                'drop',
                event => {

                    const files =
                        event.dataTransfer.files;

                    if (!files.length) {
                        return;
                    }

                    this.handleFiles(files);

                    this.updateInputFiles();
                }
            );
        }


        /* --------------------------------------------------------
           Handle Files
        -------------------------------------------------------- */

        handleFiles(fileList) {

            this.previewContainer.innerHTML = '';

            this.previews = [];

            this.originalFiles = [];

            this.convertedFiles = [];


            Array.from(fileList).forEach(file => {

                if (
                    !this.options.supportedTypes.includes(
                        file.type
                    )
                ) {

                    this.showStatus(
                        `Skipped ${file.name}: Unsupported file type`,
                        'error'
                    );

                    return;
                }


                this.originalFiles.push(file);


                const preview =
                    createPreview(file);


                this.previews.push(preview);


                this.previewContainer.appendChild(
                    preview.container
                );


                preview.removeBtn.addEventListener(
                    'click',
                    () => {
                        this.removeFile(file);
                    }
                );
            });


            if (this.originalFiles.length > 0) {

                this.convertBtn.style.display =
                    'inline-block';

                this.showStatus(
                    `${this.originalFiles.length} file(s) ready for conversion`
                );

            } else {

                this.convertBtn.style.display =
                    'none';

                this.showStatus('');
            }
        }


        /* --------------------------------------------------------
           Remove File
        -------------------------------------------------------- */

        removeFile(file) {

            const index =
                this.originalFiles.findIndex(
                    f => f === file
                );


            if (index === -1) {
                return;
            }


            this.originalFiles.splice(
                index,
                1
            );


            if (this.previews[index]) {

                const image =
                    this.previews[index]
                        .container
                        .querySelector('img');

                if (image && image.src) {

                    URL.revokeObjectURL(
                        image.src
                    );
                }


                this.previews[index]
                    .container
                    .remove();
            }


            this.previews.splice(
                index,
                1
            );


            this.updateInputFiles();


            if (!this.originalFiles.length) {

                this.convertBtn.style.display =
                    'none';

                this.showStatus('');
            }
        }


        /* --------------------------------------------------------
           Update Input FileList
        -------------------------------------------------------- */

        updateInputFiles() {

            const dt =
                new DataTransfer();


            this.originalFiles.forEach(file => {

                dt.items.add(file);
            });


            this.input.files =
                dt.files;
        }


        /* --------------------------------------------------------
           Convert All
        -------------------------------------------------------- */

        async convertAll() {

            if (!this.originalFiles.length) {
                return;
            }


            this.convertBtn.disabled =
                true;

            this.convertBtn.textContent =
                'Converting...';


            this.showStatus(
                'Converting images to WebP...'
            );


            this.convertedFiles = [];


            for (
                let i = 0;
                i < this.originalFiles.length;
                i++
            ) {

                const file =
                    this.originalFiles[i];


                try {

                    this.showStatus(
                        `Converting ${i + 1} of ${this.originalFiles.length}: ${file.name}`
                    );


                    const webpFile =
                        await convertToWebP(
                            file,
                            this.options
                        );


                    this.convertedFiles.push(
                        webpFile
                    );


                    /*
                     * Update preview
                     */
                    const preview =
                        this.previews[i];


                    if (!preview) {
                        continue;
                    }


                    const oldSizeKB =
                        (
                            file.size /
                            1024
                        ).toFixed(1);


                    const newSizeKB =
                        (
                            webpFile.size /
                            1024
                        ).toFixed(1);


                    const savings =
                        file.size > 0
                            ? (
                                (
                                    1 -
                                    webpFile.size /
                                    file.size
                                ) * 100
                            ).toFixed(1)
                            : '0.0';


                    const info =
                        preview.container
                            .querySelector(
                                '.webp-preview-info'
                            );


                    const name =
                        preview.container
                            .querySelector(
                                '.webp-preview-name'
                            );


                    const meta =
                        preview.container
                            .querySelector(
                                '.webp-preview-meta'
                            );


                    if (name) {

                        name.textContent =
                            webpFile.name;
                    }


                    if (meta) {

                        meta.textContent =
                            `${webpFile.type} • ${newSizeKB} KB (was ${oldSizeKB} KB, ${savings}% smaller)`;
                    }


                    const image =
                        preview.container
                            .querySelector('img');


                    if (image) {

                        if (image.src) {

                            URL.revokeObjectURL(
                                image.src
                            );
                        }


                        image.src =
                            URL.createObjectURL(
                                webpFile
                            );
                    }

                } catch (error) {

                    console.error(
                        'WebP conversion failed:',
                        error
                    );


                    this.showStatus(
                        `Failed to convert ${file.name}: ${error.message}`,
                        'error'
                    );


                    /*
                     * Keep original file if
                     * conversion fails.
                     */
                    this.convertedFiles.push(
                        file
                    );
                }
            }


            /*
             * Replace uploaded files
             * with converted WebP files.
             */
            const dt =
                new DataTransfer();


            this.convertedFiles.forEach(
                file => {
                    dt.items.add(file);
                }
            );


            this.input.files =
                dt.files;


            this.convertBtn.disabled =
                false;


            this.convertBtn.textContent =
                'Convert to WebP';


            this.showStatus(
                `Converted ${this.convertedFiles.length} image(s) to WebP`
            );
        }


        /* --------------------------------------------------------
           Status
        -------------------------------------------------------- */

        showStatus(
            message,
            type = 'info'
        ) {

            this.statusEl.textContent =
                message;


            this.statusEl.style.color =
                type === 'error'
                    ? '#dc3545'
                    : '';
        }


        /* --------------------------------------------------------
           Destroy
        -------------------------------------------------------- */

        destroy() {

            this.wrapper.remove();

            converters.delete(
                this.input
            );
        }
    }


    /* ============================================================
       INITIALIZATION
    ============================================================ */

    function initWebPConversion() {

        const inputs =
            document.querySelectorAll(
                'input[type="file"][data-webp-convert="true"]'
            );


        inputs.forEach(input => {

            if (converters.has(input)) {
                return;
            }


            const options = {

                quality:
                    parseFloat(
                        input.dataset.webpQuality
                    ) || CONFIG.quality,

                maxWidth:
                    parseInt(
                        input.dataset.webpMaxWidth,
                        10
                    ) || CONFIG.maxWidth,

                maxHeight:
                    parseInt(
                        input.dataset.webpMaxHeight,
                        10
                    ) || CONFIG.maxHeight
            };


            new WebPConverter(
                input,
                options
            );
        });
    }


    /* ============================================================
       DOM READY
    ============================================================ */

    if (
        document.readyState ===
        'loading'
    ) {

        document.addEventListener(
            'DOMContentLoaded',
            initWebPConversion
        );

    } else {

        initWebPConversion();
    }


    /* ============================================================
       DYNAMIC DJANGO ADMIN CONTENT
    ============================================================ */

    const observer =
        new MutationObserver(
            mutations => {

                mutations.forEach(
                    mutation => {

                        mutation.addedNodes.forEach(
                            node => {

                                if (
                                    node.nodeType !==
                                    Node.ELEMENT_NODE
                                ) {
                                    return;
                                }


                                /*
                                 * Direct input
                                 */
                                if (
                                    node.matches &&
                                    node.matches(
                                        'input[type="file"][data-webp-convert="true"]'
                                    )
                                ) {

                                    if (
                                        !converters.has(
                                            node
                                        )
                                    ) {

                                        const options = {

                                            quality:
                                                parseFloat(
                                                    node.dataset.webpQuality
                                                ) || CONFIG.quality,

                                            maxWidth:
                                                parseInt(
                                                    node.dataset.webpMaxWidth,
                                                    10
                                                ) || CONFIG.maxWidth,

                                            maxHeight:
                                                parseInt(
                                                    node.dataset.webpMaxHeight,
                                                    10
                                                ) || CONFIG.maxHeight
                                        };


                                        new WebPConverter(
                                            node,
                                            options
                                        );
                                    }
                                }


                                /*
                                 * Inputs inside newly
                                 * added Django Admin content
                                 */
                                const inputs =
                                    node.querySelectorAll?.(
                                        'input[type="file"][data-webp-convert="true"]'
                                    );


                                if (!inputs) {
                                    return;
                                }


                                inputs.forEach(
                                    input => {

                                        if (
                                            converters.has(
                                                input
                                            )
                                        ) {
                                            return;
                                        }


                                        const options = {

                                            quality:
                                                parseFloat(
                                                    input.dataset.webpQuality
                                                ) || CONFIG.quality,

                                            maxWidth:
                                                parseInt(
                                                    input.dataset.webpMaxWidth,
                                                    10
                                                ) || CONFIG.maxWidth,

                                            maxHeight:
                                                parseInt(
                                                    input.dataset.webpMaxHeight,
                                                    10
                                                ) || CONFIG.maxHeight
                                        };


                                        new WebPConverter(
                                            input,
                                            options
                                        );
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );


    observer.observe(
        document.body,
        {
            childList: true,
            subtree: true
        }
    );


    /* ============================================================
       GLOBAL API
    ============================================================ */

    window.WebPConverter =
        WebPConverter;

    window.initWebPConversion =
        initWebPConversion;

})();