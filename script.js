const fadeDuration = 350;

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

    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
            return;
        }

        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) {
            return;
        }

        link.addEventListener('click', event => {
            if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank') {
                return;
            }

            event.preventDefault();
            document.body.classList.remove('loaded');
            setTimeout(() => {
                window.location.href = url.href;
            }, fadeDuration);
        });
    });

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
    }
});
