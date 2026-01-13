/**
 * Smart Planner Landing Page
 * Premium Dark/Light Interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavbarScroll();
    initScrollAnimations();
    initSmoothScroll();
    initTabInteraction();
    initCTAButton();
    initParallax();
});

// === Navbar Scroll Effect ===
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// === Scroll Animations (Intersection Observer) ===
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.feature-text, .feature-visual, .empathy-card, .testimonial-card, ' +
        '.stat-item, .results-header, .result-before, .result-after, ' +
        '.empathy-message, .cta-content'
    );

    animatedElements.forEach(el => el.classList.add('fade-in'));

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.15
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered animation
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach((el, index) => {
        // Add stagger delay for grid items
        if (el.classList.contains('empathy-card') || el.classList.contains('stat-item')) {
            const siblings = el.parentElement.querySelectorAll('.' + el.classList[0]);
            const sibIndex = Array.from(siblings).indexOf(el);
            el.dataset.delay = sibIndex * 100;
        }
        fadeInObserver.observe(el);
    });

    // Section titles
    const sectionTitles = document.querySelectorAll(
        '.feature-title, .empathy-title, .results-title, .testimonials-title, .cta-title'
    );
    sectionTitles.forEach(title => {
        title.classList.add('fade-in');
        fadeInObserver.observe(title);
    });
}

// === Smooth Scroll ===
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// === Tab Interaction ===
function initTabInteraction() {
    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from siblings
            const parent = tab.parentElement;
            parent.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            // Add active to clicked
            tab.classList.add('active');
        });
    });
}

// === CTA Button Interaction ===
function initCTAButton() {
    const ctaButton = document.getElementById('main-cta');
    const navCta = document.querySelector('.nav-cta');

    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            createRipple(ctaButton);
            setTimeout(() => {
                showToast('준비 중입니다! 곧 만나요 ✨');
            }, 300);
        });
    }

    if (navCta) {
        navCta.addEventListener('click', () => {
            document.getElementById('cta').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

// === Ripple Effect ===
function createRipple(button) {
    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-effect 0.6s linear;
        pointer-events: none;
    `;

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.marginLeft = -size / 2 + 'px';
    ripple.style.marginTop = -size / 2 + 'px';

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

// === Toast Notification ===
function showToast(message) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: #FFFFFF;
        color: #0A0A0A;
        padding: 16px 32px;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 500;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        opacity: 0;
        transition: all 0.3s ease;
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// === Parallax Effect ===
function initParallax() {
    const heroContent = document.querySelector('.hero-content');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
        }
    });
}

// === CSS for Ripple Animation ===
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-effect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// === Counter Animation for Stats ===
function animateCounter(element, target, suffix = '') {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (target - start) * easeOutQuart;

        element.textContent = Math.round(current) + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// Observe stats and animate
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const match = text.match(/(\d+\.?\d*)/);
                if (match) {
                    const number = parseFloat(match[0]);
                    const suffix = text.replace(match[0], '');
                    animateCounter(stat, number, suffix);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

console.log('✨ Smart Planner - Premium Landing Page Loaded');
