/**
 * =========================================================================
 * PRESENTATION LOGIC & CONTROLLER
 * Seminar Nasional SENTRA PENDIPA 2026
 * Model SSCS Berbantuan Flashcard pada Materi Suhu & Kalor
 * =========================================================================
 */

'use strict';

// Global Chart.js instances to prevent canvas reuse conflicts
let macroChart = null;
let hellerChart = null;
let mouseIdleTimer = null;
let timerSeconds = 0;
let timerInterval = null;
let timerRunning = true;

// =========================================================================
// 1. REVEAL.JS INITIALIZATION & CORE CONFIG
// =========================================================================
Reveal.initialize({
    width: 1280,
    height: 720,
    margin: 0.02,
    minScale: 0.2,
    maxScale: 2.5,
    hash: true,
    history: true,
    center: false,
    controls: false,
    transition: 'slide',
    backgroundTransition: 'fade',
    transitionSpeed: 'fast',
    overview: true,
    keyboard: true,
    touch: true,
    mouseWheel: false
});

// Event: Presentation Ready
Reveal.on('ready', event => {
    initSlideJumpMenu();
    updateCustomUI(event.indexh);
    renderMathFormulas();
    renderChartIfNeeded(event.indexh);
    startTimer();
});

// Event: Slide Changed
Reveal.on('slidechanged', event => {
    updateCustomUI(event.indexh);
    renderChartIfNeeded(event.indexh);
});

// =========================================================================
// 2. FULLSCREEN PRESENTATION MODE CONTROLLER (PPT / KEYNOTE STYLE)
// =========================================================================
function togglePresentationMode() {
    if (!document.fullscreenElement) {
        const docEl = document.documentElement;
        const requestFs = docEl.requestFullscreen || 
                          docEl.webkitRequestFullscreen || 
                          docEl.mozRequestFullScreen || 
                          docEl.msRequestFullscreen;
        if (requestFs) {
            requestFs.call(docEl).catch(err => {
                console.warn('Fullscreen request failed:', err);
            });
        }
    } else {
        const exitFs = document.exitFullscreen || 
                       document.webkitExitFullscreen || 
                       document.mozCancelFullScreen || 
                       document.msExitFullscreen;
        if (exitFs) {
            exitFs.call(document);
        }
    }
}

// Bind Fullscreen Buttons
const btnFullscreen = document.getElementById('btnFullscreen');
if (btnFullscreen) {
    btnFullscreen.addEventListener('click', togglePresentationMode);
}

// Fullscreen State Synchronization
['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(evt => {
    document.addEventListener(evt, handleFullscreenSync);
});

function handleFullscreenSync() {
    const isFull = !!(document.fullscreenElement || 
                      document.webkitFullscreenElement || 
                      document.mozFullScreenElement || 
                      document.msFullscreenElement);
    
    document.body.classList.toggle('is-fullscreen', isFull);
    
    const fsLabel = document.getElementById('fsBtnLabel');
    if (fsLabel) {
        fsLabel.textContent = isFull ? 'Keluar (ESC)' : 'Presentasi (F)';
    }

    // Force layout recalculation with buffer to guarantee 16:9 projection
    setTimeout(() => {
        Reveal.layout();
        if (macroChart) macroChart.resize();
        if (hellerChart) hellerChart.resize();
    }, 180);
}

// Window Resize Synchronization
let windowResizeTimer = null;
window.addEventListener('resize', () => {
    clearTimeout(windowResizeTimer);
    windowResizeTimer = setTimeout(() => {
        Reveal.layout();
        if (macroChart) macroChart.resize();
        if (hellerChart) hellerChart.resize();
    }, 150);
});

// Auto-hide floating presenter toolbar in fullscreen mode when idle
const floatingBar = document.getElementById('floating-presentation-bar');

document.addEventListener('mousemove', () => {
    if (document.body.classList.contains('is-fullscreen') && floatingBar) {
        floatingBar.classList.remove('idle-fade');
        clearTimeout(mouseIdleTimer);
        mouseIdleTimer = setTimeout(() => {
            floatingBar.classList.add('idle-fade');
        }, 2800);
    }
});

// Global Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        togglePresentationMode();
    } else if (e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        const menu = document.getElementById('slide-jump-menu');
        if (menu) {
            menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
        }
    }
});

// =========================================================================
// 3. KATEX MATH FORMULA AUTO-RENDER
// =========================================================================
function renderMathFormulas() {
    if (typeof renderMathInElement === 'function') {
        renderMathInElement(document.body, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false }
            ],
            throwOnError: false
        });
    }
}

// =========================================================================
// 4. UI SYNCHRONIZATION (BREADCRUMB, PROGRESS BAR, COUNTER)
// =========================================================================
function updateCustomUI(index) {
    const total = Reveal.getTotalSlides();
    const current = index + 1;
    
    const formattedCurrent = current < 10 ? '0' + current : current;
    const formattedTotal = total < 10 ? '0' + total : total;
    const counterText = `${formattedCurrent} / ${formattedTotal}`;

    const badge = document.getElementById('slideNumberBadge');
    if (badge) badge.textContent = counterText;

    const floatingCounter = document.getElementById('floatingCounterBadge');
    if (floatingCounter) floatingCounter.textContent = counterText;

    // Update top progress line
    const progressBar = document.getElementById('deck-progress-bar');
    if (progressBar) {
        const progressPercent = (current / total) * 100;
        progressBar.style.width = progressPercent + '%';
    }

    // Update breadcrumb
    const currentSection = Reveal.getCurrentSlide();
    const slideTitle = currentSection ? (currentSection.getAttribute('data-title') || 'Seminar SENTRA PENDIPA 2026') : '';
    const breadcrumb = document.getElementById('current-slide-breadcrumb');
    if (breadcrumb) {
        breadcrumb.textContent = `Slide ${current}: ${slideTitle}`;
    }

    // Update active jump menu item
    document.querySelectorAll('.jump-item').forEach((item, idx) => {
        item.classList.toggle('active', idx === index);
    });
}

// =========================================================================
// 5. QUICK SLIDE JUMP MENU DRAWER
// =========================================================================
function initSlideJumpMenu() {
    const menuContainer = document.getElementById('slide-jump-menu');
    if (!menuContainer) return;

    menuContainer.innerHTML = '';
    const slides = document.querySelectorAll('.reveal .slides > section');

    slides.forEach((slide, idx) => {
        const title = slide.getAttribute('data-title') || `Slide ${idx + 1}`;
        const item = document.createElement('div');
        item.className = 'jump-item' + (idx === 0 ? ' active' : '');
        item.innerHTML = `
            <span class="jump-num">${idx + 1 < 10 ? '0' + (idx + 1) : idx + 1}</span>
            <span>${title}</span>
        `;
        item.addEventListener('click', () => {
            Reveal.slide(idx);
            menuContainer.style.display = 'none';
        });
        menuContainer.appendChild(item);
    });

    const btnJump = document.getElementById('btnToggleJump');
    if (btnJump) {
        btnJump.addEventListener('click', (e) => {
            e.stopPropagation();
            menuContainer.style.display = menuContainer.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#slide-jump-menu') && !e.target.closest('#btnToggleJump')) {
            menuContainer.style.display = 'none';
        }
    });
}

// =========================================================================
// 6. LIVE PRESENTATION STOPWATCH
// =========================================================================
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (timerRunning) {
            timerSeconds++;
            const mins = Math.floor(timerSeconds / 60);
            const secs = timerSeconds % 60;
            const timerEl = document.getElementById('timerText');
            if (timerEl) {
                timerEl.textContent = 
                    (mins < 10 ? '0' + mins : mins) + ':' + (secs < 10 ? '0' + secs : secs);
            }
        }
    }, 1000);
}

const timerBox = document.getElementById('sessionTimer');
if (timerBox) {
    timerBox.addEventListener('click', () => {
        timerRunning = !timerRunning;
        timerBox.style.opacity = timerRunning ? '1' : '0.6';
    });

    timerBox.addEventListener('dblclick', () => {
        timerSeconds = 0;
        const timerEl = document.getElementById('timerText');
        if (timerEl) timerEl.textContent = '00:00';
    });
}

// =========================================================================
// 7. CELEBRATION CONFETTI (SLIDE 7)
// =========================================================================
function fireConfetti() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#1b5e3a', '#65c447', '#53a497', '#f59e0b']
        });
    }
}

// =========================================================================
// 8. LAZY & REPLAYABLE CHART.JS ANIMATIONS (BULAK-BALIK DARI DASAR)
// =========================================================================
function triggerReplayAnimation(chart) {
    if (!chart) return;
    chart.stop();
    chart.reset();
    setTimeout(() => {
        chart.update();
    }, 50);
}

function switchResultTab(tabId, btnEl) {
    document.querySelectorAll('.result-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.result-tab-panel').forEach(panel => panel.classList.remove('active'));

    if (btnEl) btnEl.classList.add('active');
    const targetPanel = document.getElementById(tabId);
    if (targetPanel) targetPanel.classList.add('active');

    if (tabId === 'tab-ngain') {
        if (!macroChart) {
            setTimeout(initMacroChart, 60);
        } else {
            macroChart.resize();
            triggerReplayAnimation(macroChart);
        }
    } else if (macroChart) {
        macroChart.reset();
    }

    if (tabId === 'tab-indikator') {
        if (!hellerChart) {
            setTimeout(initHellerChart, 60);
        } else {
            hellerChart.resize();
            triggerReplayAnimation(hellerChart);
        }
    } else if (hellerChart) {
        hellerChart.reset();
    }
}

function renderChartIfNeeded(slideIndex) {
    // Slide 5 (0-indexed: 4) -> Hasil Pretest, Posttest & N-Gain (Chart Tabs)
    if (slideIndex === 4) {
        const activePanel = document.querySelector('.result-tab-panel.active');
        if (activePanel) {
            if (activePanel.id === 'tab-ngain') {
                if (!macroChart) {
                    setTimeout(initMacroChart, 80);
                } else {
                    macroChart.resize();
                    triggerReplayAnimation(macroChart);
                }
            } else if (activePanel.id === 'tab-indikator') {
                if (!hellerChart) {
                    setTimeout(initHellerChart, 80);
                } else {
                    hellerChart.resize();
                    triggerReplayAnimation(hellerChart);
                }
            }
        }
    } else {
        if (macroChart) macroChart.reset();
        if (hellerChart) hellerChart.reset();
    }

    // Slide 7 (0-indexed: 6) -> Penutup / Thank You Celebration
    if (slideIndex === 6) {
        setTimeout(fireConfetti, 400);
    }
}

// Chart 1: Macro Comparison Bar Chart (Grows Upwards from Base y=0)
function initMacroChart() {
    const ctx = document.getElementById('macroComparisonChart');
    if (!ctx) return;
    
    macroChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Pretest (Awal)', 'Posttest (Akhir)', 'N-Gain (Peningkatan %)'],
            datasets: [
                {
                    label: 'SSCS + Flashcard (Eksperimen)',
                    data: [26, 91, 88], // 88 represents 0.88 normalized
                    backgroundColor: '#1b5e3a',
                    borderRadius: 6,
                    barPercentage: 0.65,
                    categoryPercentage: 0.75
                },
                {
                    label: 'PBL + Flashcard (Kontrol)',
                    data: [21, 86, 82], // 82 represents 0.82 normalized
                    backgroundColor: '#94a3b8',
                    borderRadius: 6,
                    barPercentage: 0.65,
                    categoryPercentage: 0.75
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1100,
                easing: 'easeOutQuart'
            },
            animations: {
                y: {
                    from: (ctx) => {
                        if (ctx.type === 'data') {
                            return ctx.chart.scales.y.getPixelForValue(0);
                        }
                    },
                    duration: 1100,
                    easing: 'easeOutQuart'
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: { family: "'Plus Jakarta Sans', sans-serif", size: 12, weight: '600' },
                        color: '#0f172a',
                        usePointStyle: true,
                        pointStyle: 'rectRounded'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.dataIndex === 2) {
                                return `${context.dataset.label}: N-Gain ${(context.raw / 100).toFixed(2)} (Kategori Tinggi)`;
                            }
                            return `${context.dataset.label}: Skor ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 100,
                    ticks: { color: '#64748b', font: { family: "'Inter', sans-serif", size: 11 }, stepSize: 20 },
                    grid: { color: 'rgba(226, 232, 240, 0.8)' }
                },
                x: {
                    ticks: { color: '#0f172a', font: { family: "'Plus Jakarta Sans', sans-serif", size: 11, weight: '600' } },
                    grid: { display: false }
                }
            }
        }
    });
}

// Chart 2: Submateri Horizontal Bar Chart (Slide 10 - Grows Outwards from Base x=0.70)
function initSubmateriChart() {
    const ctx = document.getElementById('submateriChart');
    if (!ctx) return;

    submateriChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Suhu & Termometer', 'Kalor & Perubahan Wujud', 'Perpindahan Kalor'],
            datasets: [
                {
                    label: 'SSCS + Flashcard',
                    data: [0.94, 0.83, 0.88],
                    backgroundColor: '#2563eb',
                    borderRadius: 6,
                    barPercentage: 0.65
                },
                {
                    label: 'PBL + Flashcard',
                    data: [0.83, 0.77, 0.86],
                    backgroundColor: '#94a3b8',
                    borderRadius: 6,
                    barPercentage: 0.65
                }
            ]
        },
        options: {
            indexAxis: 'y', // Horizontal
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1100,
                easing: 'easeOutQuart'
            },
            animations: {
                x: {
                    from: (ctx) => {
                        if (ctx.type === 'data') {
                            return ctx.chart.scales.x.getPixelForValue(0.70);
                        }
                    },
                    duration: 1100,
                    easing: 'easeOutQuart'
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: { family: "'Plus Jakarta Sans', sans-serif", size: 12, weight: '600' },
                        color: '#0f172a',
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: N-Gain ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    min: 0.70,
                    max: 1.00,
                    ticks: { color: '#64748b', stepSize: 0.05 },
                    grid: { color: 'rgba(226, 232, 240, 0.8)' }
                },
                y: {
                    ticks: { color: '#0f172a', font: { family: "'Plus Jakarta Sans', sans-serif", size: 11, weight: '600' } },
                    grid: { display: false }
                }
            }
        }
    });
}

// Chart 3: Heller 5 Dimensions Radar Chart (Slide 11 - Expands Outward from Origin)
function initHellerChart() {
    const ctx = document.getElementById('hellerRadarChart');
    if (!ctx) return;

    hellerChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: [
                '1. Deskripsi Berguna',
                '2. Pendekatan Fisika',
                '3. Aplikasi Spesifik',
                '4. Prosedur Matematika',
                '5. Progresi Logis'
            ],
            datasets: [
                {
                    label: 'SSCS + Flashcard',
                    data: [0.88, 0.87, 0.85, 0.92, 0.87],
                    backgroundColor: 'rgba(27, 94, 58, 0.22)',
                    borderColor: '#1b5e3a',
                    borderWidth: 2.5,
                    pointBackgroundColor: '#1b5e3a',
                    pointBorderColor: '#ffffff',
                    pointHoverRadius: 6,
                    pointRadius: 4
                },
                {
                    label: 'PBL + Flashcard',
                    data: [0.84, 0.81, 0.79, 0.87, 0.80],
                    backgroundColor: 'rgba(148, 163, 184, 0.2)',
                    borderColor: '#64748b',
                    borderWidth: 2,
                    pointBackgroundColor: '#64748b',
                    pointBorderColor: '#ffffff',
                    pointHoverRadius: 6,
                    pointRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1200,
                easing: 'easeOutQuart'
            },
            animations: {
                x: {
                    from: (ctx) => {
                        if (ctx.type === 'data' && ctx.chart.scales.r) {
                            return ctx.chart.scales.r.xCenter;
                        }
                    },
                    duration: 1200,
                    easing: 'easeOutQuart'
                },
                y: {
                    from: (ctx) => {
                        if (ctx.type === 'data' && ctx.chart.scales.r) {
                            return ctx.chart.scales.r.yCenter;
                        }
                    },
                    duration: 1200,
                    easing: 'easeOutQuart'
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: { family: "'Plus Jakarta Sans', sans-serif", size: 12, weight: '600' },
                        color: '#0f172a',
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: N-Gain ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                r: {
                    min: 0.70,
                    max: 1.00,
                    ticks: { stepSize: 0.05, color: '#64748b', font: { size: 10 }, backdropColor: 'transparent' },
                    pointLabels: { font: { family: "'Plus Jakarta Sans', sans-serif", size: 11, weight: '600' }, color: '#0f172a' },
                    grid: { color: 'rgba(203, 213, 225, 0.6)' },
                    angleLines: { color: 'rgba(203, 213, 225, 0.6)' }
                }
            }
        }
    });
}
