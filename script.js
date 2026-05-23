const fadeDuration = 420;

function createTransitionOverlay() {
    const existing = document.querySelector('.page-transition-overlay');
    if (existing) {
        return existing;
    }

    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);
    return overlay;
}

function triggerPageTransition() {
    const overlay = createTransitionOverlay();
    document.body.classList.add('is-transitioning');
    requestAnimationFrame(() => {
        overlay.classList.add('active');
    });
}

function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
        reveals.forEach(element => element.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            entry.target.classList.toggle('is-visible', entry.isIntersecting);
        });
    }, {
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px'
    });

    reveals.forEach(element => observer.observe(element));
}

function updateNetworkStatus() {
    const picker = document.getElementById('page-picker');
    if (!picker) {
        return;
    }

    const online = typeof navigator !== 'undefined' && navigator.onLine;
    picker.setAttribute('data-status', online ? 'online' : 'offline');

    const label = picker.querySelector('[data-status-label]');
    if (label) {
        label.textContent = online ? 'ONLINE' : 'OFFLINE';
    }
}

function initPageSwap() {
    document.body.classList.add('loaded');
    createTransitionOverlay();
    initRevealAnimations();

    document.body.addEventListener('click', event => {
        const link = event.target.closest('a[href]');
        if (!link) {
            return;
        }

        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
            return;
        }

        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank') {
            return;
        }

        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) {
            return;
        }

        event.preventDefault();
        triggerPageTransition();
        setTimeout(() => {
            window.location.href = url.href;
        }, fadeDuration);
    }, true);

    initPagePicker();
    updateNetworkStatus();
}

function initPagePicker() {
    const picker = document.getElementById('page-picker');
    if (!picker) {
        return;
    }

    const openClass = 'active';
    const toggle = picker.querySelector('.page-picker-toggle');
    const openDistance = 170;

    function updatePicker(event) {
        const rect = picker.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);

        if (distance < openDistance) {
            picker.classList.add(openClass);
        } else if (!picker.matches(':hover')) {
            picker.classList.remove(openClass);
        }
    }

    document.addEventListener('mousemove', updatePicker);
    picker.addEventListener('mouseleave', () => picker.classList.remove(openClass));
    toggle.addEventListener('click', () => picker.classList.toggle(openClass));
}

window.addEventListener('DOMContentLoaded', initPageSwap);
window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);
window.addEventListener('pageshow', event => {
    if (event.persisted) {
        document.body.classList.add('loaded');
        document.body.classList.remove('is-transitioning');
    }
});
