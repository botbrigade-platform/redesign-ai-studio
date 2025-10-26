# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BotBrigade AI Studio is a static HTML/CSS dashboard for managing AI agents, designed for Dinkominfo Surabaya (Surabaya City Government IT Department). This is a redesign/prototype of the AI Studio interface featuring official government branding.

**Project Status:** Static prototype (no backend integration)

## Architecture

### Technology Stack
- **Pure HTML/CSS** - No build process, bundlers, or frameworks
- **Vanilla JavaScript** - Interactive features (sidebar toggle, search, filters, artifact panel, dashboard grid)
- **External Libraries (CDN)** - Prism.js (syntax highlighting), Chart.js (charts), Marked.js (markdown), Gridstack.js (drag-drop grid)
- **Static Files** - Can be served directly via any web server or opened in browser

### File Structure (Updated 2025-10-26)
```
redesign-ai-studio/
├── README.md                         # Main documentation with quick start guide
├── CLAUDE.md                         # This file - guidance for Claude Code
├── index.html                        # Landing page with navigation
│
├── pages/                            # HTML pages
│   ├── dashboard.html                # Dashboard with pinned charts (Gridstack)
│   ├── agents.html                   # AI Agents grid/list view
│   └── detail-chat.html              # Chat interface with artifact display panel
│
├── assets/                           # All static assets
│   ├── css/
│   │   └── styles.css                # Comprehensive stylesheet (~100KB, 2895 lines)
│   ├── js/
│   │   ├── app.js                    # Main JavaScript logic (~30KB, 766 lines)
│   │   ├── artifact-manager.js       # Artifact panel functionality (~15KB, 373 lines)
│   │   └── dashboard.js              # Dashboard grid logic (~35KB, 872 lines)
│   └── icons/
│       └── icons.svg                 # SVG icon library
│
├── components/                       # Reusable HTML components
│   └── sidebar.html                  # Sidebar navigation component
│
└── docs/                             # Documentation
    ├── DESIGN_SYSTEM.md              # Brand colors, typography, component guide
    ├── TESTING.md                    # Manual testing checklist
    ├── screenshots/                  # Page screenshots for documentation
    └── plans/                        # Design & implementation plans
        ├── 2025-10-24-artifact-display-design.md
        ├── 2025-10-24-artifact-display-implementation.md
        └── 2025-10-26-dashboard-pinned-charts-design.md
```

**Core Pages:**
- `index.html` - Landing page with links to all main pages (dashboard, agents, chat)
- `pages/dashboard.html` - Dashboard with pinned chart visualizations (Gridstack.js drag-drop grid)
- `pages/agents.html` - AI Agents Dashboard with filtering, search, agent cards
- `pages/detail-chat.html` - Chat interface with artifact display panel (code/document/chart)

**Key JavaScript Files:**
- `assets/js/app.js` - Sidebar loading, search, filters, user menu, agent card generation, pin modal
- `assets/js/artifact-manager.js` - Artifact panel (slide-in panel, syntax highlighting, copy-to-clipboard)
- `assets/js/dashboard.js` - Dashboard grid management (Gridstack integration, chart rendering, state persistence)

### Design System

#### Brand Colors (Dinkominfo Surabaya Official)
```css
/* Primary Colors */
--primary-blue: #072ac8          /* Main brand color */
--primary-blue-dark: #051f96     /* Darker variant */
--primary-blue-light: #0835fa    /* Lighter variant */
--primary-yellow: #ffc600        /* Accent color */
--primary-yellow-dark: #e6b200   /* Darker variant */
--primary-yellow-light: #ffd633  /* Lighter variant */

/* Soft Accents */
--accent-blue-soft: #e8edff      /* Light blue backgrounds */
--accent-yellow-soft: #fff8e0    /* Light yellow backgrounds */

/* Neutrals */
--neutral-dark: #1a2332          /* Dark text/elements */
--neutral-medium: #4b5563        /* Medium gray */
--neutral-light: #9ca3af         /* Light gray */
--background-gray: #f5f7fa       /* Page background */
--background-white: #ffffff      /* Card/panel backgrounds */
--border-color: #e1e8ef          /* Border color */
--text-primary: #1a2332          /* Primary text */
--text-secondary: #6b7280        /* Secondary text */

/* Status Colors */
--success-green: #00A651         /* Active status */
--success-green-light: #e6f7ef   /* Light green backgrounds */
```

**Government Branding Element:**
- Distinctive 4px horizontal stripe at top of sidebar (`.gov-accent` class)
- Split 50/50: top half blue (`--primary-blue`), bottom half yellow (`--primary-yellow`)
- Represents official Dinkominfo Surabaya visual identity

#### Key UI Components

1. **Sidebar Navigation** (`.sidebar`)
   - Fixed 240px width, collapsible to 60px via toggle button
   - **Logo Section:** "BotBrigade" with "Dashboard Internal" subtitle
   - **Navigation Items:** Dashboard (inactive), Agents (active on agents.html)
   - **New Chat Button:** Only on detail-chat.html (`.new-thread-btn`)
   - **Conversation History:** Shows truncated chat titles (detail-chat.html only)
   - **Settings Button:** Fixed at bottom of sidebar
   - Collapse state managed via `.collapsed` class on `.sidebar`
   - Toggle button positioned at top-right of sidebar (absolute positioning)
   - All text/labels hidden when collapsed, icons remain centered

2. **Agent Cards** (`.agent-card` on agents.html)
   - Grid layout: `repeat(auto-fill, minmax(360px, 1fr))`
   - **Status Badges:** `.status-active` (green) or `.status-inactive` (gray)
   - **Tools Badge:** Shows number of integrated tools (`.badge.tools-badge`)
   - **Metadata:** Model name and creation date (`.meta-item`)
   - **Chat Button:** Primary action (`.btn-chat`)
   - **Visual States:** Inactive agents have reduced opacity (0.7) and disabled chat button

3. **Chat Interface** (detail-chat.html)
   - **Agent Header:** Shows agent name, description, and back button
   - **Message Bubbles:** `.message` (agent) vs `.message.user-message` (user)
   - **Message Components:** Avatar (`.message-avatar`), bubble (`.message-bubble`), timestamp
   - **File Attachments:** Support for file previews with thumbnails (`.message-attachments`)
   - **Input Area:** Text input with send button and attachment option
   - **Tooltip:** Truncated agent descriptions show full text on hover (`.description-tooltip`)

4. **Artifact Display Panel** (detail-chat.html)
   - **Slide-in Panel:** 500px width panel from right side (`.artifact-panel`)
   - **Artifact Types:**
     - **Code:** Syntax highlighting via Prism.js (Python, JavaScript, HTML, CSS, JSON)
     - **Documents:** Markdown rendering via Marked.js with formatted typography
     - **Charts:** Interactive charts via Chart.js (bar, line, pie charts supported)
   - **Features:**
     - Copy to clipboard functionality with visual feedback (checkmark animation)
     - Artifact list dropdown (shows all artifacts in conversation with icons)
     - Multiple close options: Close button, ESC key, backdrop click (mobile)
     - Artifact switching without closing panel
     - Line numbers for code artifacts
   - **Responsive:**
     - Desktop: Slide-in panel with resizable width
     - Mobile: Fullscreen overlay with dark backdrop
   - **Thumbnails:** Artifact previews in chat messages (`.artifact-thumbnail`)
   - **State Management:** Managed by `ArtifactStore` in `artifact-manager.js`
   - **Sample Content:** 3 pre-loaded artifacts (financial report, Python script, revenue chart)

5. **Resizable Split-Pane Layout** (detail-chat.html)
   - **Resize Handle:** Vertical draggable divider between chat and artifact panel (`.resize-handle`)
   - **Functionality:**
     - Mouse drag to resize chat/artifact panel widths
     - Visual feedback on hover (blue highlight)
     - Cursor changes to `col-resize` during drag
     - Smooth real-time resizing
   - **Constraints:**
     - Minimum chat width: Prevents over-compression
     - Minimum artifact panel width: 400px (maintains readability)
     - Maximum artifact panel width: 70% of viewport
   - **Implementation:** Event listeners in `app.js` (`startResize`, `doResize`, `stopResize`)
   - **Responsive:** Only active on desktop (>768px), disabled on mobile

#### State Management Patterns

- **Sidebar collapse**: Toggle `.collapsed` class on `.sidebar` element
- **Active navigation**: `.active` class on `.nav-item` or `.conversation-item`
- **Disabled states**: Use `:has(.status-inactive)` selector for agent cards
- **View toggle**: `.active` class on `.view-btn` for grid/list views

### Development Workflow

#### Running the Project

**Option 1: Direct File Opening**
```bash
# Simply open in browser (works for basic viewing)
open index.html  # macOS - landing page
open pages/agents.html  # macOS - direct to dashboard
# or double-click the file in file explorer
```

**Option 2: Local HTTP Server (Recommended)**
```bash
# Using Python
python3 -m http.server 8000
# Then visit:
# http://localhost:8000/                    (landing page)
# http://localhost:8000/pages/agents.html   (dashboard)
# http://localhost:8000/pages/detail-chat.html  (chat)

# Using Node.js (if you have npx)
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

#### Making Changes

**1. Styling Changes**
- **Location:** All CSS in `assets/css/styles.css` (shared by all pages)
- **CSS Variables:** Defined in `:root` for consistent theming
- **Layout System:** CSS Grid for agent cards, Flexbox for components
- **Responsive Breakpoints:**
  - Desktop: 1200px and above
  - Tablet: 768px to 1199px
  - Mobile: below 768px
- **Workflow:** Edit `assets/css/styles.css` → refresh browser → see changes

**2. Content Updates**
- **Agent Data:** Generated dynamically by `assets/js/app.js` (see `generateAgentCards()`)
- **Chat Messages:** Hardcoded in `pages/detail-chat.html` (`.message` blocks)
- **Sidebar:** Loaded from `components/sidebar.html` via fetch in `app.js`
- **No Build Step:** Changes visible immediately on page refresh

**3. JavaScript Implementation**
- **Main Logic:** `assets/js/app.js` (~30KB, 766 lines)
  - **Sidebar Management:**
    - `loadSidebar(activePage)` - Fetches and loads sidebar component
    - `toggleSidebar()` - Sidebar collapse/expand
    - `addChatSidebarContent()` - Adds chat-specific sidebar content (conversation history, new thread button)
  - **Agent Card System:**
    - `createAgentCard(agent)` - Generates HTML for a single agent card
    - `renderAgentCards()` - Renders all agent cards to DOM from agentsData array
  - **User Interface:**
    - `toggleUserMenu()` - Toggle user dropdown visibility
    - `initChatTextarea()` - Auto-resize textarea in chat input
  - **Artifact Panel Control:**
    - `openArtifactPanel(artifactId)` - Opens artifact panel with specific artifact
    - `closeArtifactPanel()` - Closes artifact panel and restores sidebar state
    - `getLatestArtifact()` - Retrieves most recent artifact by timestamp
    - `toggleArtifactList()` - Toggle artifact list dropdown
    - `copyArtifactContent()` - Copy artifact content to clipboard
    - `showCopyFeedback()` - Visual feedback when copy succeeds
    - `renderArtifact(artifact)` - Renders artifact content with syntax highlighting
  - **Resizable Split-Pane:**
    - `initializeResizeHandler()` - Setup resizable divider between chat and artifact panel
    - `startResize(e)`, `doResize(e)`, `stopResize()` - Mouse drag handlers for resize
  - **Pin Chart Modal:**
    - `showPinModal(artifactId)` - Display pin modal for chart artifacts
    - `closePinModal()` - Close pin modal
    - `confirmPinChart()` - Save chart to sessionStorage and show toast
    - `showToast(message, type)` - Toast notification system
  - Search and filter functionality (UI-only, no backend)

- **Artifact Panel:** `assets/js/artifact-manager.js` (~15KB, 373 lines)
  - **Artifact Store Object:**
    - `ArtifactStore.add(artifact)` - Add artifact to store
    - `ArtifactStore.get(id)` - Retrieve artifact by ID
    - `ArtifactStore.getAll()` - Get all artifacts as array
    - `ArtifactStore.setCurrent(id)` - Set current active artifact
    - `ArtifactStore.getCurrent()` - Get current artifact
    - `ArtifactStore.updateArtifactCount()` - Update count display in UI
  - **Rendering Functions:**
    - `renderDocumentArtifact(artifact)` - Converts markdown to HTML (uses Marked.js)
    - `renderCodeArtifact(artifact)` - Code with syntax highlighting (uses Prism.js)
    - `renderChartArtifact(artifact)` - Canvas-based chart rendering (uses Chart.js)
    - `initializeChart(artifact)` - Initialize Chart.js from config
    - `renderArtifactContent(artifact)` - Dispatcher to correct renderer based on type
    - `renderArtifactList()` - Render dropdown list of all artifacts
  - **Utility Functions:**
    - `escapeHTML(str)` - Sanitize HTML strings
    - `formatTimestamp(isoString)` - Format ISO timestamps to readable format
    - `getArtifactIcon(type)` - Return SVG icon for artifact type
    - `getArtifactMeta(artifact)` - Get metadata string (language, word count, chart type)
  - **Sample Artifacts:** 3 hardcoded artifacts (financial report, Python script, revenue chart)

- **Dashboard Grid:** `assets/js/dashboard.js` (~35KB, 872 lines)
  - **Initialization:**
    - `initDashboard()` - Main dashboard initialization
    - `initializeGridstack()` - Configure Gridstack.js (12-column grid, drag/drop, resize)
    - `loadPinnedCharts()` - Load charts from sessionStorage
    - `initResizeHandler()` - Window resize handler for responsive charts
  - **Rendering:**
    - `renderPinnedCharts(charts)` - Render all pinned charts to grid
    - `createChartCard(chartData)` - Generate HTML for single chart card
    - `initializeChartCanvas(chartId, config)` - Initialize Chart.js instance
    - `showEmptyState()` / `hideEmptyState()` - Toggle empty state display
  - **State Management:**
    - `savePinnedCharts()` - Persist charts to sessionStorage
    - `addPinnedChart(chartData)` - Add new chart to state
    - `removePinnedChart(chartId)` - Remove chart from state
    - `updateChartPosition(chartId, position)` - Update grid position in storage
  - **Interactions:**
    - `expandChart(chartId)` - Open fullscreen chart modal
    - `closeFullscreenModal()` - Close fullscreen view
    - `removeChart(chartId)` - Show confirmation dialog
    - `confirmRemoveChart()` - Execute chart removal
    - `clearAllCharts()` - Remove all charts with confirmation
    - `loadPreviewDashboard()` - Load sample dashboard for preview
  - **Gridstack Event Handlers:**
    - Grid change events → auto-save positions
    - Resize events → re-render Chart.js canvases
    - Drag events → update grid layout

#### Adding New Features

**Adding a New Agent Card:**

Agents are now generated dynamically from the `agentsData` array in `assets/js/app.js`.
To add a new agent, add an object to the array:

```javascript
// In assets/js/app.js, find the agentsData array and add:
{
    name: 'Your Agent Name',
    description: 'Brief description of what the agent does',
    model: 'gpt-4',
    tools: 5,
    status: 'active', // or 'inactive'
    created: '2024-03-15'
}
```

The `generateAgentCards()` function will automatically create the HTML markup.

**Adding a New Chat Message (in detail-chat.html):**

For an agent message:
```html
<div class="message">
  <div class="message-avatar">AG</div>
  <div class="message-content">
    <div class="message-bubble">Your message text here</div>
    <div class="message-time">10:30 AM</div>
  </div>
</div>
```

For a user message:
```html
<div class="message user-message">
  <div class="message-content">
    <div class="message-bubble">User message text</div>
    <div class="message-time">10:31 AM</div>
  </div>
  <div class="message-avatar">U</div>
</div>
```

With file attachments:
```html
<div class="message-attachments">
  <div class="attachment-item">
    <div class="attachment-icon">[icon]</div>
    <span class="attachment-name">filename.pdf</span>
    <span class="attachment-size">2.4 MB</span>
  </div>
</div>
```

### Design Considerations

1. **Government Context**
   - Professional, accessible design for government use
   - Official Dinkominfo Surabaya brand colors (must be preserved)
   - English UI labels (conversation examples in Indonesian)
   - Branded as "Dashboard Internal" for internal government use

2. **Agent Status Handling**
   - **Active agents:** Full color, interactive buttons, green status badge
   - **Inactive agents:** Reduced opacity (0.7), disabled/grayed chat button
   - Visual feedback via hover states and smooth transitions (0.2s-0.3s)
   - Status badge prominently displayed on each agent card

3. **Responsive Behavior**
   - **Desktop (>1200px):** Full sidebar + multi-column agent grid
   - **Tablet (768px-1200px):** Collapsible sidebar + 2-column grid
   - **Mobile (<768px):** Hidden sidebar, single-column layout
   - Message bubbles expand to 85% width on mobile
   - Touch-friendly button sizes (minimum 36x36px)

4. **Accessibility**
   - High contrast text colors (WCAG compliant)
   - Clear hover states on all interactive elements
   - Focus states with blue rings (`:focus-within`)
   - SVG icons use `currentColor` for proper theming
   - Proper semantic HTML structure

### Data Structures

The application uses the following data structures for managing agents, artifacts, and messages:

#### Agent Object
```javascript
{
  name: string,           // Agent display name (e.g., "Public Data Insight Agent")
  description: string,    // Agent capability description (2-line clamp in UI)
  status: "active" | "inactive",  // Agent operational status
  model: string,          // AI model identifier (e.g., "intelligence-n1", "gpt-4")
  created: string,        // Creation date (e.g., "Oct 21, 2025")
  tools: number           // Number of integrated tools (0-5+, displays badge if > 0)
}
```

**Example:**
```javascript
{
  name: "Public Data Insight Agent",
  description: "Specialized in analyzing and extracting insights from public datasets...",
  status: "active",
  model: "intelligence-n1",
  created: "Oct 21, 2025",
  tools: 0
}
```

**Storage:** `agentsData` array in `assets/js/app.js`

#### Artifact Object
```javascript
{
  id: string,             // Unique identifier (e.g., "artifact-001")
  type: "code" | "document" | "chart",  // Artifact type determines renderer
  title: string,          // Display title shown in panel header
  content: string,        // Raw content (code/markdown text or Chart.js config JSON)
  language: string,       // Code language for syntax highlighting (e.g., "python", "javascript")
  timestamp: string,      // ISO 8601 timestamp (e.g., "2025-10-24T13:16:00Z")
  messageId: string,      // Associated message ID for linking
  metadata: {
    wordCount?: number,   // For document artifacts
    lineCount?: number,   // For code artifacts
    chartType?: string    // For charts: "bar", "line", "pie", etc.
  }
}
```

**Example (Code Artifact):**
```javascript
{
  id: "artifact-002",
  type: "code",
  title: "Data Analysis Script",
  content: "import pandas as pd\nimport numpy as np\n...",
  language: "python",
  timestamp: "2025-10-24T13:16:00Z",
  messageId: "msg-002",
  metadata: {
    lineCount: 45
  }
}
```

**Example (Chart Artifact):**
```javascript
{
  id: "artifact-003",
  type: "chart",
  title: "Revenue Growth Q3 2024",
  content: '{"type":"bar","data":{"labels":["July","August","September"],...}}',
  language: null,
  timestamp: "2025-10-24T13:17:00Z",
  messageId: "msg-003",
  metadata: {
    chartType: "bar"
  }
}
```

**Storage:** `ArtifactStore` object in `assets/js/artifact-manager.js`

#### Message Object (Hardcoded in HTML)
```javascript
{
  type: "user" | "agent",    // Message sender type
  avatar: string,            // Avatar initials (e.g., "U" for user, "PD" for agent)
  sender: string,            // Display name (e.g., "You", "Public Data Agent")
  timestamp: string,         // Formatted time (e.g., "01:11 PM")
  text: string,              // Message content (supports markdown)
  attachments?: Array,       // Optional file attachments
  artifactId?: string        // Optional link to artifact
}
```

**Note:** Messages are currently hardcoded in `pages/detail-chat.html` as HTML blocks, not JavaScript objects. Structure shown above represents the conceptual data model.

### Icon Library

The project includes a comprehensive SVG icon library in `assets/icons/icons.svg` (131 lines). All icons use stroke-based design with `currentColor` for easy theming.

**Available Icons:**

**Navigation & Actions:**
- `arrow-left` - Back navigation, sidebar toggle
- `plus-icon` - Create/add actions
- `x-icon` - Close buttons
- `menu-dots` - Three-dot menu (vertical)
- `search-icon` - Search functionality

**Agent & Dashboard:**
- `robot-icon` - Agent/bot representation
- `dashboard-icon` - Dashboard/grid view
- `chat-icon` - Chat/conversation
- `tool-icon` - Tool/integration indicator
- `settings-icon` - Settings/configuration

**View Controls:**
- `grid-view-icon` - Grid layout view
- `list-view-icon` - List layout view
- `eye-icon` - View/preview actions
- `edit-icon` - Edit actions

**File & Media:**
- `file-icon` - Document/file representation
- `image-icon` - Image files
- `attach-icon` - Paperclip for attachments

**Communication:**
- `send-icon` - Send message button
- `copy-icon` - Copy to clipboard
- `share-icon` - Share functionality

**User:**
- `logout-icon` - Logout/sign out

**Icon Specifications:**
- **Design:** Stroke-based with `stroke-width: 2`
- **Color:** Uses `currentColor` to inherit from parent
- **Style:** `stroke-linecap="round"` and `stroke-linejoin="round"`
- **Sizes:** 16px (default), 20px (buttons), 24px (headers)
- **Usage:** Inline SVG in HTML with `<use>` references

**Example Usage:**
```html
<svg width="20" height="20">
  <use href="assets/icons/icons.svg#chat-icon"/>
</svg>
```

### Common Patterns

**Button Styles:**
- `.btn-primary` - Blue background with yellow shimmer effect on hover, white text
- `.btn-chat` - Primary action button in agent cards, uses `.btn-primary` styles
- `.btn-secondary` - Bordered outline, blue text, transparent background
- `.icon-btn` - Square icon-only buttons (36x36px minimum)
- `.new-thread-btn` - Full-width button in sidebar with icon + text
- `.sidebar-toggle` - Circular toggle button (32x32px) with rotation animation

**SVG Icons:**
- Inline SVG with stroke-based design (stroke-width: 2)
- Inherit color via `currentColor` for easy theming
- Standard sizes: 16px (default), 20px (larger icons in buttons)
- Consistent stroke-linecap="round" and stroke-linejoin="round"

**Hover Effects:**
- Smooth transitions (0.2s to 0.3s ease)
- Subtle transforms: `translateY(-1px)` for lift effect, `scale(1.05)` for emphasis
- Box shadows with brand color opacity for depth
- Button hover: background color shifts + shadow enhancement
- Card hover: subtle lift with shadow (0 4px 12px)

**Typography:**
- Font family: System font stack (-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, etc.)
- Heading sizes: h1 (24px), h2 (20px), h3 (16px)
- Body text: 14px default, 12px for secondary/meta text
- Line height: 1.5 for readability

### Current Implementation Status

**What Works (Functional):**
- ✅ Sidebar collapse/expand toggle (JavaScript implemented)
- ✅ Sidebar component loading via fetch
- ✅ Dynamic agent card generation from data array
- ✅ User menu dropdown toggle
- ✅ Chat textarea auto-resize
- ✅ Artifact display panel (code, document, chart)
- ✅ Artifact panel slide-in/out animation
- ✅ Artifact list dropdown with selection
- ✅ Copy to clipboard functionality with visual feedback
- ✅ Syntax highlighting (Prism.js for code artifacts)
- ✅ Markdown rendering (Marked.js for document artifacts)
- ✅ Chart rendering (Chart.js for chart artifacts)
- ✅ Split-pane resizable layout (drag to resize)
- ✅ Artifact thumbnails in chat messages
- ✅ ESC key to close artifact panel
- ✅ Responsive layout adjustments
- ✅ Hover states and visual feedback
- ✅ Static content display
- ✅ **Dashboard with pinned charts (Gridstack.js integration)**
- ✅ **Pin chart from chat to dashboard (modal + sessionStorage)**
- ✅ **Drag-and-drop chart repositioning on dashboard**
- ✅ **Resize charts via corner/edge handles**
- ✅ **Fullscreen chart modal for detailed viewing**
- ✅ **Remove charts with confirmation dialog**
- ✅ **Clear all charts functionality**
- ✅ **Auto-layout button for grid organization**
- ✅ **sessionStorage persistence (browser session only)**
- ✅ **Empty state with preview dashboard option**
- ✅ **Toast notifications for user feedback**

**What's UI-Only (Not Functional):**
- ❌ Search bar (no search logic)
- ❌ Filter dropdowns (no filtering logic)
- ❌ Sort functionality (no sorting logic)
- ❌ "Create Agent" button (no form/modal)
- ❌ "Chat" buttons on agent cards (links to detail-chat.html only)
- ❌ Message input/send (no chat backend)
- ❌ File attachment uploads (UI only)
- ❌ View toggle (Grid/List - no switching logic)
- ❌ Conversation history items (static, no routing)

### Future Integration Roadmap

When integrating with a backend system:

**Phase 1 - Data Layer:**
1. Replace hardcoded agent data with API calls
2. Implement agent CRUD operations (Create, Read, Update, Delete)
3. Set up authentication/authorization system
4. Create user session management

**Phase 2 - Interactive Features:**
5. Implement search functionality with debouncing
6. Add working filter/sort logic with URL query params
7. Build agent creation modal/form
8. Implement view toggle (grid ↔ list)

**Phase 3 - Chat Integration:**
9. Connect chat to WebSocket or Server-Sent Events
10. Implement real-time message streaming
11. Add file upload/storage handling with preview generation
12. Build conversation routing and state management

**Phase 4 - Advanced Features:**
13. Add agent configuration/settings panel
14. Implement tool integration management
15. Create analytics/usage tracking
16. Build notification system

**Architecture Notes:**
- Current structure designed for minimal refactoring when adding backend
- Consider using a lightweight framework (Alpine.js, htmx) or vanilla JS modules
- CSS classes are semantic and ready for dynamic state changes
- Component structure maps well to modern frontend frameworks if needed

---

## Quick Reference

### Common CSS Classes

**Layout:**
- `.sidebar` - Main navigation sidebar (240px → 60px when collapsed)
- `.sidebar.collapsed` - Collapsed state of sidebar
- `.main-content` - Main content area (adjusts with sidebar)
- `.header` - Page header with breadcrumb and title
- `.controls` - Filter and search controls bar

**Agent Cards:**
- `.agent-card` - Individual agent card container
- `.agent-header` - Card header with name and status
- `.agent-name` - Agent title (h3)
- `.agent-description` - Agent description (2-line clamp)
- `.agent-meta` - Metadata section (model, tools, created)
- `.agent-actions` - Action buttons area

**Status & Badges:**
- `.badge` - Base badge style
- `.status-active` - Green active status badge
- `.status-inactive` - Gray inactive status badge
- `.tools-badge` - Badge showing tool count

**Chat Components:**
- `.message` - Agent message container
- `.message.user-message` - User message (right-aligned)
- `.message-avatar` - Circular avatar with initials
- `.message-bubble` - Message content bubble
- `.message-time` - Timestamp below message
- `.message-attachments` - File attachment section
- `.chat-input-container` - Chat input area with textarea
- `.input-group` - Textarea wrapper with auto-resize
- `.attached-files` - Attached files preview section

**Artifact Panel:**
- `.artifact-panel` - Main artifact panel container (500px width)
- `.artifact-panel.open` - Open state (slides in from right)
- `.artifact-panel-header` - Panel header with controls
- `.artifact-list-btn` - Artifact list dropdown toggle
- `.artifact-list-dropdown` - Dropdown with all artifacts
- `.artifact-content-area` - Content rendering area
- `.artifact-empty-state` - Empty state message
- `.artifact-document` - Document artifact container
- `.artifact-code` - Code artifact with syntax highlighting
- `.artifact-chart` - Chart artifact with canvas
- `.artifact-thumbnail` - Thumbnail preview in messages
- `.artifact-panel-backdrop` - Mobile fullscreen backdrop
- `.resize-handle` - Draggable divider for split-pane
- `.copy-artifact-btn` - Copy button with "copied" state
- `.copy-artifact-btn.copied` - Visual feedback state after copy

**Buttons (Unified System):**

*Base Class:*
- `.btn` - Base button class (must be combined with variant and size)

*Variants:*
- `.btn-primary` - Filled blue with shimmer effect (main CTAs)
- `.btn-secondary` - Outlined style (secondary actions)
- `.btn-ghost` - Transparent with hover background (subtle actions)

*Sizes:*
- `.btn-lg` - Large (40px height) - Headers, important CTAs
- `.btn-md` - Medium (32px height) - Default size
- `.btn-sm` - Small (28px height) - Compact areas
- `.btn-xs` - Extra small (20px height) - Inline elements

*Types:*
- `.btn-icon` - Icon-only button (square)
- `.btn-text` - Text-only button
- (default) - Icon + text button

*Specialized:*
- `.menu-btn` - Three-dot menu button (32px square)
- `.send-btn` - Primary send button in chat input
- `.sidebar-toggle` - Sidebar collapse toggle
- `.new-thread-btn` - New chat button in sidebar

*Usage Examples:*
```html
<!-- Primary button with icon and text -->
<button class="btn btn-primary btn-md">
  <svg>...</svg>
  <span>Create Agent</span>
</button>

<!-- Secondary button -->
<button class="btn btn-secondary btn-md">
  <svg>...</svg>
  <span>View</span>
</button>

<!-- Icon-only ghost button -->
<button class="btn btn-ghost btn-md btn-icon" title="Share">
  <svg>...</svg>
</button>

<!-- Small ghost button with text -->
<button class="btn btn-ghost btn-sm">
  <svg>...</svg>
  <span>Copy</span>
</button>
```

**Navigation:**
- `.nav-item` - Navigation menu item
- `.nav-item.active` - Active navigation item
- `.conversation-item` - Conversation history item
- `.conversation-item.active` - Active conversation

**Utility:**
- `.gov-accent` - Government brand stripe (blue/yellow)
- `.breadcrumb` - Breadcrumb navigation
- `.search-bar` - Search input container
- `.filter-group` - Filter control group

### Common Tasks Cheat Sheet

**Toggle Sidebar:**
```javascript
document.querySelector('.sidebar').classList.toggle('collapsed');
```

**Open Artifact Panel:**
```javascript
openArtifactPanel('artifact-001'); // Opens specific artifact
```

**Close Artifact Panel:**
```javascript
closeArtifactPanel(); // Closes panel and restores sidebar
```

**Add New Artifact:**
```javascript
ArtifactStore.add({
  id: 'artifact-004',
  type: 'code',
  title: 'New Script',
  content: 'console.log("Hello");',
  language: 'javascript',
  timestamp: new Date().toISOString(),
  messageId: 'msg-004',
  metadata: { lineCount: 1 }
});
```

**Render Artifact:**
```javascript
const artifact = ArtifactStore.get('artifact-001');
renderArtifact(artifact);
```

**Change Agent Status:**
```html
<!-- From inactive to active -->
<span class="badge status-active">Active</span>
```

**Add Custom Color:**
```css
:root {
  --my-custom-color: #123456;
}
```

**Adjust Responsive Breakpoint:**
```css
@media (max-width: 768px) {
  /* Mobile styles */
}
```

### Key Interactions & Workflows

**Artifact Panel Workflow:**
1. User clicks "Show Artifact" button or artifact thumbnail in message
2. `openArtifactPanel(artifactId)` is called
3. Panel slides in from right (300ms animation)
4. Sidebar collapses to 60px to make room
5. Artifact content is rendered based on type (code/document/chart)
6. User can switch artifacts via dropdown without closing panel
7. User closes panel via close button, ESC key, or backdrop click
8. `closeArtifactPanel()` restores sidebar to original state

**Split-Pane Resize Workflow:**
1. User hovers over resize handle (`.resize-handle`)
2. Handle highlights blue, cursor changes to `col-resize`
3. User clicks and drags handle left/right
4. `doResize()` calculates new widths in real-time
5. Chat and artifact panel resize simultaneously
6. Constraints prevent over-compression (min/max widths)
7. User releases mouse, resize completes

**Agent Card Generation Workflow:**
1. Page loads, `DOMContentLoaded` event fires
2. `renderAgentCards()` iterates over `agentsData` array
3. For each agent, `createAgentCard(agent)` generates HTML
4. HTML includes status badge, metadata, action buttons
5. Inactive agents get reduced opacity and disabled chat button
6. Cards are inserted into `.agents-grid` container
7. Grid layout auto-arranges cards responsively

**Sidebar Component Loading:**
1. `loadSidebar(activePage)` fetches `components/sidebar.html`
2. HTML is inserted into `.sidebar` container
3. Active navigation item gets `.active` class based on page
4. If on detail-chat.html, `addChatSidebarContent()` adds conversation history
5. Event listeners attached for toggle button and navigation items

### File Locations

| What to Edit | File | Line Range |
|-------------|------|---------------------|
| **Page Content:** | | |
| Dashboard page | `pages/dashboard.html` | Full file (242 lines) |
| Agents page | `pages/agents.html` | Full file (~350 lines) |
| Chat page | `pages/detail-chat.html` | Full file (~900 lines) |
| Landing page | `index.html` | Full file (274 lines) |
| **JavaScript Logic:** | | |
| Agent cards data | `assets/js/app.js` | Lines 16-57 (agentsData array) |
| Dashboard grid logic | `assets/js/dashboard.js` | Full file (872 lines) |
| Artifact panel logic | `assets/js/artifact-manager.js` | Full file (373 lines) |
| Core app functions | `assets/js/app.js` | Full file (766 lines) |
| **Components:** | | |
| Sidebar navigation | `components/sidebar.html` | Full file (36 lines) |
| **CSS Architecture:** | | |
| CSS Variables/Design Tokens | `assets/css/styles.css` | Lines 1-50 |
| Sidebar Styles | `assets/css/styles.css` | Lines 60-354 |
| Unified Button System | `assets/css/styles.css` | Lines 390-622 |
| Badges | `assets/css/styles.css` | Lines 623-662 |
| Agents Page Styles | `assets/css/styles.css` | Lines 664-999 |
| Chat Page Styles | `assets/css/styles.css` | Lines 1001-1617 |
| Artifact Panel Styles | `assets/css/styles.css` | Lines 1645-2000 |
| Dashboard Styles | `assets/css/styles.css` | Lines 2000-2600 |
| Responsive Styles | `assets/css/styles.css` | Lines 2600-2895 |

### Project Constraints

**Must Preserve:**
- ✓ Dinkominfo Surabaya brand colors (blue #072ac8, yellow #ffc600)
- ✓ Government accent stripe in sidebar
- ✓ Static HTML/CSS approach (no build tools)
- ✓ Professional, accessible design

**Can Modify:**
- ✓ Layout proportions and spacing
- ✓ Additional features and components
- ✓ JavaScript implementation approach
- ✓ Content and agent data

**Recommendations:**
- Keep government branding consistent
- Maintain accessibility standards
- Test on mobile devices
- Consider progressive enhancement for JS features
