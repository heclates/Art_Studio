/**
 * Scroll Navigation Tracker
 * Tracks active section during scrolling, updates URL, and handles navigation clicks
 */

class ScrollNavigationTracker {
    constructor() {
        this.navLinks = null;
        this.sections = null;
        this.currentActiveLink = null;
        this.observer = null;
        this.isScrolling = false; // Prevent URL updates during programmatic scrolling
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.navLinks = document.querySelectorAll('.header__nav-link');
        this.sections = document.querySelectorAll('section[id]');

        if (this.navLinks.length === 0) {
            // Retry after a short delay if elements not found
            setTimeout(() => this.setup(), 100);
            return;
        }

        // Always setup scroll navigation since we have a single page now
        if (this.sections.length > 0) {
            this.setupIntersectionObserver();
        }

        this.setupClickHandlers();
        this.handleInitialHash(); // Handle initial page load with hash
    }

    handleInitialHash() {
        // If page loaded with a hash, scroll to that section
        const hash = window.location.hash.substring(1);
        if (hash) {
            const targetSection = document.getElementById(hash);
            if (targetSection) {
                this.isScrolling = true;
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(() => {
                    this.isScrolling = false;
                    this.setActiveLink(hash);
                }, 500);
            }
        }
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '-50% 0px -50% 0px', // Trigger when section is in middle of viewport
            threshold: 0
        };

        this.observer = new IntersectionObserver((entries) => {
            if (this.isScrolling) return; // Don't update URL during programmatic scrolling

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.updateURL(sectionId);
                    this.setActiveLink(sectionId);
                }
            });
        }, options);

        this.sections.forEach(section => {
            this.observer.observe(section);
        });
    }

    updateURL(sectionId) {
        const newURL = `${window.location.pathname}#${sectionId}`;
        history.replaceState(null, '', newURL);
    }

    setupClickHandlers() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);

                    // If we're not on the home page, navigate to home page first
                    if (window.location.pathname !== '/' && window.location.pathname !== '') {
                        window.location.href = `/#${targetId}`;
                        return;
                    }

                    // If profile is currently shown, hide it first
                    if (window.mainContentControls && window.mainContentControls.hideProfile) {
                        window.mainContentControls.hideProfile();
                    }

                    // We're on home page, scroll to section
                    const targetSection = document.getElementById(targetId);
                    if (targetSection) {
                        this.isScrolling = true;
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });

                        // Update URL immediately
                        this.updateURL(targetId);
                        this.setActiveLink(targetId);

                        setTimeout(() => {
                            this.isScrolling = false;
                        }, 500);
                    }
                }
            });
        });
    }

    setActiveLink(sectionId) {
        // Remove active class from current active link
        if (this.currentActiveLink) {
            this.currentActiveLink.classList.remove('header__nav-link--active');
        }

        // Find and set new active link
        const activeLink = Array.from(this.navLinks).find(link =>
            link.getAttribute('href') === `#${sectionId}`
        );

        if (activeLink) {
            activeLink.classList.add('header__nav-link--active');
            this.currentActiveLink = activeLink;
        }
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }

        this.navLinks.forEach(link => {
            link.removeEventListener('click', this.handleClick);
        });
    }
}

// Initialize the tracker
const scrollTracker = new ScrollNavigationTracker();

// Export for potential cleanup
export { scrollTracker };