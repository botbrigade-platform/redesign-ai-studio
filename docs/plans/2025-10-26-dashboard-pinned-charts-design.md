# Dashboard with Pinned Charts - Design Document

**Date:** 2025-10-26
**Status:** Approved for Implementation
**Designer:** Claude Code with user collaboration

## Overview

This document describes the design for a new Dashboard page that allows users to pin chart artifacts from chat conversations and organize them in a customizable grid layout. The dashboard is a peer-level page to the existing Agents page, providing a centralized view of important data visualizations.

## Requirements Summary

### Functional Requirements
- Users can pin chart artifacts from chat conversations to the dashboard
- Pinned charts can be dragged to reposition
- Pinned charts can be resized via corner/edge handles
- Charts can be expanded to fullscreen for detailed viewing
- Charts can be removed (unpinned) with confirmation
- Dashboard state persists during browser session (sessionStorage)
- Dashboard is accessible via sidebar navigation at same level as Agents

### User Experience Requirements
- Pin action requires user to name the chart via modal
- 6-column grid system for organized layout
- Fixed grid cells like dashboard builders (not free-form)
- All chart customization happens on dashboard, not in chat
- Session-only persistence (resets on browser close)

### Technical Requirements
- Use Gridstack.js library for drag-and-drop grid functionality
- Maintain existing tech stack (vanilla JS, CDN libraries, no build process)
- Match existing design system (Dinkominfo Surabaya branding)
- Integrate with existing ArtifactStore and Chart.js implementation

## Architecture

### Technology Stack
- **Gridstack.js v10.x** (via CDN) - Grid layout with drag/drop and resize
- **Chart.js** (existing) - Chart rendering
- **Vanilla JavaScript** - State management, UI interactions
- **sessionStorage** - Temporary persistence (key: `pinnedCharts`)

### Navigation Structure
```
Sidebar Navigation:
├── BotBrigade (Logo)
├── Dashboard Internal (Subtitle)
├── 📊 Dashboard (new - pages/dashboard.html)
├── 🤖 Agents (existing - pages/agents.html)
└── ⚙️ Settings (bottom)
```

### Page Hierarchy
- `pages/dashboard.html` - New peer page to `pages/agents.html`
- Both pages share same header structure and sidebar component
- Dashboard shows "Dashboard > Overview" breadcrumb
- Header includes date range selector and download button (matching screenshot)

## Data Structures

### Pinned Chart Object
Stored in sessionStorage under key `'pinnedCharts'` as JSON array:

```javascript
{
  id: string,              // Unique ID (timestamp-based: 'chart-1234567890')
  artifactId: string,      // Original artifact ID from ArtifactStore
  name: string,            // User-provided chart name (max 50 chars)
  type: 'chart',           // Always 'chart' for pinned items
  chartConfig: object,     // Chart.js configuration object (from artifact.content)
  chartType: string,       // Chart type: 'bar', 'line', 'pie', 'radar', 'doughnut'
  pinnedAt: string,        // ISO 8601 timestamp
  gridPosition: {
    x: number,             // Grid column position (0-5 for 6-column grid)
    y: number,             // Grid row position (0-∞)
    w: number,             // Width in grid units (1-6 columns)
    h: number              // Height in grid units (1-4 rows)
  }
}
```

### Example
```javascript
{
  id: 'chart-1730000000',
  artifactId: 'artifact-003',
  name: 'Revenue Growth Q3 2024',
  type: 'chart',
  chartConfig: {
    type: 'bar',
    data: { labels: [...], datasets: [...] },
    options: { responsive: true, ... }
  },
  chartType: 'bar',
  pinnedAt: '2025-10-26T10:30:00Z',
  gridPosition: { x: 0, y: 0, w: 2, h: 2 }
}
```

## User Workflows

### Pin Chart from Chat
1. User views chat conversation in `detail-chat.html`
2. Agent generates chart artifact → appears in artifact panel
3. User clicks "Pin to Dashboard" button in artifact panel header
4. Modal appears: "Pin Chart to Dashboard"
   - Input field labeled "Chart Name"
   - Pre-filled with artifact title (editable)
   - Character limit: 50 characters
5. User edits name (optional) and clicks "Save"
6. Chart data stored in sessionStorage
7. Success toast notification: "Chart pinned to Dashboard"
8. Modal closes

### Navigate to Dashboard
1. User clicks "Dashboard" in sidebar navigation
2. Browser navigates to `pages/dashboard.html`
3. Dashboard loads and reads from sessionStorage
4. Pinned charts rendered in Gridstack grid
5. If no charts: empty state displayed with "Go to Chat" CTA

### Reposition Chart (Drag)
1. User clicks and holds on chart card header
2. Gridstack highlights valid drop zones
3. Card follows cursor with transparency (0.8 opacity)
4. On drop, card snaps to grid position
5. Grid auto-rearranges other cards (no overlap)
6. Position saved to sessionStorage immediately

### Resize Chart
1. User hovers over chart card → resize handles appear
2. User drags corner or edge handle
3. Visual feedback: dashed border shows new size
4. Chart.js canvas re-renders at new dimensions
5. Constraints enforced: min 1×1, max 6×4 grid units
6. Size saved to sessionStorage on release

### Expand Chart (Fullscreen)
1. User clicks expand button on chart card
2. Fullscreen modal appears:
   - Dark backdrop (rgba(0, 0, 0, 0.7))
   - Large chart (80vw × 70vh)
   - Chart title at top
   - Close button (×) in top-right
3. Chart rendered at larger scale
4. Close via: close button, ESC key, or backdrop click

### Remove Chart (Unpin)
1. User clicks remove (×) button on chart card
2. Confirmation dialog appears:
   - Title: "Remove Chart?"
   - Message: "Are you sure you want to remove '{chart name}' from the dashboard?"
   - Buttons: Cancel | Remove (danger red)
3. On confirm:
   - Card fades out (300ms)
   - Removed from grid and sessionStorage
   - Remaining cards auto-rearrange
   - Success toast: "Chart removed from dashboard"

## UI Components

### Dashboard Page Header
Matches `pages/agents.html` structure:
- **Title Section:**
  - H1: "Dashboard"
  - Subtitle: "View and organize your pinned charts"
- **Header Actions:**
  - Date range selector (13 June 2023 - 14 July 2023)
  - Download button (primary style)
  - User menu dropdown

### Dashboard Chart Card
```html
<div class="grid-stack-item" gs-x="0" gs-y="0" gs-w="2" gs-h="2">
  <div class="grid-stack-item-content">
    <div class="dashboard-chart-card">
      <!-- Card Header (drag handle) -->
      <div class="chart-card-header">
        <h3 class="chart-card-title">Revenue Growth Q3 2024</h3>
        <div class="chart-card-controls">
          <button class="btn btn-ghost btn-sm btn-icon" title="Refresh">
            <!-- refresh icon (placeholder) -->
          </button>
          <button class="btn btn-ghost btn-sm btn-icon" title="Expand">
            <!-- expand icon -->
          </button>
          <button class="btn btn-ghost btn-sm btn-icon" title="Remove">
            <!-- x icon -->
          </button>
        </div>
      </div>

      <!-- Chart Canvas -->
      <div class="chart-card-body">
        <canvas id="dashboard-chart-{id}"></canvas>
      </div>
    </div>
  </div>
</div>
```

**Card Features:**
- **Drag:** Entire header acts as drag handle
- **Resize:** 8 handles (4 corners + 4 edges) provided by Gridstack
- **Controls:**
  - Refresh: Placeholder icon (no functionality in prototype)
  - Expand: Opens fullscreen modal
  - Remove: Shows confirmation dialog → unpins chart
- **Styling:**
  - Background: white
  - Border: 1px solid `--border-color`
  - Border radius: 8px
  - Box shadow: 0 2px 4px rgba(0,0,0,0.05)
  - Hover: 0 4px 12px rgba(0,0,0,0.1)

### Pin Modal
```html
<div class="modal-overlay pin-modal" id="pinModal">
  <div class="modal-card">
    <div class="modal-header">
      <h3>Pin Chart to Dashboard</h3>
      <button class="btn btn-ghost btn-sm btn-icon" onclick="closePinModal()">
        <!-- x icon -->
      </button>
    </div>
    <div class="modal-body">
      <label class="form-label">Chart Name</label>
      <input type="text" class="form-input" id="chartNameInput"
             placeholder="Enter a name for this chart..." maxlength="50">
      <span class="form-hint">Max 50 characters</span>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary btn-md" onclick="closePinModal()">
        Cancel
      </button>
      <button class="btn btn-primary btn-md" onclick="confirmPinChart()">
        Save
      </button>
    </div>
  </div>
</div>
```

**Modal Behavior:**
- Backdrop click closes modal
- ESC key closes modal
- Enter key submits (same as Save button)
- Input pre-filled with artifact title
- Max 50 characters enforced

### Empty State
```html
<div class="dashboard-empty-state">
  <svg class="empty-state-icon">
    <!-- large dashboard icon -->
  </svg>
  <h3>No charts pinned yet</h3>
  <p>Create charts in chat conversations and pin them here to build your dashboard.</p>
  <a href="detail-chat.html" class="btn btn-primary btn-md">
    <svg><!-- chat icon --></svg>
    <span>Go to Chat</span>
  </a>
</div>
```

### Gridstack Configuration
```javascript
{
  column: 6,                    // 6-column grid
  cellHeight: 120,              // Base row height (px)
  margin: 16,                   // Gap between cards (px)
  float: false,                 // Tight packing, no floating
  resizable: {
    handles: 'e, se, s, sw, w'  // 5 handles (right, corners, bottom, left)
  },
  draggable: {
    handle: '.chart-card-header' // Only header is draggable
  },
  minRow: 1,                    // Minimum 1 row
  disableOneColumnMode: false   // Stack to 1 column on mobile
}
```

## File Structure

### New Files
```
redesign-ai-studio/
├── pages/
│   └── dashboard.html              # New dashboard page (~250 lines)
├── assets/
│   └── js/
│       └── dashboard.js            # Dashboard logic (~400 lines)
```

### Updated Files
```
redesign-ai-studio/
├── components/
│   └── sidebar.html                # Add Dashboard nav item (+10 lines)
├── assets/
│   ├── css/
│   │   └── styles.css              # Dashboard styles (+300 lines)
│   └── js/
│       └── app.js                  # Pin modal logic (+50 lines)
```

## Implementation Components

### dashboard.html Structure
- SVG icon sprite (shared)
- Sidebar container (loaded dynamically)
- Page header (title, actions, user menu)
- Main content with Gridstack grid container
- Empty state (hidden when charts exist)
- Pin modal markup
- Fullscreen chart modal markup
- Confirmation dialog markup
- Script imports: Gridstack CSS/JS, Chart.js, app.js, dashboard.js

### dashboard.js Functions

**Initialization:**
- `initDashboard()` - Main initialization function
- `initializeGridstack()` - Configure and create Gridstack instance
- `loadPinnedCharts()` - Read from sessionStorage

**Rendering:**
- `renderPinnedCharts()` - Render all charts in grid
- `createChartCard(chartData)` - Generate HTML for single card
- `initializeChartCanvas(chartId, config)` - Initialize Chart.js
- `showEmptyState()` / `hideEmptyState()` - Toggle empty state

**State Management:**
- `savePinnedCharts()` - Write array to sessionStorage
- `addPinnedChart(chartData)` - Add new chart to state
- `removePinnedChart(chartId)` - Remove chart from state
- `updateChartPosition(chartId, position)` - Update grid position

**Interactions:**
- `expandChart(chartId)` - Open fullscreen modal
- `closeFullscreenModal()` - Close fullscreen modal
- `removeChart(chartId)` - Show confirmation → remove
- `confirmRemoveChart(chartId)` - Execute removal
- Event listeners for drag, resize, button clicks

### app.js Updates (Pin from Chat)

**New Functions:**
- `showPinModal(artifactId)` - Display pin modal with pre-filled name
- `closePinModal()` - Hide pin modal
- `confirmPinChart()` - Save to sessionStorage and show toast
- `showToast(message, type)` - Toast notification

**UI Changes:**
- Add pin button to artifact panel header (only on detail-chat.html)
- Add event listener for pin button click

### styles.css Updates

**New Style Sections:**
```css
/* Dashboard Page Styles */
.dashboard-empty-state { ... }
.dashboard-chart-card { ... }
.chart-card-header { ... }
.chart-card-body { ... }
.chart-card-controls { ... }

/* Gridstack Customizations */
.grid-stack { ... }
.grid-stack-item { ... }
.grid-stack-item-content { ... }
.grid-stack-placeholder { ... }

/* Pin Modal */
.pin-modal { ... }
.modal-overlay { ... }
.modal-card { ... }
.modal-header { ... }
.modal-body { ... }
.modal-footer { ... }

/* Fullscreen Chart Modal */
.fullscreen-chart-modal { ... }

/* Confirmation Dialog */
.confirmation-dialog { ... }

/* Toast Notifications */
.toast { ... }
.toast.success { ... }
```

### sidebar.html Updates

Add Dashboard navigation item before Agents:
```html
<a href="dashboard.html" class="nav-item" data-page="dashboard">
  <svg class="nav-icon" viewBox="0 0 24 24">
    <use href="../assets/icons/icons.svg#dashboard-icon"/>
  </svg>
  <span class="nav-label">Dashboard</span>
</a>
```

## CDN Dependencies

Add to `<head>` of dashboard.html:
```html
<!-- Gridstack.js CSS -->
<link href="https://cdn.jsdelivr.net/npm/gridstack@10.1.2/dist/gridstack.min.css" rel="stylesheet">

<!-- Gridstack.js JavaScript (before app.js) -->
<script src="https://cdn.jsdelivr.net/npm/gridstack@10.1.2/dist/gridstack-all.js"></script>
```

## Responsive Behavior

**Desktop (>1200px):**
- Full 6-column grid
- Charts maintain custom sizes
- Sidebar expanded by default

**Tablet (768px-1200px):**
- 6-column grid maintained
- Smaller chart cards
- Sidebar collapsible

**Mobile (<768px):**
- Gridstack auto-stacks to 1 column
- Charts take full width
- Sidebar hidden, accessible via toggle
- Fullscreen modal becomes full viewport

## Design System Integration

**Colors:**
- Chart cards: `--background-white` background
- Borders: `--border-color`
- Buttons: Existing button system (primary, secondary, ghost)
- Modal backdrop: rgba(0, 0, 0, 0.7)

**Typography:**
- Chart card title: 16px, font-weight 600
- Modal title: 20px, font-weight 600
- Body text: 14px

**Spacing:**
- Grid gap: 16px
- Card padding: 16px
- Modal padding: 24px

**Branding:**
- Maintains Dinkominfo Surabaya color scheme
- Government accent stripe in sidebar
- Professional, accessible design

## Testing Checklist

### Pin Functionality
- [ ] Pin button appears in artifact panel header (detail-chat.html)
- [ ] Pin button only shows for chart artifacts (not code/document)
- [ ] Click pin button opens modal
- [ ] Modal pre-fills with artifact title
- [ ] Character limit (50) enforced
- [ ] Save creates entry in sessionStorage
- [ ] Success toast appears after save
- [ ] Modal closes on: Save, Cancel, ESC, backdrop click

### Dashboard Load
- [ ] Dashboard accessible via sidebar navigation
- [ ] Sidebar shows Dashboard as active
- [ ] Empty state shows when no charts pinned
- [ ] Pinned charts render correctly from sessionStorage
- [ ] Chart.js initializes for each canvas
- [ ] Charts display with correct data

### Drag and Drop
- [ ] Header acts as drag handle
- [ ] Card follows cursor while dragging
- [ ] Valid drop zones highlighted
- [ ] Cards snap to grid on drop
- [ ] Other cards auto-rearrange (no overlap)
- [ ] Position saved to sessionStorage

### Resize
- [ ] Resize handles appear on hover (8 handles)
- [ ] Dragging handle resizes card
- [ ] Visual feedback during resize (dashed border)
- [ ] Chart canvas re-renders at new size
- [ ] Min/max constraints enforced (1×1 to 6×4)
- [ ] Size saved to sessionStorage

### Expand/Fullscreen
- [ ] Click expand button opens fullscreen modal
- [ ] Chart renders at larger scale
- [ ] Chart title displayed
- [ ] Close button works
- [ ] ESC key closes modal
- [ ] Backdrop click closes modal

### Remove/Unpin
- [ ] Click remove button shows confirmation dialog
- [ ] Dialog shows correct chart name
- [ ] Cancel closes dialog without removing
- [ ] Confirm removes card from grid
- [ ] Card removed from sessionStorage
- [ ] Remaining cards rearrange
- [ ] Success toast appears

### Responsive
- [ ] Desktop: 6-column grid displays correctly
- [ ] Tablet: Grid maintains layout, sidebar collapsible
- [ ] Mobile: Charts stack to 1 column
- [ ] Touch: Drag and resize work on touch devices

### State Persistence
- [ ] Charts persist during session (page refresh)
- [ ] Grid positions persist
- [ ] Chart sizes persist
- [ ] State clears on browser close (sessionStorage behavior)

## Future Enhancements (Out of Scope)

- **Backend Integration:** Persist to database instead of sessionStorage
- **User Accounts:** Per-user dashboard configurations
- **Dashboard Templates:** Pre-built dashboard layouts
- **Chart Filtering:** Date range filters for chart data
- **Live Data:** Real-time chart updates from API
- **Export:** Export dashboard as PDF or image
- **Sharing:** Share dashboard via URL
- **Annotations:** Add notes/comments to charts
- **Multiple Dashboards:** Create and manage multiple dashboards
- **Chart Editing:** Edit chart configuration from dashboard

## Summary

This design provides a complete, user-friendly dashboard feature that integrates seamlessly with the existing BotBrigade AI Studio interface. Users can pin important chart visualizations from chat conversations, organize them in a flexible grid layout, and access them easily via the main navigation. The implementation maintains the project's static HTML/CSS approach while adding sophisticated drag-and-drop functionality through Gridstack.js.

The dashboard respects the government branding requirements, follows the established design system, and provides a professional interface suitable for internal government use at Dinkominfo Surabaya.
