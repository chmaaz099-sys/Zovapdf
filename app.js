/**
 * Zova PDF Workspace - 100+ Pro Features Client-Side Engine
 */

// Application State
const state = {
  images: [], // Array of { id, file, name, size, type, dataUrl, originalDataUrl, width, height, rotation, flipH, flipV }
  settings: {
    pageSize: 'fit', // 'fit' | 'a4' | 'letter' | 'a3' | 'legal' | 'tabloid' | 'idcard'
    gridLayout: 1, // 1 | 2 | 4
    orientation: 'auto', // 'auto' | 'portrait' | 'landscape'
    margin: 0, // 0 | 5 | 12 | 20 mm
    imageFit: 'contain', // 'contain' | 'cover' | 'stretch'
    pageBgColor: '#ffffff',
    filter: 'none', // 'none' | 'bw-doc' | 'grayscale' | 'boost' | 'sepia' | 'invert'
    scannerThreshold: 138,
    brightness: 100,
    contrast: 100,
    addWatermark: false,
    watermarkText: 'CONFIDENTIAL',
    watermarkOpacity: 0.20,
    watermarkPattern: 'diagonal', // 'diagonal' | 'tile'
    addPageNumbers: false,
    batesPrefix: '',
    addDateStamp: false,
    customHeaderText: '',
    pdfPassword: '',
    signatureDataUrl: null,
    quality: 0.9,
    targetDpi: 'original',
    fileName: 'zova-pdf-document',
    metaTitle: '',
    metaAuthor: '',
    metaSubject: '',
    stripExif: true
  },
  currentBlobUrl: null,
  sortableInstance: null,
  cropper: {
    activeImg: null,
    aspect: 'free',
    box: { x: 10, y: 10, w: 80, h: 80 } // percentages
  }
};

// Custom Themed PDF Viewer State
const viewer = {
  pdfDoc: null,
  pageNum: 1,
  totalPages: 1,
  scale: 1.0,
  isRendering: false,
  pendingPageNum: null
};

// Standard Paper Sizes in Millimeters (Width x Height in Portrait)
const PAGE_SIZES = {
  a4: { width: 210, height: 297 },
  letter: { width: 215.9, height: 279.4 },
  a3: { width: 297, height: 420 },
  legal: { width: 215.9, height: 355.6 },
  tabloid: { width: 279.4, height: 431.8 },
  idcard: { width: 85.6, height: 53.98 } // CR80 standard
};

// 100+ Features Directory Catalog
const FEATURES_CATALOG = [
  // Ingestion & Formats (10)
  { cat: 'ingestion', name: 'Drag & Drop Batch Upload', desc: 'Add dozens of images simultaneously with visual drop feedback.' },
  { cat: 'ingestion', name: 'Clipboard Paste (Ctrl + V)', desc: 'Paste screenshots directly from system clipboard without saving files.' },
  { cat: 'ingestion', name: 'Multi-Select File Dialog', desc: 'Browse and append multiple files from any folder.' },
  { cat: 'ingestion', name: 'JPG / JPEG Full Ingestion', desc: 'Direct decoding with native canvas hardware acceleration.' },
  { cat: 'ingestion', name: 'PNG Alpha Flattening', desc: 'Automatic background handling to eliminate black transparency blocks.' },
  { cat: 'ingestion', name: 'WebP Modern Image Support', desc: 'Lossless & lossy Google WebP container conversion.' },
  { cat: 'ingestion', name: 'SVG Vector Rasterization', desc: 'High-DPI vector rendering onto raster canvas before PDF compile.' },
  { cat: 'ingestion', name: 'BMP & GIF Frame Extraction', desc: 'Automatic decoding of classic bitmap and static GIF files.' },
  { cat: 'ingestion', name: 'Sample Demo 1-Click Loader', desc: 'Instantly generate test receipts and documents to preview all features.' },
  { cat: 'ingestion', name: 'Zero Upload Limits', desc: 'Unlimited conversions with zero file size restrictions.' },

  // Cropping & Visual Editing (15)
  { cat: 'crop', name: 'Built-in Visual Cropper Studio', desc: 'Interactive visual bounding box to crop any image card.' },
  { cat: 'crop', name: 'Freeform Crop Mode', desc: 'Unconstrained aspect ratio cropping.' },
  { cat: 'crop', name: '1:1 Square Crop Preset', desc: 'Profile and square avatar framing.' },
  { cat: 'crop', name: '4:3 Standard Photo Preset', desc: 'Standard digital camera photo framing.' },
  { cat: 'crop', name: '16:9 Widescreen Preset', desc: 'Landscape and presentation slide framing.' },
  { cat: 'crop', name: 'A4 Document Ratio Preset', desc: 'Match exact European/ISO document proportion.' },
  { cat: 'crop', name: '90° Clockwise Rotation', desc: 'Rotate individual cards or bulk rotate all.' },
  { cat: 'crop', name: '90° Counter-Clockwise Rotation', desc: 'Instant orientation correction.' },
  { cat: 'crop', name: '180° Inversion Rotation', desc: 'Quick flip for upside down scanned paperwork.' },
  { cat: 'crop', name: 'Horizontal Flip (Mirror)', desc: 'Mirror selfies and mirrored camera scans.' },
  { cat: 'crop', name: 'Vertical Flip', desc: 'Vertical axis flip.' },
  { cat: 'crop', name: 'Live Brightness Slider', desc: 'Fine-tune image brightness from 50% to 150%.' },
  { cat: 'crop', name: 'Live Contrast Slider', desc: 'Enhance faded ink and pencil text readability.' },
  { cat: 'crop', name: 'Reset Edits Per Card', desc: 'Revert any cropped image back to its original raw file.' },
  { cat: 'crop', name: 'High-Res Uncompressed Crop Export', desc: 'Retains full pixel density inside crop bounds.' },

  // Document Scanner & Filters (12)
  { cat: 'scanner', name: 'High-Contrast B&W Document Scanner', desc: 'Intelligent thresholding that removes shadows from phone camera photos.' },
  { cat: 'scanner', name: 'Scanner Sensitivity Slider', desc: 'Adjust threshold from 60 to 210 to preserve light pencil or dark ink.' },
  { cat: 'scanner', name: 'Grayscale Monochrome', desc: 'Classic black & white document photo conversion.' },
  { cat: 'scanner', name: 'Vibrant Contrast Boost', desc: 'Enhance saturation and punchiness for photo portfolios.' },
  { cat: 'scanner', name: 'Sepia Retro Filter', desc: 'Warm vintage tone for aged paper documents and archives.' },
  { cat: 'scanner', name: 'Invert Colors (Dark Mode PDF)', desc: 'Invert black text on white to white on black.' },
  { cat: 'scanner', name: 'Background Shadow Elimination', desc: 'Cleans up desk and table shadows behind documents.' },
  { cat: 'scanner', name: 'Pixel Threshold Binarization', desc: 'Converts gray paper textures into pure laser-printer white.' },
  { cat: 'scanner', name: 'Faded Text Recovery', desc: 'Recovers faint ballpoint pen notes with contrast curves.' },
  { cat: 'scanner', name: 'Fast Canvas Shader Pipeline', desc: 'Runs in under 15ms per image using typed Uint8ClampedArrays.' },
  { cat: 'scanner', name: 'Filter Preview Comparison', desc: 'Preview results live in interactive viewer.' },
  { cat: 'scanner', name: 'Zero Cloud Filter Processing', desc: 'All image filters processed 100% on your local CPU/GPU.' },

  // Layouts & Grids (16)
  { cat: 'grid', name: 'Fit to Image (1:1 Zero Borders)', desc: 'PDF page matches exact image pixel dimensions with zero letterboxing.' },
  { cat: 'grid', name: '1-Up Layout (Single)', desc: 'One image per PDF page.' },
  { cat: 'grid', name: '2-Up Grid (Dual Images)', desc: 'Two images per page (side-by-side) ideal for receipts and comparisons.' },
  { cat: 'grid', name: '4-Up Grid (2×2 Contact Sheet)', desc: 'Four images per page in a neat 2x2 grid for photo albums.' },
  { cat: 'grid', name: 'ISO A4 Document Size', desc: 'Standard 210 x 297 mm global office format.' },
  { cat: 'grid', name: 'US Letter Document Size', desc: 'Standard 8.5 x 11 in North American format.' },
  { cat: 'grid', name: 'ISO A3 Poster Size', desc: 'Large 297 x 420 mm presentation layout.' },
  { cat: 'grid', name: 'US Legal Size', desc: '8.5 x 14 in legal contracts format.' },
  { cat: 'grid', name: 'Tabloid / Ledger Size', desc: '11 x 17 in architectural and publication format.' },
  { cat: 'grid', name: 'ID Card / Badge (CR80)', desc: '85.6 x 54 mm standard credit card and driver license size.' },
  { cat: 'grid', name: 'Auto Orientation Detection', desc: 'Detects portrait vs landscape per image automatically.' },
  { cat: 'grid', name: 'Forced Portrait Orientation', desc: 'Forces all pages into vertical orientation.' },
  { cat: 'grid', name: 'Forced Landscape Orientation', desc: 'Forces all pages into horizontal orientation.' },
  { cat: 'grid', name: 'Zero Margins (0mm)', desc: 'Full bleed edge-to-edge layout.' },
  { cat: 'grid', name: 'Compact Margins (5mm)', desc: 'Minimal safety margin.' },
  { cat: 'grid', name: 'Standard Document Margins (12mm)', desc: 'Balanced office document margins.' },

  // Security & Signature (10)
  { cat: 'security', name: 'PDF User Password Encryption', desc: 'Encrypt your PDF with a password required to open it.' },
  { cat: 'security', name: 'Show/Hide Password Toggle', desc: 'Verify your entered password before compilation.' },
  { cat: 'security', name: 'Digital Drawn Signature Pad', desc: 'Draw your signature directly with mouse or touchscreen.' },
  { cat: 'security', name: 'Signature Stamp Overlay', desc: 'Stamps your signature onto the bottom right of document pages.' },
  { cat: 'security', name: '100% Offline Security', desc: 'Your private files and passwords never touch the internet.' },
  { cat: 'security', name: 'In-Memory Garbage Collection', desc: 'Immediate memory deallocation when pages or sessions close.' },
  { cat: 'security', name: 'Sanitize Camera EXIF Metadata', desc: 'Strips GPS coordinates, device models, and timestamps from images.' },
  { cat: 'security', name: 'No Tracking or Analytics', desc: 'Zero cookies, zero analytics, zero external logging.' },
  { cat: 'security', name: 'Client-Side Cryptography', desc: 'AES compliant container encoding.' },
  { cat: 'security', name: 'Local Blob Security Revocation', desc: 'Revokes object URLs to prevent browser memory leaks.' },

  // Watermarks & Stamps (12)
  { cat: 'watermark', name: 'Custom Text Watermark', desc: 'Stamp CONFIDENTIAL, DRAFT, COPY, or custom text.' },
  { cat: 'watermark', name: 'Watermark Opacity Slider', desc: 'Adjust opacity from 10% (subtle) to 55% (bold).' },
  { cat: 'watermark', name: 'Single Diagonal Stamp', desc: 'Large diagonal watermark centered on every page.' },
  { cat: 'watermark', name: 'Repeating Tile Pattern', desc: 'Grid pattern repeating across the entire page for anti-theft.' },
  { cat: 'watermark', name: 'Dynamic Page Numbers', desc: 'Adds "Page X of Y" centered on the bottom of every page.' },
  { cat: 'watermark', name: 'Adaptive Text Contrast', desc: 'Page numbers automatically detect dark vs light backgrounds.' },
  { cat: 'watermark', name: 'Automated Date & Timestamp', desc: 'Stamp the exact generation date and time.' },
  { cat: 'watermark', name: 'Custom Header Text', desc: 'Add official organizational headers to top of pages.' },
  { cat: 'watermark', name: 'Font Scaling with Page Size', desc: 'Watermark font size automatically scales to match canvas dimensions.' },
  { cat: 'watermark', name: 'Non-Destructive Watermarking', desc: 'Original images in memory remain untouched.' },
  { cat: 'watermark', name: 'Alpha Blending GState', desc: 'Uses native PDF graphics state for transparent vector text.' },
  { cat: 'watermark', name: 'Multi-Page Propagation', desc: 'Watermarks automatically applied across all pages seamlessly.' },

  // Compression & DPI (8)
  { cat: 'compression', name: 'Lossless Original Quality (100%)', desc: 'Zero compression artifacts for archival.' },
  { cat: 'compression', name: 'High Quality (90% JPEG)', desc: 'Recommended balance of crispness and small file size.' },
  { cat: 'compression', name: 'Balanced Web (75%)', desc: 'Fast loading for web and email attachments.' },
  { cat: 'compression', name: 'Compact (50%)', desc: 'Shrinks large multi-megabyte photos for email size limits.' },
  { cat: 'compression', name: 'Ultra Compressed (30%)', desc: 'Maximum size reduction for strict upload portals.' },
  { cat: 'compression', name: 'Target 300 DPI (Print Quality)', desc: 'Calculates high density output for physical printing.' },
  { cat: 'compression', name: 'Target 150 DPI (Office Quality)', desc: 'Standard office document resolution.' },
  { cat: 'compression', name: 'Live Estimated PDF Size Badge', desc: 'Real-time badge showing estimated PDF file size before building.' },

  // Preview & Export (20+)
  { cat: 'export', name: 'Interactive PDF.js Canvas Viewer', desc: 'Custom themed in-app viewer matching website theme.' },
  { cat: 'export', name: 'Page Navigation (Previous / Next)', desc: 'Flip between pages with buttons or arrow keys.' },
  { cat: 'export', name: 'Dynamic Zoom In / Zoom Out', desc: 'Zoom from 40% to 250%.' },
  { cat: 'export', name: 'Fit to Window Zoom', desc: 'One-click zoom to fit full modal width.' },
  { cat: 'export', name: 'High-Res Single Card Lightbox', desc: 'Click any thumbnail to inspect high-resolution details.' },
  { cat: 'export', name: 'Instant One-Click Download', desc: 'Bypass preview and download immediately.' },
  { cat: 'export', name: 'Preview PDF Toolbar Button', desc: 'Launch full document preview directly from gallery.' },
  { cat: 'export', name: 'Batch Export as ZIP Archive', desc: 'Download all processed/cropped images in a single ZIP.' },
  { cat: 'export', name: 'Custom Output Filename', desc: 'Name your PDF file before saving.' },
  { cat: 'export', name: 'Keyboard Shortcuts Navigation', desc: 'Arrow keys, R to rotate, + / - to zoom, Esc to close.' },
  { cat: 'export', name: 'Drag & Drop Page Reordering', desc: 'Visual reordering powered by SortableJS.' },
  { cat: 'export', name: 'Sort Alphabetically (A to Z)', desc: 'Sort pages by filename ascending.' },
  { cat: 'export', name: 'Sort Reverse Alphabetically (Z to A)', desc: 'Sort pages by filename descending.' },
  { cat: 'export', name: 'Reverse Page Order', desc: 'Invert sequence of all uploaded pages.' },
  { cat: 'export', name: 'Random Shuffle Order', desc: 'Shuffle order of cards randomly.' },
  { cat: 'export', name: 'Duplicate Page Action', desc: 'Duplicate any page in the sequence.' },
  { cat: 'export', name: 'Delete Individual Page', desc: 'Remove specific page with single click.' },
  { cat: 'export', name: 'Clear All with Confirmation', desc: 'Reset workspace cleanly.' },
  { cat: 'export', name: '1-Click Presets Manager', desc: 'Instant configurations for Photo Album, Doc Scanner, Receipts, etc.' },
  { cat: 'export', name: 'Toast Notification System', desc: 'Non-intrusive animated status alerts.' }
];

// DOM References
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const workspaceSection = document.getElementById('workspaceSection');
const imagesGrid = document.getElementById('imagesGrid');
const fileCountBadge = document.getElementById('fileCountBadge');
const totalSizeBadge = document.getElementById('totalSizeBadge');
const estPdfSizeBadge = document.getElementById('estPdfSizeBadge');

// Toolbar Buttons
const addMoreBtn = document.getElementById('addMoreBtn');
const toolbarPreviewBtn = document.getElementById('toolbarPreviewBtn');
const exportZipBtn = document.getElementById('exportZipBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const sortAzBtn = document.getElementById('sortAzBtn');
const sortZaBtn = document.getElementById('sortZaBtn');
const reverseBtn = document.getElementById('reverseBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const rotateAllBtn = document.getElementById('rotateAllBtn');

// Sidebar Studio Controls
const pageSizeSelect = document.getElementById('pageSizeSelect');
const fitExplanation = document.getElementById('fitExplanation');
const orientationContainer = document.getElementById('orientationContainer');
const marginContainer = document.getElementById('marginContainer');
const imageFitContainer = document.getElementById('imageFitContainer');
const imageFitSelect = document.getElementById('imageFitSelect');
const pageBgContainer = document.getElementById('pageBgContainer');
const customBgColorPicker = document.getElementById('customBgColorPicker');

const filterSelect = document.getElementById('filterSelect');
const thresholdSliderContainer = document.getElementById('thresholdSliderContainer');
const scannerThreshold = document.getElementById('scannerThreshold');
const thresholdVal = document.getElementById('thresholdVal');
const brightnessSlider = document.getElementById('brightnessSlider');
const brightnessVal = document.getElementById('brightnessVal');
const contrastSlider = document.getElementById('contrastSlider');
const contrastVal = document.getElementById('contrastVal');

const addWatermark = document.getElementById('addWatermark');
const watermarkControls = document.getElementById('watermarkControls');
const watermarkText = document.getElementById('watermarkText');
const watermarkOpacity = document.getElementById('watermarkOpacity');
const watermarkPattern = document.getElementById('watermarkPattern');
const addPageNumbers = document.getElementById('addPageNumbers');
const addDateStamp = document.getElementById('addDateStamp');
const customHeaderText = document.getElementById('customHeaderText');

const pdfPasswordInput = document.getElementById('pdfPasswordInput');
const togglePasswordVisBtn = document.getElementById('togglePasswordVisBtn');
const openSignatureModalBtn = document.getElementById('openSignatureModalBtn');
const signaturePreviewBox = document.getElementById('signaturePreviewBox');
const signatureThumbnail = document.getElementById('signatureThumbnail');
const removeSignatureBtn = document.getElementById('removeSignatureBtn');

const qualitySelect = document.getElementById('qualitySelect');
const qualityLabel = document.getElementById('qualityLabel');
const dpiSelect = document.getElementById('dpiSelect');

const metaTitle = document.getElementById('metaTitle');
const metaAuthor = document.getElementById('metaAuthor');
const metaSubject = document.getElementById('metaSubject');
const stripExifCheck = document.getElementById('stripExifCheck');

const pdfFileName = document.getElementById('pdfFileName');
const generatePdfBtn = document.getElementById('generatePdfBtn');
const generateBtnText = document.getElementById('generateBtnText');
const directDownloadBtn = document.getElementById('directDownloadBtn');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const progressPercent = document.getElementById('progressPercent');
const progressStatus = document.getElementById('progressStatus');

// Header Utilities
const featuresHubBtn = document.getElementById('featuresHubBtn');
const loadSampleImagesBtn = document.getElementById('loadSampleImagesBtn');
const changelogBtn = document.getElementById('changelogBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');

// Modals
const previewModal = document.getElementById('previewModal');
const previewModalSubtext = document.getElementById('previewModalSubtext');
const modalDownloadBtn = document.getElementById('modalDownloadBtn');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const pageNavIndicator = document.getElementById('pageNavIndicator');
const zoomOutBtn = document.getElementById('zoomOutBtn');
const zoomInBtn = document.getElementById('zoomInBtn');
const zoomIndicator = document.getElementById('zoomIndicator');
const fitWidthBtn = document.getElementById('fitWidthBtn');
const pdfViewerContainer = document.getElementById('pdfViewerContainer');
const canvasWrapper = document.getElementById('canvasWrapper');
const pdfCanvas = document.getElementById('pdfCanvas');
const viewerLoadingSpinner = document.getElementById('viewerLoadingSpinner');

const changelogModal = document.getElementById('changelogModal');
const closeChangelogBtn = document.getElementById('closeChangelogBtn');
const dismissChangelogBtn = document.getElementById('dismissChangelogBtn');

const featuresHubModal = document.getElementById('featuresHubModal');
const closeFeaturesHubBtn = document.getElementById('closeFeaturesHubBtn');
const featureSearchInput = document.getElementById('featureSearchInput');
const featuresListContainer = document.getElementById('featuresListContainer');

const imageLightboxModal = document.getElementById('imageLightboxModal');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxMeta = document.getElementById('lightboxMeta');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxDownloadBtn = document.getElementById('lightboxDownloadBtn');
const lightboxCropBtn = document.getElementById('lightboxCropBtn');
const lightboxRotateBtn = document.getElementById('lightboxRotateBtn');
const closeLightboxBtn = document.getElementById('closeLightboxBtn');
const batesPrefixInput = document.getElementById('batesPrefixInput');
let activeLightboxImg = null;

// Cropper Modal Elements
const cropperModal = document.getElementById('cropperModal');
const cropperSubtext = document.getElementById('cropperSubtext');
const cropperImg = document.getElementById('cropperImg');
const cropBox = document.getElementById('cropBox');
const cancelCropBtn = document.getElementById('cancelCropBtn');
const applyCropBtn = document.getElementById('applyCropBtn');
const cropResetBtn = document.getElementById('cropResetBtn');

// Signature Modal Elements
const signatureModal = document.getElementById('signatureModal');
const signatureCanvas = document.getElementById('signatureCanvas');
const clearSignatureBtn = document.getElementById('clearSignatureBtn');
const saveSignatureBtn = document.getElementById('saveSignatureBtn');
const closeSignatureModalBtn = document.getElementById('closeSignatureModalBtn');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSortable();
  initAccordions();
  initEventListeners();
  renderFeaturesHub('all');
  lucide.createIcons();
});

// Setup Theme (Minimalist Pure Black UI)
function initTheme() {
  document.documentElement.classList.add('dark');
  localStorage.setItem('zova_theme', 'dark');
}

function toggleTheme() {
  document.documentElement.classList.add('dark');
  localStorage.setItem('zova_theme', 'dark');
}

// Setup Accordion items
function initAccordions() {
  const items = document.querySelectorAll('.accordion-item');
  items.forEach((item, index) => {
    // Keep first 2 open by default, collapse others for cleanliness
    if (index >= 2) {
      item.classList.add('collapsed');
    }
    const header = item.querySelector('.accordion-header');
    if (header) {
      header.addEventListener('click', () => {
        item.classList.toggle('collapsed');
      });
    }
  });
}

// Setup SortableJS for Drag-and-Drop Reordering
function initSortable() {
  state.sortableInstance = new Sortable(imagesGrid, {
    animation: 180,
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    onEnd: () => {
      const newImages = [];
      const cards = imagesGrid.querySelectorAll('.image-card');
      cards.forEach(card => {
        const id = card.dataset.id;
        const imgObj = state.images.find(img => img.id === id);
        if (imgObj) newImages.push(imgObj);
      });
      state.images = newImages;
      updatePageBadges();
      updateEstimatedPdfSize();
    }
  });
}

// Event Listeners
function initEventListeners() {
  // Dropzone click & drag
  dropzone.addEventListener('click', () => fileInput.click());
  addMoreBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
      fileInput.value = '';
    }
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('border-brand-500', 'bg-brand-500/5');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('border-brand-500', 'bg-brand-500/5');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    if (dt && dt.files && dt.files.length > 0) {
      handleFiles(Array.from(dt.files));
    }
  });

  // Global Clipboard Paste Support (Ctrl + V)
  window.addEventListener('paste', (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    const pastedFiles = [];
    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        const blob = item.getAsFile();
        if (blob) pastedFiles.push(blob);
      }
    }
    if (pastedFiles.length > 0) {
      handleFiles(pastedFiles);
      showToast(`Pasted ${pastedFiles.length} image(s) from clipboard`, 'success');
    }
  });

  // Sample Demo Loader
  if (loadSampleImagesBtn) {
    loadSampleImagesBtn.addEventListener('click', loadSampleDemoImages);
  }

  // 1-Click Workflow Presets Bar
  document.querySelectorAll('.preset-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      applyPreset(btn.dataset.preset);
    });
  });

  // Toolbar Actions
  clearAllBtn.addEventListener('click', () => {
    if (state.images.length === 0) return;
    if (confirm('Are you sure you want to remove all images?')) {
      state.images = [];
      renderImages();
      showToast('All images cleared', 'info');
    }
  });

  rotateAllBtn.addEventListener('click', () => {
    state.images.forEach(img => {
      img.rotation = (img.rotation + 90) % 360;
    });
    renderImages();
    showToast('Rotated all images 90°', 'info');
  });

  sortAzBtn.addEventListener('click', () => {
    state.images.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    renderImages();
    showToast('Sorted A to Z', 'info');
  });

  sortZaBtn.addEventListener('click', () => {
    state.images.sort((a, b) => b.name.localeCompare(a.name, undefined, { numeric: true }));
    renderImages();
    showToast('Sorted Z to A', 'info');
  });

  reverseBtn.addEventListener('click', () => {
    state.images.reverse();
    renderImages();
    showToast('Reversed page order', 'info');
  });

  shuffleBtn.addEventListener('click', () => {
    for (let i = state.images.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [state.images[i], state.images[j]] = [state.images[j], state.images[i]];
    }
    renderImages();
    showToast('Shuffled pages randomly', 'info');
  });

  exportZipBtn.addEventListener('click', exportBatchZip);

  // Page Size Selector
  pageSizeSelect.addEventListener('change', (e) => {
    state.settings.pageSize = e.target.value;
    const isFit = state.settings.pageSize === 'fit';
    
    if (fitExplanation) fitExplanation.classList.toggle('hidden', !isFit);
    if (orientationContainer) orientationContainer.classList.toggle('hidden', isFit);
    if (marginContainer) marginContainer.classList.toggle('hidden', isFit);
    if (imageFitContainer) imageFitContainer.classList.toggle('hidden', isFit);
    if (pageBgContainer) pageBgContainer.classList.toggle('hidden', isFit);
    
    updateEstimatedPdfSize();
  });

  // Grid Layout Buttons (1-Up, 2-Up, 4-Up)
  document.querySelectorAll('.grid-layout-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.grid-layout-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.settings.gridLayout = parseInt(btn.dataset.grid);
      showToast(`Grid layout: ${state.settings.gridLayout}-Up per page`, 'info');
      updateEstimatedPdfSize();
    });
  });

  // Orientation Buttons
  document.querySelectorAll('.orientation-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.orientation-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.settings.orientation = btn.dataset.orientation;
    });
  });

  // Margin Buttons
  document.querySelectorAll('.margin-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.margin-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.settings.margin = parseInt(btn.dataset.margin);
    });
  });

  // Image Fit Select
  if (imageFitSelect) {
    imageFitSelect.addEventListener('change', (e) => {
      state.settings.imageFit = e.target.value;
    });
  }

  // Background Color Buttons
  document.querySelectorAll('.bg-color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.bg-color-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.settings.pageBgColor = btn.dataset.bg;
      if (customBgColorPicker) customBgColorPicker.value = state.settings.pageBgColor;
    });
  });

  if (customBgColorPicker) {
    customBgColorPicker.addEventListener('input', (e) => {
      document.querySelectorAll('.bg-color-btn').forEach(b => b.classList.remove('active'));
      state.settings.pageBgColor = e.target.value;
    });
  }

  // Filter Selector
  if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
      state.settings.filter = e.target.value;
      if (thresholdSliderContainer) {
        thresholdSliderContainer.classList.toggle('hidden', state.settings.filter !== 'bw-doc');
      }
      showToast(`Filter: ${filterSelect.options[filterSelect.selectedIndex].text}`, 'info');
    });
  }

  if (scannerThreshold) {
    scannerThreshold.addEventListener('input', (e) => {
      state.settings.scannerThreshold = parseInt(e.target.value);
      if (thresholdVal) thresholdVal.textContent = state.settings.scannerThreshold;
    });
  }

  if (brightnessSlider) {
    brightnessSlider.addEventListener('input', (e) => {
      state.settings.brightness = parseInt(e.target.value);
      if (brightnessVal) brightnessVal.textContent = state.settings.brightness + '%';
    });
  }

  if (contrastSlider) {
    contrastSlider.addEventListener('input', (e) => {
      state.settings.contrast = parseInt(e.target.value);
      if (contrastVal) contrastVal.textContent = state.settings.contrast + '%';
    });
  }

  // Watermark Options
  if (addWatermark) {
    addWatermark.addEventListener('change', (e) => {
      state.settings.addWatermark = e.target.checked;
      if (watermarkControls) {
        watermarkControls.classList.toggle('hidden', !state.settings.addWatermark);
      }
    });
  }

  if (watermarkText) {
    watermarkText.addEventListener('input', (e) => {
      state.settings.watermarkText = e.target.value;
    });
  }

  // Quick Legal / Office Stamp Preset Pills
  document.querySelectorAll('.stamp-preset-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const stamp = btn.dataset.stamp;
      if (watermarkText) watermarkText.value = stamp;
      state.settings.watermarkText = stamp;
      if (addWatermark) addWatermark.checked = true;
      state.settings.addWatermark = true;
      if (watermarkControls) watermarkControls.classList.remove('hidden');
      showToast(`Applied stamp preset: "${stamp}"`, 'success');
    });
  });

  // Bates Stamping Prefix
  if (batesPrefixInput) {
    batesPrefixInput.addEventListener('input', (e) => {
      state.settings.batesPrefix = e.target.value.trim();
    });
  }

  if (watermarkOpacity) {
    watermarkOpacity.addEventListener('change', (e) => {
      state.settings.watermarkOpacity = parseFloat(e.target.value);
    });
  }

  if (watermarkPattern) {
    watermarkPattern.addEventListener('change', (e) => {
      state.settings.watermarkPattern = e.target.value;
    });
  }

  if (addPageNumbers) {
    addPageNumbers.addEventListener('change', (e) => {
      state.settings.addPageNumbers = e.target.checked;
    });
  }

  if (addDateStamp) {
    addDateStamp.addEventListener('change', (e) => {
      state.settings.addDateStamp = e.target.checked;
    });
  }

  if (customHeaderText) {
    customHeaderText.addEventListener('input', (e) => {
      state.settings.customHeaderText = e.target.value;
    });
  }

  // Security / Password Protection
  if (pdfPasswordInput) {
    pdfPasswordInput.addEventListener('input', (e) => {
      state.settings.pdfPassword = e.target.value;
    });
  }

  if (togglePasswordVisBtn) {
    togglePasswordVisBtn.addEventListener('click', () => {
      const isPass = pdfPasswordInput.type === 'password';
      pdfPasswordInput.type = isPass ? 'text' : 'password';
    });
  }

  // Signature Pad Modal
  if (openSignatureModalBtn) {
    openSignatureModalBtn.addEventListener('click', openSignatureModal);
  }
  if (closeSignatureModalBtn) {
    closeSignatureModalBtn.addEventListener('click', closeSignatureModal);
  }
  if (clearSignatureBtn) {
    clearSignatureBtn.addEventListener('click', clearSignature);
  }
  if (saveSignatureBtn) {
    saveSignatureBtn.addEventListener('click', saveSignature);
  }
  if (removeSignatureBtn) {
    removeSignatureBtn.addEventListener('click', removeSignature);
  }

  // Compression Quality & DPI
  if (qualitySelect) {
    qualitySelect.addEventListener('change', (e) => {
      state.settings.quality = parseFloat(e.target.value);
      const selectedOption = e.target.options[e.target.selectedIndex].text;
      qualityLabel.textContent = selectedOption.split('(')[1] ? selectedOption.split('(')[1].replace(')', '') : selectedOption;
      updateEstimatedPdfSize();
    });
  }

  if (dpiSelect) {
    dpiSelect.addEventListener('change', (e) => {
      state.settings.targetDpi = e.target.value;
      updateEstimatedPdfSize();
    });
  }

  // Metadata Inputs
  if (metaTitle) metaTitle.addEventListener('input', (e) => state.settings.metaTitle = e.target.value);
  if (metaAuthor) metaAuthor.addEventListener('input', (e) => state.settings.metaAuthor = e.target.value);
  if (metaSubject) metaSubject.addEventListener('input', (e) => state.settings.metaSubject = e.target.value);
  if (stripExifCheck) stripExifCheck.addEventListener('change', (e) => state.settings.stripExif = e.target.checked);

  // Filename Input
  if (pdfFileName) {
    pdfFileName.addEventListener('input', (e) => {
      state.settings.fileName = e.target.value.trim() || 'zova-pdf-document';
    });
  }

  // Generate & Preview Actions
  generatePdfBtn.addEventListener('click', () => generatePdf(false));
  if (toolbarPreviewBtn) {
    toolbarPreviewBtn.addEventListener('click', () => generatePdf(false));
  }
  if (directDownloadBtn) {
    directDownloadBtn.addEventListener('click', () => generatePdf(true));
  }

  // Themed PDF Viewer Modal Actions
  modalCloseBtn.addEventListener('click', closePdfModal);
  previewModal.addEventListener('click', (e) => {
    if (e.target === previewModal) closePdfModal();
  });
  modalDownloadBtn.addEventListener('click', downloadCurrentPdf);

  prevPageBtn.addEventListener('click', () => changeViewerPage(-1));
  nextPageBtn.addEventListener('click', () => changeViewerPage(1));
  zoomOutBtn.addEventListener('click', () => changeViewerZoom(-0.15));
  zoomInBtn.addEventListener('click', () => changeViewerZoom(0.15));
  fitWidthBtn.addEventListener('click', fitViewerToWidth);

  // Lightbox Modal Actions
  if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeImageLightbox);
  if (lightboxRotateBtn) lightboxRotateBtn.addEventListener('click', rotateLightboxImage);
  if (lightboxDownloadBtn) lightboxDownloadBtn.addEventListener('click', downloadLightboxImage);
  if (lightboxCropBtn) {
    lightboxCropBtn.addEventListener('click', () => {
      if (activeLightboxImg) {
        closeImageLightbox();
        openCropperModal(activeLightboxImg);
      }
    });
  }
  if (imageLightboxModal) {
    imageLightboxModal.addEventListener('click', (e) => {
      if (e.target === imageLightboxModal) closeImageLightbox();
    });
  }

  // Cropper Modal Actions
  if (cancelCropBtn) cancelCropBtn.addEventListener('click', closeCropperModal);
  if (applyCropBtn) applyCropBtn.addEventListener('click', applyCrop);
  if (cropResetBtn) cropResetBtn.addEventListener('click', resetCropToOriginal);
  document.querySelectorAll('.crop-aspect-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.crop-aspect-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setCropperAspect(btn.dataset.cropAspect);
    });
  });

  // Features Hub Modal
  if (featuresHubBtn && featuresHubModal) {
    featuresHubBtn.addEventListener('click', () => {
      featuresHubModal.classList.remove('hidden');
      lucide.createIcons();
    });
  }
  if (closeFeaturesHubBtn) {
    closeFeaturesHubBtn.addEventListener('click', () => featuresHubModal.classList.add('hidden'));
  }
  if (featuresHubModal) {
    featuresHubModal.addEventListener('click', (e) => {
      if (e.target === featuresHubModal) featuresHubModal.classList.add('hidden');
    });
  }
  if (featureSearchInput) {
    featureSearchInput.addEventListener('input', (e) => {
      renderFeaturesHub(null, e.target.value.trim().toLowerCase());
    });
  }
  document.querySelectorAll('.feat-cat-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.feat-cat-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderFeaturesHub(btn.dataset.cat);
    });
  });

  // Changelog Modal
  if (changelogBtn && changelogModal) {
    changelogBtn.addEventListener('click', () => {
      changelogModal.classList.remove('hidden');
      lucide.createIcons();
    });
  }
  const closeChangelog = () => {
    if (changelogModal) changelogModal.classList.add('hidden');
  };
  if (closeChangelogBtn) closeChangelogBtn.addEventListener('click', closeChangelog);
  if (dismissChangelogBtn) dismissChangelogBtn.addEventListener('click', closeChangelog);
  if (changelogModal) {
    changelogModal.addEventListener('click', (e) => {
      if (e.target === changelogModal) closeChangelog();
    });
  }

  // Theme Toggle (Safely checked)
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // Navigation & Menus
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle('hidden');
    });
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileMenu.classList.add('hidden');
      }
    });
  }

  const toolsDropdownBtn = document.getElementById('toolsDropdownBtn');
  const toolsDropdownMenu = document.getElementById('toolsDropdownMenu');
  if (toolsDropdownBtn && toolsDropdownMenu) {
    toolsDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toolsDropdownMenu.classList.toggle('show');
    });
    document.addEventListener('click', (e) => {
      if (!toolsDropdownMenu.contains(e.target) && !toolsDropdownBtn.contains(e.target)) {
        toolsDropdownMenu.classList.remove('show');
      }
    });
  }

  const mobileFeaturesHubBtn = document.getElementById('mobileFeaturesHubBtn');
  if (mobileFeaturesHubBtn && featuresHubModal) {
    mobileFeaturesHubBtn.addEventListener('click', () => {
      if (mobileMenu) mobileMenu.classList.add('hidden');
      featuresHubModal.classList.remove('hidden');
      lucide.createIcons();
    });
  }

  const mobileChangelogBtn = document.getElementById('mobileChangelogBtn');
  if (mobileChangelogBtn && changelogModal) {
    mobileChangelogBtn.addEventListener('click', () => {
      if (mobileMenu) mobileMenu.classList.add('hidden');
      changelogModal.classList.remove('hidden');
      lucide.createIcons();
    });
  }

  // Command Palette Open Triggers
  const openCmdBtn = document.getElementById('openCommandPaletteBtn');
  const footerCmdBtn = document.getElementById('footerCommandBtn');
  const heroBadge = document.getElementById('heroAnnouncementBadge');

  if (openCmdBtn) openCmdBtn.addEventListener('click', openCommandPalette);
  if (footerCmdBtn) footerCmdBtn.addEventListener('click', openCommandPalette);
  if (heroBadge) {
    heroBadge.addEventListener('click', () => {
      const toolsSec = document.getElementById('tools');
      if (toolsSec) toolsSec.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Command Palette Input & Navigation
  const cmdModal = document.getElementById('commandPaletteModal');
  const cmdInput = document.getElementById('commandPaletteInput');

  if (cmdModal) {
    cmdModal.addEventListener('click', (e) => {
      if (e.target === cmdModal) closeCommandPalette();
    });
  }

  if (cmdInput) {
    cmdInput.addEventListener('input', (e) => {
      cmdSelectedIndex = 0;
      renderCommandList(e.target.value);
    });

    cmdInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (filteredCmdItems.length > 0) {
          cmdSelectedIndex = (cmdSelectedIndex + 1) % filteredCmdItems.length;
          renderCommandList(cmdInput.value);
          const activeItem = document.querySelector(`.cmd-item[data-cmd-index="${cmdSelectedIndex}"]`);
          if (activeItem) activeItem.scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (filteredCmdItems.length > 0) {
          cmdSelectedIndex = (cmdSelectedIndex - 1 + filteredCmdItems.length) % filteredCmdItems.length;
          renderCommandList(cmdInput.value);
          const activeItem = document.querySelector(`.cmd-item[data-cmd-index="${cmdSelectedIndex}"]`);
          if (activeItem) activeItem.scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCmdItems.length > 0 && filteredCmdItems[cmdSelectedIndex]) {
          executeToolAction(filteredCmdItems[cmdSelectedIndex].action);
        }
      } else if (e.key === 'Escape') {
        closeCommandPalette();
      }
    });
  }

  // Keyboard Shortcuts Cheatsheet
  const closeShortcutsBtn = document.getElementById('closeShortcutsBtn');
  const dismissShortcutsBtn = document.getElementById('dismissShortcutsBtn');
  const footerShortcutsBtn = document.getElementById('footerShortcutsBtn');
  const shortcutsModal = document.getElementById('shortcutsModal');

  if (footerShortcutsBtn) footerShortcutsBtn.addEventListener('click', openShortcutsModal);
  if (closeShortcutsBtn) closeShortcutsBtn.addEventListener('click', closeShortcutsModal);
  if (dismissShortcutsBtn) dismissShortcutsBtn.addEventListener('click', closeShortcutsModal);
  if (shortcutsModal) {
    shortcutsModal.addEventListener('click', (e) => {
      if (e.target === shortcutsModal) closeShortcutsModal();
    });
  }

  // Tool Category Tabs & Search in #tools Grid
  document.querySelectorAll('.tool-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tool-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeToolCategory = btn.dataset.category || 'all';
      filterToolsGrid();
    });
  });

  const toolSearchInput = document.getElementById('toolSearchInput');
  if (toolSearchInput) {
    toolSearchInput.addEventListener('input', (e) => {
      activeToolSearchQuery = e.target.value.trim().toLowerCase();
      filterToolsGrid();
    });
  }

  const resetToolFiltersBtn = document.getElementById('resetToolFiltersBtn');
  if (resetToolFiltersBtn) {
    resetToolFiltersBtn.addEventListener('click', () => {
      activeToolCategory = 'all';
      activeToolSearchQuery = '';
      if (toolSearchInput) toolSearchInput.value = '';
      document.querySelectorAll('.tool-tab-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.category === 'all');
      });
      filterToolsGrid();
    });
  }

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    const isEditing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);

    // Ctrl+K or Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdModal && !cmdModal.classList.contains('hidden')) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
      return;
    }

    // Ctrl+Enter or Cmd+Enter -> Compile & Preview PDF
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      generatePdf(false);
      return;
    }

    // '?' key for shortcuts modal when not typing in an input
    if (e.key === '?' && !isEditing) {
      e.preventDefault();
      openShortcutsModal();
      return;
    }

    // Escape key
    if (e.key === 'Escape') {
      if (cmdModal && !cmdModal.classList.contains('hidden')) {
        closeCommandPalette();
        return;
      }
      if (shortcutsModal && !shortcutsModal.classList.contains('hidden')) {
        closeShortcutsModal();
        return;
      }
    }

    // Viewer Navigation
    if (previewModal && !previewModal.classList.contains('hidden')) {
      if (e.key === 'ArrowLeft') changeViewerPage(-1);
      else if (e.key === 'ArrowRight') changeViewerPage(1);
      else if (e.key === 'Escape') closePdfModal();
      else if (e.key === '+' || e.key === '=') changeViewerZoom(0.15);
      else if (e.key === '-') changeViewerZoom(-0.15);
    } else if (imageLightboxModal && !imageLightboxModal.classList.contains('hidden')) {
      if (e.key === 'Escape') closeImageLightbox();
      else if (e.key === 'r' || e.key === 'R') rotateLightboxImage();
    } else if (cropperModal && !cropperModal.classList.contains('hidden')) {
      if (e.key === 'Escape') closeCropperModal();
    } else if (featuresHubModal && !featuresHubModal.classList.contains('hidden')) {
      if (e.key === 'Escape') featuresHubModal.classList.add('hidden');
    } else if (changelogModal && !changelogModal.classList.contains('hidden')) {
      if (e.key === 'Escape') closeChangelog();
    }
  });

  // Real Tools linking across navigation dropdown and tools grid cards
  document.querySelectorAll('[data-tool-action]').forEach(elem => {
    elem.addEventListener('click', (e) => {
      const action = elem.dataset.toolAction;
      executeToolAction(action);
    });
  });
}

// Global Command Palette & Shortcuts State
let cmdSelectedIndex = 0;
let filteredCmdItems = [];

const COMMAND_ITEMS = [
  // Quick Actions
  { id: 'cmd-preview', title: 'Compile & Preview PDF', desc: 'Render current document in full PDF viewer', category: 'Actions', icon: 'file-check', action: 'action-preview', badge: 'Ctrl+Enter' },
  { id: 'cmd-add-files', title: 'Add / Select Images', desc: 'Open file picker to load images into workspace', category: 'Actions', icon: 'upload', action: 'action-upload', badge: 'Upload' },
  { id: 'cmd-sample', title: 'Load Demo Sample Images', desc: 'Populate workspace with 3 realistic sample images', category: 'Actions', icon: 'image', action: 'action-sample', badge: 'Demo' },
  { id: 'cmd-shortcuts', title: 'View Keyboard Shortcuts', desc: 'Display complete hotkeys cheat sheet', category: 'Actions', icon: 'keyboard', action: 'action-shortcuts', badge: '?' },
  { id: 'cmd-changelog', title: 'View Release Changelog', desc: 'Read latest updates and release history', category: 'Actions', icon: 'calendar', action: 'action-changelog', badge: 'v2.4' },

  // Layout & Grids
  { id: 't1', title: 'Image to PDF (1:1 Fit)', desc: 'Borderless fit to original image dimensions', category: 'Layout & Grids', icon: 'file-text', action: 'preset-photo-album' },
  { id: 't3', title: 'Multi-Up Grids (2-Up & 4-Up)', desc: 'Multi-page contact sheets and receipt grids', category: 'Layout & Grids', icon: 'layout-grid', action: 'preset-receipts-2up' },
  { id: 't4', title: 'Visual Image Cropper', desc: 'Freeform, 1:1, 4:3, 16:9, A4 ratio presets', category: 'Layout & Grids', icon: 'crop', action: 'open-cropper-guide' },
  { id: 't14', title: 'ID Card & Passport Layout', desc: 'CR80 standard double-sided alignment on single page', category: 'Layout & Grids', icon: 'credit-card', action: 'tool-idcard-layout' },
  { id: 't15', title: 'Margin & Bleed Studio', desc: 'Borderless, 5mm slim, 12mm standard, or 20mm gutter', category: 'Layout & Grids', icon: 'maximize-2', action: 'tool-focus-margins' },
  { id: 't16', title: 'Canvas Background Tint', desc: 'Custom background tint for letterboxed images', category: 'Layout & Grids', icon: 'palette', action: 'tool-canvas-bg' },
  { id: 't24', title: 'Bulk Page Rotator (90°)', desc: 'Batch rotate all pages 90° clockwise in 1 click', category: 'Layout & Grids', icon: 'rotate-cw', action: 'tool-bulk-rotate' },
  { id: 't25', title: 'Page Sequence Reverser', desc: 'Invert page order from 10→1 to 1→10 for ADF feeds', category: 'Layout & Grids', icon: 'arrow-down-up', action: 'tool-reverse-order' },
  { id: 't26', title: 'Alphabetical Auto-Sorter', desc: 'Sort pages alphabetically and numerically (A to Z)', category: 'Layout & Grids', icon: 'arrow-up-a-z', action: 'tool-sort-az' },
  { id: 't27', title: 'Page Cloner & Duplicator', desc: 'Duplicate selected document page in 1 click', category: 'Layout & Grids', icon: 'copy', action: 'tool-clone-page' },

  // Filters & Scanner
  { id: 't2', title: 'Document Scanner', desc: 'Shadow-removal thresholding for documents & receipts', category: 'Filters & Scanner', icon: 'scan', action: 'preset-doc-scanner' },
  { id: 't10', title: 'Grayscale Monochrome', desc: '8-bit grayscale for archival filing and laser print', category: 'Filters & Scanner', icon: 'contrast', action: 'tool-grayscale' },
  { id: 't11', title: 'Inverted Dark Mode PDF', desc: 'Invert brightness for night-time reading and blueprints', category: 'Filters & Scanner', icon: 'sun-moon', action: 'tool-invert' },
  { id: 't12', title: 'Receipt & Contrast Booster', desc: 'Enhance faded thermal receipts and low-contrast scans', category: 'Filters & Scanner', icon: 'sparkles', action: 'tool-contrast-boost' },
  { id: 't13', title: 'Sepia Vintage Scan', desc: 'Warm sepia tone for historical manuscripts & portfolios', category: 'Filters & Scanner', icon: 'history', action: 'tool-sepia' },

  // Security & Signing
  { id: 't5', title: 'PDF Password Protection', desc: 'Client-side AES encryption with password', category: 'Security & Signing', icon: 'lock', action: 'focus-security' },
  { id: 't6', title: 'Digital Signature Pad', desc: 'Draw, save, and stamp signature onto pages', category: 'Security & Signing', icon: 'pen-tool', action: 'focus-signature' },
  { id: 't20', title: 'Camera EXIF & GPS Sanitizer', desc: 'Strip camera metadata, GPS coordinates, and serials', category: 'Security & Signing', icon: 'eye-off', action: 'tool-strip-exif' },
  { id: 't21', title: 'PDF Metadata & Properties', desc: 'Edit document title, author, subject, and keywords', category: 'Security & Signing', icon: 'file-cog', action: 'tool-focus-metadata' },

  // Stamps & Numbers
  { id: 't7', title: 'Watermarks & Stamps', desc: 'Diagonal & repeating text stamps and page numbers', category: 'Stamps & Numbers', icon: 'stamp', action: 'preset-confidential' },
  { id: 't17', title: 'Bates Stamping Engine', desc: 'Legal and accounting sequential numbering (DOC-0001)', category: 'Stamps & Numbers', icon: 'hash', action: 'tool-bates-stamping' },
  { id: 't18', title: 'Preset Legal & Office Stamps', desc: 'Stamp APPROVED, DRAFT, URGENT, CONFIDENTIAL, FINAL', category: 'Stamps & Numbers', icon: 'shield-check', action: 'tool-status-stamps' },
  { id: 't19', title: 'Header & Footer Banners', desc: 'Top margin document title and bottom date/pagination', category: 'Stamps & Numbers', icon: 'book-open', action: 'tool-header-footer' },

  // Optimization & Export
  { id: 't8', title: 'Compression & Target DPI', desc: 'Quality tiers and 72 / 150 / 300 DPI modes', category: 'Optimization & Export', icon: 'gauge', action: 'focus-compression' },
  { id: 't9', title: 'Batch ZIP Archive', desc: 'Package processed images into a single ZIP archive', category: 'Optimization & Export', icon: 'archive', action: 'trigger-zip' },
  { id: 't22', title: 'Target Print DPI Resampler', desc: 'Target 72 DPI screen, 150 DPI office, or 300 DPI print', category: 'Optimization & Export', icon: 'printer', action: 'tool-dpi-resampler' },
  { id: 't23', title: '5-Stage Compression Shrinker', desc: 'Shrink document from Lossless down to Compact (50%)', category: 'Optimization & Export', icon: 'minimize-2', action: 'tool-shrink-compress' },
  { id: 't28', title: 'Single Page Snapshot Extractor', desc: 'Inspect full resolution page and export image', category: 'Optimization & Export', icon: 'download', action: 'tool-extract-page' },
  { id: 't29', title: 'Workspace Reset & Clear', desc: 'Reset all loaded images and start fresh in 1 click', category: 'Optimization & Export', icon: 'trash-2', action: 'tool-clear-all' }
];

function openCommandPalette() {
  const modal = document.getElementById('commandPaletteModal');
  const input = document.getElementById('commandPaletteInput');
  if (!modal) return;
  modal.classList.remove('hidden');
  cmdSelectedIndex = 0;
  if (input) {
    input.value = '';
    setTimeout(() => input.focus(), 50);
  }
  renderCommandList('');
}

function closeCommandPalette() {
  const modal = document.getElementById('commandPaletteModal');
  if (modal) modal.classList.add('hidden');
}

function renderCommandList(query = '') {
  const list = document.getElementById('commandPaletteList');
  if (!list) return;

  const q = query.trim().toLowerCase();
  filteredCmdItems = COMMAND_ITEMS.filter(item => {
    if (!q) return true;
    return item.title.toLowerCase().includes(q) ||
           (item.desc && item.desc.toLowerCase().includes(q)) ||
           item.category.toLowerCase().includes(q);
  });

  if (filteredCmdItems.length === 0) {
    list.innerHTML = `
      <div class="py-8 text-center text-xs text-[#929292]">
        <i data-lucide="search-x" class="w-6 h-6 mx-auto mb-2 text-[#666666]"></i>
        <p>No commands matching "${query}"</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  if (cmdSelectedIndex >= filteredCmdItems.length) {
    cmdSelectedIndex = 0;
  }

  let html = '';
  let currentCat = '';
  filteredCmdItems.forEach((item, index) => {
    if (item.category !== currentCat) {
      currentCat = item.category;
      html += `
        <div class="px-3 pt-2.5 pb-1 text-[10px] font-mono uppercase tracking-wider text-[#666666] font-semibold">
          ${currentCat}
        </div>
      `;
    }
    const isSelected = index === cmdSelectedIndex;
    html += `
      <div class="cmd-item flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-xs ${isSelected ? 'selected bg-[#161616]' : 'hover:bg-[#161616]'}" data-cmd-index="${index}" data-action="${item.action}">
        <div class="flex items-center space-x-3 min-w-0">
          <div class="w-6 h-6 rounded bg-[#111111] border border-[#242424] flex items-center justify-center text-[#F5F5F5] flex-shrink-0">
            <i data-lucide="${item.icon}" class="w-3.5 h-3.5"></i>
          </div>
          <div class="truncate">
            <span class="font-medium text-[#F5F5F5] block truncate">${item.title}</span>
            ${item.desc ? `<span class="text-[10px] text-[#929292] block truncate">${item.desc}</span>` : ''}
          </div>
        </div>
        ${item.badge ? `<kbd class="text-[9px] font-mono bg-[#1A1A1A] text-[#888888] border border-[#282828] px-1.5 py-0.5 rounded ml-2 flex-shrink-0">${item.badge}</kbd>` : ''}
      </div>
    `;
  });

  list.innerHTML = html;
  lucide.createIcons();

  list.querySelectorAll('.cmd-item').forEach(elem => {
    elem.addEventListener('click', () => {
      const action = elem.dataset.action;
      executeToolAction(action);
    });
  });
}

function openShortcutsModal() {
  const modal = document.getElementById('shortcutsModal');
  if (modal) {
    modal.classList.remove('hidden');
    lucide.createIcons();
  }
}

function closeShortcutsModal() {
  const modal = document.getElementById('shortcutsModal');
  if (modal) modal.classList.add('hidden');
}

// Tool Category & Search Filtering in #tools
let activeToolCategory = 'all';
let activeToolSearchQuery = '';

function filterToolsGrid() {
  const cards = document.querySelectorAll('#toolsGridContainer .tool-card');
  const noFound = document.getElementById('noToolsFound');
  let visibleCount = 0;

  cards.forEach(card => {
    const cat = card.dataset.toolCategory || '';
    const text = card.textContent.toLowerCase();

    const matchesCategory = (activeToolCategory === 'all' || cat === activeToolCategory);
    const matchesSearch = (!activeToolSearchQuery || text.includes(activeToolSearchQuery));

    if (matchesCategory && matchesSearch) {
      card.classList.remove('filtered-out');
      visibleCount++;
    } else {
      card.classList.add('filtered-out');
    }
  });

  if (noFound) {
    noFound.classList.toggle('hidden', visibleCount > 0);
  }
}

// Unified Tool Execution Hub
function executeToolAction(action) {
  if (!action) return;

  const toolsDropdownMenu = document.getElementById('toolsDropdownMenu');
  const mobileMenu = document.getElementById('mobileMenu');
  if (toolsDropdownMenu) toolsDropdownMenu.classList.remove('show');
  if (mobileMenu) mobileMenu.classList.add('hidden');
  closeCommandPalette();

  if (action === 'action-preview') {
    generatePdf(false);
  } else if (action === 'action-upload') {
    fileInput.click();
  } else if (action === 'action-sample') {
    loadSampleDemoImages();
  } else if (action === 'action-shortcuts') {
    openShortcutsModal();
  } else if (action === 'action-changelog') {
    if (changelogModal) {
      changelogModal.classList.remove('hidden');
      lucide.createIcons();
    }
  } else if (action.startsWith('preset-')) {
    const presetKey = action.replace('preset-', '');
    applyPreset(presetKey);
    const workspace = document.getElementById('workspace');
    if (workspace) workspace.scrollIntoView({ behavior: 'smooth' });
  } else if (action === 'focus-security') {
    const secAcc = document.getElementById('accordion-security');
    if (secAcc) {
      secAcc.classList.remove('collapsed');
      secAcc.scrollIntoView({ behavior: 'smooth', block: 'center' });
      secAcc.classList.add('ring-1', 'ring-white/40');
      setTimeout(() => secAcc.classList.remove('ring-1', 'ring-white/40'), 1500);
    }
  } else if (action === 'focus-signature') {
    openSignatureModal();
  } else if (action === 'focus-compression') {
    const compAcc = document.getElementById('accordion-compression');
    if (compAcc) {
      compAcc.classList.remove('collapsed');
      compAcc.scrollIntoView({ behavior: 'smooth', block: 'center' });
      compAcc.classList.add('ring-1', 'ring-white/40');
      setTimeout(() => compAcc.classList.remove('ring-1', 'ring-white/40'), 1500);
    }
  } else if (action === 'open-cropper-guide') {
    if (state.images.length > 0) {
      openCropperModal(state.images[0]);
    } else {
      showToast('Please select or drag an image first to use the visual cropper', 'info');
      fileInput.click();
    }
  } else if (action === 'trigger-zip') {
    if (state.images.length > 0) {
      exportBatchZip();
    } else {
      showToast('Please add images first to export ZIP archive', 'info');
      fileInput.click();
    }
  } else if (action === 'tool-grayscale') {
    state.settings.filter = 'grayscale';
    if (filterSelect) filterSelect.value = 'grayscale';
    const fltAcc = document.getElementById('accordion-filters');
    if (fltAcc) {
      fltAcc.classList.remove('collapsed');
      fltAcc.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    showToast('Applied Grayscale Monochrome (Laser Print & Archival)', 'success');
  } else if (action === 'tool-invert') {
    state.settings.filter = 'invert';
    if (filterSelect) filterSelect.value = 'invert';
    const fltAcc = document.getElementById('accordion-filters');
    if (fltAcc) {
      fltAcc.classList.remove('collapsed');
      fltAcc.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    showToast('Applied Invert Colors Filter (Dark Mode PDF)', 'success');
  } else if (action === 'tool-contrast-boost') {
    state.settings.filter = 'boost';
    state.settings.contrast = 150;
    state.settings.brightness = 110;
    if (filterSelect) filterSelect.value = 'boost';
    const contrastSlider = document.getElementById('contrastSlider');
    if (contrastSlider) contrastSlider.value = 150;
    const contrastVal = document.getElementById('contrastVal');
    if (contrastVal) contrastVal.textContent = '150%';
    const fltAcc = document.getElementById('accordion-filters');
    if (fltAcc) {
      fltAcc.classList.remove('collapsed');
      fltAcc.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    showToast('Applied Contrast Booster for Faded Receipts', 'success');
  } else if (action === 'tool-sepia') {
    state.settings.filter = 'sepia';
    if (filterSelect) filterSelect.value = 'sepia';
    const fltAcc = document.getElementById('accordion-filters');
    if (fltAcc) {
      fltAcc.classList.remove('collapsed');
      fltAcc.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    showToast('Applied Sepia Vintage Archival Tone', 'success');
  } else if (action === 'tool-idcard-layout') {
    applyPreset('id-card');
    const szAcc = document.getElementById('accordion-sizing');
    if (szAcc) {
      szAcc.classList.remove('collapsed');
      szAcc.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  } else if (action === 'tool-focus-margins') {
    const szAcc = document.getElementById('accordion-sizing');
    if (szAcc) {
      szAcc.classList.remove('collapsed');
      const marginContainer = document.getElementById('marginContainer');
      if (marginContainer) marginContainer.classList.remove('hidden');
      szAcc.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    showToast('Select margin: 0mm borderless, 5mm slim, 12mm standard, or 20mm binding gutter', 'info');
  } else if (action === 'tool-canvas-bg') {
    const szAcc = document.getElementById('accordion-sizing');
    if (szAcc) {
      szAcc.classList.remove('collapsed');
      const pageBgContainer = document.getElementById('pageBgContainer');
      if (pageBgContainer) pageBgContainer.classList.remove('hidden');
      szAcc.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    showToast('Select canvas background tint for letterboxed images', 'info');
  } else if (action === 'tool-bates-stamping') {
    const wtAcc = document.getElementById('accordion-watermark');
    if (wtAcc) {
      wtAcc.classList.remove('collapsed');
      const addPageNumbers = document.getElementById('addPageNumbers');
      if (addPageNumbers) addPageNumbers.checked = true;
      state.settings.addPageNumbers = true;
      if (batesPrefixInput) {
        batesPrefixInput.value = 'DOC-';
        state.settings.batesPrefix = 'DOC-';
        batesPrefixInput.focus();
      }
      wtAcc.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    showToast('Enabled Sequential Bates Stamping (e.g. DOC-0001)', 'success');
  } else if (action === 'tool-status-stamps') {
    const wtAcc = document.getElementById('accordion-watermark');
    if (wtAcc) {
      wtAcc.classList.remove('collapsed');
      const addWatermark = document.getElementById('addWatermark');
      const watermarkText = document.getElementById('watermarkText');
      const watermarkControls = document.getElementById('watermarkControls');
      if (addWatermark) addWatermark.checked = true;
      state.settings.addWatermark = true;
      if (watermarkText) watermarkText.value = 'APPROVED';
      state.settings.watermarkText = 'APPROVED';
      if (watermarkControls) watermarkControls.classList.remove('hidden');
      wtAcc.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    showToast('Applied Legal Status Stamp: APPROVED', 'success');
  } else if (action === 'tool-header-footer') {
    const wtAcc = document.getElementById('accordion-watermark');
    if (wtAcc) {
      wtAcc.classList.remove('collapsed');
      const addDateStamp = document.getElementById('addDateStamp');
      const addPageNumbers = document.getElementById('addPageNumbers');
      const customHeaderText = document.getElementById('customHeaderText');
      if (addDateStamp) addDateStamp.checked = true;
      if (addPageNumbers) addPageNumbers.checked = true;
      state.settings.addDateStamp = true;
      state.settings.addPageNumbers = true;
      if (customHeaderText && !customHeaderText.value) {
        customHeaderText.value = 'OFFICIAL DOCUMENT';
        state.settings.customHeaderText = 'OFFICIAL DOCUMENT';
      }
      wtAcc.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    showToast('Configuring Header Document Title & Footer Stamps', 'info');
  } else if (action === 'tool-strip-exif') {
    const metaAcc = document.getElementById('accordion-metadata');
    if (metaAcc) {
      metaAcc.classList.remove('collapsed');
      const stripExifCheck = document.getElementById('stripExifCheck');
      if (stripExifCheck) stripExifCheck.checked = true;
      state.settings.stripExif = true;
      metaAcc.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    showToast('Camera EXIF & GPS Geotag Sanitizer Activated (100% Private)', 'success');
  } else if (action === 'tool-focus-metadata') {
    const metaAcc = document.getElementById('accordion-metadata');
    if (metaAcc) {
      metaAcc.classList.remove('collapsed');
      metaAcc.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const metaTitle = document.getElementById('metaTitle');
      if (metaTitle) metaTitle.focus();
    }
    showToast('Edit PDF Document Properties & Dublin Core Metadata', 'info');
  } else if (action === 'tool-dpi-resampler') {
    const compAcc = document.getElementById('accordion-compression');
    if (compAcc) {
      compAcc.classList.remove('collapsed');
      const dpiSelect = document.getElementById('dpiSelect');
      if (dpiSelect) {
        dpiSelect.value = '300';
        state.settings.targetDpi = '300';
        updateEstimatedPdfSize();
      }
      compAcc.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    showToast('Set Target Resolution: 300 DPI Archival Print', 'success');
  } else if (action === 'tool-shrink-compress') {
    const compAcc = document.getElementById('accordion-compression');
    if (compAcc) {
      compAcc.classList.remove('collapsed');
      const qualitySelect = document.getElementById('qualitySelect');
      const qualityLabel = document.getElementById('qualityLabel');
      if (qualitySelect) {
        qualitySelect.value = '0.5';
        state.settings.quality = 0.5;
        if (qualityLabel) qualityLabel.textContent = '50%';
        updateEstimatedPdfSize();
      }
      compAcc.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    showToast('Applied 50% Compact Compression (Smallest File Size)', 'success');
  } else if (action === 'tool-bulk-rotate') {
    if (state.images.length > 0) {
      state.images.forEach(img => img.rotation = (img.rotation + 90) % 360);
      renderImages();
      showToast(`Rotated all ${state.images.length} pages 90° clockwise`, 'success');
      document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      showToast('Please add images first to rotate in bulk', 'info');
      fileInput.click();
    }
  } else if (action === 'tool-reverse-order') {
    if (state.images.length > 0) {
      state.images.reverse();
      renderImages();
      showToast('Inverted document page order', 'success');
      document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      showToast('Please add images first to reverse page order', 'info');
      fileInput.click();
    }
  } else if (action === 'tool-sort-az') {
    if (state.images.length > 0) {
      state.images.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
      renderImages();
      showToast('Sorted pages alphabetically (A to Z)', 'success');
      document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      showToast('Please add images first to sort', 'info');
      fileInput.click();
    }
  } else if (action === 'tool-clone-page') {
    if (state.images.length > 0) {
      const first = state.images[0];
      const cloned = {
        ...first,
        id: 'img_' + Math.random().toString(36).substr(2, 9),
        name: `${first.name.replace(/\.[^/.]+$/, '')} (Copy).jpg`
      };
      state.images.splice(1, 0, cloned);
      renderImages();
      showToast(`Duplicated page: "${cloned.name}"`, 'success');
      document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      showToast('Please add images first to duplicate pages', 'info');
      fileInput.click();
    }
  } else if (action === 'tool-extract-page') {
    if (state.images.length > 0) {
      openImageLightbox(state.images[0]);
      showToast('Click Download icon in top right of lightbox to export single page', 'info');
    } else {
      showToast('Please add an image to inspect and extract snapshot', 'info');
      fileInput.click();
    }
  } else if (action === 'tool-clear-all') {
    if (state.images.length > 0) {
      if (confirm('Are you sure you want to clear all loaded images and reset workspace?')) {
        state.images = [];
        renderImages();
        showToast('Workspace reset successfully', 'info');
      }
    } else {
      showToast('Workspace is already empty', 'info');
    }
  }
}

// 1-Click Workflow Presets Manager
function applyPreset(presetName) {
  if (presetName === 'photo-album') {
    pageSizeSelect.value = 'fit';
    state.settings.pageSize = 'fit';
    state.settings.filter = 'none';
    if (filterSelect) filterSelect.value = 'none';
    state.settings.quality = 0.95;
    if (qualitySelect) qualitySelect.value = '1.0';
    state.settings.addWatermark = false;
    if (addWatermark) addWatermark.checked = false;
    state.settings.gridLayout = 1;
    showToast('Applied Preset: Photo Album (1:1 Borderless)', 'success');
  } else if (presetName === 'doc-scanner') {
    pageSizeSelect.value = 'a4';
    state.settings.pageSize = 'a4';
    state.settings.filter = 'bw-doc';
    if (filterSelect) filterSelect.value = 'bw-doc';
    if (thresholdSliderContainer) thresholdSliderContainer.classList.remove('hidden');
    state.settings.margin = 5;
    state.settings.quality = 0.85;
    state.settings.gridLayout = 1;
    showToast('Applied Preset: Document Scanner (B&W High Contrast)', 'success');
  } else if (presetName === 'receipts-2up') {
    pageSizeSelect.value = 'a4';
    state.settings.pageSize = 'a4';
    state.settings.filter = 'bw-doc';
    if (filterSelect) filterSelect.value = 'bw-doc';
    state.settings.gridLayout = 2;
    document.querySelectorAll('.grid-layout-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.grid === '2');
    });
    state.settings.margin = 5;
    showToast('Applied Preset: Receipts (2-Up Side-by-Side)', 'success');
  } else if (presetName === 'confidential') {
    pageSizeSelect.value = 'a4';
    state.settings.pageSize = 'a4';
    state.settings.addWatermark = true;
    if (addWatermark) addWatermark.checked = true;
    if (watermarkControls) watermarkControls.classList.remove('hidden');
    state.settings.watermarkText = 'CONFIDENTIAL';
    if (watermarkText) watermarkText.value = 'CONFIDENTIAL';
    state.settings.addPageNumbers = true;
    if (addPageNumbers) addPageNumbers.checked = true;
    state.settings.margin = 12;
    showToast('Applied Preset: Confidential Watermarked Report', 'success');
  } else if (presetName === 'id-card') {
    pageSizeSelect.value = 'idcard';
    state.settings.pageSize = 'idcard';
    state.settings.margin = 0;
    state.settings.quality = 1.0;
    showToast('Applied Preset: ID / Business Card (CR80)', 'success');
  }

  // Trigger UI state updates
  pageSizeSelect.dispatchEvent(new Event('change'));
}

// Pre-loaded Sample Demo Images Generator
function loadSampleDemoImages() {
  showToast('Generating sample documents...', 'info');

  const demoItems = [
    { title: 'Contract Agreement #204', type: 'doc', color: '#1e293b' },
    { title: 'Expense Receipt - Taxi & Lunch', type: 'receipt', color: '#0f766e' },
    { title: 'Project Blueprint / Architecture', type: 'chart', color: '#4338ca' }
  ];

  demoItems.forEach((demo, idx) => {
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 1200;
    const ctx = canvas.getContext('2d');

    // Clean paper background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header bar
    ctx.fillStyle = demo.color;
    ctx.fillRect(40, 40, canvas.width - 80, 100);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('ZOVA PDF DEMO DOCUMENT', 70, 102);

    // Title
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 38px sans-serif';
    ctx.fillText(demo.title, 60, 210);

    // Subtitle & Metadata
    ctx.fillStyle = '#64748b';
    ctx.font = '20px monospace';
    ctx.fillText(`ID: ZOVA-${1000 + idx} • Generated: ${new Date().toLocaleDateString()} • Verified 100% Client-Side`, 60, 250);

    // Horizontal Rule
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 280);
    ctx.lineTo(canvas.width - 60, 280);
    ctx.stroke();

    // Body content lines
    ctx.fillStyle = '#334155';
    ctx.font = '22px sans-serif';
    for (let row = 0; row < 14; row++) {
      const y = 340 + (row * 42);
      ctx.fillStyle = '#334155';
      ctx.fillText(`• Sample item row ${row + 1}: Testing document scanning, watermarking, and multi-up page grids.`, 60, y);
    }

    // Stamp circle
    ctx.save();
    ctx.strokeStyle = demo.color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(canvas.width - 160, canvas.height - 180, 80, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = demo.color;
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ZOVA PDF', canvas.width - 160, canvas.height - 190);
    ctx.font = '16px sans-serif';
    ctx.fillText('VERIFIED', canvas.width - 160, canvas.height - 165);
    ctx.restore();

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    state.images.push({
      id: 'demo_' + Math.random().toString(36).substr(2, 9),
      name: `${demo.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`,
      size: Math.round(dataUrl.length * 0.75),
      type: 'image/jpeg',
      dataUrl: dataUrl,
      originalDataUrl: dataUrl,
      width: canvas.width,
      height: canvas.height,
      rotation: 0
    });
  });

  renderImages();
  showToast(`Loaded ${demoItems.length} demo images!`, 'success');
}

// Process Files
async function handleFiles(files) {
  const imageFiles = files.filter(file => file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|svg|bmp|heic|heif)$/i.test(file.name));
  
  if (imageFiles.length === 0) {
    showToast('Please select valid image files (PNG, JPG, WebP, SVG, BMP, etc.)', 'error');
    return;
  }

  showToast(`Loading ${imageFiles.length} image(s)...`, 'info');

  for (const file of imageFiles) {
    try {
      const dataUrl = await readFileAsDataURL(file);
      const dimensions = await getImageDimensions(dataUrl);

      state.images.push({
        id: 'img_' + Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        type: file.type || 'image/jpeg',
        dataUrl,
        originalDataUrl: dataUrl,
        width: dimensions.width,
        height: dimensions.height,
        rotation: 0
      });
    } catch (err) {
      console.error('Failed to load image:', file.name, err);
      showToast(`Could not load ${file.name}`, 'error');
    }
  }

  renderImages();
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getImageDimensions(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 800, height: 600 });
    img.src = dataUrl;
  });
}

// Format file size
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Update Estimated Output PDF Size
function updateEstimatedPdfSize() {
  if (state.images.length === 0) {
    if (estPdfSizeBadge) estPdfSizeBadge.textContent = 'Est. PDF: ~0 KB';
    return;
  }

  const rawTotalBytes = state.images.reduce((acc, img) => acc + img.size, 0);
  const qualityFactor = state.settings.quality;
  let estimated = rawTotalBytes * qualityFactor * 0.85;

  if (state.settings.filter === 'bw-doc') {
    estimated = estimated * 0.45; // B&W documents compress dramatically
  }

  if (estPdfSizeBadge) {
    estPdfSizeBadge.textContent = `Est. PDF: ~${formatBytes(Math.max(10240, estimated))}`;
  }
}

// Render Image Cards in Gallery
function renderImages() {
  if (state.images.length === 0) {
    workspaceSection.classList.add('hidden');
    return;
  }

  workspaceSection.classList.remove('hidden');
  fileCountBadge.textContent = `${state.images.length} ${state.images.length === 1 ? 'image' : 'images'}`;
  
  const totalSize = state.images.reduce((acc, img) => acc + img.size, 0);
  totalSizeBadge.textContent = `(~${formatBytes(totalSize)})`;
  generateBtnText.textContent = `Preview & Convert ${state.images.length} ${state.images.length === 1 ? 'Image' : 'Images'} to PDF`;

  updateEstimatedPdfSize();
  imagesGrid.innerHTML = '';

  state.images.forEach((img, index) => {
    const card = document.createElement('div');
    card.className = 'image-card group';
    card.dataset.id = img.id;

    card.innerHTML = `
      <!-- Page Badge -->
      <div class="absolute top-2 left-2 z-10 bg-[#080808]/90 text-[#F5F5F5] text-[10px] font-semibold px-2 py-0.5 rounded-md border border-[#242424] shadow page-badge">
        Page ${index + 1}
      </div>

      <!-- Quick Action Controls (top right) -->
      <div class="absolute top-2 right-2 z-10 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button class="btn-crop p-1 rounded bg-[#080808]/90 hover:bg-[#161616] text-[#F5F5F5] shadow border border-[#242424] hover:border-[#383838] transition-colors" title="Crop Image">
          <i data-lucide="crop" class="w-3.5 h-3.5"></i>
        </button>
        <button class="btn-clone p-1 rounded bg-[#080808]/90 hover:bg-[#161616] text-[#F5F5F5] shadow border border-[#242424] hover:border-[#383838] transition-colors" title="Duplicate Page">
          <i data-lucide="copy" class="w-3.5 h-3.5"></i>
        </button>
        <button class="btn-rotate p-1 rounded bg-[#080808]/90 hover:bg-[#161616] text-[#F5F5F5] shadow border border-[#242424] hover:border-[#383838] transition-colors" title="Rotate 90°">
          <i data-lucide="rotate-cw" class="w-3.5 h-3.5"></i>
        </button>
        <button class="btn-delete p-1 rounded bg-[#080808]/90 hover:bg-red-950/80 hover:text-red-300 text-[#929292] shadow border border-[#242424] hover:border-red-900/50 transition-colors" title="Remove">
          <i data-lucide="trash" class="w-3.5 h-3.5"></i>
        </button>
      </div>

      <!-- Drag Handle Icon overlay -->
      <div class="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity">
        <i data-lucide="move" class="w-8 h-8 text-[#929292] drop-shadow"></i>
      </div>

      <!-- Thumbnail Preview (clickable for lightbox) -->
      <div class="thumbnail-container cursor-pointer" title="Click to inspect high-res image">
        <img src="${img.dataUrl}" alt="${img.name}" style="transform: rotate(${img.rotation}deg);" loading="lazy">
      </div>

      <!-- Meta Info Footer -->
      <div class="p-2.5 bg-[#111111] border-t border-[#242424]">
        <p class="text-xs font-medium text-[#F5F5F5] truncate" title="${img.name}">${img.name}</p>
        <div class="flex items-center justify-between text-[10px] text-[#929292] mt-1 font-mono">
          <span>${img.rotation % 180 !== 0 ? `${img.height}×${img.width}` : `${img.width}×${img.height}`}</span>
          <span>${formatBytes(img.size)}</span>
        </div>
      </div>
    `;

    // Click thumbnail to open lightbox
    card.querySelector('.thumbnail-container').addEventListener('click', (e) => {
      e.stopPropagation();
      openImageLightbox(img);
    });

    // Crop Button Handler
    card.querySelector('.btn-crop').addEventListener('click', (e) => {
      e.stopPropagation();
      openCropperModal(img);
    });

    // Rotate Button Handler
    card.querySelector('.btn-rotate').addEventListener('click', (e) => {
      e.stopPropagation();
      img.rotation = (img.rotation + 90) % 360;
      const imgElem = card.querySelector('img');
      imgElem.style.transform = `rotate(${img.rotation}deg)`;
      const metaSpan = card.querySelector('.font-mono span:first-child');
      metaSpan.textContent = img.rotation % 180 !== 0 ? `${img.height}×${img.width}` : `${img.width}×${img.height}`;
    });

    // Clone / Duplicate Button Handler
    card.querySelector('.btn-clone').addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = state.images.findIndex(i => i.id === img.id);
      const cloned = {
        ...img,
        id: 'img_' + Math.random().toString(36).substr(2, 9),
        name: `${img.name.replace(/\.[^/.]+$/, '')} (Copy).jpg`
      };
      state.images.splice(idx + 1, 0, cloned);
      renderImages();
      showToast(`Duplicated page: "${cloned.name}"`, 'success');
    });

    // Delete Button Handler
    card.querySelector('.btn-delete').addEventListener('click', (e) => {
      e.stopPropagation();
      state.images = state.images.filter(i => i.id !== img.id);
      renderImages();
    });

    imagesGrid.appendChild(card);
  });

  lucide.createIcons();
}

// Update Page Badges after sorting
function updatePageBadges() {
  const cards = imagesGrid.querySelectorAll('.image-card');
  cards.forEach((card, index) => {
    const badge = card.querySelector('.page-badge');
    if (badge) badge.textContent = `Page ${index + 1}`;
  });
}

// Image Lightbox Preview Functions
function openImageLightbox(img) {
  activeLightboxImg = img;
  if (!imageLightboxModal) return;

  lightboxTitle.textContent = img.name;
  const dims = img.rotation % 180 !== 0 ? `${img.height} × ${img.width} px` : `${img.width} × ${img.height} px`;
  lightboxMeta.textContent = `${dims} • ${formatBytes(img.size)}`;
  lightboxImg.src = img.dataUrl;
  lightboxImg.style.transform = `rotate(${img.rotation}deg)`;

  imageLightboxModal.classList.remove('hidden');
  lucide.createIcons();
}

function closeImageLightbox() {
  if (imageLightboxModal) imageLightboxModal.classList.add('hidden');
  activeLightboxImg = null;
}

function rotateLightboxImage() {
  if (!activeLightboxImg) return;
  activeLightboxImg.rotation = (activeLightboxImg.rotation + 90) % 360;
  if (lightboxImg) {
    lightboxImg.style.transform = `rotate(${activeLightboxImg.rotation}deg)`;
  }
  const dims = activeLightboxImg.rotation % 180 !== 0 ? `${activeLightboxImg.height} × ${activeLightboxImg.width} px` : `${activeLightboxImg.width} × ${activeLightboxImg.height} px`;
  if (lightboxMeta) {
    lightboxMeta.textContent = `${dims} • ${formatBytes(activeLightboxImg.size)}`;
  }
  const card = imagesGrid.querySelector(`[data-id="${activeLightboxImg.id}"]`);
  if (card) {
    const cardImg = card.querySelector('img');
    if (cardImg) cardImg.style.transform = `rotate(${activeLightboxImg.rotation}deg)`;
    const metaSpan = card.querySelector('.font-mono span:first-child');
    if (metaSpan) metaSpan.textContent = activeLightboxImg.rotation % 180 !== 0 ? `${activeLightboxImg.height}×${activeLightboxImg.width}` : `${activeLightboxImg.width}×${activeLightboxImg.height}`;
  }
}

async function downloadLightboxImage() {
  if (!activeLightboxImg) return;
  const processed = await getProcessedImageData(activeLightboxImg, 0.95);
  const a = document.createElement('a');
  a.href = processed.dataUrl;
  const ext = processed.format === 'PNG' ? 'png' : 'jpg';
  a.download = `${activeLightboxImg.name.replace(/\.[^/.]+$/, '')}-snapshot.${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast(`Exported single page snapshot: "${a.download}"`, 'success');
}

// Built-in Visual Cropper Studio
function openCropperModal(img) {
  state.cropper.activeImg = img;
  cropperSubtext.textContent = `${img.name} (${img.width} × ${img.height} px)`;
  cropperImg.src = img.dataUrl;
  
  // Reset crop box to 80% center
  state.cropper.box = { x: 10, y: 10, w: 80, h: 80 };
  updateCropBoxUI();

  cropperModal.classList.remove('hidden');
  lucide.createIcons();
  initCropBoxDrag();
}

function closeCropperModal() {
  cropperModal.classList.add('hidden');
  state.cropper.activeImg = null;
}

function setCropperAspect(aspect) {
  state.cropper.aspect = aspect;
  if (aspect === '1:1') {
    state.cropper.box.w = Math.min(state.cropper.box.w, state.cropper.box.h);
    state.cropper.box.h = state.cropper.box.w;
  } else if (aspect === '4:3') {
    state.cropper.box.h = state.cropper.box.w * (3 / 4);
  } else if (aspect === '16:9') {
    state.cropper.box.h = state.cropper.box.w * (9 / 16);
  } else if (aspect === 'a4') {
    state.cropper.box.h = state.cropper.box.w * (297 / 210);
  }
  updateCropBoxUI();
}

function updateCropBoxUI() {
  const box = state.cropper.box;
  cropBox.style.left = `${box.x}%`;
  cropBox.style.top = `${box.y}%`;
  cropBox.style.width = `${box.w}%`;
  cropBox.style.height = `${box.h}%`;
}

function resetCropToOriginal() {
  if (!state.cropper.activeImg) return;
  state.cropper.activeImg.dataUrl = state.cropper.activeImg.originalDataUrl;
  cropperImg.src = state.cropper.activeImg.dataUrl;
  state.cropper.box = { x: 5, y: 5, w: 90, h: 90 };
  updateCropBoxUI();
  showToast('Reset crop to original image', 'info');
}

function initCropBoxDrag() {
  let isDragging = false;
  let startX = 0, startY = 0;
  let initialX = 0, initialY = 0;

  cropBox.onmousedown = (e) => {
    if (e.target.classList.contains('crop-handle')) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialX = state.cropper.box.x;
    initialY = state.cropper.box.y;
    e.preventDefault();
  };

  window.onmousemove = (e) => {
    if (!isDragging || !cropperModal || cropperModal.classList.contains('hidden')) return;
    const stage = document.getElementById('cropperStage');
    if (!stage) return;
    const stageRect = stage.getBoundingClientRect();
    
    const deltaXPercent = ((e.clientX - startX) / stageRect.width) * 100;
    const deltaYPercent = ((e.clientY - startY) / stageRect.height) * 100;

    const newX = Math.max(0, Math.min(100 - state.cropper.box.w, initialX + deltaXPercent));
    const newY = Math.max(0, Math.min(100 - state.cropper.box.h, initialY + deltaYPercent));

    state.cropper.box.x = Math.round(newX);
    state.cropper.box.y = Math.round(newY);
    updateCropBoxUI();
  };

  window.onmouseup = () => {
    isDragging = false;
  };
}

async function applyCrop() {
  const targetImg = state.cropper.activeImg;
  if (!targetImg) return;

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const box = state.cropper.box;

    const cropX = (box.x / 100) * img.naturalWidth;
    const cropY = (box.y / 100) * img.naturalHeight;
    const cropW = (box.w / 100) * img.naturalWidth;
    const cropH = (box.h / 100) * img.naturalHeight;

    canvas.width = Math.max(1, cropW);
    canvas.height = Math.max(1, cropH);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height);
    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.95);

    targetImg.dataUrl = croppedDataUrl;
    targetImg.width = Math.round(canvas.width);
    targetImg.height = Math.round(canvas.height);

    renderImages();
    closeCropperModal();
    showToast('Crop applied successfully!', 'success');
  };
  img.src = targetImg.dataUrl;
}

// Digital Signature Drawing Pad
let sigDrawing = false;
let sigCtx = null;

function openSignatureModal() {
  signatureModal.classList.remove('hidden');
  sigCtx = signatureCanvas.getContext('2d');
  sigCtx.lineWidth = 3;
  sigCtx.lineCap = 'round';
  sigCtx.strokeStyle = '#0f172a';

  signatureCanvas.onmousedown = (e) => {
    sigDrawing = true;
    sigCtx.beginPath();
    sigCtx.moveTo(e.offsetX, e.offsetY);
  };

  signatureCanvas.onmousemove = (e) => {
    if (!sigDrawing) return;
    sigCtx.lineTo(e.offsetX, e.offsetY);
    sigCtx.stroke();
  };

  window.onmouseup = () => { sigDrawing = false; };

  // Touch Support for Mobile / iPad
  signatureCanvas.ontouchstart = (e) => {
    const rect = signatureCanvas.getBoundingClientRect();
    const touch = e.touches[0];
    sigDrawing = true;
    sigCtx.beginPath();
    sigCtx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
    e.preventDefault();
  };

  signatureCanvas.ontouchmove = (e) => {
    if (!sigDrawing) return;
    const rect = signatureCanvas.getBoundingClientRect();
    const touch = e.touches[0];
    sigCtx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
    sigCtx.stroke();
    e.preventDefault();
  };

  signatureCanvas.ontouchend = () => { sigDrawing = false; };
}

function clearSignature() {
  if (sigCtx) {
    sigCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
  }
}

function closeSignatureModal() {
  signatureModal.classList.add('hidden');
}

function saveSignature() {
  const dataUrl = signatureCanvas.toDataURL('image/png');
  state.settings.signatureDataUrl = dataUrl;
  if (signatureThumbnail) signatureThumbnail.src = dataUrl;
  if (signaturePreviewBox) signaturePreviewBox.classList.remove('hidden');
  closeSignatureModal();
  showToast('Digital signature saved & will be stamped on PDF!', 'success');
}

function removeSignature() {
  state.settings.signatureDataUrl = null;
  if (signaturePreviewBox) signaturePreviewBox.classList.add('hidden');
  clearSignature();
  showToast('Signature removed', 'info');
}

// Batch ZIP Archive Export
async function exportBatchZip() {
  if (state.images.length === 0) {
    showToast('No images to export', 'error');
    return;
  }

  if (typeof JSZip === 'undefined') {
    showToast('ZIP library loading... Please check internet connection', 'error');
    return;
  }

  showToast('Creating ZIP archive of all processed images...', 'info');
  const zip = new JSZip();

  state.images.forEach((img, idx) => {
    const base64Data = img.dataUrl.split(',')[1];
    const ext = img.name.split('.').pop() || 'jpg';
    const cleanName = `page_${idx + 1}_${img.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    zip.file(cleanName, base64Data, { base64: true });
  });

  const content = await zip.generateAsync({ type: 'blob' });
  const zipUrl = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = zipUrl;
  a.download = `${state.settings.fileName || 'zova-pdf'}-images.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(zipUrl);
  showToast('ZIP archive downloaded successfully!', 'success');
}

// 100+ Features Directory Modal Renderer
function renderFeaturesHub(category = 'all', searchQuery = '') {
  if (!featuresListContainer) return;
  featuresListContainer.innerHTML = '';

  let filtered = FEATURES_CATALOG;
  if (category && category !== 'all') {
    filtered = filtered.filter(f => f.cat === category);
  }

  if (searchQuery) {
    filtered = filtered.filter(f => 
      f.name.toLowerCase().includes(searchQuery) || 
      f.desc.toLowerCase().includes(searchQuery) ||
      f.cat.toLowerCase().includes(searchQuery)
    );
  }

  filtered.forEach(feat => {
    const card = document.createElement('div');
    card.className = 'p-3 rounded-xl bg-[#0D0D0D] border border-[#242424] hover:border-[#383838] transition-colors space-y-1';
    card.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="font-medium text-[#F5F5F5] text-xs">${feat.name}</span>
        <span class="text-[9px] px-1.5 py-0.5 rounded-full bg-[#161616] text-[#929292] border border-[#242424] font-mono">Active</span>
      </div>
      <p class="text-[11px] text-[#929292] leading-relaxed">${feat.desc}</p>
    `;
    featuresListContainer.appendChild(card);
  });
}

// Process Image with Rotations, Filters & Thresholding
function getProcessedImageData(imgObj, quality) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const rotation = (imgObj.rotation || 0) % 360;

      if (rotation === 90 || rotation === 270) {
        canvas.width = img.naturalHeight;
        canvas.height = img.naturalWidth;
      } else {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
      }

      // Fill canvas background
      ctx.fillStyle = state.settings.pageBgColor || '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      ctx.restore();

      // Apply Pixel Filters & Document Scanner
      const filter = state.settings.filter;
      const bMul = (state.settings.brightness || 100) / 100;
      const cMul = (state.settings.contrast || 100) / 100;
      const threshold = state.settings.scannerThreshold || 138;

      if (filter !== 'none' || bMul !== 1 || cMul !== 1) {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imgData.data;

        for (let i = 0; i < d.length; i += 4) {
          let r = d[i];
          let g = d[i + 1];
          let b = d[i + 2];

          // Brightness & Contrast adjustment
          if (bMul !== 1) {
            r *= bMul; g *= bMul; b *= bMul;
          }
          if (cMul !== 1) {
            r = ((r - 128) * cMul) + 128;
            g = ((g - 128) * cMul) + 128;
            b = ((b - 128) * cMul) + 128;
          }

          if (filter === 'bw-doc') {
            // High-Contrast Document Scanner
            const gray = (0.299 * r) + (0.587 * g) + (0.114 * b);
            const val = gray > threshold ? 255 : 0;
            d[i] = val; d[i + 1] = val; d[i + 2] = val;
          } else if (filter === 'grayscale') {
            const gray = (0.299 * r) + (0.587 * g) + (0.114 * b);
            d[i] = gray; d[i + 1] = gray; d[i + 2] = gray;
          } else if (filter === 'boost') {
            d[i] = Math.min(255, r * 1.15);
            d[i + 1] = Math.min(255, g * 1.15);
            d[i + 2] = Math.min(255, b * 1.15);
          } else if (filter === 'sepia') {
            d[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
            d[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
            d[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
          } else if (filter === 'invert') {
            d[i] = 255 - r;
            d[i + 1] = 255 - g;
            d[i + 2] = 255 - b;
          } else {
            d[i] = Math.max(0, Math.min(255, r));
            d[i + 1] = Math.max(0, Math.min(255, g));
            d[i + 2] = Math.max(0, Math.min(255, b));
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }

      const finalDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve({
        dataUrl: finalDataUrl,
        width: canvas.width,
        height: canvas.height,
        format: 'JPEG'
      });
    };
    img.src = imgObj.dataUrl;
  });
}

// Core PDF Generation with Multi-Up Grids & Encryption
async function generatePdf(autoDownload = false) {
  if (state.images.length === 0) {
    showToast('Please add at least one image to convert', 'error');
    return;
  }

  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) {
    showToast('jsPDF library failed to load. Please check your internet connection.', 'error');
    return;
  }

  // Lock UI & show progress
  generatePdfBtn.disabled = true;
  generatePdfBtn.classList.add('opacity-75', 'cursor-not-allowed');
  if (directDownloadBtn) {
    directDownloadBtn.disabled = true;
    directDownloadBtn.classList.add('opacity-75', 'cursor-not-allowed');
  }
  if (toolbarPreviewBtn) {
    toolbarPreviewBtn.disabled = true;
    toolbarPreviewBtn.classList.add('opacity-75', 'cursor-not-allowed');
  }
  progressContainer.classList.remove('hidden');
  updateProgress(0, 'Initializing PDF engine...');

  try {
    let pdfDoc = null;
    const gridLayout = state.settings.pageSize === 'fit' ? 1 : (state.settings.gridLayout || 1);
    const imagesPerDocPage = gridLayout; // 1, 2, or 4
    const totalDocPages = Math.ceil(state.images.length / imagesPerDocPage);
    const margin = state.settings.pageSize === 'fit' ? 0 : state.settings.margin;
    const quality = state.settings.quality;

    for (let pageIdx = 0; pageIdx < totalDocPages; pageIdx++) {
      updateProgress(Math.round((pageIdx / totalDocPages) * 100), `Processing page ${pageIdx + 1} of ${totalDocPages}...`);
      await new Promise(r => setTimeout(r, 20));

      const pageImages = state.images.slice(pageIdx * imagesPerDocPage, (pageIdx + 1) * imagesPerDocPage);

      if (state.settings.pageSize === 'fit') {
        // Pure 1:1 Fit (Zero Borders)
        const imgObj = pageImages[0];
        const processedImage = await getProcessedImageData(imgObj, quality);
        const imgW = processedImage.width;
        const imgH = processedImage.height;
        const orientation = imgW >= imgH ? 'l' : 'p';

        if (pageIdx === 0) {
          pdfDoc = new jsPDF({
            orientation: orientation,
            unit: 'px',
            format: [imgW, imgH],
            hotfixes: ['px_scaling'],
            encryption: state.settings.pdfPassword ? {
              userPassword: state.settings.pdfPassword,
              ownerPassword: state.settings.pdfPassword,
              userPermissions: ['print', 'modify', 'copy', 'annot-forms']
            } : undefined
          });
        } else {
          pdfDoc.addPage([imgW, imgH], orientation);
        }

        const actualPageWidth = pdfDoc.internal.pageSize.getWidth();
        const actualPageHeight = pdfDoc.internal.pageSize.getHeight();
        pdfDoc.addImage(processedImage.dataUrl, processedImage.format, 0, 0, actualPageWidth, actualPageHeight);

      } else {
        // Standard Document Paper with Multi-Up Grid Support
        const standard = PAGE_SIZES[state.settings.pageSize] || PAGE_SIZES.a4;
        let pageOrientation = 'p';

        if (state.settings.orientation === 'auto') {
          // If 2-up, landscape is often superior
          pageOrientation = gridLayout === 2 ? 'l' : (pageImages[0].width > pageImages[0].height ? 'l' : 'p');
        } else if (state.settings.orientation === 'landscape') {
          pageOrientation = 'l';
        } else {
          pageOrientation = 'p';
        }

        if (pageIdx === 0) {
          pdfDoc = new jsPDF({
            orientation: pageOrientation,
            unit: 'mm',
            format: state.settings.pageSize,
            encryption: state.settings.pdfPassword ? {
              userPassword: state.settings.pdfPassword,
              ownerPassword: state.settings.pdfPassword,
              userPermissions: ['print', 'modify', 'copy', 'annot-forms']
            } : undefined
          });
        } else {
          pdfDoc.addPage(state.settings.pageSize, pageOrientation);
        }

        const actualPageWidth = pdfDoc.internal.pageSize.getWidth();
        const actualPageHeight = pdfDoc.internal.pageSize.getHeight();

        // Fill background color
        const bgHex = state.settings.pageBgColor || '#ffffff';
        const r = parseInt(bgHex.slice(1, 3), 16) || 255;
        const g = parseInt(bgHex.slice(3, 5), 16) || 255;
        const b = parseInt(bgHex.slice(5, 7), 16) || 255;
        pdfDoc.setFillColor(r, g, b);
        pdfDoc.rect(0, 0, actualPageWidth, actualPageHeight, 'F');

        // Calculate Multi-Up Grid Slots
        const usableW = Math.max(1, actualPageWidth - (margin * 2));
        const usableH = Math.max(1, actualPageHeight - (margin * 2));

        let slots = [];
        if (gridLayout === 1) {
          slots = [{ x: margin, y: margin, w: usableW, h: usableH }];
        } else if (gridLayout === 2) {
          const halfW = (usableW - 4) / 2;
          slots = [
            { x: margin, y: margin, w: halfW, h: usableH },
            { x: margin + halfW + 4, y: margin, w: halfW, h: usableH }
          ];
        } else if (gridLayout === 4) {
          const halfW = (usableW - 4) / 2;
          const halfH = (usableH - 4) / 2;
          slots = [
            { x: margin, y: margin, w: halfW, h: halfH },
            { x: margin + halfW + 4, y: margin, w: halfW, h: halfH },
            { x: margin, y: margin + halfH + 4, w: halfW, h: halfH },
            { x: margin + halfW + 4, y: margin + halfH + 4, w: halfW, h: halfH }
          ];
        }

        // Draw Images into Grid Slots
        for (let slotIdx = 0; slotIdx < pageImages.length; slotIdx++) {
          const imgObj = pageImages[slotIdx];
          const slot = slots[slotIdx];
          const processed = await getProcessedImageData(imgObj, quality);

          let renderW = slot.w;
          let renderH = slot.h;
          let renderX = slot.x;
          let renderY = slot.y;

          if (state.settings.imageFit === 'contain') {
            const ratio = Math.min(slot.w / processed.width, slot.h / processed.height);
            renderW = processed.width * ratio;
            renderH = processed.height * ratio;
            renderX = slot.x + (slot.w - renderW) / 2;
            renderY = slot.y + (slot.h - renderH) / 2;
          }

          pdfDoc.addImage(processed.dataUrl, processed.format, renderX, renderY, renderW, renderH);
        }

        // Optional: Custom Header Text
        if (state.settings.customHeaderText && state.settings.customHeaderText.trim()) {
          pdfDoc.setFontSize(8);
          pdfDoc.setTextColor(148, 163, 184);
          pdfDoc.text(state.settings.customHeaderText.trim(), actualPageWidth / 2, margin > 4 ? margin - 2 : 4, { align: 'center' });
        }

        // Optional: Date Stamp & Page Numbers
        if (state.settings.addDateStamp) {
          pdfDoc.setFontSize(8);
          pdfDoc.setTextColor(148, 163, 184);
          const dateStr = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          pdfDoc.text(dateStr, margin || 6, actualPageHeight - 4);
        }

        if (state.settings.addPageNumbers) {
          pdfDoc.setFontSize(8);
          pdfDoc.setTextColor(148, 163, 184);
          let pageText = `Page ${pageIdx + 1} of ${totalDocPages}`;
          if (state.settings.batesPrefix) {
            const batesNum = String(pageIdx + 1).padStart(4, '0');
            pageText = `${state.settings.batesPrefix}${batesNum} • Page ${pageIdx + 1} of ${totalDocPages}`;
          }
          pdfDoc.text(pageText, actualPageWidth / 2, actualPageHeight - 4, { align: 'center' });
        }
      }

      // Optional: Text Watermark
      if (state.settings.addWatermark && state.settings.watermarkText && state.settings.watermarkText.trim()) {
        const pWidth = pdfDoc.internal.pageSize.getWidth();
        const pHeight = pdfDoc.internal.pageSize.getHeight();
        drawPageWatermark(pdfDoc, pWidth, pHeight, state.settings.watermarkText.trim(), state.settings.watermarkOpacity || 0.20, state.settings.watermarkPattern);
      }

      // Optional: Digital Signature Stamp
      if (state.settings.signatureDataUrl) {
        const pWidth = pdfDoc.internal.pageSize.getWidth();
        const pHeight = pdfDoc.internal.pageSize.getHeight();
        pdfDoc.addImage(state.settings.signatureDataUrl, 'PNG', pWidth - (state.settings.pageSize === 'fit' ? 120 : 40), pHeight - (state.settings.pageSize === 'fit' ? 60 : 25), (state.settings.pageSize === 'fit' ? 100 : 32), (state.settings.pageSize === 'fit' ? 40 : 15));
      }
    }

    // Set Document Metadata
    if (state.settings.metaTitle) pdfDoc.setProperties({ title: state.settings.metaTitle });
    if (state.settings.metaAuthor) pdfDoc.setProperties({ author: state.settings.metaAuthor });
    if (state.settings.metaSubject) pdfDoc.setProperties({ subject: state.settings.metaSubject });
    pdfDoc.setProperties({ creator: 'Zova PDF Workspace (100% Free)' });

    updateProgress(100, 'Finalizing PDF document...');
    await new Promise(r => setTimeout(r, 50));

    const pdfBlob = pdfDoc.output('blob');
    if (state.currentBlobUrl) {
      URL.revokeObjectURL(state.currentBlobUrl);
    }
    state.currentBlobUrl = URL.createObjectURL(pdfBlob);

    const arrayBuffer = await pdfBlob.arrayBuffer();
    if (autoDownload) {
      downloadCurrentPdf();
      showToast('PDF downloaded successfully!', 'success');
    } else {
      await loadThemedPdfPreview(arrayBuffer, totalDocPages, pdfBlob.size);
      showToast('PDF ready! Previewing now...', 'success');
    }

  } catch (err) {
    console.error('PDF generation error:', err);
    showToast('Error generating PDF: ' + err.message, 'error');
  } finally {
    generatePdfBtn.disabled = false;
    generatePdfBtn.classList.remove('opacity-75', 'cursor-not-allowed');
    if (directDownloadBtn) {
      directDownloadBtn.disabled = false;
      directDownloadBtn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
    if (toolbarPreviewBtn) {
      toolbarPreviewBtn.disabled = false;
      toolbarPreviewBtn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
    setTimeout(() => {
      progressContainer.classList.add('hidden');
    }, 800);
  }
}

// Draw Watermarks (Diagonal or Repeating Tile)
function drawPageWatermark(pdfDoc, pageWidth, pageHeight, text, opacity, pattern = 'diagonal') {
  pdfDoc.saveGraphicsState();
  if (pdfDoc.setGState) {
    const gState = new pdfDoc.GState({ opacity: opacity });
    pdfDoc.setGState(gState);
  }
  pdfDoc.setFont('helvetica', 'bold');
  pdfDoc.setTextColor(148, 163, 184);

  if (pattern === 'tile') {
    pdfDoc.setFontSize(16);
    for (let x = 20; x < pageWidth; x += 60) {
      for (let y = 30; y < pageHeight; y += 60) {
        pdfDoc.text(text, x, y, { angle: 30 });
      }
    }
  } else {
    // Single Large Centered Diagonal
    const fontSize = Math.max(18, Math.min(pageWidth, pageHeight) / 8);
    pdfDoc.setFontSize(fontSize);
    pdfDoc.text(text, pageWidth / 2, pageHeight / 2, {
      align: 'center',
      baseline: 'middle',
      angle: 45
    });
  }

  pdfDoc.restoreGraphicsState();
}

// Load PDF into Custom Themed Viewer
if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

async function loadThemedPdfPreview(arrayBuffer, totalPages, byteSize) {
  previewModalSubtext.textContent = `${totalPages} page(s) • ${formatBytes(byteSize)}`;
  previewModal.classList.remove('hidden');

  if (!window.pdfjsLib) {
    console.warn('PDF.js not loaded, skipping canvas preview');
    return;
  }

  try {
    viewerLoadingSpinner.classList.remove('hidden');
    viewer.pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    viewer.totalPages = viewer.pdfDoc.numPages;
    viewer.pageNum = 1;
    viewer.scale = 1.0;

    updateViewerNavUI();
    await renderPdfPage(viewer.pageNum);
  } catch (err) {
    console.error('Themed PDF preview render error:', err);
    showToast('Interactive preview unavailable, but your PDF is ready to download!', 'error');
  } finally {
    viewerLoadingSpinner.classList.add('hidden');
  }
}

async function renderPdfPage(num) {
  if (!viewer.pdfDoc) return;
  if (viewer.isRendering) {
    viewer.pendingPageNum = num;
    return;
  }

  viewer.isRendering = true;
  viewerLoadingSpinner.classList.remove('hidden');

  try {
    const page = await viewer.pdfDoc.getPage(num);
    const viewport = page.getViewport({ scale: viewer.scale });

    pdfCanvas.height = viewport.height;
    pdfCanvas.width = viewport.width;

    const renderContext = {
      canvasContext: pdfCanvas.getContext('2d'),
      viewport: viewport
    };

    await page.render(renderContext).promise;
  } catch (err) {
    console.error('Error rendering PDF page:', err);
  } finally {
    viewer.isRendering = false;
    viewerLoadingSpinner.classList.add('hidden');

    if (viewer.pendingPageNum !== null) {
      const nextNum = viewer.pendingPageNum;
      viewer.pendingPageNum = null;
      renderPdfPage(nextNum);
    }
  }

  updateViewerNavUI();
}

function updateViewerNavUI() {
  if (pageNavIndicator) {
    pageNavIndicator.textContent = `${viewer.pageNum} / ${viewer.totalPages}`;
  }
  if (zoomIndicator) {
    zoomIndicator.textContent = `${Math.round(viewer.scale * 100)}%`;
  }
  if (prevPageBtn) {
    prevPageBtn.disabled = viewer.pageNum <= 1;
  }
  if (nextPageBtn) {
    nextPageBtn.disabled = viewer.pageNum >= viewer.totalPages;
  }
}

function changeViewerPage(delta) {
  const target = viewer.pageNum + delta;
  if (target >= 1 && target <= viewer.totalPages) {
    viewer.pageNum = target;
    renderPdfPage(viewer.pageNum);
  }
}

function changeViewerZoom(delta) {
  const newScale = Math.min(2.5, Math.max(0.4, viewer.scale + delta));
  viewer.scale = Math.round(newScale * 100) / 100;
  renderPdfPage(viewer.pageNum);
}

async function fitViewerToWidth() {
  if (!viewer.pdfDoc) return;
  try {
    const page = await viewer.pdfDoc.getPage(viewer.pageNum);
    const viewport = page.getViewport({ scale: 1.0 });
    const containerWidth = Math.max(300, pdfViewerContainer.clientWidth - 80);
    const newScale = Math.min(2.0, Math.max(0.35, containerWidth / viewport.width));
    viewer.scale = Math.round(newScale * 100) / 100;
    renderPdfPage(viewer.pageNum);
  } catch (err) {
    console.error('Fit width error:', err);
  }
}

function updateProgress(percent, status) {
  progressBar.style.width = `${percent}%`;
  progressPercent.textContent = `${percent}%`;
  progressStatus.textContent = status;
}

function downloadCurrentPdf() {
  if (!state.currentBlobUrl) return;
  const fileName = (state.settings.fileName.trim() || 'zova-pdf-document') + '.pdf';
  const a = document.createElement('a');
  a.href = state.currentBlobUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast(`Downloading "${fileName}"...`, 'success');
}

function closePdfModal() {
  previewModal.classList.add('hidden');
  if (viewer.pdfDoc) {
    viewer.pdfDoc.destroy();
    viewer.pdfDoc = null;
  }
  const ctx = pdfCanvas.getContext('2d');
  ctx.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);
}

// Toast Notifications
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  
  let typeStyles = 'bg-[#111111] text-[#F5F5F5] border-[#242424]';
  let iconName = 'info';

  if (type === 'success') {
    typeStyles = 'bg-[#0D1510] text-[#A7F3D0] border-[#065F46]';
    iconName = 'check-circle';
  } else if (type === 'error') {
    typeStyles = 'bg-[#180A0A] text-[#FECACA] border-[#991B1B]';
    iconName = 'alert-triangle';
  }

  toast.className = `pointer-events-auto flex items-center space-x-2.5 px-4 py-3 rounded-xl border shadow-xl text-xs font-medium toast-slide-in ${typeStyles}`;
  toast.innerHTML = `
    <i data-lucide="${iconName}" class="w-4 h-4 flex-shrink-0"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.classList.remove('toast-slide-in');
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
