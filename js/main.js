/**
 * PORTAFOLIO DE DASHBOARDS - MAIN JAVASCRIPT
 * Versión: 2.0 - Simplificado para iframes estáticos
 * Descripción: Manejo de tabs y efectos parallax
 */

// ===================================
// FILTROS Y TABS
// ===================================

/**
 * Muestra proyectos según el tab seleccionado
 * @param {string} tab - Tipo de tab ('all', 'powerbi', 'excel')
 */
function showTab(tab) {
    // Actualizar botones activos
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Obtener secciones
    const powerbiSection = document.getElementById('powerbi-section');
    const excelSection = document.getElementById('excel-section');

    if (!powerbiSection || !excelSection) return;

    // Mostrar/ocultar secciones según el tab
    switch(tab) {
        case 'all':
            powerbiSection.style.display = 'block';
            excelSection.style.display = 'block';
            break;
        case 'powerbi':
            powerbiSection.style.display = 'block';
            excelSection.style.display = 'none';
            break;
        case 'excel':
            powerbiSection.style.display = 'none';
            excelSection.style.display = 'block';
            break;
        default:
            powerbiSection.style.display = 'block';
            excelSection.style.display = 'block';
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

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrolled = window.pageYOffset;
                const bubbles = document.querySelectorAll('.bubble');
                
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
    // Verificar si IntersectionObserver está disponible
    if (!('IntersectionObserver' in window)) {
        console.log('IntersectionObserver no disponible');
        return;
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    // Observar todos los contenedores de dashboard
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
 * Verifica si los iframes tienen URLs válidas
 * y oculta los placeholders automáticamente
 */
function checkIframes() {
    const iframes = document.querySelectorAll('.dashboard-iframe-wrapper iframe');
    
    iframes.forEach(iframe => {
        const src = iframe.getAttribute('src');
        
        // Si el iframe tiene un src válido (no es placeholder)
        if (src && 
            src !== '' && 
            !src.includes('TU_ENLACE_POWERBI') && 
            !src.includes('TU_ENLACE_EXCEL')) {
            
            // Encontrar el placeholder hermano y ocultarlo
            const wrapper = iframe.closest('.dashboard-iframe-wrapper');
            const placeholder = wrapper.querySelector('.dashboard-placeholder');
            
            if (placeholder) {
                placeholder.style.display = 'none';
            }

            // Agregar listener para cuando el iframe termine de cargar
            iframe.addEventListener('load', function() {
                console.log('Dashboard cargado:', iframe.getAttribute('title'));
            });

            // Manejo de errores
            iframe.addEventListener('error', function() {
                console.error('Error al cargar dashboard:', iframe.getAttribute('title'));
                if (placeholder) {
                    placeholder.style.display = 'flex';
                    placeholder.innerHTML = `
                        <div class="placeholder-icon">⚠️</div>
                        <p class="placeholder-text">
                            <strong>Error al cargar el dashboard</strong><br>
                            Verifica que el enlace sea correcto y que el dashboard esté publicado públicamente.
                        </p>
                    `;
                }
            });
        }
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
        // El diseño ya es oscuro por defecto
    }
}

/**
 * Log de información del portafolio
 */
function logPortfolioInfo() {
    console.log('%c🚀 Portafolio de Dashboards', 'font-size: 20px; font-weight: bold; color: #6366f1;');
    console.log('%cVersión: 2.0', 'color: #94a3b8;');
    console.log('%cDiseñado con 💜 para análisis de datos', 'color: #a855f7;');
    
    // Contar dashboards con URLs válidas
    const validDashboards = document.querySelectorAll('iframe[src]:not([src=""]):not([src*="TU_ENLACE"])').length;
    console.log(`%c✅ Dashboards configurados: ${validDashboards}/4`, 'color: #10b981;');
}

// ===================================
// INICIALIZACIÓN
// ===================================

/**
 * Inicializa toda la aplicación
 */
function init() {
    console.log('Inicializando portafolio...');

    // Configurar efectos
    setupParallaxEffect();
    setupSmoothScroll();
    
    // Verificar iframes
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

// Si necesitas usar estas funciones desde la consola o desde otros scripts
window.portfolioApp = {
    showTab: showTab,
    checkIframes: checkIframes,
    init: init
};