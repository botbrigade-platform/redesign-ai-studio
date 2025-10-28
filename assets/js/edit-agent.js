/**
 * Edit Agent Page JavaScript
 * Handles form interactions, character counters, tool selection, and model configuration
 */

// Sample MCP Tools Data
const mcpToolsData = [
    {
        id: 'brave-search',
        name: 'Brave Search',
        description: 'Provides a bridge to the Brave Search API for performing web, image, video, news, and local business searches with configurable parameters and robust error handling.',
        package: 'npm/brave-search-mcp',
        status: 'active',
        selected: true
    },
    {
        id: 'sequential-thinking',
        name: 'Sequential Thinking',
        description: 'Implements a structured sequential thinking process for breaking down complex problems, iteratively refining solutions, and exploring multiple reasoning paths.',
        package: 'npm/@modelcontextprotocol/server-sequential-thinking',
        status: 'active',
        selected: true
    },
    {
        id: 'notion',
        name: 'Notion',
        description: 'Bridges to the Notion API for searching content, querying databases, and managing pages and comments without requiring complex API interaction code',
        package: 'npm/@notionhq/notion-mcp-server',
        status: 'active',
        selected: false
    },
    {
        id: 'github',
        name: 'GitHub',
        description: 'Integrates with GitHub API for repository management, issue tracking, pull requests, and code search functionality.',
        package: 'npm/@modelcontextprotocol/server-github',
        status: 'active',
        selected: false
    },
    {
        id: 'filesystem',
        name: 'File System',
        description: 'Provides secure access to local file system for reading, writing, and managing files and directories with permission controls.',
        package: 'npm/@modelcontextprotocol/server-filesystem',
        status: 'active',
        selected: false
    }
];

// Stop sequences storage
let stopSequences = [];

// Initialize edit agent page
document.addEventListener('DOMContentLoaded', function() {
    // Load sidebar
    loadSidebar('agents');

    // Initialize character counters
    initCharacterCounters();

    // Initialize sliders
    initSliders();

    // Initialize toggles
    initToggles();

    // Initialize tool selection
    initToolSelection();

    // Initialize stop sequences
    initStopSequences();

    // Initialize form submission
    initFormSubmit();
});

/**
 * Initialize character counters for text inputs and textareas
 */
function initCharacterCounters() {
    const nameInput = document.getElementById('agentName');
    const descInput = document.getElementById('agentDescription');
    const instructionsInput = document.getElementById('agentInstructions');

    if (nameInput) {
        updateCharCount(nameInput, 'nameCharCount');
        nameInput.addEventListener('input', () => updateCharCount(nameInput, 'nameCharCount'));
    }

    if (descInput) {
        updateCharCount(descInput, 'descCharCount');
        descInput.addEventListener('input', () => updateCharCount(descInput, 'descCharCount'));
    }

    if (instructionsInput) {
        updateCharCount(instructionsInput, 'instructionsCharCount');
        instructionsInput.addEventListener('input', () => updateCharCount(instructionsInput, 'instructionsCharCount'));
    }
}

/**
 * Update character count display
 */
function updateCharCount(input, counterId) {
    const counter = document.getElementById(counterId);
    if (counter) {
        counter.textContent = input.value.length;
    }
}

/**
 * Initialize range sliders with value displays
 */
function initSliders() {
    const sliders = [
        { id: 'temperature', valueId: 'temperatureValue', decimals: 2 },
        { id: 'topP', valueId: 'topPValue', decimals: 2 },
        { id: 'frequencyPenalty', valueId: 'frequencyPenaltyValue', decimals: 2 },
        { id: 'presencePenalty', valueId: 'presencePenaltyValue', decimals: 2 }
    ];

    sliders.forEach(slider => {
        const element = document.getElementById(slider.id);
        const valueDisplay = document.getElementById(slider.valueId);

        if (element && valueDisplay) {
            // Update on input
            element.addEventListener('input', () => {
                const value = parseFloat(element.value);
                valueDisplay.textContent = value.toFixed(slider.decimals);
            });
        }
    });
}

/**
 * Initialize toggle switches
 */
function initToggles() {
    const modelConfigToggle = document.getElementById('enableModelConfig');
    const modelConfigPanel = document.getElementById('modelConfigPanel');

    if (modelConfigToggle && modelConfigPanel) {
        modelConfigToggle.addEventListener('change', () => {
            if (modelConfigToggle.checked) {
                modelConfigPanel.classList.remove('collapsed');
            } else {
                modelConfigPanel.classList.add('collapsed');
            }
        });
    }
}

/**
 * Initialize tool selection functionality
 */
function initToolSelection() {
    renderTools();

    // Tool search
    const toolSearch = document.getElementById('toolSearch');
    if (toolSearch) {
        toolSearch.addEventListener('input', (e) => {
            filterTools(e.target.value);
        });
    }

    // Active only filter
    const activeOnlyBtn = document.getElementById('activeOnlyBtn');
    if (activeOnlyBtn) {
        let activeOnly = false;
        activeOnlyBtn.addEventListener('click', () => {
            activeOnly = !activeOnly;
            activeOnlyBtn.classList.toggle('active', activeOnly);
            filterTools(toolSearch ? toolSearch.value : '', activeOnly);
        });
    }

    // Clear all tools
    const clearAllBtn = document.getElementById('clearAllTools');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            mcpToolsData.forEach(tool => tool.selected = false);
            renderTools();
        });
    }
}

/**
 * Render tools in both selected and available panels
 */
function renderTools() {
    const selectedList = document.getElementById('selectedToolsList');
    const availableList = document.getElementById('availableToolsList');
    const selectedCount = document.getElementById('selectedCount');

    if (!selectedList || !availableList) return;

    // Clear lists
    selectedList.innerHTML = '';
    availableList.innerHTML = '';

    // Separate selected and available tools
    const selectedTools = mcpToolsData.filter(tool => tool.selected);
    const availableTools = mcpToolsData.filter(tool => !tool.selected);

    // Update count
    if (selectedCount) {
        selectedCount.textContent = selectedTools.length;
    }

    // Render selected tools
    selectedTools.forEach(tool => {
        selectedList.appendChild(createToolCard(tool, true));
    });

    // Render available tools
    availableTools.forEach(tool => {
        availableList.appendChild(createToolCard(tool, false));
    });
}

/**
 * Create a tool card element
 */
function createToolCard(tool, isSelected) {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.dataset.toolId = tool.id;

    card.innerHTML = `
        <div class="tool-card-header">
            <div>
                <h5 class="tool-name">${tool.name}</h5>
                <span class="tool-status">${tool.status}</span>
            </div>
        </div>
        <p class="tool-description">${tool.description}</p>
        <p class="tool-package">${tool.package}</p>
        <div class="tool-actions">
            ${isSelected
                ? `<button type="button" class="btn btn-secondary btn-sm" onclick="removeTool('${tool.id}')">Remove</button>`
                : `<button type="button" class="btn btn-primary btn-sm" onclick="addTool('${tool.id}')">Add</button>`
            }
        </div>
    `;

    return card;
}

/**
 * Add a tool to selected list
 */
function addTool(toolId) {
    const tool = mcpToolsData.find(t => t.id === toolId);
    if (tool) {
        tool.selected = true;
        renderTools();
    }
}

/**
 * Remove a tool from selected list
 */
function removeTool(toolId) {
    const tool = mcpToolsData.find(t => t.id === toolId);
    if (tool) {
        tool.selected = false;
        renderTools();
    }
}

/**
 * Filter tools based on search query and active filter
 */
function filterTools(query = '', activeOnly = false) {
    const searchTerm = query.toLowerCase();

    const filtered = mcpToolsData.filter(tool => {
        const matchesSearch = !searchTerm ||
            tool.name.toLowerCase().includes(searchTerm) ||
            tool.description.toLowerCase().includes(searchTerm) ||
            tool.package.toLowerCase().includes(searchTerm);

        const matchesActive = !activeOnly || tool.status === 'active';

        return matchesSearch && matchesActive;
    });

    // Render filtered tools
    const selectedList = document.getElementById('selectedToolsList');
    const availableList = document.getElementById('availableToolsList');

    if (!selectedList || !availableList) return;

    selectedList.innerHTML = '';
    availableList.innerHTML = '';

    const selectedTools = filtered.filter(tool => tool.selected);
    const availableTools = filtered.filter(tool => !tool.selected);

    selectedTools.forEach(tool => {
        selectedList.appendChild(createToolCard(tool, true));
    });

    availableTools.forEach(tool => {
        availableList.appendChild(createToolCard(tool, false));
    });
}

/**
 * Initialize stop sequences tag input
 */
function initStopSequences() {
    const input = document.getElementById('stopSequenceInput');
    const addBtn = document.getElementById('addStopSequence');
    const tagsContainer = document.getElementById('stopSequencesTags');

    if (!input || !addBtn || !tagsContainer) return;

    // Add on button click
    addBtn.addEventListener('click', () => {
        addStopSequence(input, tagsContainer);
    });

    // Add on Enter key
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addStopSequence(input, tagsContainer);
        }
    });
}

/**
 * Add a stop sequence tag
 */
function addStopSequence(input, container) {
    const value = input.value.trim();

    if (value && !stopSequences.includes(value)) {
        stopSequences.push(value);
        renderStopSequences(container);
        input.value = '';
    }
}

/**
 * Remove a stop sequence tag
 */
function removeStopSequence(value, container) {
    stopSequences = stopSequences.filter(seq => seq !== value);
    renderStopSequences(container);
}

/**
 * Render stop sequence tags
 */
function renderStopSequences(container) {
    if (!container) return;

    container.innerHTML = '';

    stopSequences.forEach(sequence => {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.innerHTML = `
            <span>${sequence}</span>
            <button type="button" class="tag-remove" onclick="removeStopSequenceGlobal('${sequence}')" aria-label="Remove">
                ×
            </button>
        `;
        container.appendChild(tag);
    });
}

/**
 * Global function to remove stop sequence (called from onclick)
 */
function removeStopSequenceGlobal(value) {
    const container = document.getElementById('stopSequencesTags');
    removeStopSequence(value, container);
}

/**
 * Initialize form submission
 */
function initFormSubmit() {
    const form = document.getElementById('editAgentForm');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Collect form data
            const formData = {
                name: document.getElementById('agentName').value,
                description: document.getElementById('agentDescription').value,
                instructions: document.getElementById('agentInstructions').value,
                active: document.getElementById('agentActive').checked,
                tools: mcpToolsData.filter(t => t.selected).map(t => t.id),
                modelConfig: {
                    enabled: document.getElementById('enableModelConfig').checked,
                    model: document.getElementById('modelSelect').value,
                    temperature: parseFloat(document.getElementById('temperature').value),
                    topP: parseFloat(document.getElementById('topP').value),
                    maxTokens: document.getElementById('maxTokens').value || null,
                    frequencyPenalty: parseFloat(document.getElementById('frequencyPenalty').value),
                    presencePenalty: parseFloat(document.getElementById('presencePenalty').value),
                    seed: document.getElementById('seed').value || null,
                    stopSequences: stopSequences
                }
            };

            console.log('Form submitted with data:', formData);

            // Show success message (since this is a static prototype)
            alert('Agent configuration updated successfully! (This is a static prototype - no data was actually saved)');

            // Redirect back to agents page
            window.location.href = 'agents.html';
        });
    }
}

// Make functions globally available for onclick handlers
window.addTool = addTool;
window.removeTool = removeTool;
window.removeStopSequenceGlobal = removeStopSequenceGlobal;
