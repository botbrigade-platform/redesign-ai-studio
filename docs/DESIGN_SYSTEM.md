# Design System - BotBrigade AI Studio

> **Panduan lengkap brand identity, colors, typography, dan component patterns untuk BotBrigade AI Studio**
> Untuk frontend developers yang akan mengimplementasikan design ini ke production

---

## 📋 Daftar Isi

- [Brand Identity](#-brand-identity)
- [Color Palette](#-color-palette)
- [Typography](#-typography)
- [Spacing System](#-spacing-system)
- [Component Inventory](#%EF%B8%8F-component-inventory)
- [Layout Patterns](#-layout-patterns)
- [Icons](#-icons)
- [Responsive Breakpoints](#-responsive-breakpoints)
- [Interactive States](#-interactive-states)

---

## 🎨 Brand Identity

### Dinkominfo Surabaya Official Branding

Project ini menggunakan **official brand colors** dari Dinkominfo Surabaya (Dinas Komunikasi dan Informatika Kota Surabaya).

**Key Branding Element:** Government Accent Stripe
- **Location:** Top of sidebar (`.gov-accent` class)
- **Design:** 4px horizontal stripe
- **Colors:** Split 50/50
  - Top half: `--primary-blue` (#072ac8)
  - Bottom half: `--primary-yellow` (#ffc600)
- **Purpose:** Represents official government visual identity

**Usage Rules:**
- ✅ MUST preserve exact brand colors
- ✅ MUST keep government stripe in sidebar
- ✅ Professional, accessible design for government use
- ❌ DO NOT alter official blue/yellow color values
- ❌ DO NOT remove government branding stripe

---

## 🎨 Color Palette

### CSS Variables (dari `styles.css:8-28`)

```css
:root {
    /* Primary Colors */
    --primary-blue: #072ac8;          /* Main brand color */
    --primary-blue-dark: #051f96;     /* Darker variant */
    --primary-blue-light: #0835fa;    /* Lighter variant */

    --primary-yellow: #ffc600;        /* Accent color */
    --primary-yellow-dark: #e6b200;   /* Darker variant */
    --primary-yellow-light: #ffd633;  /* Lighter variant */

    /* Soft Accents */
    --accent-blue-soft: #e8edff;      /* Light blue backgrounds */
    --accent-yellow-soft: #fff8e0;    /* Light yellow backgrounds */

    /* Neutrals */
    --neutral-dark: #1a2332;          /* Dark text/elements */
    --neutral-medium: #4b5563;        /* Medium gray */
    --neutral-light: #9ca3af;         /* Light gray */

    --background-gray: #f5f7fa;       /* Page background */
    --background-white: #ffffff;      /* Card/panel backgrounds */
    --border-color: #e1e8ef;          /* Border color */

    --text-primary: #1a2332;          /* Primary text */
    --text-secondary: #6b7280;        /* Secondary text */

    /* Status Colors */
    --success-green: #00A651;         /* Active status */
    --success-green-light: #e6f7ef;   /* Light green backgrounds */
}
```

### Color Usage Guide

| Color Variable | Hex Code | Usage |
|----------------|----------|-------|
| `--primary-blue` | #072ac8 | Primary buttons, active states, links, government stripe |
| `--primary-yellow` | #ffc600 | Accent elements, hover effects, government stripe |
| `--accent-blue-soft` | #e8edff | Light backgrounds for blue-themed sections |
| `--accent-yellow-soft` | #fff8e0 | Light backgrounds for yellow-themed sections |
| `--neutral-dark` | #1a2332 | Primary text, headings |
| `--neutral-medium` | #4b5563 | Secondary text, labels |
| `--neutral-light` | #9ca3af | Disabled text, placeholders |
| `--background-gray` | #f5f7fa | Page background |
| `--background-white` | #ffffff | Cards, panels, modals |
| `--border-color` | #e1e8ef | Borders, dividers |
| `--success-green` | #00A651 | Active status badges, success states |

### Color Contrast (WCAG Compliance)

✅ **AAA Compliant:**
- `--text-primary` on `--background-white` (16.4:1)
- `--text-primary` on `--background-gray` (15.2:1)

✅ **AA Compliant:**
- `--primary-blue` on `--background-white` (8.9:1)
- `--text-secondary` on `--background-white` (4.8:1)

---

## ✍️ Typography

### Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
             Oxygen, Ubuntu, Cantarell, sans-serif;
```

**Rationale:** System font stack for:
- Native look & feel
- Excellent performance (no web font loading)
- Cross-platform consistency

### Font Sizes

| Element | Size | Line Height | Weight | Usage |
|---------|------|-------------|--------|-------|
| **h1** | 24px | 1.3 | 600 | Page titles |
| **h2** | 20px | 1.4 | 600 | Section headings |
| **h3** | 16px | 1.4 | 600 | Card titles, subsections |
| **Body** | 14px | 1.5 | 400 | Default body text |
| **Small** | 12px | 1.5 | 400 | Meta info, timestamps |
| **Tiny** | 11px | 1.4 | 500 | Badges, labels |

### Text Colors

```css
.text-primary   { color: var(--text-primary); }    /* #1a2332 */
.text-secondary { color: var(--text-secondary); }  /* #6b7280 */
.text-muted     { color: var(--neutral-light); }   /* #9ca3af */
```

### Example Usage

```html
<h1>AI Agents Dashboard</h1>
<h2>Active Agents</h2>
<h3 class="agent-name">Customer Support Bot</h3>
<p class="agent-description">Handles customer inquiries...</p>
<span class="meta-value">2024-03-15</span>
```

---

## 📏 Spacing System

### Base Unit: 8px

All spacing uses **8px increments** for consistency:

| Variable | Value | Usage |
|----------|-------|-------|
| `--space-xs` | 4px | Minimal spacing (icon margins) |
| `--space-sm` | 8px | Small gaps (badge padding) |
| `--space-md` | 12px | Medium gaps (button padding) |
| `--space-base` | 16px | Default spacing (card padding) |
| `--space-lg` | 20px | Large gaps (section margins) |
| `--space-xl` | 24px | Extra large (page margins) |
| `--space-2xl` | 32px | Section dividers |

### Padding Pattern

```css
/* Cards */
padding: 16px;  /* Base padding */

/* Buttons */
padding: 10px 16px;  /* Vertical: 10px, Horizontal: 16px */

/* Sections */
padding: 20px 24px;  /* Vertical: 20px, Horizontal: 24px */
```

---

## 🧱 Component Inventory

### 1. Sidebar Navigation

**File:** `sidebar.html`, `styles.css:37-150`

**Key Classes:**
- `.sidebar` - Main container (240px → 60px when collapsed)
- `.sidebar.collapsed` - Collapsed state
- `.gov-accent` - Government brand stripe (4px blue/yellow)
- `.logo` - Logo section
- `.nav-item` - Navigation menu item
- `.nav-item.active` - Active navigation state

**HTML Example:**

```html
<div class="sidebar">
    <!-- Government Branding Stripe -->
    <div class="gov-accent"></div>

    <!-- Logo -->
    <div class="logo">
        <div class="logo-icon">BB</div>
        <div class="logo-text">
            <h1>BotBrigade</h1>
            <p>Dashboard Internal</p>
        </div>
    </div>

    <!-- Navigation -->
    <nav>
        <a href="#" class="nav-item">
            <svg><!-- Icon --></svg>
            <span>Dashboard</span>
        </a>
        <a href="#" class="nav-item active">
            <svg><!-- Icon --></svg>
            <span>Agents</span>
        </a>
    </nav>

    <!-- Settings (Bottom) -->
    <button class="settings-btn">
        <svg><!-- Icon --></svg>
        <span>Settings</span>
    </button>
</div>
```

**Responsive Behavior:**
- Desktop: 240px width
- Collapsed: 60px width
- Mobile (<768px): Hidden, off-canvas

---

### 2. Agent Cards

**File:** `agents.html`, `styles.css:300-600` (approx)

**Key Classes:**
- `.agent-card` - Card container
- `.agent-header` - Card header (name + status)
- `.agent-name` - Agent title (h3)
- `.agent-description` - Description (2-line clamp)
- `.agent-meta` - Metadata section
- `.agent-actions` - Button area

**HTML Example:**

```html
<div class="agent-card">
    <!-- Header with Name & Status -->
    <div class="agent-header">
        <div>
            <h3 class="agent-name">Customer Support Bot</h3>
            <p class="agent-description">
                Handles customer inquiries and provides instant support
            </p>
        </div>
        <span class="badge status-active">Active</span>
    </div>

    <!-- Metadata -->
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

    <!-- Actions -->
    <div class="agent-actions">
        <button class="btn-chat">Chat</button>
    </div>
</div>
```

**States:**
- **Active:** Full color, interactive
- **Inactive:** Reduced opacity (0.7), disabled button

**Grid Layout:**
```css
.agent-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 20px;
}
```

---

### 3. Buttons

**File:** `styles.css:200-300` (approx)

**Button Variants:**

#### Primary Button
```html
<button class="btn-primary">
    Create Agent
</button>
```

**Styling:**
- Background: `--primary-blue`
- Text: white
- Hover: Yellow shimmer effect + shadow
- Border radius: 8px
- Padding: 10px 16px

#### Secondary Button
```html
<button class="btn-secondary">
    Cancel
</button>
```

**Styling:**
- Background: transparent
- Border: 1px solid `--primary-blue`
- Text: `--primary-blue`
- Hover: Background `--accent-blue-soft`

#### Icon Button
```html
<button class="icon-btn">
    <svg><!-- Icon --></svg>
</button>
```

**Styling:**
- Size: 36x36px minimum (touch-friendly)
- Square shape
- Icon-only, no text

#### Chat Button (on Agent Cards)
```html
<button class="btn-chat">Chat</button>
```

**Styling:**
- Inherits `.btn-primary` styles
- Full width in card
- Disabled state for inactive agents

---

### 4. Badges

**File:** `styles.css:250-280` (approx)

**Badge Variants:**

#### Status Badge (Active)
```html
<span class="badge status-active">Active</span>
```

**Styling:**
- Background: `--success-green-light`
- Text: `--success-green`
- Font size: 11px
- Padding: 4px 8px
- Border radius: 4px

#### Status Badge (Inactive)
```html
<span class="badge status-inactive">Inactive</span>
```

**Styling:**
- Background: `--neutral-light` (light gray)
- Text: `--neutral-medium`

#### Tools Badge
```html
<span class="badge tools-badge">5</span>
```

**Styling:**
- Background: `--accent-blue-soft`
- Text: `--primary-blue`
- Compact, numeric display

---

### 5. Chat Messages

**File:** `detail-chat.html`, `styles.css:700-1100` (approx)

**Key Classes:**
- `.message` - Agent message (left-aligned)
- `.message.user-message` - User message (right-aligned)
- `.message-avatar` - Circular avatar (initials)
- `.message-bubble` - Message content bubble
- `.message-time` - Timestamp below message

**HTML Example (Agent Message):**

```html
<div class="message">
    <div class="message-avatar">AG</div>
    <div class="message-content">
        <div class="message-bubble">
            I can help you with that. Let me analyze the data...
        </div>
        <div class="message-time">10:30 AM</div>
    </div>
</div>
```

**HTML Example (User Message):**

```html
<div class="message user-message">
    <div class="message-content">
        <div class="message-bubble">
            Can you show me the sales report?
        </div>
        <div class="message-time">10:31 AM</div>
    </div>
    <div class="message-avatar">U</div>
</div>
```

**File Attachments:**

```html
<div class="message-attachments">
    <div class="attachment-item">
        <div class="attachment-icon">📄</div>
        <span class="attachment-name">sales_report.pdf</span>
        <span class="attachment-size">2.4 MB</span>
    </div>
</div>
```

---

### 6. Artifact Panel (Slide-in)

**File:** `detail-chat.html`, `artifact-manager.js`, `styles.css:800-1000` (approx)

**Key Classes:**
- `.artifact-panel` - Main panel container
- `.artifact-panel.open` - Open state (slides in from right)
- `.artifact-header` - Panel header (title + close button)
- `.artifact-content` - Content area (code/document/chart)
- `.artifact-list` - Dropdown list of artifacts

**HTML Example:**

```html
<div class="artifact-panel">
    <!-- Header -->
    <div class="artifact-header">
        <div class="artifact-title">
            <svg><!-- Icon --></svg>
            <span>Code Snippet</span>
        </div>
        <button class="close-artifact">×</button>
    </div>

    <!-- Artifact List Dropdown -->
    <div class="artifact-list-container">
        <button class="artifact-list-toggle">
            Artifacts (3) ▼
        </button>
        <div class="artifact-list">
            <div class="artifact-list-item active">
                <svg><!-- Code icon --></svg>
                <span>Python Script</span>
            </div>
            <!-- More items... -->
        </div>
    </div>

    <!-- Content -->
    <div class="artifact-content">
        <pre><code class="language-python">
# Python code here
        </code></pre>
    </div>

    <!-- Copy Button -->
    <button class="copy-artifact">
        <svg><!-- Copy icon --></svg>
        Copy
    </button>
</div>
```

**Behavior:**
- Desktop: 500px width, slides from right
- Mobile: Fullscreen overlay with backdrop
- Supports: Code (Prism.js), Documents (Marked.js), Charts (Chart.js)

---

### 7. Search & Filters

**File:** `agents.html`, `styles.css:400-500` (approx)

**HTML Example:**

```html
<div class="controls">
    <!-- Search -->
    <div class="search-bar">
        <svg><!-- Search icon --></svg>
        <input type="text" placeholder="Search agents...">
    </div>

    <!-- Filters -->
    <div class="filter-group">
        <select class="filter-select">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
        </select>
    </div>

    <!-- Sort -->
    <div class="filter-group">
        <select class="filter-select">
            <option>Sort by: Latest</option>
            <option>Sort by: Name</option>
            <option>Sort by: Model</option>
        </select>
    </div>

    <!-- View Toggle -->
    <div class="view-toggle">
        <button class="view-btn active">
            <svg><!-- Grid icon --></svg>
        </button>
        <button class="view-btn">
            <svg><!-- List icon --></svg>
        </button>
    </div>
</div>
```

**Styling:**
- Horizontal layout with flexbox
- Gap between controls: 12px
- Search bar expands to fill space
- Dropdowns: 160px minimum width

---

## 📐 Layout Patterns

### Grid System (Agent Cards)

```css
.agent-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 20px;
    padding: 24px;
}
```

**Behavior:**
- Cards: 360px minimum, expand to fill
- Desktop: 3-4 columns (depending on viewport)
- Tablet: 2 columns
- Mobile: 1 column

### Sidebar Layout

```css
.sidebar {
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* Settings button at bottom */
}
```

**Structure:**
1. Logo (top)
2. Navigation (middle, grows)
3. Settings (bottom, fixed)

### Chat Layout

```css
.chat-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.messages-area {
    flex: 1;  /* Grows to fill space */
    overflow-y: auto;
}

.input-area {
    position: sticky;
    bottom: 0;
}
```

---

## 🎨 Icons

### Icon System

**Source:** `icons.svg` (inline SVG library)

**Style Guidelines:**
- **Stroke-based** design (not filled)
- **Stroke width:** 2px
- **Stroke linecap:** round
- **Stroke linejoin:** round
- **Color:** Inherits `currentColor` (easy theming)

**Sizes:**
- Small: 16x16px (default)
- Medium: 20x20px (buttons, headers)
- Large: 24x24px (featured icons)

**HTML Example:**

```html
<!-- Inline SVG -->
<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
     stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
</svg>
```

**Common Icons:**
- Dashboard: Home icon
- Agents: Robot/user icon
- Settings: Gear icon
- Search: Magnifying glass
- Close: X icon
- Chat: Message bubble
- Code: Code brackets
- Document: File icon
- Chart: Bar chart icon

---

## 📱 Responsive Breakpoints

### Media Query Strategy

```css
/* Mobile First Approach */

/* Mobile: Default (< 768px) */
/* Styles written for mobile by default */

/* Tablet: 768px - 1199px */
@media (min-width: 768px) {
    /* Tablet-specific styles */
}

/* Desktop: 1200px and above */
@media (min-width: 1200px) {
    /* Desktop-specific styles */
}
```

### Breakpoint-Specific Behaviors

| Viewport | Sidebar | Agent Grid | Chat Panel |
|----------|---------|------------|------------|
| **Mobile** (<768px) | Hidden (off-canvas) | 1 column | Fullscreen overlay |
| **Tablet** (768-1199px) | Collapsible 240px | 2 columns | 500px slide-in |
| **Desktop** (≥1200px) | Fixed 240px | 3-4 columns | 500px slide-in |

### Touch-Friendly Targets

**Minimum sizes for mobile:**
- Buttons: 44x44px (iOS standard)
- Icon buttons: 36x36px minimum
- Input fields: 44px height
- List items: 44px minimum height

---

## ✨ Interactive States

### Hover Effects

```css
/* Button Hover */
.btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(7, 42, 200, 0.3);
    /* + Yellow shimmer effect */
}

/* Card Hover */
.agent-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Icon Button Hover */
.icon-btn:hover {
    background: var(--accent-blue-soft);
}
```

### Focus States

```css
/* Input Focus */
input:focus {
    outline: none;
    border-color: var(--primary-blue);
    box-shadow: 0 0 0 3px rgba(7, 42, 200, 0.1);
}

/* Button Focus */
button:focus {
    outline: 2px solid var(--primary-blue);
    outline-offset: 2px;
}
```

### Active States

```css
/* Navigation Active */
.nav-item.active {
    background: var(--accent-blue-soft);
    color: var(--primary-blue);
}

/* View Toggle Active */
.view-btn.active {
    background: var(--primary-blue);
    color: white;
}
```

### Disabled States

```css
/* Disabled Button */
.btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--neutral-light);
}

/* Inactive Agent Card */
.agent-card:has(.status-inactive) {
    opacity: 0.7;
}

.agent-card:has(.status-inactive) .btn-chat {
    background: var(--neutral-light);
    color: var(--neutral-medium);
    cursor: not-allowed;
}
```

### Transitions

**Standard timing:**
```css
transition: all 0.2s ease;  /* Fast interactions */
transition: all 0.3s ease;  /* Standard transitions */
```

**Applied to:**
- Button hovers: 0.2s
- Card hovers: 0.3s
- Sidebar collapse: 0.3s
- Panel slide-in: 0.3s

---

## 📝 Implementation Notes

### CSS Organization

**File:** `styles.css` (45KB, ~1318 lines)

**Structure:**
1. Base styles & CSS variables (1-35)
2. Sidebar & navigation (37-150)
3. Main layout & containers (150-300)
4. Buttons & form elements (200-400)
5. Agent cards (300-600)
6. Chat components (700-1100)
7. Artifact panel (800-1000)
8. Responsive media queries (1200-1318)

### Best Practices

✅ **DO:**
- Use CSS variables for colors/spacing
- Keep components modular with clear class names
- Follow BEM-like naming (`.component-element-modifier`)
- Use semantic HTML (`<nav>`, `<main>`, `<article>`)
- Test on multiple browsers

❌ **DON'T:**
- Hardcode colors (use variables)
- Use `!important` (specificity issues)
- Inline styles (maintain in CSS file)
- Mix units (stick to px/rem consistently)

### Migration to Production

When implementing in production framework:

**React/Vue:**
```jsx
// Convert CSS classes to component props
<Button variant="primary" size="md">Create Agent</Button>

// Extract colors to theme config
const theme = {
  colors: {
    primaryBlue: '#072ac8',
    primaryYellow: '#ffc600',
    // ...
  }
}
```

**Tailwind CSS:**
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'primary-blue': '#072ac8',
        'primary-yellow': '#ffc600',
        // ...
      }
    }
  }
}
```

---

## 🔗 Quick Reference

### Most Used Classes

| Class | Purpose | File |
|-------|---------|------|
| `.sidebar` | Main navigation | sidebar.html |
| `.agent-card` | Agent display card | agents.html |
| `.btn-primary` | Primary action button | All pages |
| `.badge` | Status/info badge | All pages |
| `.message` | Chat message bubble | detail-chat.html |
| `.artifact-panel` | Artifact display panel | detail-chat.html |

### Color Quick Pick

| Use Case | Variable | Hex |
|----------|----------|-----|
| Primary action | `--primary-blue` | #072ac8 |
| Accent/hover | `--primary-yellow` | #ffc600 |
| Success/active | `--success-green` | #00A651 |
| Text (dark) | `--text-primary` | #1a2332 |
| Background (page) | `--background-gray` | #f5f7fa |
| Background (card) | `--background-white` | #ffffff |

---

**Last Updated:** 2025-10-24
**Version:** 1.0
**Maintained by:** BotBrigade Team
