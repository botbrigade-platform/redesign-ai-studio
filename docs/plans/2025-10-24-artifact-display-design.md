# Artifact Display Feature Design

**Date:** 2025-10-24
**Status:** Design Complete
**Target:** BotBrigade AI Studio - Chat Interface

## Overview

This design adds artifact display capability to the chat interface, enabling agents to generate and display structured outputs like code snippets, documents, and data visualizations in a dedicated side panel - similar to Claude.ai's artifact feature.

## Requirements Summary

### Artifact Types Supported
1. **Code Snippets** - Syntax-highlighted code with line numbers and copy functionality
2. **Documents** - Markdown-rendered long-form text content
3. **Data Visualizations** - Interactive charts and graphs

### Core User Experience
- **Display Method:** Side panel that slides in from right (desktop) or fullscreen overlay (mobile)
- **Interaction:** Read-only artifacts with copy functionality
- **Access Pattern:** Click thumbnail in message or select from artifact list
- **Libraries:** Prism.js (syntax highlighting), Chart.js (visualizations), Marked.js (markdown)

### Constraints
- Desktop-first responsive design (mobile uses fullscreen overlay)
- No external window/tab opening
- Pure vanilla JavaScript (no frameworks)
- Maintains current static HTML/CSS architecture
- Consistent with Dinkominfo Surabaya branding

---

## Architecture

### Layout System

**Three-Column Grid Layout:**
```
┌──────────────┬────────────────────────┬──────────────────┐
│   Sidebar    │    Chat Messages       │  Artifact Panel  │
│   (240px)    │      (flexible)        │     (500px)      │
│              │                        │                  │
│ - Nav        │ - Messages             │ - Header         │
│ - History    │ - Thumbnails           │ - List Toggle    │
│ - Settings   │ - Input Area           │ - Content Area   │
└──────────────┴────────────────────────┴──────────────────┘
```

**Layout States:**
- **Default (closed):** `grid-template-columns: 240px 1fr`
- **Artifact open:** `grid-template-columns: 240px 1fr 500px`
- **Mobile (<768px):** Artifact panel becomes fixed fullscreen overlay with backdrop

### Data Structure

**Artifact Object Schema:**
```javascript
{
  id: "artifact-001",              // Unique identifier
  type: "code" | "document" | "chart",
  title: "Display Name",
  language: "python",              // For code artifacts
  content: "...",                  // Raw content
  timestamp: "2025-10-24T10:30:00Z",
  messageId: "msg-123",            // Parent message reference
  metadata: {
    lineCount: 45,                 // Code-specific
    chartType: "bar",              // Chart-specific
    wordCount: 1200                // Document-specific
  }
}
```

**Global Artifact Store:**
```javascript
const ArtifactStore = {
  artifacts: new Map(),            // id -> artifact object
  currentArtifact: null,           // Currently displayed

  add(artifact) { ... },
  get(id) { ... },
  getAll() { ... },
  getByMessage(messageId) { ... }
};
```

---

## Component Design

### 1. Artifact Thumbnail (In Message)

**Location:** Inside `.message-bubble` after `.message-text`

**HTML Structure:**
```html
<div class="artifact-thumbnail" data-artifact-type="code">
  <div class="thumbnail-icon">
    <!-- SVG icon based on type -->
  </div>
  <div class="thumbnail-info">
    <span class="thumbnail-title">Python Data Analysis</span>
    <span class="thumbnail-meta">Python • 45 lines</span>
  </div>
  <button class="thumbnail-open-btn">Open</button>
</div>
```

**Visual Design:**
- Background color based on type:
  - Code: `var(--accent-blue-soft)`
  - Document: `var(--accent-yellow-soft)`
  - Chart: `var(--success-green-light)`
- Rounded corners (8px), padding (12px)
- Hover state: lift effect (`translateY(-2px)`) + shadow
- Click opens artifact in side panel

### 2. Artifact Panel

**HTML Structure:**
```html
<div class="artifact-panel">
  <!-- Header -->
  <div class="artifact-panel-header">
    <div class="header-left">
      <button class="artifact-list-btn">
        <svg><!-- list icon --></svg>
        Artifacts (3)
      </button>
    </div>
    <div class="header-right">
      <button class="copy-artifact-btn" title="Copy content">
        <svg><!-- copy icon --></svg>
      </button>
      <button class="close-panel-btn" title="Close">
        <svg><!-- x icon --></svg>
      </button>
    </div>
  </div>

  <!-- Artifact List Dropdown (toggleable) -->
  <div class="artifact-list-dropdown">
    <div class="artifact-list-item" data-artifact-id="artifact-001">
      <div class="list-item-icon"><!-- type icon --></div>
      <div class="list-item-info">
        <span class="list-item-title">Python Analysis</span>
        <span class="list-item-meta">Code • 2:30 PM</span>
      </div>
    </div>
    <!-- More artifacts... -->
  </div>

  <!-- Content Area (dynamic) -->
  <div class="artifact-content-area">
    <!-- Rendered artifact based on type -->
  </div>
</div>
```

**Panel Positioning:**
- Desktop: Fixed right side, 500px width
- Tablet: Slide-over with backdrop (350px width)
- Mobile: Fullscreen overlay (100vw × 100vh)

**Animations:**
- Slide-in from right: 300ms ease-out
- Backdrop fade: 200ms ease
- Content fade when switching: 150ms

### 3. Type-Specific Rendering

#### Code Artifacts (Prism.js)

```html
<div class="artifact-code">
  <div class="code-header">
    <span class="code-language">Python</span>
    <span class="code-lines">45 lines</span>
  </div>
  <pre class="line-numbers"><code class="language-python">
# Code content with syntax highlighting
import pandas as pd
...
  </code></pre>
</div>
```

**Prism.js Setup:**
- Theme: `prism-tomorrow.css` (dark theme matching brand)
- Plugins: `line-numbers`, language-specific components (Python, JS, etc.)
- Auto-highlight on render: `Prism.highlightAll()`

#### Document Artifacts (Markdown)

```html
<div class="artifact-document">
  <div class="document-header">
    <h3 class="document-title">Financial Analysis Report</h3>
    <span class="document-meta">1,240 words</span>
  </div>
  <div class="document-content markdown-body">
    <!-- Rendered markdown from Marked.js -->
  </div>
</div>
```

**Markdown Rendering:**
- Library: Marked.js v11.0.0
- Styling: GitHub-flavored markdown CSS
- Sanitization: Use `marked.setOptions({ sanitize: true })`

#### Chart Artifacts (Chart.js)

```html
<div class="artifact-chart">
  <div class="chart-header">
    <h3 class="chart-title">Revenue Growth Q3 2024</h3>
    <span class="chart-type">Bar Chart</span>
  </div>
  <div class="chart-container">
    <canvas id="chart-canvas-{id}"></canvas>
  </div>
</div>
```

**Chart.js Configuration:**
- Responsive: `maintainAspectRatio: true`
- Theme colors: Use brand color variables
- Destroy previous instance before creating new chart (prevent memory leaks)

---

## User Interactions

### Interaction Flows

**Flow 1: Open Artifact from Thumbnail**
1. User clicks `.thumbnail-open-btn` in message
2. JavaScript extracts `data-artifact-id` from parent message
3. `openArtifactPanel(artifactId)` called
4. Panel slides in from right
5. Artifact content rendered in `.artifact-content-area`
6. Panel state set to open, `currentArtifact` updated

**Flow 2: Browse Artifacts via List**
1. User clicks `.artifact-list-btn` in panel header
2. `.artifact-list-dropdown` toggles open
3. User clicks artifact from list
4. `switchArtifact(artifactId)` called
5. Content area updates with fade transition
6. List closes automatically

**Flow 3: Copy Artifact Content**
1. User clicks `.copy-artifact-btn`
2. `currentArtifact.content` copied to clipboard
3. Button shows "Copied!" tooltip (2s duration)
4. Toast notification appears (optional)

**Flow 4: Close Panel**
1. User clicks `.close-panel-btn` OR presses `Escape` OR clicks backdrop (mobile)
2. Panel slides out to right
3. Panel state set to closed
4. `currentArtifact` set to null

### Event Handlers

```javascript
// Thumbnail click
document.addEventListener('click', (e) => {
  if (e.target.closest('.artifact-thumbnail')) {
    const message = e.target.closest('.message');
    const artifactId = message.dataset.artifactId;
    openArtifactPanel(artifactId);
  }
});

// List toggle
document.querySelector('.artifact-list-btn')?.addEventListener('click', () => {
  document.querySelector('.artifact-list-dropdown')
    .classList.toggle('open');
});

// Switch artifact
document.querySelectorAll('.artifact-list-item').forEach(item => {
  item.addEventListener('click', (e) => {
    const artifactId = e.currentTarget.dataset.artifactId;
    switchArtifact(artifactId);
  });
});

// Copy content
document.querySelector('.copy-artifact-btn')?.addEventListener('click', () => {
  copyArtifactContent(ArtifactStore.currentArtifact);
});

// Close panel
document.querySelector('.close-panel-btn')?.addEventListener('click', () => {
  closeArtifactPanel();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isPanelOpen()) {
    closeArtifactPanel();
  }
});
```

---

## Implementation Details

### Library Integration

**CDN Links (in `<head>`):**
```html
<!-- Prism.js - Syntax Highlighting -->
<link href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-python.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-javascript.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/line-numbers/prism-line-numbers.min.js"></script>

<!-- Chart.js - Data Visualization -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

<!-- Marked.js - Markdown Rendering -->
<script src="https://cdn.jsdelivr.net/npm/marked@11.0.0/marked.min.js"></script>
```

### Core JavaScript Functions

**Rendering Logic:**
```javascript
function renderArtifact(artifact) {
  const contentArea = document.querySelector('.artifact-content-area');

  try {
    switch(artifact.type) {
      case 'code':
        contentArea.innerHTML = generateCodeHTML(artifact);
        Prism.highlightAll();
        break;
      case 'document':
        contentArea.innerHTML = generateDocumentHTML(artifact);
        break;
      case 'chart':
        contentArea.innerHTML = generateChartHTML(artifact);
        renderChart(artifact);
        break;
      default:
        throw new Error(`Unknown type: ${artifact.type}`);
    }
  } catch (error) {
    console.error('Render error:', error);
    showErrorState(error.message);
  }
}

function generateCodeHTML(artifact) {
  return `
    <div class="artifact-code">
      <div class="code-header">
        <span class="code-language">${artifact.language}</span>
        <span class="code-lines">${artifact.metadata.lineCount} lines</span>
      </div>
      <pre class="line-numbers"><code class="language-${artifact.language}">${escapeHTML(artifact.content)}</code></pre>
    </div>
  `;
}

function renderChart(artifact) {
  const canvas = document.getElementById(`chart-canvas-${artifact.id}`);
  const ctx = canvas.getContext('2d');

  // Destroy existing chart if any
  if (window.currentChart) {
    window.currentChart.destroy();
  }

  // Parse chart configuration from artifact.content
  const config = JSON.parse(artifact.content);

  window.currentChart = new Chart(ctx, config);
}
```

### CSS Key Classes

```css
/* Panel */
.artifact-panel {
  position: fixed;
  top: 0;
  right: -500px; /* Hidden by default */
  width: 500px;
  height: 100vh;
  background: var(--background-white);
  border-left: 1px solid var(--border-color);
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
  transition: right 300ms ease-out;
  z-index: 100;
}

.artifact-panel.open {
  right: 0;
}

/* Thumbnail */
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
}

.artifact-thumbnail:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(7, 42, 200, 0.15);
}

/* Code artifact */
.artifact-code pre {
  margin: 0;
  border-radius: 6px;
  background: #2d2d2d;
}

.artifact-code code {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  line-height: 1.6;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .artifact-panel {
    right: -100vw;
    width: 100vw;
  }

  .artifact-panel.open {
    right: 0;
  }

  .artifact-panel-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;
  }
}
```

---

## Error Handling & Edge Cases

### Error States

**1. Library Loading Failure:**
```javascript
function checkLibraries() {
  const missing = [];
  if (typeof Prism === 'undefined') missing.push('Prism.js');
  if (typeof Chart === 'undefined') missing.push('Chart.js');
  if (typeof marked === 'undefined') missing.push('Marked.js');

  if (missing.length > 0) {
    console.error('Missing libraries:', missing);
    return false;
  }
  return true;
}
```

**2. Artifact Rendering Error:**
```html
<div class="artifact-error-state">
  <svg class="error-icon"><!-- alert icon --></svg>
  <p>Failed to load artifact</p>
  <button class="retry-btn">Retry</button>
</div>
```

**3. Invalid Artifact Data:**
- Validate artifact schema before rendering
- Show error state if required fields missing
- Log to console for debugging

### Edge Cases

**No Artifacts in Conversation:**
- Hide artifact list button
- Don't show panel at all
- No empty states needed

**Large Code Files (>1000 lines):**
- Show warning: "Large file - showing first 500 lines"
- Add "View all" button to expand
- Consider virtual scrolling for performance

**Chart Data Malformed:**
- Validate JSON structure before Chart.js init
- Show error: "Invalid chart configuration"
- Provide fallback message

**Multiple Artifacts Same Message:**
- Show multiple thumbnails stacked vertically
- Each thumbnail opens respective artifact
- List shows all with message context

### Performance Optimizations

1. **Lazy Loading:** Only render artifact when panel opens, not on message load
2. **Chart Cleanup:** Always destroy Chart.js instance before creating new one
3. **Debounced Events:** If adding search, debounce input 300ms
4. **CSS Animations:** Use `transform` and `opacity` (GPU-accelerated)
5. **Image Lazy Load:** For document artifacts with images

---

## Testing Checklist

**Functional Tests:**
- [ ] Click thumbnail opens panel with correct artifact
- [ ] Panel slides in/out smoothly (desktop)
- [ ] Panel fullscreen works on mobile
- [ ] Artifact list shows all artifacts chronologically
- [ ] Switching artifacts updates content correctly
- [ ] Copy button copies content to clipboard
- [ ] Close button closes panel
- [ ] ESC key closes panel
- [ ] Backdrop click closes panel (mobile)

**Visual Tests:**
- [ ] Code syntax highlighting works for all languages
- [ ] Charts render correctly with brand colors
- [ ] Markdown renders with proper styling
- [ ] Thumbnails show correct icons per type
- [ ] Active artifact highlighted in list
- [ ] Hover states work on all interactive elements

**Error Tests:**
- [ ] Library failure shows error message
- [ ] Invalid artifact data shows error state
- [ ] Large files show truncation warning
- [ ] Malformed chart data shows error

**Responsive Tests:**
- [ ] Desktop: side panel 500px width
- [ ] Tablet: slide-over panel 350px
- [ ] Mobile: fullscreen overlay
- [ ] Panel doesn't break layout on any screen size

---

## Future Enhancements (Out of Scope)

- Artifact editing capability (make read-only editable)
- Artifact versioning (track changes)
- Download artifact as file
- Share artifact via link
- Full-text search across artifacts
- Syntax highlighting for more languages
- More chart types (3D, maps, etc.)
- Collaborative artifact editing
- Artifact templates library

---

## Summary

This design provides a complete artifact display system for the BotBrigade chat interface, following Claude.ai's proven UX pattern. The implementation uses vanilla JavaScript with lightweight libraries (Prism.js, Chart.js, Marked.js) while maintaining the project's static HTML/CSS architecture and Dinkominfo Surabaya branding.

**Key Design Decisions:**
1. **Side panel approach:** Familiar pattern, dedicated space, doesn't disrupt chat flow
2. **Vanilla JS with templates:** Flexible, maintainable, no framework overhead
3. **Desktop-first responsive:** Optimized for primary use case, graceful mobile degradation
4. **Read-only initial scope:** Simpler implementation, can enhance later
5. **CDN libraries:** No build process, fast setup, auto-updates

**Next Steps:**
1. Set up git worktree for isolated development
2. Create detailed implementation plan
3. Build HTML structure and CSS layout
4. Implement JavaScript functionality
5. Integrate libraries and test all artifact types
6. Test responsive behavior and edge cases
