/**
 * Dashboard JavaScript
 * Handles pinned charts grid with Gridstack.js
 */

let grid = null;
let fullscreenChart = null;
let pendingRemoveChartId = null;

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', function() {
  // Load sidebar with dashboard active
  loadSidebar('dashboard');

  // Initialize dashboard
  initDashboard();
});

/**
 * Initialize dashboard
 */
function initDashboard() {
  const pinnedCharts = loadPinnedCharts();

  if (pinnedCharts.length === 0) {
    showEmptyState();
  } else {
    hideEmptyState();
    initializeGridstack();
    renderPinnedCharts(pinnedCharts);
  }
}

/**
 * Initialize Gridstack
 */
function initializeGridstack() {
  const gridEl = document.getElementById('dashboardGrid');
  gridEl.style.display = 'block';

  grid = GridStack.init({
    column: 6,
    cellHeight: 120,
    margin: 16,
    float: false,
    resizable: {
      handles: 'e, se, s, sw, w'
    },
    draggable: {
      handle: '.chart-card-header'
    },
    minRow: 1,
    disableOneColumnMode: false
  });

  // Save grid changes to sessionStorage
  grid.on('change', function(event, items) {
    if (items) {
      items.forEach(function(item) {
        updateChartPosition(item.id, {
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h
        });
      });
    }
  });
}

/**
 * Load pinned charts from sessionStorage
 */
function loadPinnedCharts() {
  const stored = sessionStorage.getItem('pinnedCharts');
  return stored ? JSON.parse(stored) : [];
}

/**
 * Save pinned charts to sessionStorage
 */
function savePinnedCharts(charts) {
  sessionStorage.setItem('pinnedCharts', JSON.stringify(charts));
}

/**
 * Render all pinned charts
 */
function renderPinnedCharts(charts) {
  charts.forEach(function(chartData) {
    const chartCard = createChartCard(chartData);
    grid.addWidget(chartCard, {
      id: chartData.id,
      x: chartData.gridPosition.x,
      y: chartData.gridPosition.y,
      w: chartData.gridPosition.w,
      h: chartData.gridPosition.h,
      minW: 1,
      minH: 1,
      maxW: 6,
      maxH: 4
    });

    // Initialize Chart.js after widget is added
    setTimeout(function() {
      initializeChartCanvas(chartData.id, chartData.chartConfig);
    }, 100);
  });
}

/**
 * Create chart card HTML
 */
function createChartCard(chartData) {
  const card = document.createElement('div');
  card.className = 'grid-stack-item';
  card.setAttribute('gs-id', chartData.id);

  card.innerHTML = `
    <div class="grid-stack-item-content">
      <div class="dashboard-chart-card">
        <div class="chart-card-header">
          <h3 class="chart-card-title">${escapeHTML(chartData.name)}</h3>
          <div class="chart-card-controls">
            <button class="btn btn-ghost btn-sm btn-icon" onclick="refreshChart('${chartData.id}')" title="Refresh">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <use href="../assets/icons/icons.svg#refresh-icon"/>
              </svg>
            </button>
            <button class="btn btn-ghost btn-sm btn-icon" onclick="expandChart('${chartData.id}')" title="Expand">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <use href="../assets/icons/icons.svg#expand-icon"/>
              </svg>
            </button>
            <button class="btn btn-ghost btn-sm btn-icon" onclick="removeChart('${chartData.id}')" title="Remove">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <use href="../assets/icons/icons.svg#x-icon"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="chart-card-body">
          <canvas id="dashboard-chart-${chartData.id}"></canvas>
        </div>
      </div>
    </div>
  `;

  return card;
}

/**
 * Initialize Chart.js canvas
 */
function initializeChartCanvas(chartId, config) {
  const canvas = document.getElementById(`dashboard-chart-${chartId}`);
  if (!canvas) {
    console.error('Canvas not found for chart:', chartId);
    return;
  }

  const ctx = canvas.getContext('2d');
  new Chart(ctx, config);
}

/**
 * Update chart grid position in sessionStorage
 */
function updateChartPosition(chartId, position) {
  const charts = loadPinnedCharts();
  const chartIndex = charts.findIndex(function(c) { return c.id === chartId; });

  if (chartIndex !== -1) {
    charts[chartIndex].gridPosition = position;
    savePinnedCharts(charts);
  }
}

/**
 * Refresh chart (placeholder - no functionality in prototype)
 */
function refreshChart(chartId) {
  showToast('Chart refresh is not available in this prototype', 'info');
}

/**
 * Expand chart to fullscreen
 */
function expandChart(chartId) {
  const charts = loadPinnedCharts();
  const chartData = charts.find(function(c) { return c.id === chartId; });

  if (!chartData) {
    console.error('Chart not found:', chartId);
    return;
  }

  // Update modal title
  document.getElementById('fullscreenChartTitle').textContent = chartData.name;

  // Show modal
  const modal = document.getElementById('fullscreenModal');
  modal.classList.add('open');

  // Destroy existing chart if any
  if (fullscreenChart) {
    fullscreenChart.destroy();
    fullscreenChart = null;
  }

  // Render chart in modal
  setTimeout(function() {
    const canvas = document.getElementById('fullscreenChart');
    const ctx = canvas.getContext('2d');
    fullscreenChart = new Chart(ctx, chartData.chartConfig);
  }, 100);

  // Add ESC key listener
  document.addEventListener('keydown', handleEscapeKey);
}

/**
 * Close fullscreen modal
 */
function closeFullscreenModal() {
  const modal = document.getElementById('fullscreenModal');
  modal.classList.remove('open');

  // Destroy chart
  if (fullscreenChart) {
    fullscreenChart.destroy();
    fullscreenChart = null;
  }

  // Remove ESC key listener
  document.removeEventListener('keydown', handleEscapeKey);
}

/**
 * Handle ESC key to close fullscreen modal
 */
function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    closeFullscreenModal();
  }
}

/**
 * Remove chart (show confirmation first)
 */
function removeChart(chartId) {
  const charts = loadPinnedCharts();
  const chartData = charts.find(function(c) { return c.id === chartId; });

  if (!chartData) {
    console.error('Chart not found:', chartId);
    return;
  }

  // Update confirmation message
  document.getElementById('confirmMessage').textContent =
    `Are you sure you want to remove '${chartData.name}' from the dashboard?`;

  // Store chart ID for confirmation
  pendingRemoveChartId = chartId;

  // Show confirmation dialog
  document.getElementById('confirmDialog').classList.add('open');

  // Attach confirm button handler
  document.getElementById('confirmRemoveBtn').onclick = confirmRemoveChart;
}

/**
 * Confirm and execute chart removal
 */
function confirmRemoveChart() {
  if (!pendingRemoveChartId) return;

  const chartId = pendingRemoveChartId;
  const charts = loadPinnedCharts();

  // Remove from array
  const filteredCharts = charts.filter(function(c) { return c.id !== chartId; });
  savePinnedCharts(filteredCharts);

  // Remove from grid
  grid.removeWidget(`[gs-id="${chartId}"]`);

  // Close dialog
  closeConfirmDialog();

  // Show success toast
  showToast('Chart removed from dashboard', 'success');

  // Check if empty now
  if (filteredCharts.length === 0) {
    showEmptyState();
    document.getElementById('dashboardGrid').style.display = 'none';
  }

  // Clear pending ID
  pendingRemoveChartId = null;
}

/**
 * Close confirmation dialog
 */
function closeConfirmDialog() {
  document.getElementById('confirmDialog').classList.remove('open');
  pendingRemoveChartId = null;
}

/**
 * Show empty state
 */
function showEmptyState() {
  document.getElementById('emptyState').style.display = 'flex';
}

/**
 * Hide empty state
 */
function hideEmptyState() {
  document.getElementById('emptyState').style.display = 'none';
}

/**
 * Show toast notification
 */
function showToast(message, type) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');

  toastMessage.textContent = message;
  toast.className = 'toast ' + (type || 'info');
  toast.classList.add('show');

  setTimeout(function() {
    toast.classList.remove('show');
  }, 3000);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Export functions for use in HTML onclick attributes
window.refreshChart = refreshChart;
window.expandChart = expandChart;
window.removeChart = removeChart;
window.closeFullscreenModal = closeFullscreenModal;
window.confirmRemoveChart = confirmRemoveChart;
window.closeConfirmDialog = closeConfirmDialog;
