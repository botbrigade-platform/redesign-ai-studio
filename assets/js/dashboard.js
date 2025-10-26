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
    hideClearAllButton();
  } else {
    hideEmptyState();
    showClearAllButton();
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
  }, '#dashboardGrid');

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
 * Show clear all button
 */
function showClearAllButton() {
  const clearBtn = document.getElementById('clearAllBtn');
  if (clearBtn) {
    clearBtn.style.display = '';
  }
}

/**
 * Hide clear all button
 */
function hideClearAllButton() {
  const clearBtn = document.getElementById('clearAllBtn');
  if (clearBtn) {
    clearBtn.style.display = 'none';
  }
}

/**
 * Clear all charts from dashboard
 */
function clearAllCharts() {
  const charts = loadPinnedCharts();

  if (charts.length === 0) {
    return;
  }

  // Show confirmation dialog
  document.getElementById('confirmMessage').textContent =
    `Are you sure you want to remove all ${charts.length} chart${charts.length > 1 ? 's' : ''} from the dashboard?`;

  // Store special flag for clearing all
  pendingRemoveChartId = 'CLEAR_ALL';

  // Show confirmation dialog
  document.getElementById('confirmDialog').classList.add('open');

  // Attach confirm button handler
  document.getElementById('confirmRemoveBtn').onclick = function() {
    if (pendingRemoveChartId === 'CLEAR_ALL') {
      // Clear all charts from sessionStorage
      sessionStorage.removeItem('pinnedCharts');

      // Close dialog
      closeConfirmDialog();

      // Show success toast
      showToast('All charts cleared from dashboard', 'success');

      // Reload page to show empty state
      location.reload();
    }
  };
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

/**
 * Load preview dashboard with 10 sample charts
 */
function loadPreviewDashboard() {
  const previewCharts = generatePreviewCharts();
  savePinnedCharts(previewCharts);

  // Reload dashboard
  location.reload();
}

/**
 * Generate 10 sample charts with different types and sizes
 */
function generatePreviewCharts() {
  const charts = [];
  const now = Date.now();

  // Chart 1: Line Chart - Revenue Trend (2x2)
  charts.push({
    id: 'preview-chart-1',
    artifactId: 'preview-artifact-1',
    name: 'Revenue Trend Q1-Q4 2024',
    type: 'chart',
    chartType: 'line',
    pinnedAt: new Date(now - 9000).toISOString(),
    gridPosition: { x: 0, y: 0, w: 2, h: 2 },
    chartConfig: {
      type: 'line',
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [{
          label: 'Revenue (Billions IDR)',
          data: [37.5, 40.8, 45.8, 48.2],
          borderColor: '#072ac8',
          backgroundColor: 'rgba(7, 42, 200, 0.1)',
          borderWidth: 2,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { position: 'top' } }
      }
    }
  });

  // Chart 2: Bar Chart - Sector Performance (3x2)
  charts.push({
    id: 'preview-chart-2',
    artifactId: 'preview-artifact-2',
    name: 'Sector Performance Comparison',
    type: 'chart',
    chartType: 'bar',
    pinnedAt: new Date(now - 8000).toISOString(),
    gridPosition: { x: 2, y: 0, w: 3, h: 2 },
    chartConfig: {
      type: 'bar',
      data: {
        labels: ['Sector A', 'Sector B', 'Sector C', 'Sector D'],
        datasets: [{
          label: 'Revenue',
          data: [26.6, 12.8, 6.4, 8.5],
          backgroundColor: 'rgba(7, 42, 200, 0.7)',
          borderColor: '#072ac8',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } }
      }
    }
  });

  // Chart 3: Pie Chart - Market Share (1x2)
  charts.push({
    id: 'preview-chart-3',
    artifactId: 'preview-artifact-3',
    name: 'Market Share Distribution',
    type: 'chart',
    chartType: 'pie',
    pinnedAt: new Date(now - 7000).toISOString(),
    gridPosition: { x: 5, y: 0, w: 1, h: 2 },
    chartConfig: {
      type: 'pie',
      data: {
        labels: ['Product A', 'Product B', 'Product C', 'Others'],
        datasets: [{
          data: [35, 28, 22, 15],
          backgroundColor: [
            'rgba(7, 42, 200, 0.8)',
            'rgba(255, 198, 0, 0.8)',
            'rgba(0, 166, 81, 0.8)',
            'rgba(156, 163, 175, 0.6)'
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { position: 'bottom' } }
      }
    }
  });

  // Chart 4: Doughnut Chart - Budget Allocation (2x2)
  charts.push({
    id: 'preview-chart-4',
    artifactId: 'preview-artifact-4',
    name: 'Budget Allocation 2024',
    type: 'chart',
    chartType: 'doughnut',
    pinnedAt: new Date(now - 6000).toISOString(),
    gridPosition: { x: 0, y: 2, w: 2, h: 2 },
    chartConfig: {
      type: 'doughnut',
      data: {
        labels: ['Development', 'Operations', 'Marketing', 'Research'],
        datasets: [{
          data: [40, 30, 20, 10],
          backgroundColor: [
            '#072ac8',
            '#ffc600',
            '#00A651',
            '#9ca3af'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { position: 'right' } }
      }
    }
  });

  // Chart 5: Bar Chart - Monthly Growth (2x2)
  charts.push({
    id: 'preview-chart-5',
    artifactId: 'preview-artifact-5',
    name: 'Monthly User Growth',
    type: 'chart',
    chartType: 'bar',
    pinnedAt: new Date(now - 5000).toISOString(),
    gridPosition: { x: 2, y: 2, w: 2, h: 2 },
    chartConfig: {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'New Users',
          data: [1200, 1900, 1500, 2200, 2800, 3100],
          backgroundColor: 'rgba(255, 198, 0, 0.7)',
          borderColor: '#ffc600',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } }
      }
    }
  });

  // Chart 6: Line Chart - Customer Satisfaction (2x2)
  charts.push({
    id: 'preview-chart-6',
    artifactId: 'preview-artifact-6',
    name: 'Customer Satisfaction Score',
    type: 'chart',
    chartType: 'line',
    pinnedAt: new Date(now - 4000).toISOString(),
    gridPosition: { x: 4, y: 2, w: 2, h: 2 },
    chartConfig: {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          label: 'Satisfaction (%)',
          data: [85, 87, 89, 92],
          borderColor: '#00A651',
          backgroundColor: 'rgba(0, 166, 81, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: { y: { min: 80, max: 100 } }
      }
    }
  });

  // Chart 7: Bar Chart - Team Performance (3x2)
  charts.push({
    id: 'preview-chart-7',
    artifactId: 'preview-artifact-7',
    name: 'Team Performance Metrics',
    type: 'chart',
    chartType: 'bar',
    pinnedAt: new Date(now - 3000).toISOString(),
    gridPosition: { x: 0, y: 4, w: 3, h: 2 },
    chartConfig: {
      type: 'bar',
      data: {
        labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
        datasets: [{
          label: 'Tasks Completed',
          data: [45, 52, 38, 61, 47],
          backgroundColor: 'rgba(7, 42, 200, 0.6)',
          borderColor: '#072ac8',
          borderWidth: 1
        }, {
          label: 'Target',
          data: [50, 50, 50, 50, 50],
          backgroundColor: 'rgba(255, 198, 0, 0.4)',
          borderColor: '#ffc600',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { position: 'top' } }
      }
    }
  });

  // Chart 8: Pie Chart - Traffic Sources (2x2)
  charts.push({
    id: 'preview-chart-8',
    artifactId: 'preview-artifact-8',
    name: 'Traffic Sources',
    type: 'chart',
    chartType: 'pie',
    pinnedAt: new Date(now - 2000).toISOString(),
    gridPosition: { x: 3, y: 4, w: 2, h: 2 },
    chartConfig: {
      type: 'pie',
      data: {
        labels: ['Direct', 'Organic Search', 'Social Media', 'Referral'],
        datasets: [{
          data: [30, 45, 15, 10],
          backgroundColor: [
            '#072ac8',
            '#ffc600',
            '#00A651',
            '#9ca3af'
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { position: 'bottom' } }
      }
    }
  });

  // Chart 9: Line Chart - Server Response Time (1x2)
  charts.push({
    id: 'preview-chart-9',
    artifactId: 'preview-artifact-9',
    name: 'Server Response Time',
    type: 'chart',
    chartType: 'line',
    pinnedAt: new Date(now - 1000).toISOString(),
    gridPosition: { x: 5, y: 4, w: 1, h: 2 },
    chartConfig: {
      type: 'line',
      data: {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        datasets: [{
          label: 'Response Time (ms)',
          data: [120, 115, 125, 118, 122, 119],
          borderColor: '#00A651',
          backgroundColor: 'rgba(0, 166, 81, 0.1)',
          borderWidth: 2,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } }
      }
    }
  });

  // Chart 10: Bar Chart - Quarterly Comparison (6x2 - full width)
  charts.push({
    id: 'preview-chart-10',
    artifactId: 'preview-artifact-10',
    name: 'Quarterly Revenue Comparison (2023 vs 2024)',
    type: 'chart',
    chartType: 'bar',
    pinnedAt: new Date(now).toISOString(),
    gridPosition: { x: 0, y: 6, w: 6, h: 2 },
    chartConfig: {
      type: 'bar',
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [{
          label: '2023',
          data: [32.5, 35.2, 38.1, 40.3],
          backgroundColor: 'rgba(156, 163, 175, 0.6)',
          borderColor: '#9ca3af',
          borderWidth: 2
        }, {
          label: '2024',
          data: [37.5, 40.8, 45.8, 48.2],
          backgroundColor: 'rgba(7, 42, 200, 0.7)',
          borderColor: '#072ac8',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: false }
        }
      }
    }
  });

  return charts;
}

// Export functions for use in HTML onclick attributes
window.refreshChart = refreshChart;
window.expandChart = expandChart;
window.removeChart = removeChart;
window.closeFullscreenModal = closeFullscreenModal;
window.confirmRemoveChart = confirmRemoveChart;
window.closeConfirmDialog = closeConfirmDialog;
window.loadPreviewDashboard = loadPreviewDashboard;
window.clearAllCharts = clearAllCharts;
