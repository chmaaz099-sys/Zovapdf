/**
 * Zenvixa PDF - 100% Free Client-Side Image to PDF Converter
 */

// Application State
const state = {
  images: [], // Array of { id, file, name, size, type, dataUrl, width, height, rotation }
  settings: {
    pageSize: 'fit', // Pure image conversion: exact image size, zero borders
    orientation: 'auto',
    margin: 0, // No borders by default
    imageFit: 'contain',
    quality: 0.9,
    addPageNumbers: false,
    fileName: 'converted-document',
    pageBgColor: '#ffffff',
    filter: 'none',
    addWatermark: false,
    watermarkText: 'CONFIDENTIAL',
    watermarkOpacity: 0.25
  },
  currentBlobUrl: null,
  sortableInstance: null
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
  legal: { width: 215.9, height: 355.6 }
};

// DOM Elements
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const workspaceSection = document.getElementById('workspaceSection');
const imagesGrid = document.getElementById('imagesGrid');
const fileCountBadge = document.getElementById('fileCountBadge');
const totalSizeBadge = document.getElementById('totalSizeBadge');
const addMoreBtn = document.getElementById('addMoreBtn');
const sortAzBtn = document.getElementById('sortAzBtn');
const reverseBtn = document.getElementById('reverseBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const rotateAllBtn = document.getElementById('rotateAllBtn');
const generatePdfBtn = document.getElementById('generatePdfBtn');
const generateBtnText = document.getElementById('generateBtnText');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const progressPercent = document.getElementById('progressPercent');
const progressStatus = document.getElementById('progressStatus');
const pageSizeSelect = document.getElementById('pageSizeSelect');
const imageFitSelect = document.getElementById('imageFitSelect');
const qualitySelect = document.getElementById('qualitySelect');
const qualityLabel = document.getElementById('qualityLabel');
const addPageNumbers = document.getElementById('addPageNumbers');
const filterSelect = document.getElementById('filterSelect');
const addWatermark = document.getElementById('addWatermark');
const watermarkControls = document.getElementById('watermarkControls');
const watermarkText = document.getElementById('watermarkText');
const watermarkOpacity = document.getElementById('watermarkOpacity');
const pdfFileName = document.getElementById('pdfFileName');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const customBgColorPicker = document.getElementById('customBgColorPicker');

// What's New / Changelog Modal DOM Elements
const changelogBtn = document.getElementById('changelogBtn');
const changelogModal = document.getElementById('changelogModal');
const closeChangelogBtn = document.getElementById('closeChangelogBtn');
const dismissChangelogBtn = document.getElementById('dismissChangelogBtn');

// Themed Preview Modal DOM Elements
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

// New Preview & Action DOM Elements
const toolbarPreviewBtn = document.getElementById('toolbarPreviewBtn');
const directDownloadBtn = document.getElementById('directDownloadBtn');

// Image Lightbox Modal DOM Elements
const imageLightboxModal = document.getElementById('imageLightboxModal');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxMeta = document.getElementById('lightboxMeta');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxRotateBtn = document.getElementById('lightboxRotateBtn');
const closeLightboxBtn = document.getElementById('closeLightboxBtn');
let activeLightboxImg = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSortable();
  initEventListeners();
  lucide.createIcons();
});

// Setup SortableJS for Drag-and-Drop Reordering
function initSortable() {
  state.sortableInstance = new Sortable(imagesGrid, {
    animation: 180,
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    onEnd: () => {
      // Reorder state.images array based on new DOM order
      const newImages = [];
      const cards = imagesGrid.querySelectorAll('.image-card');
      cards.forEach(card => {
        const id = card.dataset.id;
        const imgObj = state.images.find(img => img.id === id);
        if (imgObj) newImages.push(imgObj);
      });
      state.images = newImages;
      updatePageBadges();
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
      fileInput.value = ''; // Reset input
    }
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('drag-active');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('drag-active');
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

  // Clear All & Rotate All
  clearAllBtn.addEventListener('click', () => {
    if (state.images.length === 0) return;
    if (confirm('Are you sure you want to remove all images?')) {
      state.images = [];
      renderImages();
      showToast('All images removed', 'info');
    }
  });

  rotateAllBtn.addEventListener('click', () => {
    state.images.forEach(img => {
      img.rotation = (img.rotation + 90) % 360;
    });
    renderImages();
    showToast('Rotated all images 90°', 'info');
  });

  // Page Size Selector
  pageSizeSelect.addEventListener('change', (e) => {
    state.settings.pageSize = e.target.value;
    const orientationContainer = document.getElementById('orientationContainer');
    const marginContainer = document.getElementById('marginContainer');
    const imageFitContainer = document.getElementById('imageFitContainer');
    const pageBgContainer = document.getElementById('pageBgContainer');
    const fitExplanation = document.getElementById('fitExplanation');

    if (state.settings.pageSize === 'fit') {
      if (orientationContainer) orientationContainer.classList.add('hidden');
      if (marginContainer) marginContainer.classList.add('hidden');
      if (imageFitContainer) imageFitContainer.classList.add('hidden');
      if (pageBgContainer) pageBgContainer.classList.add('hidden');
      if (fitExplanation) fitExplanation.classList.remove('hidden');
      state.settings.margin = 0;
    } else {
      if (orientationContainer) orientationContainer.classList.remove('hidden');
      if (marginContainer) marginContainer.classList.remove('hidden');
      if (imageFitContainer) imageFitContainer.classList.remove('hidden');
      if (pageBgContainer) pageBgContainer.classList.remove('hidden');
      if (fitExplanation) fitExplanation.classList.add('hidden');
    }
  });

  // Orientation Selector Buttons
  document.querySelectorAll('.orientation-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.orientation-btn').forEach(b => {
        b.classList.remove('active', 'border-brand-500', 'bg-brand-500/10', 'text-brand-300');
        b.classList.add('border-slate-700', 'bg-slate-900', 'text-slate-300');
      });
      btn.classList.add('active', 'border-brand-500', 'bg-brand-500/10', 'text-brand-300');
      btn.classList.remove('border-slate-700', 'bg-slate-900', 'text-slate-300');
      state.settings.orientation = btn.dataset.orientation;
    });
  });

  // Margin Selector Buttons
  document.querySelectorAll('.margin-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.margin-btn').forEach(b => {
        b.classList.remove('active', 'border-brand-500', 'bg-brand-500/10', 'text-brand-300');
        b.classList.add('border-slate-700', 'bg-slate-900', 'text-slate-300');
      });
      btn.classList.add('active', 'border-brand-500', 'bg-brand-500/10', 'text-brand-300');
      btn.classList.remove('border-slate-700', 'bg-slate-900', 'text-slate-300');
      state.settings.margin = parseInt(btn.dataset.margin, 10);
    });
  });

  // Image Fit Selector
  imageFitSelect.addEventListener('change', (e) => {
    state.settings.imageFit = e.target.value;
  });

  // Background Color Selector Buttons
  document.querySelectorAll('.bg-color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.bg-color-btn').forEach(b => {
        b.classList.remove('active', 'border-brand-500', 'bg-brand-500/10', 'text-brand-300');
        b.classList.add('border-slate-700', 'bg-slate-900', 'text-slate-300');
      });
      btn.classList.add('active', 'border-brand-500', 'bg-brand-500/10', 'text-brand-300');
      btn.classList.remove('border-slate-700', 'bg-slate-900', 'text-slate-300');
      state.settings.pageBgColor = btn.dataset.bg;
      if (customBgColorPicker) customBgColorPicker.value = btn.dataset.bg;
    });
  });

  if (customBgColorPicker) {
    customBgColorPicker.addEventListener('input', (e) => {
      state.settings.pageBgColor = e.target.value;
      document.querySelectorAll('.bg-color-btn').forEach(b => {
        b.classList.remove('active', 'border-brand-500', 'bg-brand-500/10', 'text-brand-300');
        b.classList.add('border-slate-700', 'bg-slate-900', 'text-slate-300');
      });
    });
  }

  // Sort Actions
  if (sortAzBtn) {
    sortAzBtn.addEventListener('click', () => {
      state.images.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
      renderImages();
      showToast('Images sorted A-Z by name', 'info');
    });
  }

  if (reverseBtn) {
    reverseBtn.addEventListener('click', () => {
      state.images.reverse();
      renderImages();
      showToast('Image order reversed', 'info');
    });
  }

  // Filter Selector
  if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
      state.settings.filter = e.target.value;
      const filterNames = {
        'none': 'Natural colors',
        'bw-doc': 'B&W Document Scanner',
        'grayscale': 'Grayscale',
        'boost': 'Vibrant Contrast'
      };
      showToast(`Filter: ${filterNames[state.settings.filter] || state.settings.filter}`, 'info');
    });
  }

  // Watermark Options
  if (addWatermark) {
    addWatermark.addEventListener('change', (e) => {
      state.settings.addWatermark = e.target.checked;
      if (watermarkControls) {
        if (state.settings.addWatermark) {
          watermarkControls.classList.remove('hidden');
        } else {
          watermarkControls.classList.add('hidden');
        }
      }
    });
  }

  if (watermarkText) {
    watermarkText.addEventListener('input', (e) => {
      state.settings.watermarkText = e.target.value;
    });
  }

  if (watermarkOpacity) {
    watermarkOpacity.addEventListener('change', (e) => {
      state.settings.watermarkOpacity = parseFloat(e.target.value);
    });
  }

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

  // Quality Selector
  qualitySelect.addEventListener('change', (e) => {
    state.settings.quality = parseFloat(e.target.value);
    const selectedOption = e.target.options[e.target.selectedIndex].text;
    qualityLabel.textContent = selectedOption.split('(')[1] ? selectedOption.split('(')[1].replace(')', '') : selectedOption;
  });

  // Page Numbers
  addPageNumbers.addEventListener('change', (e) => {
    state.settings.addPageNumbers = e.target.checked;
  });

  // Filename Input
  pdfFileName.addEventListener('input', (e) => {
    state.settings.fileName = e.target.value.trim() || 'converted-document';
  });

  // Generate & Preview PDF Actions
  generatePdfBtn.addEventListener('click', () => generatePdf(false));
  if (toolbarPreviewBtn) {
    toolbarPreviewBtn.addEventListener('click', () => generatePdf(false));
  }
  if (directDownloadBtn) {
    directDownloadBtn.addEventListener('click', () => generatePdf(true));
  }

  // Lightbox Modal Actions
  if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeImageLightbox);
  if (lightboxRotateBtn) lightboxRotateBtn.addEventListener('click', rotateLightboxImage);
  if (imageLightboxModal) {
    imageLightboxModal.addEventListener('click', (e) => {
      if (e.target === imageLightboxModal) closeImageLightbox();
    });
  }

  // Themed Modal Actions
  modalCloseBtn.addEventListener('click', closeModal);
  previewModal.addEventListener('click', (e) => {
    if (e.target === previewModal) closeModal();
  });
  modalDownloadBtn.addEventListener('click', downloadCurrentPdf);

  // Themed Viewer Navigation & Zoom Buttons
  prevPageBtn.addEventListener('click', () => changeViewerPage(-1));
  nextPageBtn.addEventListener('click', () => changeViewerPage(1));
  zoomOutBtn.addEventListener('click', () => changeViewerZoom(-0.15));
  zoomInBtn.addEventListener('click', () => changeViewerZoom(0.15));
  fitWidthBtn.addEventListener('click', fitViewerToWidth);

  // Keyboard navigation when modal is open
  window.addEventListener('keydown', (e) => {
    if (previewModal && !previewModal.classList.contains('hidden')) {
      if (e.key === 'ArrowLeft') changeViewerPage(-1);
      else if (e.key === 'ArrowRight') changeViewerPage(1);
      else if (e.key === 'Escape') closeModal();
      else if (e.key === '+' || e.key === '=') changeViewerZoom(0.15);
      else if (e.key === '-') changeViewerZoom(-0.15);
    } else if (imageLightboxModal && !imageLightboxModal.classList.contains('hidden')) {
      if (e.key === 'Escape') closeImageLightbox();
      else if (e.key === 'r' || e.key === 'R') rotateLightboxImage();
    } else if (changelogModal && !changelogModal.classList.contains('hidden')) {
      if (e.key === 'Escape') closeChangelog();
    }
  });

  // Theme Toggle
  themeToggleBtn.addEventListener('click', toggleTheme);
}

// Process Files
async function handleFiles(files) {
  const imageFiles = files.filter(file => file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|svg|bmp|heic|heif)$/i.test(file.name));
  
  if (imageFiles.length === 0) {
    showToast('Please select valid image files (PNG, JPG, WebP, SVG, etc.)', 'error');
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

// Render Image Cards in Gallery
function renderImages() {
  if (state.images.length === 0) {
    workspaceSection.classList.add('hidden');
    return;
  }

  workspaceSection.classList.remove('hidden');
  fileCountBadge.textContent = `${state.images.length} ${state.images.length === 1 ? 'image' : 'images'}`;
  
  const totalSize = state.images.reduce((acc, img) => acc + img.size, 0);
  totalSizeBadge.textContent = `(~${formatBytes(totalSize)} total)`;
  generateBtnText.textContent = `Convert ${state.images.length} ${state.images.length === 1 ? 'Image' : 'Images'} to PDF`;

  imagesGrid.innerHTML = '';

  state.images.forEach((img, index) => {
    const card = document.createElement('div');
    card.className = 'image-card group';
    card.dataset.id = img.id;

    card.innerHTML = `
      <!-- Page Badge -->
      <div class="absolute top-2 left-2 z-10 bg-slate-900/80 backdrop-blur-md text-slate-200 text-[11px] font-bold px-2 py-0.5 rounded-md border border-slate-700/60 shadow page-badge">
        Page ${index + 1}
      </div>

      <!-- Quick Action Controls (top right) -->
      <div class="absolute top-2 right-2 z-10 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button class="btn-inspect p-1.5 rounded-md bg-slate-900/85 hover:bg-brand-600 text-white shadow border border-slate-700 hover:border-brand-500 transition-colors" title="Inspect Full Image">
          <i data-lucide="eye" class="w-3.5 h-3.5"></i>
        </button>
        <button class="btn-rotate p-1.5 rounded-md bg-slate-900/85 hover:bg-brand-600 text-white shadow border border-slate-700 hover:border-brand-500 transition-colors" title="Rotate 90°">
          <i data-lucide="rotate-cw" class="w-3.5 h-3.5"></i>
        </button>
        <button class="btn-delete p-1.5 rounded-md bg-slate-900/85 hover:bg-red-600 text-white shadow border border-slate-700 hover:border-red-500 transition-colors" title="Remove">
          <i data-lucide="trash" class="w-3.5 h-3.5"></i>
        </button>
      </div>

      <!-- Drag Handle Icon overlay -->
      <div class="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity">
        <i data-lucide="move" class="w-8 h-8 text-white drop-shadow"></i>
      </div>

      <!-- Thumbnail Preview (clickable for lightbox) -->
      <div class="thumbnail-container cursor-pointer" title="Click to preview full-size">
        <img src="${img.dataUrl}" alt="${img.name}" style="transform: rotate(${img.rotation}deg);" loading="lazy">
      </div>

      <!-- Meta Info Footer -->
      <div class="p-2.5 bg-slate-800/90 border-t border-slate-700/50">
        <p class="text-xs font-medium text-slate-200 truncate" title="${img.name}">${img.name}</p>
        <div class="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
          <span>${img.rotation % 180 !== 0 ? `${img.height}×${img.width}` : `${img.width}×${img.height}`}</span>
          <span>${formatBytes(img.size)}</span>
        </div>
      </div>
    `;

    // Click thumbnail or inspect button to open full lightbox preview
    card.querySelector('.thumbnail-container').addEventListener('click', (e) => {
      e.stopPropagation();
      openImageLightbox(img);
    });

    card.querySelector('.btn-inspect').addEventListener('click', (e) => {
      e.stopPropagation();
      openImageLightbox(img);
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
  // Sync thumbnail on the workspace card
  const card = imagesGrid.querySelector(`[data-id="${activeLightboxImg.id}"]`);
  if (card) {
    const cardImg = card.querySelector('img');
    if (cardImg) cardImg.style.transform = `rotate(${activeLightboxImg.rotation}deg)`;
    const metaSpan = card.querySelector('.font-mono span:first-child');
    if (metaSpan) metaSpan.textContent = activeLightboxImg.rotation % 180 !== 0 ? `${activeLightboxImg.height}×${activeLightboxImg.width}` : `${activeLightboxImg.width}×${activeLightboxImg.height}`;
  }
}

// Generate Rotated Canvas Image for PDF insertion
function getRotatedImageData(imgObj, quality) {
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

      // Fill with selected background color (handles transparent PNGs seamlessly)
      ctx.fillStyle = state.settings.pageBgColor || '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      if (rotation === 90) {
        ctx.translate(canvas.width, 0);
        ctx.rotate((90 * Math.PI) / 180);
      } else if (rotation === 180) {
        ctx.translate(canvas.width, canvas.height);
        ctx.rotate((180 * Math.PI) / 180);
      } else if (rotation === 270) {
        ctx.translate(0, canvas.height);
        ctx.rotate((270 * Math.PI) / 180);
      }

      ctx.drawImage(img, 0, 0);
      ctx.restore();

      // Apply selected color or document filter
      applyImageFilter(ctx, canvas, state.settings.filter);

      // Export as JPEG with chosen quality
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

// Core PDF Generation using jsPDF
async function generatePdf(autoDownload = false) {
  if (state.images.length === 0) {
    showToast('Please add at least one image to convert', 'error');
    return;
  }

  // Check jsPDF availability
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) {
    showToast('jsPDF library failed to load. Please check your internet connection.', 'error');
    return;
  }

  // Lock UI and show progress
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
    const totalPages = state.images.length;
    const margin = state.settings.pageSize === 'fit' ? 0 : state.settings.margin;
    const quality = state.settings.quality;

    for (let i = 0; i < totalPages; i++) {
      const imgObj = state.images[i];
      updateProgress(Math.round(((i) / totalPages) * 100), `Processing page ${i + 1} of ${totalPages}...`);
      
      // Allow browser to repaint progress
      await new Promise(r => setTimeout(r, 20));

      const processedImage = await getRotatedImageData(imgObj, quality);
      const imgWidthPx = processedImage.width;
      const imgHeightPx = processedImage.height;

      let pageOrientation = 'p'; // portrait
      let pageWidth = 0;
      let pageHeight = 0;

      if (state.settings.pageSize === 'fit') {
        // Pure image conversion: Page size is identical to image dimensions (ZERO BORDERS)
        const orientation = imgWidthPx >= imgHeightPx ? 'l' : 'p';
        if (i === 0) {
          pdfDoc = new jsPDF({
            orientation: orientation,
            unit: 'px',
            format: [imgWidthPx, imgHeightPx],
            hotfixes: ['px_scaling']
          });
        } else {
          pdfDoc.addPage([imgWidthPx, imgHeightPx], orientation);
        }

        const actualPageWidth = pdfDoc.internal.pageSize.getWidth();
        const actualPageHeight = pdfDoc.internal.pageSize.getHeight();

        // Full bleed 100% direct image placement with 0 borders
        pdfDoc.addImage(processedImage.dataUrl, processedImage.format, 0, 0, actualPageWidth, actualPageHeight);
      } else {
        // Standard document paper (A4, Letter, A3, Legal)
        const standard = PAGE_SIZES[state.settings.pageSize] || PAGE_SIZES.a4;
        let pageOrientation = 'p';
        if (state.settings.orientation === 'auto') {
          pageOrientation = imgWidthPx > imgHeightPx ? 'l' : 'p';
        } else if (state.settings.orientation === 'landscape') {
          pageOrientation = 'l';
        } else {
          pageOrientation = 'p';
        }

        const pageWidth = pageOrientation === 'l' ? standard.height : standard.width;
        const pageHeight = pageOrientation === 'l' ? standard.width : standard.height;

        if (i === 0) {
          pdfDoc = new jsPDF({
            orientation: pageOrientation,
            unit: 'mm',
            format: state.settings.pageSize
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

        // Calculate Image Placement within Usable Area
        const usableW = Math.max(1, actualPageWidth - (margin * 2));
        const usableH = Math.max(1, actualPageHeight - (margin * 2));

        let renderW = usableW;
        let renderH = usableH;
        let renderX = margin;
        let renderY = margin;

        if (state.settings.imageFit === 'contain') {
          const ratio = Math.min(usableW / imgWidthPx, usableH / imgHeightPx);
          renderW = imgWidthPx * ratio;
          renderH = imgHeightPx * ratio;
          renderX = margin + (usableW - renderW) / 2;
          renderY = margin + (usableH - renderH) / 2;
        }

        pdfDoc.addImage(processedImage.dataUrl, processedImage.format, renderX, renderY, renderW, renderH);

        // Optional: Add Page Numbering with adaptive contrast
        if (state.settings.addPageNumbers) {
          pdfDoc.setFontSize(9);
          const isDark = ((r * 299) + (g * 587) + (b * 114)) / 1000 < 128;
          if (isDark) {
            pdfDoc.setTextColor(203, 213, 225); // Slate 300
          } else {
            pdfDoc.setTextColor(100, 116, 139); // Slate 500
          }
          const pageText = `Page ${i + 1} of ${totalPages}`;
          pdfDoc.text(pageText, actualPageWidth / 2, actualPageHeight - 4, { align: 'center' });
        }
      }

      // Optional: Add Text Watermark across the page
      if (state.settings.addWatermark && state.settings.watermarkText && state.settings.watermarkText.trim()) {
        const pWidth = pdfDoc.internal.pageSize.getWidth();
        const pHeight = pdfDoc.internal.pageSize.getHeight();
        drawPageWatermark(pdfDoc, pWidth, pHeight, state.settings.watermarkText.trim(), state.settings.watermarkOpacity || 0.25);
      }
    }

    updateProgress(100, 'Finalizing PDF...');
    await new Promise(r => setTimeout(r, 50));

    // Create Blob URL for preview and download
    const pdfBlob = pdfDoc.output('blob');
    if (state.currentBlobUrl) {
      URL.revokeObjectURL(state.currentBlobUrl);
    }
    state.currentBlobUrl = URL.createObjectURL(pdfBlob);

    // Render or Download
    const arrayBuffer = await pdfBlob.arrayBuffer();
    if (autoDownload) {
      downloadCurrentPdf();
      showToast('PDF downloaded successfully!', 'success');
    } else {
      await loadThemedPdfPreview(arrayBuffer, totalPages, pdfBlob.size);
      showToast('PDF ready! Previewing now...', 'success');
    }
  } catch (err) {
    console.error('PDF generation error:', err);
    showToast('An error occurred while generating the PDF: ' + err.message, 'error');
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
    }, 1000);
  }
}

// Setup PDF.js worker if available
if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

// Load PDF into Custom Themed Viewer
async function loadThemedPdfPreview(arrayBuffer, totalPages, byteSize) {
  previewModalSubtext.textContent = `${totalPages} page(s) &bull; ${formatBytes(byteSize)}`;
  previewModal.classList.remove('hidden');

  if (!window.pdfjsLib) {
    console.warn('PDF.js not loaded, cannot render canvas preview');
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

// Render specific PDF page on canvas
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

// Update Page Navigation & Zoom UI
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

// Navigation Handlers
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

// Progress Bar Helper
function updateProgress(percent, status) {
  progressBar.style.width = `${percent}%`;
  progressPercent.textContent = `${percent}%`;
  progressStatus.textContent = status;
}

// Download Trigger
function downloadCurrentPdf() {
  if (!state.currentBlobUrl) return;
  const fileName = (state.settings.fileName.trim() || 'converted-document') + '.pdf';
  const a = document.createElement('a');
  a.href = state.currentBlobUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast(`Downloading "${fileName}"...`, 'success');
}

// Close Modal
function closeModal() {
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
  
  let typeStyles = 'bg-slate-800 text-slate-100 border-slate-700';
  let iconName = 'info';

  if (type === 'success') {
    typeStyles = 'bg-emerald-950/90 text-emerald-200 border-emerald-800/80';
    iconName = 'check-circle';
  } else if (type === 'error') {
    typeStyles = 'bg-red-950/90 text-red-200 border-red-800/80';
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
    toast.classList.add('toast-slide-out');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 200);
  }, 3500);
}

// Theme Handlers
function initTheme() {
  const savedTheme = localStorage.getItem('zenvixa_theme') || localStorage.getItem('snappdf_theme');
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    // Default to white (light mode)
    document.documentElement.classList.remove('dark');
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  if (isDark) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('zenvixa_theme', 'light');
  } else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('zenvixa_theme', 'dark');
  }
  lucide.createIcons();
}

// Apply Pixel / Color Filters to Canvas
function applyImageFilter(ctx, canvas, filterType) {
  if (!filterType || filterType === 'none') return;

  try {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imgData.data;

    if (filterType === 'bw-doc') {
      // Document scanner: High-contrast thresholding for paper, receipts, and notes
      for (let i = 0; i < d.length; i += 4) {
        const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        const val = gray > 138 ? 255 : (gray < 85 ? 0 : (gray - 85) * 4.8);
        d[i] = val;
        d[i + 1] = val;
        d[i + 2] = val;
      }
    } else if (filterType === 'grayscale') {
      // Clean monochrome
      for (let i = 0; i < d.length; i += 4) {
        const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        d[i] = gray;
        d[i + 1] = gray;
        d[i + 2] = gray;
      }
    } else if (filterType === 'boost') {
      // Enhanced dynamic contrast
      for (let i = 0; i < d.length; i += 4) {
        d[i] = Math.min(255, Math.max(0, (d[i] - 128) * 1.25 + 138));
        d[i + 1] = Math.min(255, Math.max(0, (d[i + 1] - 128) * 1.25 + 138));
        d[i + 2] = Math.min(255, Math.max(0, (d[i + 2] - 128) * 1.25 + 138));
      }
    }

    ctx.putImageData(imgData, 0, 0);
  } catch (err) {
    console.error('Filter application error:', err);
  }
}

// Draw Semi-Transparent Diagonal Watermark on PDF Page
function drawPageWatermark(pdfDoc, pageWidth, pageHeight, text, opacity) {
  try {
    pdfDoc.saveGraphicsState();
    if (pdfDoc.setGState && typeof pdfDoc.GState === 'function') {
      pdfDoc.setGState(new pdfDoc.GState({ opacity: opacity }));
    }
    const fontSize = Math.max(14, Math.min(pageWidth, pageHeight) / 9);
    pdfDoc.setFontSize(fontSize);
    pdfDoc.setTextColor(150, 155, 165);
    pdfDoc.text(text, pageWidth / 2, pageHeight / 2, {
      align: 'center',
      angle: 45
    });
    pdfDoc.restoreGraphicsState();
  } catch (err) {
    console.error('Watermark error:', err);
  }
}
