/**
 * PORTAFOLIO DE DASHBOARDS - MAIN JAVASCRIPT
 * Autor: Tu Nombre
 * Versión: 1.0
 * Descripción: Manejo de proyectos, modal, animaciones y filtros
 */

// ===================================
// DATOS DE PROYECTOS
// ===================================

let projects = {
    powerbi: [
        {
            title: "Dashboard de Ventas 2024",
            description: "Análisis completo de ventas con KPIs principales, tendencias mensuales y análisis por región geográfica. Incluye métricas de desempeño y comparativas año con año.",
            url: "#"
        },
        {
            title: "Dashboard Financiero",
            description: "Visualización de estados financieros, flujo de caja y proyecciones trimestrales con indicadores clave de rentabilidad y liquidez.",
            url: "#"
        }
    ],
    excel: []
};

// ===================================
// ESTADÍSTICAS Y CONTADORES
// ===================================

/**
 * Actualiza las estadísticas del header
 */
function updateStats() {
    const totalProjects = projects.powerbi.length + projects.excel.length;
    animateNumber('total-projects', totalProjects);
    animateNumber('powerbi-count', projects.powerbi.length);
    animateNumber('excel-count', projects.excel.length);
}

/**
 * Anima un número contando desde 0 hasta el valor final
 * @param {string} elementId - ID del elemento a animar
 * @param {number} finalNumber - Número final
 */
function animateNumber(elementId, finalNumber) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const duration = 1000; // 1 segundo
    const steps = 20;
    const increment = finalNumber / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= finalNumber) {
            element.textContent = finalNumber;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, duration / steps);
}

// ===================================
// RENDERIZADO DE PROYECTOS
// ===================================

/**
 * Renderiza todos los proyectos en la página
 */
function renderProjects() {
    renderPowerBIProjects();
    renderExcelProjects();
    updateStats();
}

/**
 * Renderiza proyectos de Power BI
 */
function renderPowerBIProjects() {
    const powerbiGrid = document.getElementById('powerbi-grid');
    if (!powerbiGrid) return;

    powerbiGrid.innerHTML = projects.powerbi.map((project, index) => `
        <article class="project-card" style="animation-delay: ${index * 0.1}s" role="listitem">
            <div class="project-header">
                <span class="project-type">Power BI</span>
                <h3 class="project-title">${escapeHtml(project.title)}</h3>
            </div>
            <div class="project-body">
                <p class="project-description">${escapeHtml(project.description)}</p>
                <a href="${escapeHtml(project.url)}" class="project-link" target="_blank" rel="noopener noreferrer">
                    <span>Ver Dashboard</span>
                </a>
            </div>
        </article>
    `).join('');
}

/**
 * Renderiza proyectos de Excel
 */
function renderExcelProjects() {
    const excelGrid = document.getElementById('excel-grid');
    if (!excelGrid) return;

    if (projects.excel.length > 0) {
        excelGrid.innerHTML = projects.excel.map((project, index) => `
            <article class="project-card" style="animation-delay: ${index * 0.1}s" role="listitem">
                <div class="project-header excel">
                    <span class="project-type excel">Excel</span>
                    <h3 class="project-title">${escapeHtml(project.title)}</h3>
                </div>
                <div class="project-body">
                    <p class="project-description">${escapeHtml(project.description)}</p>
                    <a href="${escapeHtml(project.url)}" class="project-link excel" target="_blank" rel="noopener noreferrer">
                        <span>Ver Dashboard</span>
                    </a>
                </div>
            </article>
        `).join('');
    } else {
        excelGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📊</div>
                <p class="empty-state-text">Aún no hay proyectos de Excel.<br>¡Agrega tu primer dashboard!</p>
            </div>
        `;
    }
}

/**
 * Escapa caracteres HTML para prevenir XSS
 * @param {string} text - Texto a escapar
 * @returns {string} Texto escapado
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

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
    const powerbiSection = document.querySelector('#powerbi-grid').closest('section');
    const excelSection = document.querySelector('#excel-grid').closest('section');

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
}

// ===================================
// MODAL
// ===================================

/**
 * Abre el modal para agregar proyecto
 */
function openModal() {
    const modal = document.getElementById('modal');
    if (!modal) return;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus en el primer input
    const firstInput = modal.querySelector('select');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
}

/**
 * Cierra el modal
 */
function closeModal() {
    const modal = document.getElementById('modal');
    const form = document.getElementById('project-form');
    
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    if (form) form.reset();
}

/**
 * Cierra el modal al hacer clic fuera
 */
function setupModalClickOutside() {
    const modal = document.getElementById('modal');
    if (!modal) return;

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

/**
 * Cierra el modal con la tecla ESC
 */
function setupModalEscapeKey() {
    document.addEventListener('keydown', function(e) {
        const modal = document.getElementById('modal');
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// ===================================
// FORMULARIO
// ===================================

/**
 * Maneja el envío del formulario
 */
function setupFormSubmit() {
    const form = document.getElementById('project-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Obtener valores del formulario
        const type = document.getElementById('project-type').value;
        const title = document.getElementById('project-title').value.trim();
        const description = document.getElementById('project-description').value.trim();
        const url = document.getElementById('project-url').value.trim();

        // Validación básica
        if (!type || !title || !description || !url) {
            alert('Por favor completa todos los campos');
            return;
        }

        // Crear nuevo proyecto
        const newProject = {
            title: title,
            description: description,
            url: url
        };

        // Agregar al array correspondiente
        projects[type].push(newProject);

        // Re-renderizar proyectos
        renderProjects();

        // Cerrar modal
        closeModal();

        // Mostrar feedback de éxito
        showSuccessFeedback();

        // Scroll suave hacia el nuevo proyecto
        setTimeout(() => {
            const section = type === 'powerbi' ? '#powerbi-grid' : '#excel-grid';
            const element = document.querySelector(section);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 300);
    });
}

/**
 * Muestra feedback visual de éxito
 */
function showSuccessFeedback() {
    const btn = document.querySelector('.add-project-btn');
    if (!btn) return;

    const originalText = btn.innerHTML;
    btn.innerHTML = '✓ ¡Proyecto Agregado!';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = 'linear-gradient(135deg, #6366f1, #a855f7)';
    }, 2000);
}

// ===================================
// EFECTOS PARALLAX
// ===================================

/**
 * Efecto parallax en las burbujas al hacer scroll
 */
function setupParallaxEffect() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const bubbles = document.querySelectorAll('.bubble');
        
        bubbles.forEach((bubble, index) => {
            const speed = 0.2 + (index * 0.1);
            bubble.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// ===================================
// ANIMACIONES AL SCROLL
// ===================================

/**
 * Observa elementos y anima cuando entran al viewport
 */
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar todas las cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// ===================================
// INICIALIZACIÓN
// ===================================

/**
 * Inicializa toda la aplicación
 */
function init() {
    // Renderizar proyectos iniciales
    renderProjects();

    // Configurar eventos del modal
    setupModalClickOutside();
    setupModalEscapeKey();

    // Configurar formulario
    setupFormSubmit();

    // Configurar efectos
    setupParallaxEffect();

    // Animaciones al scroll (solo si IntersectionObserver está disponible)
    if ('IntersectionObserver' in window) {
        // Esperar un momento para que el DOM esté completamente listo
        setTimeout(setupScrollAnimations, 100);
    }

    console.log('✅ Portafolio inicializado correctamente');
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}