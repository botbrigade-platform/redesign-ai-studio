# BotBrigade AI Studio - Static Prototype

> **Static HTML/CSS prototype** untuk Dinkominfo Surabaya (Surabaya City Government IT Department)
> Didesain sebagai referensi visual untuk implementasi final product oleh tim development

[![Status](https://img.shields.io/badge/status-prototype-blue.svg)](https://github.com)
[![License](https://img.shields.io/badge/license-Internal-red.svg)](https://github.com)

---

## 📋 Daftar Isi

- [Tentang Project](#-tentang-project)
- [Quick Start](#-quick-start)
- [Struktur File](#-struktur-file)
- [Halaman Utama](#-halaman-utama)
- [Tech Stack](#%EF%B8%8F-tech-stack)
- [Fitur yang Diimplementasikan](#-fitur-yang-diimplementasikan)
- [Design System](#-design-system)
- [Dokumentasi Lengkap](#-dokumentasi-lengkap)
- [Untuk Implementasi Production](#-untuk-implementasi-production)

---

## 🎯 Tentang Project

**BotBrigade AI Studio** adalah prototype static dashboard untuk mengelola AI agents, dirancang khusus untuk internal Dinkominfo Surabaya. Project ini berfungsi sebagai **design reference** yang akan diimplementasikan ke production application oleh tim frontend developers.

### Status Project
- **Tipe:** Static prototype (HTML/CSS/JS)
- **Tujuan:** Design handoff & visual specification
- **Target:** Frontend developers untuk implementasi production
- **Branding:** Official Dinkominfo Surabaya colors & identity

### Key Features
✅ Dashboard dengan grid/list view agents
✅ Chat interface dengan artifact display panel
✅ Responsive design (desktop, tablet, mobile)
✅ Sidebar navigation dengan collapse functionality
✅ Government branding (blue/yellow accent stripe)
✅ Artifact management (code, document, chart previews)

---

## 🚀 Quick Start

### Option 1: Buka Langsung di Browser
Cara tercepat untuk preview:
```bash
# macOS - Landing page
open index.html

# macOS - Langsung ke halaman tertentu
open pages/dashboard.html
open pages/agents.html
open pages/detail-chat.html

# Windows
start index.html

# Linux
xdg-open index.html
```

### Option 2: Python HTTP Server (Recommended)
```bash
# Python 3
python3 -m http.server 8000

# Kemudian buka browser ke:
# http://localhost:8000/                    (landing page)
# http://localhost:8000/pages/dashboard.html   (dashboard)
# http://localhost:8000/pages/agents.html      (agents)
# http://localhost:8000/pages/detail-chat.html (chat)
```

### Option 3: Node.js HTTP Server
```bash
# Menggunakan npx (tidak perlu install)
npx http-server -p 8000

# Atau gunakan serve
npx serve

# Buka: http://localhost:8000/
```

### Option 4: VS Code Live Server
1. Install extension "Live Server" di VS Code
2. Right-click `agents.html` → "Open with Live Server"

---

## 📁 Struktur File

```
redesign-ai-studio/
│
├── README.md                         # ← Dokumentasi utama (file ini)
├── CLAUDE.md                         # Dokumentasi untuk Claude AI assistant
├── .gitignore                        # Git ignore configuration
├── index.html                        # Landing page dengan navigasi
│
├── pages/                            # HTML pages
│   ├── dashboard.html                # 🔵 Dashboard dengan pinned charts
│   ├── agents.html                   # 🔵 AI Agents grid/list view
│   └── detail-chat.html              # 🔵 Chat interface + artifacts
│
├── assets/                           # Static assets
│   ├── css/
│   │   └── styles.css                # Stylesheet utama (~100KB)
│   ├── js/
│   │   ├── app.js                    # JavaScript utama (~30KB)
│   │   ├── artifact-manager.js       # Artifact panel logic (~15KB)
│   │   └── dashboard.js              # Dashboard grid logic (~35KB)
│   └── icons/
│       └── icons.svg                 # SVG icon library
│
├── components/                       # Reusable components
│   └── sidebar.html                  # Sidebar navigation
│
└── docs/                             # Dokumentasi tambahan
    ├── DESIGN_SYSTEM.md              # ✅ Brand & component guide
    ├── TESTING.md                    # Testing checklist
    └── plans/                        # Implementation plans & specs
        ├── 2025-10-24-artifact-display-design.md
        ├── 2025-10-24-artifact-display-implementation.md
        └── 2025-10-26-dashboard-pinned-charts-design.md
```

### File Prioritas untuk Developers

| File | Ukuran | Fungsi | Penting |
|------|--------|--------|---------|
| **pages/dashboard.html** | 13KB | Dashboard dengan pinned charts & Gridstack | ⭐⭐⭐ |
| **pages/agents.html** | 13KB | AI Agents grid dengan search & filter | ⭐⭐⭐ |
| **pages/detail-chat.html** | 37KB | Chat interface + artifact display panel | ⭐⭐⭐ |
| **assets/css/styles.css** | ~100KB | Complete design system & styling | ⭐⭐⭐ |
| **assets/js/dashboard.js** | ~35KB | Dashboard grid logic (Gridstack integration) | ⭐⭐ |
| **assets/js/app.js** | ~30KB | Core app logic (sidebar, menus, utilities) | ⭐⭐ |
| **assets/js/artifact-manager.js** | ~15KB | Artifact panel rendering & state | ⭐⭐ |

---

## 📄 Halaman Utama

### 1. `dashboard.html` - Dashboard dengan Pinned Charts

**Dashboard untuk visualisasi chart yang di-pin dari conversations.**

**Fitur:**
- Pin chart artifacts dari chat ke dashboard
- Drag-and-drop repositioning (Gridstack.js)
- Resize charts via corner/edge handles
- Fullscreen chart modal untuk detail view
- Remove charts dengan confirmation dialog
- Auto-layout untuk grid organization
- Clear all charts functionality
- sessionStorage persistence (reset saat browser close)
- Empty state dengan preview option

**Key Components:**
- `.grid-stack` - Gridstack container (12-column grid)
- `.dashboard-chart-card` - Individual chart card dengan controls
- `.fullscreen-chart-modal` - Fullscreen chart viewer
- `.confirmation-dialog` - Remove confirmation modal

**Tech:**
- Gridstack.js 10.x untuk drag/drop grid
- Chart.js untuk rendering charts
- sessionStorage untuk state persistence

**Screenshot:**
<!-- TODO: Add screenshot dashboard.html desktop & mobile -->

---

### 2. `agents.html` - AI Agents Dashboard

**Browse dan manage AI agents.**

**Fitur:**
- Grid/list view toggle untuk agent cards
- Search bar untuk mencari agents
- Filter by status (Active/Inactive)
- Sort by berbagai kriteria
- Agent cards dengan metadata (model, tools, created date)
- Status badges (Active/Inactive)
- Responsive grid layout

**Key Components:**
- `.sidebar` - Navigasi samping
- `.agent-card` - Card untuk setiap agent
- `.controls` - Search & filter controls
- `.agent-grid` - Container grid agents

**Screenshot:**
<!-- TODO: Add screenshot agents.html desktop & mobile -->

---

### 3. `detail-chat.html` - Chat Interface

**Chat interface dengan artifact display panel.**

**Fitur:**
- Chat message bubbles (agent vs user)
- Message timestamps
- File attachment support
- **Artifact Display Panel** (slide-in dari kanan)
  - Code artifacts dengan syntax highlighting
  - Document artifacts (Markdown rendering)
  - Chart artifacts (Chart.js visualization)
- Copy to clipboard functionality
- Fullscreen mobile overlay
- Conversation history di sidebar

**Key Components:**
- `.chat-container` - Main chat area
- `.message` / `.message.user-message` - Message bubbles
- `.artifact-panel` - Slide-in panel untuk artifacts
- `.artifact-thumbnail` - Thumbnail previews dalam chat

**Screenshot:**
<!-- TODO: Add screenshot detail-chat.html desktop & mobile -->

---

## 🛠️ Tech Stack

### Core Technologies
- **HTML5** - Semantic markup
- **CSS3** - Modern styling (Grid, Flexbox, CSS Variables)
- **Vanilla JavaScript** - Minimal dependencies

### External Libraries (CDN)
- **Prism.js** - Syntax highlighting untuk code artifacts
- **Chart.js** - Chart rendering untuk visualizations
- **Marked.js** - Markdown parsing untuk documents
- **Gridstack.js** - Drag-and-drop grid layout untuk dashboard

### Design Approach
- **No build process** - Static files, langsung buka di browser
- **No frameworks** - Pure HTML/CSS/JS untuk portability
- **Component-based** - Reusable CSS classes & patterns
- **Mobile-first** - Responsive dari awal

### Browser Support
- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## ✨ Fitur yang Diimplementasikan

### ✅ Fully Functional
| Feature | Status | Location |
|---------|--------|----------|
| Sidebar collapse/expand | ✅ Working | `app.js:toggleSidebar()` |
| Responsive layout | ✅ Working | `styles.css` media queries |
| Artifact panel display | ✅ Working | `artifact-manager.js` |
| Code syntax highlighting | ✅ Working | Prism.js integration |
| Chart rendering | ✅ Working | Chart.js integration |
| Copy to clipboard | ✅ Working | Artifact panel |
| Mobile fullscreen overlay | ✅ Working | Artifact panel responsive |
| **Dashboard pinned charts** | ✅ Working | `dashboard.js` + Gridstack |
| **Drag-and-drop grid** | ✅ Working | Gridstack.js integration |
| **Chart resize & fullscreen** | ✅ Working | Dashboard chart controls |
| **Pin charts from chat** | ✅ Working | Pin modal + sessionStorage |
| **sessionStorage persistence** | ✅ Working | Dashboard state management |

### ⚠️ UI-Only (Static/Non-functional)
| Feature | Status | Notes |
|---------|--------|-------|
| Search bar | ⚠️ UI only | No search logic implemented |
| Filter dropdowns | ⚠️ UI only | No filtering logic |
| Sort functionality | ⚠️ UI only | No sorting logic |
| "Create Agent" button | ⚠️ UI only | No form/modal |
| "Chat" buttons | ⚠️ UI only | Links to detail-chat.html |
| Message input/send | ⚠️ UI only | No chat backend |
| File uploads | ⚠️ UI only | No upload handling |
| View toggle (Grid/List) | ⚠️ UI only | No switching logic |

---

## 🎨 Design System

### Brand Colors (Dinkominfo Surabaya Official)

```css
/* Primary Colors */
--primary-blue: #072ac8          /* Main brand color */
--primary-yellow: #ffc600        /* Accent color */

/* Soft Accents */
--accent-blue-soft: #e8edff      /* Light blue backgrounds */
--accent-yellow-soft: #fff8e0    /* Light yellow backgrounds */

/* Neutrals */
--neutral-dark: #1a2332          /* Dark text */
--background-gray: #f5f7fa       /* Page background */
--background-white: #ffffff      /* Card backgrounds */

/* Status Colors */
--success-green: #00A651         /* Active status */
```

**Government Branding:**
- Signature 4px stripe di top sidebar (`.gov-accent`)
- Split 50/50: blue (top) + yellow (bottom)
- Represents official Dinkominfo Surabaya identity

### Typography
- **Font:** System font stack (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`)
- **Sizes:** h1 (24px), h2 (20px), h3 (16px), body (14px), small (12px)
- **Line height:** 1.5 for readability

### Component Patterns
- **Cards:** Border radius 12px, subtle shadows
- **Buttons:** Border radius 8px, smooth hover transitions
- **Icons:** 16px-20px, stroke-width: 2, `currentColor` inheritance
- **Spacing:** 8px base unit (8, 12, 16, 20, 24, 32px)

📖 **Dokumentasi lengkap:** Lihat [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)

---

## 📚 Dokumentasi Lengkap

| Dokumen | Deskripsi |
|---------|-----------|
| [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Brand colors, typography, component inventory |
| [TESTING.md](docs/TESTING.md) | Manual testing checklist untuk artifact features |
| [CLAUDE.md](CLAUDE.md) | Dokumentasi untuk Claude AI assistant (tech specs) |
| [Plans](docs/plans/) | Design & implementation planning documents |

---

## 🏗️ Untuk Implementasi Production

### Rekomendasi Tech Stack Production

**Frontend Framework Options:**
- **React + TypeScript** - Component reusability, type safety
- **Vue 3 + TypeScript** - Lighter, easier learning curve
- **Next.js** - SSR, routing, SEO-friendly
- **Vanilla JS + Web Components** - Maintain current approach

**State Management:**
- Redux/Zustand (React)
- Pinia (Vue)
- Context API (React minimal)

**Backend Integration:**
- REST API or GraphQL untuk agent data
- WebSocket/SSE untuk real-time chat
- File upload handling (multipart/form-data)

### Roadmap Implementasi

**Phase 1 - Data Layer:**
1. Replace hardcoded agent data dengan API calls
2. Implement agent CRUD operations
3. Authentication/authorization system
4. User session management

**Phase 2 - Interactive Features:**
5. Working search dengan debouncing
6. Filter & sort logic
7. Agent creation modal/form
8. Grid/List view toggle

**Phase 3 - Chat Integration:**
9. WebSocket connection untuk real-time chat
10. Message streaming
11. File upload/storage
12. Conversation routing

**Phase 4 - Advanced Features:**
13. Agent configuration panel
14. Tool integration management
15. Analytics/usage tracking
16. Notification system

### Migration Notes
- **CSS classes** sudah semantic, ready untuk dynamic state changes
- **Component structure** maps well ke React/Vue components
- **Artifact panel** logic dapat di-extract ke reusable hook/composable
- **Design system** variables bisa migrate ke Tailwind/Styled Components

---

## 📸 Screenshots

### Desktop View
<!-- TODO: Add desktop screenshots -->

### Mobile View
<!-- TODO: Add mobile screenshots -->

### Component Examples
<!-- TODO: Add component close-ups -->

---

## 👥 Credits

**Design & Development:** BotBrigade Team
**Client:** Dinkominfo Surabaya (Surabaya City Government IT Department)
**Project Type:** Static Prototype for Design Handoff

---

## 📞 Kontak & Support

Untuk pertanyaan implementasi atau klarifikasi design decisions:
- **Repository:** [GitHub Link]
- **Documentation:** Lihat folder `/docs`
- **Issues:** Report via GitHub Issues

---

**Last Updated:** 2025-10-26
**Version:** 1.1 (Static Prototype + Dashboard Feature)
