# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BotBrigade AI Studio is a static HTML/CSS dashboard for managing AI agents, designed for Dinkominfo Surabaya (Surabaya City Government IT Department). This is a redesign/prototype of the AI Studio interface featuring official government branding.

**Project Status:** Static prototype (no backend integration)

## Architecture

### Technology Stack
- **Pure HTML/CSS** - No build process, bundlers, or frameworks
- **Vanilla JavaScript** - Minimal inline JS for interactive features (sidebar toggle only)
- **Static Files** - Can be served directly via any web server or opened in browser

### File Structure
```
redesign-ai-studio/
├── agents.html          (526 lines) - Main dashboard with agent grid/list view
├── detail-chat.html     (299 lines) - Chat interface for agent interaction
└── styles.css          (1318 lines) - Shared stylesheet for all pages
```

**Core Pages:**
- `agents.html` - "AI Agents Dashboard - Improved" with filtering, search, and agent cards
- `detail-chat.html` - Chat interface with conversation history and message bubbles
- `styles.css` - Comprehensive stylesheet with Dinkominfo Surabaya brand system

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
open agents.html  # macOS
# or double-click the file in file explorer
```

**Option 2: Local HTTP Server (Recommended)**
```bash
# Using Python
python3 -m http.server 8000
# Then visit: http://localhost:8000/agents.html

# Using Node.js (if you have npx)
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

#### Making Changes

**1. Styling Changes**
- **Location:** All CSS in `styles.css` (shared by both pages)
- **CSS Variables:** Defined in `:root` for consistent theming
- **Layout System:** CSS Grid for agent cards, Flexbox for components
- **Responsive Breakpoints:**
  - Desktop: 1200px and above
  - Tablet: 768px to 1199px
  - Mobile: below 768px
- **Workflow:** Edit `styles.css` → refresh browser → see changes

**2. Content Updates**
- **Agent Data:** Hardcoded in `agents.html` (`.agent-card` blocks)
- **Chat Messages:** Hardcoded in `detail-chat.html` (`.message` blocks)
- **No Build Step:** Changes visible immediately on page refresh
- **Duplication:** Sidebar code is duplicated across both HTML files

**3. JavaScript Implementation**
- **Current JS:** Minimal inline `<script>` tag at bottom of each HTML file
- **Implemented Function:** `toggleSidebar()` only
  ```javascript
  function toggleSidebar() {
      document.querySelector('.sidebar').classList.toggle('collapsed');
  }
  ```
- **Future Needs:** Search, filtering, form handling, chat interactions
- **Recommendation:** Consider moving to external JS file when adding features

#### Adding New Features

**Adding a New Agent Card (in agents.html):**

Find an existing `.agent-card` block and duplicate it. Modify these key elements:

```html
<div class="agent-card">
  <div class="agent-header">
    <div>
      <h3 class="agent-name">Your Agent Name</h3>
      <p class="agent-description">Brief description (max 2 lines, auto-truncated)</p>
    </div>
    <span class="badge status-active">Active</span>  <!-- or status-inactive -->
  </div>

  <div class="agent-meta">
    <div class="meta-item">
      <span class="meta-label">Model:</span>
      <span class="meta-value">gpt-4</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Tools:</span>
      <span class="badge tools-badge">5</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Created:</span>
      <span class="meta-value">2024-03-15</span>
    </div>
  </div>

  <div class="agent-actions">
    <button class="btn-chat">Chat</button>
  </div>
</div>
```

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
- ✅ Responsive layout adjustments
- ✅ Hover states and visual feedback
- ✅ Static content display

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

**Buttons:**
- `.btn-primary` - Primary action button (blue)
- `.btn-secondary` - Secondary action button (outline)
- `.btn-chat` - Chat action button
- `.icon-btn` - Icon-only button
- `.new-thread-btn` - New chat button in sidebar
- `.sidebar-toggle` - Sidebar collapse toggle

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

### File Locations

| What to Edit | File | Line Range (approx) |
|-------------|------|---------------------|
| Agent cards data | `agents.html` | 130-500 |
| Chat messages | `detail-chat.html` | 120-250 |
| Color scheme | `styles.css` | 8-28 (:root) |
| Sidebar styles | `styles.css` | 37-150 |
| Agent card styles | `styles.css` | 300-600 |
| Chat styles | `styles.css` | 700-1100 |
| Responsive rules | `styles.css` | 1200-1318 |

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
