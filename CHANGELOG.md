<div align="center">
  <img src="logo.png" width="130" alt="Zova PDF Logo">
  <h1>Zova PDF &mdash; Daily Updates &amp; Release Changelog</h1>
  <p>Official record of daily automated and feature updates for Zova PDF Workspace.</p>
</div>

---

## 📅 Releases

### 🌟 Release v2.4 &bull; October 27, 2026 (Official Rebrand to Zova PDF)
- **✨ Official Rebranding to Zova PDF**:
  - Rebranded the application, documentation, and user interfaces across all tools, modals, and metadata to **Zova PDF**.
  - Default compiled document filename updated to `zova-pdf-document.pdf`.
  - Export archive updated to `zova-pdf-images.zip`.
  - Cache-busting version bumped to `?v=5` across all favicon and logo references for instant display.
  - Retained the complete 29-tool suite, Command Palette (`⌘K`), keyboard shortcuts cheatsheet (`?`), and 100% private client-side processing.

---

### 🌟 Release v2.3 &bull; October 26, 2026 (Hyper-Clean Command Palette &amp; Workspace Architecture)
- **✨ Raycast &amp; Linear Style Command Palette (`⌘K` / `Ctrl + K`)**:
  - Global floating command palette accessible anywhere across the workspace with `⌘K` or clicking the search badge in the navigation bar.
  - Full keyboard accessibility: Up/Down arrow navigation, `Enter` to execute tool or action, and `Esc` to dismiss.
  - Live fuzzy search indexing all 29 PDF tools, workflow presets, sample demo loaders, and documentation modals.
- **✨ Categorized Tool Filter Tabs &amp; Real-Time Search**:
  - Interactive category filter tabs on the homepage tools grid:
    - **All (29)**
    - **Layout &amp; Grids (9)**
    - **Filters &amp; Scanner (5)**
    - **Security &amp; Signing (4)**
    - **Stamps &amp; Numbers (4)**
    - **Optimization &amp; Export (7)**
  - Live instant text search input with `⌘K` hint and automatic "No matching tools found" empty state with 1-click filter reset.
- **✨ Keyboard Shortcuts Cheatsheet Modal (`?`)**:
  - Interactive hotkey cheatsheet triggered by typing `?` or clicking the footer shortcut badge.
  - Complete index of productivity hotkeys: `Ctrl+K` (Command Palette), `Ctrl+Enter` (Compile & Preview), `Ctrl+V` (Paste clipboard images), `R` (Rotate in Lightbox), `Esc` (Close modals), and PDF viewer zoom/page navigation.
- **✨ 10,000x Cool &amp; Clean Visual Architecture**:
  - Ambient radial geometric mesh background (`.bg-grid-mesh`) with subtle depth in the hero section.
  - Specular micro-highlights on cards (`inset 0 1px 0 0 rgba(255, 255, 255, 0.04)`), creating crisp physical edges.
  - Smooth 150ms hover elevations with zero layout shifts.
  - Pixel-perfect responsive footer with one-click hotkey triggers for Shortcuts and Command Palette.
- **✨ High-Fidelity Logo &amp; Favicon Master Upgrade**:
  - Multi-resolution `favicon.ico` (16 to 256px) and crisp 512x512 PNG master logos with tight bounding-box cropping and cache-busting `?v=4`.

---

### 🌟 Release v2.2 &bull; October 26, 2026 (20 New Pro Tools Expansion Suite)
- **✨ 20 New Dedicated Client-Side PDF Tools Added (29 Total Tools Suite)**:
  - **Grayscale Monochrome Engine**: 1-click conversion to clean 8-bit grayscale optimized for laser printing and ink saving.
  - **Inverted Dark Mode PDF**: Luminance inversion for comfortable night-time reading and dark architectural blueprint viewing.
  - **Faded Receipt & Contrast Booster**: Custom contrast & brightness curves recovering faint thermal register rolls and low-light photos.
  - **Sepia Vintage Archival Scan**: Warm sepia tone for historical book scans, certificates, and portfolio documentation.
  - **ID-1 / CR-80 Dual-Sided ID Layout**: Automatic 2-up alignment for driver's licenses, student badges, and passports.
  - **Margin & Bleed Studio**: Precise document margins (0mm borderless, 5mm slim, 12mm standard, 20mm binding gutter).
  - **Canvas Background Tint**: Customizable backdrop fill colors (Pure White, Dark Gray, Warm Ivory, Custom Hex) behind letterboxed images.
  - **Bates Stamping Engine**: Automated sequential legal Bates index codes (e.g. `DOC-0001`, `EXHIBIT-A-0001`) stamped on every page.
  - **Preset Legal & Office Status Stamps**: 1-click official approval marks (`APPROVED`, `DRAFT`, `URGENT`, `CONFIDENTIAL`, `COPY`, `FINAL`).
  - **Dual Header & Footer Banners**: Synchronized top document title banners and bottom pagination/timestamp stamps.
  - **Camera EXIF & GPS Sanitizer**: One-click privacy wipe stripping camera models, lens data, and GPS geotags.
  - **PDF Metadata & Dublin Core Editor**: Edit document Title, Author, Subject, and Keywords for indexing and search.
  - **Target Print DPI Resampler**: Choose between 72 DPI (email), 150 DPI (office print), and 300 DPI (archival master print).
  - **5-Stage Compression Shrinker**: Scale file sizes from Lossless (100%) down to Compact (50%) and Ultra (30%) with live size estimation.
  - **Bulk Page Rotator (90°)**: One-click simultaneous rotation across all pages in the entire document.
  - **Page Sequence Reverser**: Invert entire document sequence in 1 click (ideal for reversed scanner feeds 10 → 1).
  - **Alphabetical Auto-Sorter (A &rarr; Z)**: Sort loaded files by original name alphabetically and numerically.
  - **Page Cloner & Duplicator**: Duplicate any page in 1 click directly from its gallery card.
  - **Single Page Snapshot Extractor**: Inspect any page in full resolution and download it directly as an isolated image file.
  - **Document Workspace Reset**: Instant 1-click clean slate wipe without reloading the browser.
- **✨ Enhanced Mega-Menu Navigation**:
  - Re-architected Tools dropdown into a multi-column command menu categorized by Layout, Filters, Security, Stamps, and Page Actions.

---

### 🌟 Release v2.1 &bull; October 26, 2026 (Premium Black UI Redesign)
- **✨ Official Rebranding Restored to ZenvixaPDF**:
  - Restored original blue ribbon emblem logo, metadata, and official **ZenvixaPDF Workspace** name.
- **✨ Premium Minimal Black Aesthetic**:
  - Engineered a sleek dark interface inspired by modern SaaS products (Linear, Vercel, Raycast).
  - Exact palette implementation:
    - Main background: `#080808`
    - Secondary surfaces: `#0D0D0D`
    - Cards & components: `#111111`
    - Micro-borders: `#242424` (hover: `#383838`)
    - Primary text: `#F5F5F5`
    - Secondary text: `#929292`
    - Subtle white & gray accents with accessible muted status states.
  - Genuinely dark workspace across all views—no light theme fallback or bright navbar.
- **✨ Streamlined Navigation System**:
  - Compact sticky navbar with ZenvixaPDF logo, Tools dropdown linking directly to active tools, Features anchor, All 100+ Tools modal trigger, and Changelog.
  - Minimal mobile navigation drawer with touch-friendly navigation links and quick access buttons.
- **✨ Redesigned SaaS Landing Page**:
  - **Hero Section**: Eyebrow badge `"YOUR PDF WORKSPACE"`, prominent headline `"Everything you need. One PDF workspace."`, supporting copy, primary CTA `"Explore PDF Tools"`, secondary `"Learn More"`, and dark visual element.
  - **Tools Grid Section (`#tools`)**: Responsive grid displaying all existing PDF tools with monochrome icons, clear titles, concise descriptions, and active click handlers that navigate directly to their corresponding workspace tool and presets.
  - **Trust & Features Section (`#features`)**: Concise client-side privacy guarantees (100% in-browser processing, zero server uploads, zero tracking) without fake statistics or claims.
- **✨ Preserved 100% Functionality**:
  - All 100+ PDF tools, logic, cropper modal, drawn signature pad, multi-up layout grids, document scanner shadow removal filter, AES encryption, batch ZIP export, and in-app PDF.js preview remain 100% operational.

---

### 🌟 Release v2.0 &bull; October 5, 2026 (Major Overhaul &bull; 100+ Features Suite)
- **✨ Built-In Visual Cropper Studio**:
  - Interactive crop tool modal with Freeform, 1:1 Square, 4:3 Photo, 16:9 Widescreen, and A4 Document aspect ratio presets.
- **✨ Multi-Up Grid Engine (1-Up, 2-Up, 4-Up)**:
  - Place 1, 2 (side-by-side), or 4 images (2x2 grid) per document page, ideal for receipts, homework, and photo contact sheets.
- **✨ PDF Security & Password Encryption**:
  - Added client-side AES user password protection to secure sensitive PDFs before downloading.
- **✨ Digital Drawn Signature Pad**:
  - Draw your signature directly with a mouse or touchscreen to stamp official documents.
- **✨ 1-Click Workflow Presets**:
  - Instant one-click configurations for *Photo Album*, *Document Scanner*, *Receipts 2-Up*, *Confidential Watermark*, and *ID Cards*.
- **✨ Batch Export to ZIP Archive**:
  - One-click export of all processed, cropped, and rotated images packaged into a `.zip` archive via `JSZip`.
- **✨ 100+ Features Directory Hub Modal**:
  - Searchable in-app catalog detailing 130+ features with category filters and real-time query matching.
- **✨ Pre-Loaded Sample Images Demo**:
  - 1-click test button to generate realistic test documents and receipts instantly.
- **✨ Compression & DPI Target Engine**:
  - Choose between Lossless (100%), High (90%), Balanced (75%), Compact (50%), and Ultra (30%) with target DPI options (72, 150, 300 DPI) and real-time PDF size estimation.
- **✨ Repeating Tile & Diagonal Watermarks**:
  - Customizable opacity, text, and repeating tile pattern mode.
- **✨ PDF Metadata & Camera EXIF Sanitizer**:
  - Set custom title, author, and subject, and automatically strip sensitive camera GPS metadata.

---

### 🌟 Release v1.2 &bull; September 20, 2026
- **✨ Dual Live Previews Everywhere**:
  - Added dedicated **"Preview PDF"** button inside gallery toolbar and instant high-res lightbox modal.
- **✨ Document Scanner Filter (High-Contrast B&W)**:
  - Added shadow removal thresholding filter for camera photos of paperwork and receipts.
- **✨ Grayscale & Vibrant Contrast Filters**:
  - Monochrome grayscale and punchy contrast adjustments.
- **✨ Semi-Transparent Diagonal Watermarking**:
  - Customizable text watermarking with adjustable opacity.
- **✨ One-Click Smart Gallery Sorting**:
  - Added `Sort A-Z` and `Reverse Order` buttons in the toolbar.

---

### 🌟 Release v1.1 &bull; September 13, 2026
- **✨ Pure 1:1 Image Conversion (Zero Borders)**:
  - Eliminated unwanted white margins and letterboxing.
- **✨ Custom Themed PDF.js In-App Viewer**:
  - Built-in pan, zoom, fit-to-width, and multi-page navigation.
- **✨ Drag-and-Drop Page Reordering**:
  - SortableJS integration for intuitive thumbnail ordering.

---

### 🌟 Release v1.0 &bull; September 6, 2026
- **✨ Initial Launch**:
  - Instant client-side Image to PDF conversion.
  - Multi-image batch support (JPG, PNG, WebP, SVG, GIF, BMP).
  - Page orientation controls (Portrait, Landscape, Auto-detect).
  - Standard paper formats (A4, US Letter, Legal, Tabloid).
