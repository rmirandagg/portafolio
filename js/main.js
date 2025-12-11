/**
 * PORTAFOLIO DE DASHBOARDS - MAIN JAVASCRIPT
 * Versión: 3.0 - Manejo avanzado de iframes y UX mejorada
 * Descripción: Manejo de tabs, parallax, animaciones y dashboards embebidos
 */

// ===================================
// FILTROS Y TABS
// ===================================

/**
 * Muestra proyectos según el tab seleccionado
 * @param {string} tab - Tipo de tab ('all', 'powerbi', 'excel')
 * @param {Event} [evt] - Evento de clic (opcional, para marcar botón activo)
 */
function showTab(tab, evt) {
    // Actualizar botones activos
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Si viene el evento, marcamos el botón clicado como activo
    if (evt && evt.currentTarget) {
        evt.currentTarget.classList.add('active');
    }

    // Obtener secciones
    const powerbiSection = document.getElementById('powerbi-section');
    const excelSection   = document.getElementById('excel-section');

    if (!powerbiSection || !excelSection) return;

    // Mostrar/ocultar secciones según el tab
    switch (tab) {
        case 'all':
            powerbiSection.style.display = 'block';
            excelSection.style.display   = 'block';
            break;
        case 'powerbi':
            powerbiSection.style.display = 'block';
            excelSection.style.display   = 'none';
            break;
        case 'excel':
            powerbiSection.style.display = 'none';
            excelSection.style.display   = 'block';
            break;
        default:
            powerbiSection.style.display = 'block';
            excelSection.style.display   = 'block';
    }

    // Scroll suave a la sección visible
    setTimeout(() => {
        if (tab === 'powerbi' && powerbiSection) {
            powerbiSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (tab === 'excel' && excelSection) {
            excelSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 100);
}

// ===================================
// EFECTOS PARALLAX
// ===================================

/**
 * Efecto parallax en las burbujas al hacer scroll
 */
function setupParallaxEffect() {
    let ticking = false;

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                const scrolled = window.pageYOffset;
                const bubbles  = document.querySelectorAll('.bubble');

                bubbles.forEach((bubble, index) => {
                    const speed = 0.2 + (index * 0.1);
                    bubble.style.transform = `translateY(${scrolled * speed}px)`;
                });

                ticking = false;
            });

            ticking = true;
        }
    });
}

// ===================================
// ANIMACIONES AL SCROLL
// ===================================

/**
 * Observa elementos y anima cuando entran al viewport
 */
function setupScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
        console.log('IntersectionObserver no disponible');
        return;
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    const dashboards = document.querySelectorAll('.dashboard-container');
    dashboards.forEach((dashboard, index) => {
        dashboard.style.animationDelay = `${index * 0.2}s`;
        observer.observe(dashboard);
    });
}

// ===================================
// MANEJO DE IFRAMES
// ===================================

/**
 * Muestra un mensaje de error elegante dentro del wrapper
 * @param {HTMLElement} wrapper
 * @param {string} msg
 */
function showIframeError(wrapper, msg) {
    if (!wrapper) return;

    const placeholder = wrapper.querySelector('.dashboard-placeholder');
    if (placeholder) {
        placeholder.style.display = 'flex';
        placeholder.innerHTML = `
            <div class="placeholder-icon">⚠️</div>
            <p class="placeholder-text">
                <strong>Error al cargar el dashboard</strong><br>
                ${msg}
            </p>
        `;
    } else {
        // Fallback básico
        wrapper.innerHTML = `
            <div class="dashboard-error">
                ⚠️ ${msg}
            </div>
        `;
    }
}

/**
 * Verifica iframes, gestiona placeholders, fade-in y timeout de error
 */
function checkIframes() {
    const iframes = document.querySelectorAll('.dashboard-iframe-wrapper iframe');

    iframes.forEach(iframe => {
        const src = iframe.getAttribute('src');

        // Si no hay src o es un placeholder de ejemplo, no hacemos nada
        if (!src ||
            src.trim() === '' ||
            src.includes('TU_ENLACE_POWERBI') ||
            src.includes('TU_ENLACE_EXCEL')) {
            return;
        }

        const wrapper     = iframe.closest('.dashboard-iframe-wrapper');
        const placeholder = wrapper ? wrapper.querySelector('.dashboard-placeholder') : null;

        // Estado inicial: mostramos placeholder, ocultamos iframe visualmente
        iframe.style.opacity    = '0';
        iframe.style.transition = 'opacity 0.8s ease';

        if (placeholder) {
            placeholder.style.display = 'flex';
        }

        // Timeout por si el iframe no termina de cargar nunca (ej. error silencioso)
        const LOAD_TIMEOUT_MS = 15000;
        const timeoutId = setTimeout(() => {
            console.error('Timeout al cargar dashboard:', iframe.getAttribute('title'));
            showIframeError(wrapper, 'Tiempo de carga excedido. Verifica el enlace o vuelve a intentarlo más tarde.');
        }, LOAD_TIMEOUT_MS);

        // Cuando el iframe termina de cargar correctamente
        iframe.addEventListener('load', function () {
            clearTimeout(timeoutId);

            // Ocultamos placeholder y hacemos fade-in del iframe
            if (placeholder) {
                placeholder.style.display = 'none';
            }

            iframe.style.opacity = '1';
            console.log('Dashboard cargado:', iframe.getAttribute('title'));
        });

        // Manejo de errores explícitos (aunque en iframes no siempre se dispara)
        iframe.addEventListener('error', function () {
            clearTimeout(timeoutId);
            console.error('Error al cargar dashboard:', iframe.getAttribute('title'));

            showIframeError(
                wrapper,
                'Verifica que el enlace sea correcto y que el dashboard esté publicado de forma pública.'
            );
        });
    });
}

// ===================================
// UTILIDADES
// ===================================

/**
 * Añade efecto smooth scroll a todos los enlaces internos
 */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Detecta si el usuario está en modo oscuro del sistema
 */
function detectDarkMode() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        console.log('Usuario prefiere modo oscuro');
        // El diseño ya es oscuro por defecto; aquí podrías agregar variantes si lo deseas
    }
}

/**
 * Log de información del portafolio
 */
function logPortfolioInfo() {
    console.log('%c🚀 Portafolio de Dashboards', 'font-size: 20px; font-weight: bold; color: #6366f1;');
    console.log('%cVersión: 3.0', 'color: #94a3b8;');
    console.log('%cDiseñado para análisis de datos', 'color: #a855f7;');

    // Dashboards con URLs válidas (sin placeholders)
    const validDashboards = document.querySelectorAll(
        'iframe[src]:not([src=""]):not([src*="TU_ENLACE_POWERBI"]):not([src*="TU_ENLACE_EXCEL"])'
    ).length;

    const totalWrappers = document.querySelectorAll('.dashboard-iframe-wrapper').length;
    console.log(`%c✅ Dashboards configurados: ${validDashboards}/${totalWrappers}`, 'color: #10b981;');
}

// ===================================
// INICIALIZACIÓN
// ===================================

/**
 * Inicializa toda la aplicación
 */
function init() {
    console.log('Inicializando portafolio...');

    // Configurar efectos visuales
    setupParallaxEffect();
    setupSmoothScroll();

    // Verificar iframes y gestionar carga
    checkIframes();

    // Detectar preferencias del usuario
    detectDarkMode();

    // Animaciones al scroll (solo si IntersectionObserver está disponible)
    if ('IntersectionObserver' in window) {
        setTimeout(setupScrollAnimations, 100);
    }

    // Log de información
    logPortfolioInfo();

    console.log('✅ Portafolio inicializado correctamente');
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ===================================
// EXPORTAR FUNCIONES (si se necesita)
// ===================================

window.portfolioApp = {
    showTab: showTab,
    checkIframes: checkIframes,
    init: init
};
