// BotBrigade Dashboard - Main JavaScript

// ===== Sidebar Management =====
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('collapsed');
}

// ===== User Menu Management (agents.html) =====
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
}

// Close dropdown when clicking outside
window.addEventListener('click', function(e) {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.getElementById('userDropdown');
    if (userMenu && dropdown && !userMenu.contains(e.target)) {
        dropdown.classList.remove('show');
    }
});

// ===== Textarea Auto-resize (detail-chat.html) =====
function initChatTextarea() {
    const textarea = document.querySelector('.input-group textarea');
    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = '20px';
            this.style.height = Math.min(this.scrollHeight, 200) + 'px';
        });

        // Set initial height based on content
        textarea.style.height = '20px';
        textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
}

// ===== Sidebar Component Loader =====
async function loadSidebar(activePage = 'agents') {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (!sidebarContainer) return;

    try {
        const response = await fetch('sidebar.html');
        const html = await response.text();
        sidebarContainer.innerHTML = html;

        // Set active navigation item
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            const href = item.getAttribute('href');
            if ((activePage === 'agents' && href === 'agents.html') ||
                (activePage === 'chat' && href === 'detail-chat.html')) {
                item.classList.add('active');
            }
        });

        // Add chat-specific sidebar content
        if (activePage === 'chat') {
            addChatSidebarContent();
        }
    } catch (error) {
        console.error('Error loading sidebar:', error);
    }
}

// ===== Chat-specific Sidebar Content =====
function addChatSidebarContent() {
    const navSection = document.querySelector('.sidebar .nav-section');
    if (!navSection) return;

    const chatSidebarHTML = `
        <div style="padding: 0 16px; margin: 20px 16px 16px;">
            <button class="new-thread-btn">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <use href="icons.svg#plus-icon"/>
                </svg>
                <span>New Chat</span>
            </button>
        </div>

        <div class="nav-label">Conversation History</div>
        <div class="conversation-item active">
            <svg class="conversation-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <use href="icons.svg#chat-icon"/>
            </svg>
            <span>jelaskan apa saja y...</span>
        </div>
        <div class="conversation-item">
            <svg class="conversation-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <use href="icons.svg#chat-icon"/>
            </svg>
            <span>analisis data pendidik...</span>
        </div>
        <div class="conversation-item">
            <svg class="conversation-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <use href="icons.svg#chat-icon"/>
            </svg>
            <span>laporan kinerja pemer...</span>
        </div>
        <div class="conversation-item">
            <svg class="conversation-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <use href="icons.svg#chat-icon"/>
            </svg>
            <span>tren data publik 2024</span>
        </div>
        <div class="conversation-item">
            <svg class="conversation-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <use href="icons.svg#chat-icon"/>
            </svg>
            <span>ringkasan statistik ke...</span>
        </div>
    `;

    navSection.insertAdjacentHTML('beforeend', chatSidebarHTML);

    // Add settings button at the bottom
    const sidebar = document.querySelector('.sidebar');
    const settingsHTML = `
        <div class="settings-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <use href="icons.svg#settings-icon"/>
            </svg>
            <span>Settings</span>
        </div>
    `;
    sidebar.insertAdjacentHTML('beforeend', settingsHTML);
}

// ===== Agent Cards Template & Data =====
const agentsData = [
    {
        name: "Public Data Insight Agent",
        description: "This agent specializes in analyzing public sector data and generating insights that support evidence-based decision making for policy development and resource allocation.",
        status: "active",
        model: "intelligence-n1",
        created: "Oct 21, 2025",
        tools: 0
    },
    {
        name: "Islamic Dialogue Guide",
        description: "Provides respectful, informative guidance about Islam to non-Muslims. Facilitates interfaith understanding through accurate information and thoughtful dialogue.",
        status: "active",
        model: "brain-t4",
        created: "Oct 12, 2025",
        tools: 0
    },
    {
        name: "Customer Support Assistant",
        description: "Handles customer inquiries and provides timely responses to common questions. Escalates complex issues to human agents when necessary.",
        status: "active",
        model: "brain-t4",
        created: "Oct 8, 2025",
        tools: 2
    },
    {
        name: "Content Generation Engine",
        description: "Creates high-quality marketing content, blog posts, and social media updates. Maintains brand voice and optimizes for SEO.",
        status: "active",
        model: "brain-t4",
        created: "Oct 8, 2025",
        tools: 3
    },
    {
        name: "Data Analytics Specialist",
        description: "Analyzes complex datasets and generates comprehensive reports with actionable insights. Visualizes trends and patterns for stakeholder presentations.",
        status: "inactive",
        model: "dendrit-n3",
        created: "Oct 8, 2025",
        tools: 2
    },
    {
        name: "Code Review Assistant",
        description: "Reviews code submissions for best practices, security vulnerabilities, and performance issues. Provides constructive feedback to development teams.",
        status: "active",
        model: "gpt-4",
        created: "Oct 8, 2025",
        tools: 0
    }
];

function createAgentCard(agent) {
    const statusClass = agent.status === 'active' ? 'status-active' : 'status-inactive';
    const statusText = agent.status === 'active' ? 'Active' : 'Inactive';

    const toolsBadge = agent.tools > 0 ? `
        <span class="badge tools">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <use href="icons.svg#tool-icon"/>
            </svg>
            ${agent.tools} Tools
        </span>
    ` : '';

    return `
        <div class="agent-card">
            <div class="card-header">
                <div>
                    <h3 class="agent-name">${agent.name}</h3>
                </div>
                <button class="menu-btn">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <use href="icons.svg#menu-dots"/>
                    </svg>
                </button>
            </div>

            <p class="agent-description">
                ${agent.description}
            </p>

            <div class="card-badges">
                <span class="badge ${statusClass}">
                    <span class="badge-dot"></span>
                    ${statusText}
                </span>
                ${toolsBadge}
            </div>

            <div class="card-meta">
                <div class="meta-item">
                    <span class="meta-label">Model</span>
                    <span class="meta-value">${agent.model}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Created</span>
                    <span class="meta-value">${agent.created}</span>
                </div>
            </div>

            <div class="card-actions">
                <a href="detail-chat.html" class="btn btn-chat">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <use href="icons.svg#chat-icon"/>
                    </svg>
                    Chat
                </a>
                <button class="btn btn-secondary">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <use href="icons.svg#eye-icon"/>
                    </svg>
                    View
                </button>
                <button class="btn btn-secondary">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <use href="icons.svg#edit-icon"/>
                    </svg>
                    Edit
                </button>
            </div>
        </div>
    `;
}

function renderAgentCards() {
    const agentsGrid = document.querySelector('.agents-grid');
    if (!agentsGrid) return;

    agentsGrid.innerHTML = agentsData.map(agent => createAgentCard(agent)).join('');
}

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

function renderArtifact(artifact) {
  const contentArea = document.getElementById('artifact-content-area');
  contentArea.innerHTML = renderArtifactContent(artifact);

  // Apply syntax highlighting for code
  if (artifact.type === 'code' && typeof Prism !== 'undefined') {
    Prism.highlightAllUnder(contentArea);
  }
}

function updateArtifactListActive(artifactId) {
  // Will implement when we add list items
  console.log('Active artifact:', artifactId);
}

// ===== Page Initialization =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize based on current page
    const isAgentsPage = document.querySelector('.agents-grid') !== null;
    const isChatPage = document.querySelector('.chat-messages') !== null;

    // Load sidebar
    if (isChatPage) {
        loadSidebar('chat');
    } else if (isAgentsPage) {
        loadSidebar('agents');
    }

    // Initialize page-specific features
    if (isChatPage) {
        initChatTextarea();
    }

    if (isAgentsPage) {
        renderAgentCards();
    }

    // ============================================
    // ARTIFACT EVENT LISTENERS
    // ============================================

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
