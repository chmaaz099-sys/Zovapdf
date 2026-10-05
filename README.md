<div align="center">
  <img src="logo.png" width="160" alt="Zenvixa PDF Logo">
  <h1>Zenvixa PDF - 100% Free Image to PDF Converter</h1>
  <p>A modern, fast, private, and zero-cost web application to convert images into polished PDF documents completely in your web browser.</p>
</div>

---

## 🌟 Key Highlights

- **100% Free & Unlimited**: No subscriptions, no credits, no daily limits, and no watermarks.
- **100% Client-Side Privacy**: Files are processed in your browser memory using HTML5 Canvas and `jsPDF`. No image is ever uploaded to an external server or cloud database.
- **Drag & Drop Reordering**: Rearrange pages visually before converting (powered by `SortableJS`).
- **Rotation Controls**: Rotate images 90° clockwise or counter-clockwise individually or all at once.
- **Flexible Page Formats**: Standard A4, US Letter, A3, Legal, or "Fit to Image" (which sets each page's size to the exact image dimensions).
- **Auto Orientation**: Detects portrait vs. landscape images automatically.
- **Adjustable Margins & Layout**: Choose margin widths (0mm, 5mm, 12mm, 20mm) and whether images should fit or fill.
- **Quality & Compression Options**: Choose between Lossless (Original), High (90%), Balanced (75%), and Compact (50%) to shrink PDF size.
- **Clipboard Support**: Simply press `Ctrl + V` anywhere on the page to paste images directly from your clipboard!
- **Dark & Light Mode**: Clean, sleek interface designed for ease of use.

---

## 🚀 How to Run Locally

You don't need Node.js or any complex server to use Zenvixa PDF.

### Option 1: Direct Browser Open (Fastest)
Simply double-click `index.html` in your file explorer to open it in Chrome, Edge, Firefox, or Safari.

### Option 2: Run with a Local Static Server
If you have Python or Node installed, you can launch a local server:

**Using Python:**
```bash
python -m http.server 3000
```
Then visit `http://localhost:3000` in your browser.

**Using Node / npx:**
```bash
npx serve .
```

---

## 🌐 How to Host for Free (Zero Server Cost)

Because Zenvixa PDF is a pure static web app (HTML + CSS + JS), it can be deployed to any free web hosting service in seconds:

1. **GitHub Pages (100% Free)**:
   - Push this directory to a GitHub repository.
   - Go to **Settings > Pages**.
   - Set Branch to `main` and folder to `/ (root)`.
   - Save. Your website will be live at `https://<your-username>.github.io/<repo-name>/`.

2. **Netlify Drop**:
   - Go to [app.netlify.com/drop](https://app.netlify.com/drop).
   - Drag & drop this entire folder.
   - You get a free `.netlify.app` link instantly.

3. **Vercel**:
   - Install Vercel CLI (`npm i -g vercel`) and run `vercel` in this folder, or import the GitHub repo on [vercel.com](https://vercel.com).
