# Artifact Display Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Claude.ai-style artifact display to chat interface with side panel for code, documents, and charts.

**Architecture:** Three-column grid layout with toggleable side panel. Vanilla JS with template rendering for artifact content. Prism.js for code highlighting, Chart.js for visualizations, Marked.js for markdown documents.

**Tech Stack:** HTML5, CSS3 (Grid/Flexbox), Vanilla JavaScript, Prism.js, Chart.js, Marked.js (all via CDN)

---

## Task 1: Add Library Dependencies to HTML

**Files:**
- Modify: `detail-chat.html:1-10` (head section)

**Step 1: Add CDN links for all libraries**

Add these script and link tags in the `<head>` section after the existing `<link rel="stylesheet" href="styles.css">`:

```html
    <link rel="stylesheet" href="styles.css">

    <!-- Prism.js - Code Syntax Highlighting -->
    <link href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/line-numbers/prism-line-numbers.min.css" rel="stylesheet">

    <!-- Chart.js - Data Visualization -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

    <!-- Marked.js - Markdown Rendering -->
    <script src="https://cdn.jsdelivr.net/npm/marked@11.0.0/marked.min.js"></script>

    <!-- Prism.js Core and Components -->
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js" data-manual></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-python.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-javascript.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-markup.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-css.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-json.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/line-numbers/prism-line-numbers.min.js"></script>
```

**Step 2: Verify libraries loaded**

Open `detail-chat.html` in browser and check console:
```javascript
console.log('Prism:', typeof Prism);     // Should output "object"
console.log('Chart:', typeof Chart);     // Should output "function"
console.log('marked:', typeof marked);   // Should output "function"
```

Expected: All three log "object" or "function" (not "undefined")

**Step 3: Commit**

```bash
git add detail-chat.html
git commit -m "feat: add CDN dependencies for Prism.js, Chart.js, and Marked.js"
```

---

## Task 2: Add Artifact Panel HTML Structure

**Files:**
- Modify: `detail-chat.html:300` (before closing `</body>`)

**Step 1: Add artifact panel markup**

Add this HTML just before the closing `</div>` of `.main-content` (around line 300, before `<script src="app.js"></script>`):

```html
    </div> <!-- End of .chat-input-container -->

    <!-- Artifact Panel -->
    <div class="artifact-panel" id="artifact-panel">
      <div class="artifact-panel-header">
        <div class="header-left">
          <button class="artifact-list-btn" id="artifact-list-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
            <span class="artifact-count">Artifacts (0)</span>
          </button>
        </div>
        <div class="header-right">
          <button class="copy-artifact-btn" id="copy-artifact-btn" title="Copy content">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
          <button class="close-panel-btn" id="close-panel-btn" title="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- Artifact List Dropdown -->
      <div class="artifact-list-dropdown" id="artifact-list-dropdown">
        <div class="artifact-list-empty">
          No artifacts yet
        </div>
      </div>

      <!-- Content Area -->
      <div class="artifact-content-area" id="artifact-content-area">
        <div class="artifact-empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            <polyline points="13 2 13 9 20 9"></polyline>
          </svg>
          <p>Select an artifact to view</p>
        </div>
      </div>
    </div>

  </div> <!-- End of .main-content -->
```

**Step 2: Verify HTML structure**

Open `detail-chat.html` in browser and inspect element. Check that:
- `.artifact-panel` exists in DOM
- Header buttons are visible
- Empty state message shows

**Step 3: Commit**

```bash
git add detail-chat.html
git commit -m "feat: add artifact panel HTML structure"
```

---

## Task 3: Add Sample Artifact Thumbnails to Messages

**Files:**
- Modify: `detail-chat.html:250` (last message in chat)

**Step 1: Add artifact thumbnail to last agent message**

Find the last agent message (around line 252, the one with financial analysis). Add this HTML just before the closing `</div>` of `.message-bubble`:

```html
                        </div>

                        <!-- Artifact Thumbnail -->
                        <div class="artifact-thumbnail" data-artifact-id="artifact-001" data-artifact-type="document">
                          <div class="thumbnail-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                          </div>
                          <div class="thumbnail-info">
                            <span class="thumbnail-title">Financial Analysis Report Q3 2024</span>
                            <span class="thumbnail-meta">Document • 1,240 words</span>
                          </div>
                          <button class="thumbnail-open-btn">Open</button>
                        </div>

                        <div class="message-actions">
```

**Step 2: Add data attribute to parent message**

Find the parent `.message` div for this agent message and add `data-artifact-id`:

```html
<div class="message" data-artifact-id="artifact-001">
```

**Step 3: Verify thumbnail appears**

Open `detail-chat.html` in browser. Check that:
- Thumbnail card appears after message text
- Title and metadata visible
- "Open" button present

**Step 4: Commit**

```bash
git add detail-chat.html
git commit -m "feat: add artifact thumbnail to sample message"
```

---

## Task 4: Add Artifact Panel CSS

**Files:**
- Modify: `styles.css:1318` (end of file)

**Step 1: Add artifact panel base styles**

Append these styles to the end of `styles.css`:

```css

/* ============================================
   ARTIFACT PANEL STYLES
   ============================================ */

/* Panel Container */
.artifact-panel {
  position: fixed;
  top: 0;
  right: -500px;
  width: 500px;
  height: 100vh;
  background: var(--background-white);
  border-left: 1px solid var(--border-color);
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
  transition: right 300ms ease-out;
  z-index: 100;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.artifact-panel.open {
  right: 0;
}

/* Panel Header */
.artifact-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  background: var(--background-white);
  flex-shrink: 0;
}

.artifact-panel-header .header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.artifact-panel-header .header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* List Button */
.artifact-list-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.artifact-list-btn:hover {
  background: var(--background-gray);
  border-color: var(--primary-blue-light);
}

.artifact-list-btn svg {
  width: 16px;
  height: 16px;
}

.artifact-count {
  font-weight: 500;
}

/* Action Buttons */
.copy-artifact-btn,
.close-panel-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-artifact-btn:hover,
.close-panel-btn:hover {
  background: var(--background-gray);
  border-color: var(--primary-blue);
  color: var(--primary-blue);
}

.copy-artifact-btn svg,
.close-panel-btn svg {
  width: 18px;
  height: 18px;
}

/* Artifact List Dropdown */
.artifact-list-dropdown {
  max-height: 0;
  overflow: hidden;
  background: var(--background-gray);
  border-bottom: 1px solid var(--border-color);
  transition: max-height 0.3s ease;
}

.artifact-list-dropdown.open {
  max-height: 400px;
  overflow-y: auto;
}

.artifact-list-empty {
  padding: 24px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
}

.artifact-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  border-bottom: 1px solid var(--border-color);
}

.artifact-list-item:hover {
  background: var(--background-white);
}

.artifact-list-item.active {
  background: var(--accent-blue-soft);
  border-left: 3px solid var(--primary-blue);
}

.list-item-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-white);
  border-radius: 6px;
  flex-shrink: 0;
}

.list-item-icon svg {
  width: 18px;
  height: 18px;
  color: var(--text-secondary);
}

.list-item-info {
  flex: 1;
  min-width: 0;
}

.list-item-title {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.list-item-meta {
  display: block;
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}

/* Content Area */
.artifact-content-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: var(--background-white);
}

/* Empty State */
.artifact-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-secondary);
}

.artifact-empty-state svg {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  opacity: 0.3;
}

.artifact-empty-state p {
  font-size: 14px;
  margin: 0;
}
```

**Step 2: Verify panel styling**

Open `detail-chat.html` in browser with DevTools. Manually add class `open` to `.artifact-panel`:

```javascript
document.querySelector('.artifact-panel').classList.add('open');
```

Expected: Panel slides in from right, styled correctly

**Step 3: Commit**

```bash
git add styles.css
git commit -m "style: add artifact panel base CSS"
```

---

## Task 5: Add Artifact Thumbnail CSS

**Files:**
- Modify: `styles.css:1318` (append after artifact panel styles)

**Step 1: Add thumbnail styles**

Append to end of `styles.css`:

```css

/* Artifact Thumbnail */
.artifact-thumbnail {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-top: 12px;
  border-radius: 8px;
  background: var(--accent-blue-soft);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.artifact-thumbnail:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(7, 42, 200, 0.15);
  border-color: var(--primary-blue-light);
}

.artifact-thumbnail[data-artifact-type="document"] {
  background: var(--accent-yellow-soft);
}

.artifact-thumbnail[data-artifact-type="document"]:hover {
  box-shadow: 0 4px 12px rgba(255, 198, 0, 0.15);
  border-color: var(--primary-yellow);
}

.artifact-thumbnail[data-artifact-type="chart"] {
  background: var(--success-green-light);
}

.artifact-thumbnail[data-artifact-type="chart"]:hover {
  box-shadow: 0 4px 12px rgba(0, 166, 81, 0.15);
  border-color: var(--success-green);
}

.thumbnail-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
  flex-shrink: 0;
}

.thumbnail-icon svg {
  width: 20px;
  height: 20px;
  color: var(--primary-blue);
}

.artifact-thumbnail[data-artifact-type="document"] .thumbnail-icon svg {
  color: var(--primary-yellow-dark);
}

.artifact-thumbnail[data-artifact-type="chart"] .thumbnail-icon svg {
  color: var(--success-green);
}

.thumbnail-info {
  flex: 1;
  min-width: 0;
}

.thumbnail-title {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.thumbnail-meta {
  display: block;
  font-size: 12px;
  color: var(--text-secondary);
}

.thumbnail-open-btn {
  padding: 6px 12px;
  background: var(--background-white);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--primary-blue);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.thumbnail-open-btn:hover {
  background: var(--primary-blue);
  color: white;
  border-color: var(--primary-blue);
}
```

**Step 2: Verify thumbnail styling**

Open `detail-chat.html` in browser. Check that:
- Thumbnail has yellow background (document type)
- Hover effect works (lift + shadow)
- Icon and text properly styled
- "Open" button has hover state

**Step 3: Commit**

```bash
git add styles.css
git commit -m "style: add artifact thumbnail CSS"
```

---

## Task 6: Create Artifact JavaScript Module

**Files:**
- Create: `artifact-manager.js`

**Step 1: Create artifact store and utilities**

Create new file `artifact-manager.js` with this content:

```javascript
/**
 * Artifact Manager
 * Manages artifact data, rendering, and interactions
 */

// Artifact Store
const ArtifactStore = {
  artifacts: new Map(),
  currentArtifact: null,

  add(artifact) {
    this.artifacts.set(artifact.id, artifact);
    this.updateArtifactCount();
  },

  get(id) {
    return this.artifacts.get(id);
  },

  getAll() {
    return Array.from(this.artifacts.values());
  },

  setCurrent(id) {
    this.currentArtifact = this.get(id);
  },

  getCurrent() {
    return this.currentArtifact;
  },

  updateArtifactCount() {
    const count = this.artifacts.size;
    const countEl = document.querySelector('.artifact-count');
    if (countEl) {
      countEl.textContent = `Artifacts (${count})`;
    }
  }
};

// Utility Functions
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatTimestamp(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// Initialize sample artifacts
function initializeSampleArtifacts() {
  // Sample Document Artifact
  ArtifactStore.add({
    id: 'artifact-001',
    type: 'document',
    title: 'Financial Analysis Report Q3 2024',
    content: `# Analisis Keuangan Q3 2024

## Ringkasan Eksekutif

Laporan ini menyajikan analisis mendalam terhadap performa keuangan Q3 2024, mencakup tren pendapatan, margin profitabilitas, dan rekomendasi strategis untuk Q4 2024.

## Temuan Utama

### 1. Pertumbuhan Pendapatan
- Q3 2024: **Rp 45.8 Miliar** (+12.3% QoQ)
- Year-over-year growth: **18.5%**
- Momentum positif dengan akselerasi dari 8.2% (Q1) ke 12.3% (Q3)

### 2. Segmentasi Pendapatan
- **Sektor A:** 58% kontribusi (Rp 26.6M) - growth 10.2%
- **Sektor B:** 28% kontribusi (Rp 12.8M) - growth 22.7% ⭐
- **Sektor C:** 14% kontribusi (Rp 6.4M) - growth 7.8%

### 3. Profitabilitas
- Gross margin: **44.1%** (↑ dari 42.3%)
- Operating margin: **18.5%** (tertinggi dalam 2 tahun)
- Net profit margin: **12.8%** (+1.4 poin)

## Rekomendasi Strategis

### Prioritas Tinggi
1. **Fokus pada Sektor B** - momentum kuat dengan growth 22.7%
2. **Efisiensi Operasional** - target saving 3-4% dari operating expenses
3. **Cash Collection** - turunkan DSO dari 52 hari ke 40-42 hari

### Prioritas Medium
1. **Revitalisasi Sektor C** - product refresh untuk meningkatkan growth
2. **Diversifikasi Revenue** - kurangi dependency Sektor A dari 58% ke 45-50%
3. **Automation Investment** - reduce operating costs jangka panjang

## Target Q4 2024
- Revenue: **Rp 50-52 Miliar** (growth 9-14%)
- Operating margin: **18-19%**
- Net profit margin: **13.5-14%**

---

*Generated by Public Data Insight Agent*`,
    timestamp: '2025-10-24T13:16:00Z',
    messageId: 'msg-003',
    metadata: {
      wordCount: 1240
    }
  });
}

// Export for use in app.js
window.ArtifactStore = ArtifactStore;
window.initializeSampleArtifacts = initializeSampleArtifacts;
window.escapeHTML = escapeHTML;
window.formatTimestamp = formatTimestamp;
```

**Step 2: Load script in HTML**

Modify `detail-chat.html` to load the script before `app.js`:

```html
    <script src="artifact-manager.js"></script>
    <script src="app.js"></script>
</body>
```

**Step 3: Verify script loaded**

Open `detail-chat.html` in browser console:

```javascript
console.log('ArtifactStore:', ArtifactStore);
initializeSampleArtifacts();
console.log('Artifacts:', ArtifactStore.getAll());
```

Expected: Store object exists, sample artifact added

**Step 4: Commit**

```bash
git add artifact-manager.js detail-chat.html
git commit -m "feat: create artifact store and management module"
```

---

## Task 7: Implement Panel Open/Close Logic

**Files:**
- Modify: `app.js`

**Step 1: Add panel control functions**

Add these functions to `app.js` (after existing `toggleSidebar` function):

```javascript

// ============================================
// ARTIFACT PANEL CONTROLS
// ============================================

function openArtifactPanel(artifactId) {
  const panel = document.getElementById('artifact-panel');
  const artifact = ArtifactStore.get(artifactId);

  if (!artifact) {
    console.error('Artifact not found:', artifactId);
    return;
  }

  // Set as current
  ArtifactStore.setCurrent(artifactId);

  // Render artifact
  renderArtifact(artifact);

  // Update list to show active
  updateArtifactListActive(artifactId);

  // Open panel
  panel.classList.add('open');
}

function closeArtifactPanel() {
  const panel = document.getElementById('artifact-panel');
  panel.classList.remove('open');

  // Clear current
  ArtifactStore.currentArtifact = null;
}

function toggleArtifactList() {
  const dropdown = document.getElementById('artifact-list-dropdown');
  dropdown.classList.toggle('open');
}

// Placeholder for rendering (will implement in next tasks)
function renderArtifact(artifact) {
  const contentArea = document.getElementById('artifact-content-area');
  contentArea.innerHTML = `<div class="artifact-loading">Rendering ${artifact.type}...</div>`;
}

function updateArtifactListActive(artifactId) {
  // Will implement when we add list items
  console.log('Active artifact:', artifactId);
}
```

**Step 2: Add event listeners**

Add event listeners at the end of `app.js`:

```javascript

// ============================================
// ARTIFACT EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize sample artifacts
  if (typeof initializeSampleArtifacts === 'function') {
    initializeSampleArtifacts();
  }

  // Thumbnail click
  document.addEventListener('click', (e) => {
    const thumbnail = e.target.closest('.artifact-thumbnail');
    if (thumbnail) {
      const artifactId = thumbnail.dataset.artifactId;
      openArtifactPanel(artifactId);
    }
  });

  // Close button
  const closeBtn = document.getElementById('close-panel-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeArtifactPanel);
  }

  // List toggle button
  const listBtn = document.getElementById('artifact-list-btn');
  if (listBtn) {
    listBtn.addEventListener('click', toggleArtifactList);
  }

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const panel = document.getElementById('artifact-panel');
      if (panel && panel.classList.contains('open')) {
        closeArtifactPanel();
      }
    }
  });
});
```

**Step 3: Test open/close functionality**

Open `detail-chat.html` in browser:
1. Click artifact thumbnail → panel should slide in
2. Click X button → panel should close
3. Press ESC key when panel open → should close
4. Click "Artifacts (1)" → dropdown should toggle

Expected: All interactions work smoothly

**Step 4: Commit**

```bash
git add app.js
git commit -m "feat: implement artifact panel open/close logic"
```

---

## Task 8: Implement Document Artifact Rendering

**Files:**
- Modify: `artifact-manager.js`

**Step 1: Add document rendering function**

Add this function to `artifact-manager.js` after the `escapeHTML` function:

```javascript

// Rendering Functions
function renderDocumentArtifact(artifact) {
  const html = marked.parse(artifact.content);

  return `
    <div class="artifact-document">
      <div class="document-header">
        <h3 class="document-title">${escapeHTML(artifact.title)}</h3>
        <span class="document-meta">${artifact.metadata.wordCount.toLocaleString()} words</span>
      </div>
      <div class="document-content markdown-body">
        ${html}
      </div>
    </div>
  `;
}

function renderCodeArtifact(artifact) {
  return `<div class="artifact-code">Code rendering coming soon...</div>`;
}

function renderChartArtifact(artifact) {
  return `<div class="artifact-chart">Chart rendering coming soon...</div>`;
}

// Main render dispatcher
function renderArtifactContent(artifact) {
  switch (artifact.type) {
    case 'document':
      return renderDocumentArtifact(artifact);
    case 'code':
      return renderCodeArtifact(artifact);
    case 'chart':
      return renderChartArtifact(artifact);
    default:
      return `<div class="artifact-error">Unknown artifact type: ${artifact.type}</div>`;
  }
}

// Export
window.renderArtifactContent = renderArtifactContent;
```

**Step 2: Update renderArtifact in app.js**

Replace the placeholder `renderArtifact` function in `app.js`:

```javascript
function renderArtifact(artifact) {
  const contentArea = document.getElementById('artifact-content-area');
  contentArea.innerHTML = renderArtifactContent(artifact);
}
```

**Step 3: Add document CSS**

Append to `styles.css`:

```css

/* Document Artifact */
.artifact-document {
  animation: fadeIn 0.2s ease;
}

.document-header {
  padding-bottom: 16px;
  border-bottom: 2px solid var(--border-color);
  margin-bottom: 24px;
}

.document-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.document-meta {
  font-size: 13px;
  color: var(--text-secondary);
}

.markdown-body {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-primary);
}

.markdown-body h1 {
  font-size: 24px;
  font-weight: 700;
  margin: 24px 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
}

.markdown-body h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 20px 0 12px 0;
}

.markdown-body h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 16px 0 8px 0;
}

.markdown-body p {
  margin: 12px 0;
}

.markdown-body ul, .markdown-body ol {
  margin: 12px 0;
  padding-left: 24px;
}

.markdown-body li {
  margin: 8px 0;
}

.markdown-body strong {
  font-weight: 600;
  color: var(--text-primary);
}

.markdown-body code {
  background: var(--background-gray);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
}

.markdown-body hr {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 24px 0;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**Step 4: Test document rendering**

Open `detail-chat.html`, click artifact thumbnail. Check that:
- Document title and word count shown
- Markdown rendered with proper headings, lists, bold text
- Scrollable if content is long
- Styled nicely with proper spacing

**Step 5: Commit**

```bash
git add artifact-manager.js app.js styles.css
git commit -m "feat: implement document artifact rendering with markdown support"
```

---

## Task 9: Implement Code Artifact Rendering

**Files:**
- Modify: `artifact-manager.js`
- Modify: `styles.css`

**Step 1: Add sample code artifact**

Add this to `initializeSampleArtifacts()` function in `artifact-manager.js`:

```javascript
  // Sample Code Artifact
  ArtifactStore.add({
    id: 'artifact-002',
    type: 'code',
    title: 'Python Data Analysis Script',
    language: 'python',
    content: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Load financial data
df = pd.read_csv('financial_data_q3_2024.csv')

# Calculate quarterly growth
df['growth_rate'] = df.groupby('sector')['revenue'].pct_change() * 100

# Segment analysis
sector_summary = df.groupby('sector').agg({
    'revenue': ['sum', 'mean'],
    'growth_rate': 'mean'
}).round(2)

print("\\nSector Performance Summary:")
print(sector_summary)

# Profitability metrics
df['gross_margin'] = (df['gross_profit'] / df['revenue']) * 100
df['operating_margin'] = (df['operating_income'] / df['revenue']) * 100
df['net_margin'] = (df['net_income'] / df['revenue']) * 100

print(f"\\nQ3 2024 Margins:")
print(f"Gross Margin: {df['gross_margin'].iloc[-1]:.1f}%")
print(f"Operating Margin: {df['operating_margin'].iloc[-1]:.1f}%")
print(f"Net Margin: {df['net_margin'].iloc[-1]:.1f}%")

# Visualization
plt.figure(figsize=(12, 6))
plt.subplot(1, 2, 1)
sector_revenue = df.groupby('sector')['revenue'].sum()
plt.pie(sector_revenue, labels=sector_revenue.index, autopct='%1.1f%%')
plt.title('Revenue Distribution by Sector')

plt.subplot(1, 2, 2)
plt.plot(df['date'], df['revenue'], marker='o')
plt.title('Revenue Trend Q3 2024')
plt.xlabel('Date')
plt.ylabel('Revenue (Millions)')
plt.xticks(rotation=45)

plt.tight_layout()
plt.savefig('financial_analysis_q3_2024.png', dpi=300, bbox_inches='tight')
print("\\nVisualization saved: financial_analysis_q3_2024.png")`,
    timestamp: '2025-10-24T13:17:30Z',
    messageId: 'msg-004',
    metadata: {
      lineCount: 45
    }
  });
```

**Step 2: Implement code rendering**

Replace `renderCodeArtifact` function in `artifact-manager.js`:

```javascript
function renderCodeArtifact(artifact) {
  const escapedCode = escapeHTML(artifact.content);

  return `
    <div class="artifact-code">
      <div class="code-header">
        <span class="code-language">${escapeHTML(artifact.language.toUpperCase())}</span>
        <span class="code-lines">${artifact.metadata.lineCount} lines</span>
      </div>
      <pre class="line-numbers"><code class="language-${artifact.language}">${escapedCode}</code></pre>
    </div>
  `;
}
```

**Step 3: Trigger Prism highlighting**

Update `renderArtifact` in `app.js` to trigger Prism:

```javascript
function renderArtifact(artifact) {
  const contentArea = document.getElementById('artifact-content-area');
  contentArea.innerHTML = renderArtifactContent(artifact);

  // Apply syntax highlighting for code
  if (artifact.type === 'code' && typeof Prism !== 'undefined') {
    Prism.highlightAllUnder(contentArea);
  }
}
```

**Step 4: Add code artifact CSS**

Append to `styles.css`:

```css

/* Code Artifact */
.artifact-code {
  animation: fadeIn 0.2s ease;
}

.code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--background-gray);
  border-radius: 6px 6px 0 0;
  border-bottom: 1px solid var(--border-color);
}

.code-language {
  font-size: 12px;
  font-weight: 600;
  color: var(--primary-blue);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.code-lines {
  font-size: 12px;
  color: var(--text-secondary);
}

.artifact-code pre {
  margin: 0;
  border-radius: 0 0 6px 6px;
  background: #2d2d2d !important;
  overflow-x: auto;
}

.artifact-code code {
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.6;
}

/* Line numbers from Prism plugin */
.line-numbers .line-numbers-rows {
  border-right: 1px solid #4a4a4a;
}
```

**Step 5: Test code rendering**

Create a test message with code artifact thumbnail, or manually test:

```javascript
openArtifactPanel('artifact-002');
```

Check that:
- Code displays with syntax highlighting
- Line numbers appear
- Language and line count shown in header
- Scrollable horizontally if code is wide

**Step 6: Commit**

```bash
git add artifact-manager.js app.js styles.css
git commit -m "feat: implement code artifact rendering with Prism.js syntax highlighting"
```

---

## Task 10: Implement Chart Artifact Rendering

**Files:**
- Modify: `artifact-manager.js`
- Modify: `styles.css`

**Step 1: Add sample chart artifact**

Add to `initializeSampleArtifacts()`:

```javascript
  // Sample Chart Artifact
  ArtifactStore.add({
    id: 'artifact-003',
    type: 'chart',
    title: 'Revenue Growth Q3 2024',
    content: JSON.stringify({
      type: 'bar',
      data: {
        labels: ['Q1 2024', 'Q2 2024', 'Q3 2024'],
        datasets: [{
          label: 'Revenue (Billions IDR)',
          data: [37.5, 40.8, 45.8],
          backgroundColor: 'rgba(7, 42, 200, 0.7)',
          borderColor: '#072ac8',
          borderWidth: 2
        }, {
          label: 'Target',
          data: [38.0, 42.0, 44.0],
          backgroundColor: 'rgba(255, 198, 0, 0.5)',
          borderColor: '#ffc600',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Revenue (Billions IDR)'
            }
          }
        }
      }
    }),
    timestamp: '2025-10-24T13:18:00Z',
    messageId: 'msg-005',
    metadata: {
      chartType: 'bar'
    }
  });
```

**Step 2: Implement chart rendering**

Replace `renderChartArtifact` in `artifact-manager.js`:

```javascript
function renderChartArtifact(artifact) {
  const chartId = `chart-${artifact.id}`;

  return `
    <div class="artifact-chart">
      <div class="chart-header">
        <h3 class="chart-title">${escapeHTML(artifact.title)}</h3>
        <span class="chart-type">${artifact.metadata.chartType.toUpperCase()} Chart</span>
      </div>
      <div class="chart-container">
        <canvas id="${chartId}"></canvas>
      </div>
    </div>
  `;
}

function initializeChart(artifact) {
  const chartId = `chart-${artifact.id}`;
  const canvas = document.getElementById(chartId);

  if (!canvas) {
    console.error('Canvas not found for chart:', chartId);
    return;
  }

  // Destroy existing chart if any
  if (window.currentChart) {
    window.currentChart.destroy();
    window.currentChart = null;
  }

  const ctx = canvas.getContext('2d');
  const config = JSON.parse(artifact.content);

  window.currentChart = new Chart(ctx, config);
}

// Export
window.initializeChart = initializeChart;
```

**Step 3: Update renderArtifact to initialize charts**

Update `renderArtifact` in `app.js`:

```javascript
function renderArtifact(artifact) {
  const contentArea = document.getElementById('artifact-content-area');
  contentArea.innerHTML = renderArtifactContent(artifact);

  // Apply syntax highlighting for code
  if (artifact.type === 'code' && typeof Prism !== 'undefined') {
    Prism.highlightAllUnder(contentArea);
  }

  // Initialize chart
  if (artifact.type === 'chart' && typeof Chart !== 'undefined') {
    // Small delay to ensure canvas is rendered
    setTimeout(() => {
      initializeChart(artifact);
    }, 50);
  }
}
```

**Step 4: Add chart CSS**

Append to `styles.css`:

```css

/* Chart Artifact */
.artifact-chart {
  animation: fadeIn 0.2s ease;
}

.chart-header {
  padding-bottom: 16px;
  border-bottom: 2px solid var(--border-color);
  margin-bottom: 24px;
}

.chart-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.chart-type {
  font-size: 13px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.chart-container {
  position: relative;
  width: 100%;
  min-height: 300px;
  padding: 20px;
  background: var(--background-white);
  border-radius: 8px;
}

.chart-container canvas {
  max-width: 100%;
  height: auto;
}
```

**Step 5: Test chart rendering**

Test manually:
```javascript
openArtifactPanel('artifact-003');
```

Check that:
- Chart renders with correct data
- Brand colors used (blue and yellow)
- Legend and labels visible
- Responsive to panel size

**Step 6: Commit**

```bash
git add artifact-manager.js app.js styles.css
git commit -m "feat: implement chart artifact rendering with Chart.js"
```

---

## Task 11: Build Artifact List Dropdown

**Files:**
- Modify: `artifact-manager.js`
- Modify: `app.js`

**Step 1: Add list rendering function**

Add to `artifact-manager.js`:

```javascript

function renderArtifactList() {
  const artifacts = ArtifactStore.getAll();
  const dropdown = document.getElementById('artifact-list-dropdown');

  if (artifacts.length === 0) {
    dropdown.innerHTML = '<div class="artifact-list-empty">No artifacts yet</div>';
    return;
  }

  const listHTML = artifacts.map(artifact => {
    const icon = getArtifactIcon(artifact.type);
    const isActive = ArtifactStore.currentArtifact?.id === artifact.id ? 'active' : '';
    const meta = getArtifactMeta(artifact);

    return `
      <div class="artifact-list-item ${isActive}" data-artifact-id="${artifact.id}">
        <div class="list-item-icon">
          ${icon}
        </div>
        <div class="list-item-info">
          <span class="list-item-title">${escapeHTML(artifact.title)}</span>
          <span class="list-item-meta">${meta} • ${formatTimestamp(artifact.timestamp)}</span>
        </div>
      </div>
    `;
  }).join('');

  dropdown.innerHTML = listHTML;
}

function getArtifactIcon(type) {
  const icons = {
    code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>`,
    document: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>`,
    chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="12" y1="20" x2="12" y2="10"></line>
      <line x1="18" y1="20" x2="18" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="16"></line>
    </svg>`
  };
  return icons[type] || icons.document;
}

function getArtifactMeta(artifact) {
  switch (artifact.type) {
    case 'code':
      return `${artifact.language} • ${artifact.metadata.lineCount} lines`;
    case 'document':
      return `Document • ${artifact.metadata.wordCount} words`;
    case 'chart':
      return `${artifact.metadata.chartType} chart`;
    default:
      return artifact.type;
  }
}

// Export
window.renderArtifactList = renderArtifactList;
```

**Step 2: Update panel controls to render list**

Update `openArtifactPanel` in `app.js`:

```javascript
function openArtifactPanel(artifactId) {
  const panel = document.getElementById('artifact-panel');
  const artifact = ArtifactStore.get(artifactId);

  if (!artifact) {
    console.error('Artifact not found:', artifactId);
    return;
  }

  // Set as current
  ArtifactStore.setCurrent(artifactId);

  // Render list and artifact
  renderArtifactList();
  renderArtifact(artifact);

  // Open panel
  panel.classList.add('open');
}
```

**Step 3: Add list item click handler**

Update event listeners in `app.js`:

```javascript
  // List item click (inside DOMContentLoaded)
  document.addEventListener('click', (e) => {
    const listItem = e.target.closest('.artifact-list-item');
    if (listItem) {
      const artifactId = listItem.dataset.artifactId;
      const artifact = ArtifactStore.get(artifactId);
      if (artifact) {
        ArtifactStore.setCurrent(artifactId);
        renderArtifact(artifact);
        renderArtifactList(); // Re-render to update active state

        // Close dropdown
        document.getElementById('artifact-list-dropdown').classList.remove('open');
      }
    }
  });
```

**Step 4: Test artifact list**

Open panel, click "Artifacts (3)" button. Check that:
- All 3 artifacts listed
- Icons match artifact types
- Metadata shows correctly
- Active artifact highlighted
- Clicking switches artifact
- Dropdown closes after selection

**Step 5: Commit**

```bash
git add artifact-manager.js app.js
git commit -m "feat: implement artifact list dropdown with type icons and metadata"
```

---

## Task 12: Implement Copy Functionality

**Files:**
- Modify: `app.js`
- Modify: `styles.css`

**Step 1: Add copy function**

Add to `app.js` after artifact controls:

```javascript

function copyArtifactContent() {
  const artifact = ArtifactStore.getCurrent();

  if (!artifact) {
    console.error('No artifact to copy');
    return;
  }

  const contentToCopy = artifact.content;

  // Copy to clipboard
  navigator.clipboard.writeText(contentToCopy)
    .then(() => {
      showCopyFeedback();
    })
    .catch(err => {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard');
    });
}

function showCopyFeedback() {
  const copyBtn = document.getElementById('copy-artifact-btn');
  const originalHTML = copyBtn.innerHTML;

  copyBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  `;
  copyBtn.classList.add('copied');

  setTimeout(() => {
    copyBtn.innerHTML = originalHTML;
    copyBtn.classList.remove('copied');
  }, 2000);
}
```

**Step 2: Add copy button event listener**

Add to event listeners in `app.js`:

```javascript
  // Copy button
  const copyBtn = document.getElementById('copy-artifact-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', copyArtifactContent);
  }
```

**Step 3: Add copy button feedback CSS**

Append to `styles.css`:

```css

/* Copy Button Feedback */
.copy-artifact-btn.copied {
  background: var(--success-green-light) !important;
  border-color: var(--success-green) !important;
  color: var(--success-green) !important;
}

.copy-artifact-btn.copied svg {
  animation: checkmark 0.3s ease;
}

@keyframes checkmark {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
```

**Step 4: Test copy functionality**

Open artifact panel, click copy button. Check that:
- Content copied to clipboard (test by pasting)
- Button shows checkmark icon briefly
- Green background appears for 2 seconds
- Returns to normal after feedback

**Step 5: Commit**

```bash
git add app.js styles.css
git commit -m "feat: implement artifact copy to clipboard with visual feedback"
```

---

## Task 13: Add Responsive Mobile Styles

**Files:**
- Modify: `styles.css`

**Step 1: Add mobile responsive styles**

Append to end of `styles.css`:

```css

/* ============================================
   ARTIFACT PANEL RESPONSIVE
   ============================================ */

@media (max-width: 768px) {
  /* Full screen panel on mobile */
  .artifact-panel {
    right: -100vw;
    width: 100vw;
  }

  .artifact-panel.open {
    right: 0;
  }

  /* Panel header adjustments */
  .artifact-panel-header {
    padding: 12px 16px;
  }

  .artifact-list-btn {
    padding: 6px 10px;
    font-size: 13px;
  }

  .artifact-list-btn span {
    display: none; /* Hide text, show count only on very small screens */
  }

  .copy-artifact-btn,
  .close-panel-btn {
    width: 32px;
    height: 32px;
  }

  /* Content area padding */
  .artifact-content-area {
    padding: 16px;
  }

  /* Document typography */
  .markdown-body {
    font-size: 13px;
  }

  .markdown-body h1 {
    font-size: 20px;
  }

  .markdown-body h2 {
    font-size: 18px;
  }

  .markdown-body h3 {
    font-size: 16px;
  }

  /* Code block scrolling */
  .artifact-code pre {
    font-size: 12px;
  }

  /* Chart container */
  .chart-container {
    padding: 12px;
    min-height: 250px;
  }

  /* Thumbnail adjustments for mobile chat */
  .artifact-thumbnail {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .thumbnail-open-btn {
    align-self: flex-end;
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  /* Extra small screens */
  .artifact-count {
    display: none;
  }

  .artifact-list-btn svg {
    margin: 0;
  }

  .document-title {
    font-size: 18px;
  }

  .chart-title {
    font-size: 18px;
  }
}
```

**Step 2: Add backdrop for mobile overlay**

Add backdrop element to HTML and CSS. Modify `detail-chat.html` before artifact panel:

```html
    <!-- Backdrop for mobile -->
    <div class="artifact-panel-backdrop" id="artifact-backdrop"></div>

    <!-- Artifact Panel -->
    <div class="artifact-panel" id="artifact-panel">
```

Add backdrop CSS to `styles.css`:

```css

/* Panel Backdrop (mobile) */
.artifact-panel-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.artifact-panel-backdrop.active {
  opacity: 1;
}

@media (max-width: 768px) {
  .artifact-panel-backdrop {
    display: block;
  }
}
```

**Step 3: Add backdrop control logic**

Update `openArtifactPanel` and `closeArtifactPanel` in `app.js`:

```javascript
function openArtifactPanel(artifactId) {
  const panel = document.getElementById('artifact-panel');
  const backdrop = document.getElementById('artifact-backdrop');
  const artifact = ArtifactStore.get(artifactId);

  if (!artifact) {
    console.error('Artifact not found:', artifactId);
    return;
  }

  // Set as current
  ArtifactStore.setCurrent(artifactId);

  // Render list and artifact
  renderArtifactList();
  renderArtifact(artifact);

  // Open panel and backdrop
  panel.classList.add('open');
  if (backdrop) {
    backdrop.classList.add('active');
  }
}

function closeArtifactPanel() {
  const panel = document.getElementById('artifact-panel');
  const backdrop = document.getElementById('artifact-backdrop');

  panel.classList.remove('open');
  if (backdrop) {
    backdrop.classList.remove('active');
  }

  // Clear current
  ArtifactStore.currentArtifact = null;
}
```

**Step 4: Add backdrop click handler**

Add to event listeners in `app.js`:

```javascript
  // Backdrop click (mobile)
  const backdrop = document.getElementById('artifact-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', closeArtifactPanel);
  }
```

**Step 5: Test responsive behavior**

Test in browser with responsive mode:
- Desktop (>768px): Side panel behavior
- Mobile (<768px): Fullscreen overlay with backdrop
- Backdrop click closes panel
- All content readable and scrollable

**Step 6: Commit**

```bash
git add detail-chat.html app.js styles.css
git commit -m "feat: add responsive mobile styles for artifact panel with fullscreen overlay"
```

---

## Task 14: Add More Sample Artifacts and Thumbnails

**Files:**
- Modify: `detail-chat.html`

**Step 1: Add code artifact thumbnail**

Add a new message with code artifact. Insert before the last message in `detail-chat.html`:

```html
            <div class="message" data-artifact-id="artifact-002">
                <div class="message-avatar agent-avatar">PD</div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-sender">Public Data Insight Agent</span>
                        <span class="message-time">01:17 PM</span>
                    </div>
                    <div class="message-bubble">
                        <div class="message-text">
                            <p>Saya telah membuat script Python untuk menganalisis data keuangan Q3 2024 secara otomatis. Script ini akan:</p>
                            <ul>
                                <li>Menghitung growth rate per sektor</li>
                                <li>Menganalisis margin profitabilitas</li>
                                <li>Membuat visualisasi revenue distribution dan trend</li>
                            </ul>
                            <p>Anda bisa menjalankan script ini dengan data CSV Anda sendiri.</p>
                        </div>

                        <!-- Code Artifact Thumbnail -->
                        <div class="artifact-thumbnail" data-artifact-id="artifact-002" data-artifact-type="code">
                            <div class="thumbnail-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="16 18 22 12 16 6"></polyline>
                                    <polyline points="8 6 2 12 8 18"></polyline>
                                </svg>
                            </div>
                            <div class="thumbnail-info">
                                <span class="thumbnail-title">Python Data Analysis Script</span>
                                <span class="thumbnail-meta">Python • 45 lines</span>
                            </div>
                            <button class="thumbnail-open-btn">Open</button>
                        </div>

                        <div class="message-actions">
                            <button class="message-action-btn">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <use href="icons.svg#copy-icon"/>
                                </svg>
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
```

**Step 2: Add chart artifact thumbnail**

Add another message with chart artifact:

```html
            <div class="message" data-artifact-id="artifact-003">
                <div class="message-avatar agent-avatar">PD</div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-sender">Public Data Insight Agent</span>
                        <span class="message-time">01:18 PM</span>
                    </div>
                    <div class="message-bubble">
                        <div class="message-text">
                            <p>Berikut adalah visualisasi perbandingan revenue aktual vs target untuk Q1-Q3 2024:</p>
                        </div>

                        <!-- Chart Artifact Thumbnail -->
                        <div class="artifact-thumbnail" data-artifact-id="artifact-003" data-artifact-type="chart">
                            <div class="thumbnail-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="20" x2="12" y2="10"></line>
                                    <line x1="18" y1="20" x2="18" y2="4"></line>
                                    <line x1="6" y1="20" x2="6" y2="16"></line>
                                </svg>
                            </div>
                            <div class="thumbnail-info">
                                <span class="thumbnail-title">Revenue Growth Q3 2024</span>
                                <span class="thumbnail-meta">Bar chart</span>
                            </div>
                            <button class="thumbnail-open-btn">Open</button>
                        </div>

                        <div class="message-actions">
                            <button class="message-action-btn">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <use href="icons.svg#copy-icon"/>
                                </svg>
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
```

**Step 3: Verify all artifacts work**

Open `detail-chat.html` in browser and test:
1. Click each thumbnail (document, code, chart)
2. Verify panel opens with correct content
3. Check artifact list shows all 3
4. Switch between artifacts via list
5. Test copy button for each type
6. Test on mobile responsive mode

Expected: All artifact types render and interact correctly

**Step 4: Commit**

```bash
git add detail-chat.html
git commit -m "feat: add sample messages with code and chart artifact thumbnails"
```

---

## Task 15: Final Testing and Documentation

**Files:**
- Create: `TESTING.md` (manual testing checklist)

**Step 1: Create testing checklist**

Create `docs/TESTING.md`:

```markdown
# Artifact Display Feature - Testing Checklist

## Desktop Testing (>768px)

### Panel Behavior
- [ ] Click document thumbnail → panel slides in from right
- [ ] Click code thumbnail → panel slides in with code
- [ ] Click chart thumbnail → panel slides in with chart
- [ ] Click X button → panel slides out
- [ ] Press ESC key → panel closes
- [ ] Panel width is 500px
- [ ] Panel doesn't block chat interaction

### Artifact List
- [ ] Click "Artifacts (3)" → dropdown toggles open/closed
- [ ] All 3 artifacts shown in list
- [ ] Correct icons for each type (code, document, chart)
- [ ] Active artifact highlighted in list
- [ ] Click list item → switches artifact
- [ ] Dropdown closes after selection

### Content Rendering
- [ ] **Document:** Markdown rendered correctly (headings, lists, bold)
- [ ] **Code:** Syntax highlighting active (Python keywords colored)
- [ ] **Code:** Line numbers displayed
- [ ] **Chart:** Bar chart renders with correct data
- [ ] **Chart:** Legend shows "Revenue" and "Target"
- [ ] All content scrollable if needed

### Copy Functionality
- [ ] Click copy button → content copied to clipboard
- [ ] Paste works in external editor
- [ ] Button shows checkmark briefly
- [ ] Green background appears for 2 seconds

## Mobile Testing (<768px)

### Panel Behavior
- [ ] Panel opens as fullscreen overlay
- [ ] Backdrop (dark overlay) appears behind panel
- [ ] Click backdrop → panel closes
- [ ] Panel takes full viewport width/height
- [ ] Content readable and scrollable

### Responsive Adjustments
- [ ] Thumbnails stack vertically in chat
- [ ] "Open" button full width on thumbnails
- [ ] Font sizes readable on small screens
- [ ] Code blocks scroll horizontally
- [ ] Chart fits within viewport

## Cross-Browser Testing

### Chrome/Edge
- [ ] All features work
- [ ] Prism.js highlights correctly
- [ ] Chart.js renders properly

### Firefox
- [ ] All features work
- [ ] Syntax highlighting active
- [ ] Chart displays correctly

### Safari
- [ ] All features work
- [ ] No layout issues
- [ ] Libraries load correctly

## Performance

- [ ] Panel animations smooth (no jank)
- [ ] Chart rendering under 1 second
- [ ] No console errors
- [ ] Libraries load successfully (check Network tab)

## Accessibility

- [ ] Keyboard navigation works (Tab, ESC)
- [ ] Buttons have visible focus states
- [ ] Color contrast sufficient for text
- [ ] Screen reader friendly (test title attributes)

## Edge Cases

- [ ] Switch artifacts rapidly → no errors
- [ ] Open panel, close, reopen → works correctly
- [ ] Copy empty artifact → handles gracefully
- [ ] Resize window with panel open → stays functional

---

**Tested by:** _____________
**Date:** _____________
**Browser/Device:** _____________
**Result:** PASS / FAIL
**Notes:**
```

**Step 2: Run through manual testing**

Go through each checklist item in browser. Document any issues found.

**Step 3: Fix any issues discovered**

If bugs found during testing, create additional commits to fix them.

**Step 4: Final commit**

```bash
git add docs/TESTING.md
git commit -m "docs: add manual testing checklist for artifact display feature"
```

**Step 5: Verification complete**

Run git log to see all commits:

```bash
git log --oneline -20
```

Expected: Clean commit history with all tasks completed.

---

## Summary

This implementation plan provides step-by-step instructions to build the artifact display feature from scratch. Each task is broken into small steps (2-5 minutes each) with:

- **Exact file paths and line numbers**
- **Complete code snippets** (copy-paste ready)
- **Verification steps** (how to test each change)
- **Commit messages** (for clean git history)

**Total Tasks:** 15
**Estimated Time:** 4-6 hours (including testing)
**Complexity:** Medium (vanilla JS, no framework, CDN libraries)

The final result will be a fully functional artifact display system matching Claude.ai's UX pattern, integrated seamlessly into the existing BotBrigade chat interface.

---

**Next Step:** Execute this plan using superpowers:executing-plans or superpowers:subagent-driven-development skill.
