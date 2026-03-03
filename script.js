/* ==============================================
   LDSSA KNUST Website — Script
   ============================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ---- Scroll Progress Bar ---- */
    const progressBar = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const max = document.body.scrollHeight - window.innerHeight;
        progressBar.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + '%';
    }, { passive: true });


    /* ---- Sticky Header ---- */
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });


    /* ---- Hamburger Menu ---- */
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });


    /* ---- Active Nav Link on Scroll ---- */
    const sections = document.querySelectorAll('section[id]');
    const navItems  = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 120;
        sections.forEach(section => {
            const top    = section.offsetTop;
            const height = section.offsetHeight;
            const id     = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navItems.forEach(item => item.classList.remove('active'));
                const active = document.querySelector(`.nav-link[href="#${id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });


    /* ---- Hero Particles ---- */
    (function createParticles() {
        const container = document.getElementById('particles');
        if (!container) return;
        const colors = ['#0D8A3D', '#D52A19', '#F3EB38', '#DDDDD7'];
        for (let i = 0; i < 22; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size     = Math.random() * 18 + 6;
            const delay    = Math.random() * 6;
            const duration = Math.random() * 4 + 4;
            const color    = colors[Math.floor(Math.random() * colors.length)];
            p.style.cssText = `
                width:${size}px; height:${size}px;
                left:${Math.random() * 100}%;
                top:${Math.random() * 100}%;
                background:${color};
                animation-delay:${delay}s;
                animation-duration:${duration}s;
                opacity:${(Math.random() * 0.25 + 0.08).toFixed(2)};
            `;
            container.appendChild(p);
        }
    })();


    /* ---- Animated Counter ---- */
    function animateCounter(el) {
        const target   = parseInt(el.getAttribute('data-target'), 10);
        const duration = 2000;
        const step     = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = Math.floor(current);
        }, 16);
    }

    let countersAnimated = false;
    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                document.querySelectorAll('.stat-number').forEach(animateCounter);
            }
        });
    }, { threshold: 0.5 });

    const heroSection = document.getElementById('home');
    if (heroSection) counterObserver.observe(heroSection);


    /* ---- Scroll Reveal Animation ---- */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('revealed'), i * 90);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


    /* ---- Gallery Filter ---- */
    const filterBtns   = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            galleryItems.forEach(item => {
                const match = filter === 'all' || item.getAttribute('data-category') === filter;
                if (match) {
                    item.style.display = '';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    requestAnimationFrame(() => {
                        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        item.style.opacity    = '1';
                        item.style.transform  = 'scale(1)';
                    });
                } else {
                    item.style.transition = 'opacity 0.3s ease';
                    item.style.opacity    = '0';
                    setTimeout(() => { item.style.display = 'none'; }, 300);
                }
            });
        });
    });


    /* ---- Gallery Lightbox ---- */
    const lightbox       = document.getElementById('lightbox');
    const lightboxImg    = document.getElementById('lightboxImg');
    const lightboxTitle  = document.getElementById('lightboxTitle');
    const lightboxDesc   = document.getElementById('lightboxDesc');
    const lightboxCounter= document.getElementById('lightboxCounter');
    const lightboxClose  = document.getElementById('lightboxClose');
    const lightboxPrev   = document.getElementById('lightboxPrev');
    const lightboxNext   = document.getElementById('lightboxNext');

    let currentIndex = 0;
    let visibleItems  = [];

    function getVisible() {
        return Array.from(document.querySelectorAll('.gallery-item'))
            .filter(el => el.style.display !== 'none');
    }

    function openLightbox(index) {
        visibleItems = getVisible();
        currentIndex = Math.max(0, Math.min(index, visibleItems.length - 1));
        renderLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function renderLightbox() {
        const item = visibleItems[currentIndex];
        if (!item) return;
        const img = item.querySelector('img');
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src         = img.src;
            lightboxImg.alt         = img.alt;
            lightboxTitle.textContent = item.getAttribute('data-title') || img.alt;
            lightboxDesc.textContent  = item.getAttribute('data-desc')  || '';
            lightboxCounter.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
            lightboxImg.style.opacity = '1';
        }, 220);
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        renderLightbox();
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % visibleItems.length;
        renderLightbox();
    }

    function attachGalleryClick(items) {
        items.forEach(item => {
            item.addEventListener('click', () => {
                const visible = getVisible();
                openLightbox(visible.indexOf(item));
            });
        });
    }

    attachGalleryClick(galleryItems);

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevImage);
    lightboxNext.addEventListener('click', nextImage);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

    // Keyboard navigation
    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape')      closeLightbox();
        if (e.key === 'ArrowLeft')   prevImage();
        if (e.key === 'ArrowRight')  nextImage();
    });

    // Touch swipe support
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lightbox.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) diff > 0 ? nextImage() : prevImage();
    }, { passive: true });


    /* ---- Load More Gallery ---- */
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const extraPhotos = [
        { category: 'community', title: 'New Member Welcome',    desc: 'Welcoming new members into our growing community.',               seed: 'welcome10' },
        { category: 'events',    title: 'Fundraiser Gala',       desc: 'Our annual fundraiser evening supporting campus outreach.',        seed: 'gala11'    },
        { category: 'worship',   title: 'Sacrament Meeting',     desc: 'A reverent sacrament meeting with the whole congregation.',       seed: 'sacr12'    },
    ];

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            const grid = document.getElementById('galleryGrid');

            extraPhotos.forEach(photo => {
                const item = document.createElement('div');
                item.className = 'gallery-item reveal';
                item.setAttribute('data-category', photo.category);
                item.setAttribute('data-title',    photo.title);
                item.setAttribute('data-desc',     photo.desc);
                item.innerHTML = `
                    <img src="https://picsum.photos/seed/${photo.seed}/600/400" alt="${photo.title}" loading="lazy">
                    <div class="gallery-overlay">
                        <div class="gallery-info">
                            <h4>${photo.title}</h4>
                            <p>${photo.category.charAt(0).toUpperCase() + photo.category.slice(1)}</p>
                        </div>
                        <button class="gallery-zoom"><i class="fas fa-expand"></i></button>
                    </div>`;
                grid.appendChild(item);
                attachGalleryClick([item]);
                // Trigger reveal observer on newly added item
                setTimeout(() => revealObserver.observe(item), 10);
            });

            loadMoreBtn.innerHTML = '<i class="fas fa-check"></i> All Photos Loaded';
            loadMoreBtn.disabled  = true;
            loadMoreBtn.style.opacity = '0.6';
        });
    }


    /* ---- Contact Form ---- */
    const contactForm = document.getElementById('contactForm');
    const formSuccess  = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            let valid = true;
            const required = contactForm.querySelectorAll('[required]');

            required.forEach(field => {
                field.classList.remove('error');
                if (!field.value.trim()) { field.classList.add('error'); valid = false; }
            });

            const emailEl = contactForm.querySelector('#email');
            if (emailEl && emailEl.value && !emailEl.value.includes('@')) {
                emailEl.classList.add('error');
                valid = false;
            }

            if (!valid) return;

            const submitBtn = contactForm.querySelector('[type="submit"]');
            submitBtn.innerHTML  = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled   = true;

            setTimeout(() => {
                contactForm.reset();
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                submitBtn.disabled  = false;
                formSuccess.classList.add('visible');
                setTimeout(() => formSuccess.classList.remove('visible'), 5000);
            }, 1500);
        });

        // Clear error state on input
        contactForm.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', () => field.classList.remove('error'));
        });
    }


    /* ---- Event Register Buttons ---- */
    document.querySelectorAll('.btn-event').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const title = btn.closest('.event-card').querySelector('.event-title').textContent;
            btn.innerHTML          = '<i class="fas fa-check"></i> Registered!';
            btn.style.background   = '#0D8A3D';
            setTimeout(() => {
                btn.innerHTML        = 'Register <i class="fas fa-arrow-right"></i>';
                btn.style.background = '';
            }, 3000);
        });
    });


    /* ---- Connect Modal ---- */
    const connectBtn   = document.getElementById('connectBtn');
    const connectModal = document.getElementById('connectModal');
    const modalClose   = document.getElementById('modalClose');

    function openModal() {
        connectModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeModal() {
        connectModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (connectBtn)  connectBtn.addEventListener('click', openModal);
    if (modalClose)  modalClose.addEventListener('click', closeModal);
    connectModal.addEventListener('click', e => { if (e.target === connectModal) closeModal(); });

    ['modalContactBtn', 'modalEventsBtn'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && connectModal.classList.contains('active')) closeModal();
    });


    /* ---- Back to Top ---- */
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});
