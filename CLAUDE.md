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

#### Opening Files
Since this is a static HTML project:
- Open HTML files directly in a browser
- Or use a simple HTTP server: `python3 -m http.server 8000`
- Files can be edited in any text editor

#### Making Changes

1. **Styling Changes**
   - All CSS is in the external `styles.css` file (shared by both pages)
   - CSS variables in `:root` for consistent theming
   - Uses CSS Grid and Flexbox for layouts
   - Responsive breakpoints at 1200px and 768px
   - Edit `styles.css` to make styling changes that affect both pages

2. **Content Updates**
   - Agent data is hardcoded in HTML
   - No backend/API integration yet
   - Search, filters, and buttons are non-functional (UI only)

3. **Interactive Features**
   - Minimal JS in inline `<script>` tags
   - Currently: sidebar toggle function only
   - Future: May need JS for search, filtering, form submission

#### Adding New Features

**New Agent Card:**
Copy existing `.agent-card` block and modify:
- `.agent-name` - Agent title
- `.agent-description` - Brief description (2-line clamp)
- `.badge.status-*` - Status indicator
- `.meta-value` - Model name and creation date

**New Chat Message:**
Use `.message` or `.message.user-message` structure with:
- `.message-avatar` - Avatar initials
- `.message-bubble` - Message content
- `.message-attachments` - Optional file attachments

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

### Future Integration Notes

This is currently a static prototype. When integrating with a backend:

1. Agent cards will need data from API endpoints
2. Search/filter functionality needs implementation
3. Chat messages should connect to websockets or polling
4. File attachments need upload/storage handling
5. User authentication/session management
6. Agent CRUD operations for dashboard

The structure is designed to accommodate these features with minimal refactoring.
