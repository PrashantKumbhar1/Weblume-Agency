/* ============================================
   WEBLUME — JAVASCRIPT
   ============================================ */

let currentPage = 'home';

// ==========================================
// PAGE NAVIGATION
// ==========================================
function navigateTo(page) {
    if (page === currentPage) return;
    const transition = document.getElementById('pageTransition');
    transition.classList.add('active');
    setTimeout(() => {
        document.getElementById(`page-${currentPage}`).classList.remove('active');
        const np = document.getElementById(`page-${page}`);
        np.classList.remove('active');
        void np.offsetWidth;
        np.classList.add('active');
        document.querySelectorAll('.nav-links a[data-page]').forEach(l => {
            l.classList.remove('active');
            if (l.dataset.page === page) l.classList.add('active');
        });
        currentPage = page;
        window.scrollTo({ top: 0, behavior: 'instant' });
        setTimeout(() => {
            initReveal();
            transition.classList.remove('active');
            if (page === 'work') {
                buildShowcases();
                setTimeout(() => initShowcase(), 200);
            }
        }, 100);
    }, 300);
}

// ==========================================
// MOBILE MENU
// ==========================================
function toggleMenu() {
    const h = document.getElementById('hamburger');
    const m = document.getElementById('mobileNav');
    h.classList.toggle('active');
    m.classList.toggle('active');
    document.body.style.overflow = m.classList.contains('active') ? 'hidden' : '';
}

// Close mobile menu when a link is tapped
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#mobileNav a').forEach(a => {
        a.addEventListener('click', () => {
            document.getElementById('hamburger').classList.remove('active');
            document.getElementById('mobileNav').classList.remove('active');
            document.body.style.overflow = '';
        });
    });
});

// ==========================================
// NAVBAR SCROLL
// ==========================================
window.addEventListener('scroll', () => {
    const nav = document.getElementById('mainNav');
    nav.classList.toggle('nav--scrolled', window.scrollY > 50);
});

// ==========================================
// HERO — ORBIT ICON GENERATION
// ==========================================
const icons = [
    "html.png","css.png","js.png","react.png",
    "android.png","python.png","instagram.png","whatsapp.png"
];
const iconsPerOrbit = [2, 2, 3, 3];

function createOrbitIcons() {
    const orbits = document.querySelectorAll(".orbit");
    let iconIdx = 0;
    orbits.forEach((orbit, orbitIndex) => {
        const count = iconsPerOrbit[orbitIndex] || 2;
        const radius = orbit.offsetWidth / 2;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * (2 * Math.PI) - Math.PI / 2;
            const x = radius + radius * Math.cos(angle);
            const y = radius + radius * Math.sin(angle);
            const wrap = document.createElement("div");
            wrap.classList.add("orbit-icon-wrap");
            wrap.style.left = x + "px";
            wrap.style.top = y + "px";
            wrap.style.transform = "translate(-50%, -50%)";
            const icon = document.createElement("img");
            icon.src = "assets/icons/" + icons[iconIdx % icons.length];
            icon.alt = icons[iconIdx % icons.length].replace('.png', '');
            icon.classList.add("orbit-icon");
            wrap.appendChild(icon);
            orbit.appendChild(wrap);
            iconIdx++;
        }
    });
}

// ==========================================
// SCROLL REVEAL
// ==========================================
function initReveal() {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
        });
    }, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });
    els.forEach(el => {
        const p = el.closest('.page');
        if (!p || p.classList.contains('active')) {
            if (!el.classList.contains('visible')) obs.observe(el);
        }
    });
}

// ==========================================
// PORTFOLIO SLIDER (Infinite & Draggable)
// ==========================================
function initPortfolioSlider() {
    const track = document.getElementById('portfolioSlider');
    if (!track) return;

    // Clone items for infinite loop illusion multiple times to ensure enough width
    const items = Array.from(track.children);
    // Use an odd number of copies (e.g. 7) so total sets (original + copies) is even (8).
    // This makes track.scrollWidth / 2 perfectly aligned with the start of a set.
    for (let i = 0; i < 7; i++) {
        items.forEach(item => {
            const clone = item.cloneNode(true);
            track.appendChild(clone);
        });
    }

    let isDown = false;
    let startX;
    let scrollLeft;
    let isHovering = false;
    let autoScrollSpeed = 1;

    // Manual Dragging
    track.addEventListener('mousedown', (e) => {
        isDown = true;
        track.style.cursor = 'grabbing';
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
    });
    track.addEventListener('mouseleave', () => {
        isDown = false;
        track.style.cursor = 'grab';
    });
    track.addEventListener('mouseup', () => {
        isDown = false;
        track.style.cursor = 'grab';
    });
    track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 2; // Scroll-fast
        track.scrollLeft = scrollLeft - walk;
    });

    // Auto Scrolling loop
    track.addEventListener('mouseenter', () => isHovering = true);
    track.addEventListener('mouseleave', () => isHovering = false);

    function autoScroll() {
        if (!isHovering && !isDown) {
            track.scrollLeft += autoScrollSpeed;
            // Reset if scrolled to halfway
            if (track.scrollLeft >= track.scrollWidth / 2) {
                track.scrollLeft = 0;
            }
        }
        requestAnimationFrame(autoScroll);
    }
    autoScroll();
}

// ==========================================
// TESTIMONIALS CAROUSEL
// ==========================================
let testimonialIndex = 0;
let testimonialTimer;

function showTestimonial(i) {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');
    if (!slides.length) return;
    testimonialIndex = ((i % slides.length) + slides.length) % slides.length;
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slides[testimonialIndex].classList.add('active');
    if (dots[testimonialIndex]) dots[testimonialIndex].classList.add('active');
}

function startTestimonialAuto() {
    testimonialTimer = setInterval(() => showTestimonial(testimonialIndex + 1), 5000);
}

function initTestimonials() {
    const dots = document.querySelectorAll('.testimonial-dot');
    dots.forEach((d, i) => {
        d.addEventListener('click', () => {
            clearInterval(testimonialTimer);
            showTestimonial(i);
            startTestimonialAuto();
        });
    });
    showTestimonial(0);
    startTestimonialAuto();
}

// ==========================================
// CONTACT FORM
// ==========================================
function handleSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '✓ Message Sent!';
    btn.style.background = '#22c55e';
    setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
        e.target.reset();
    }, 3000);
}

// ==========================================
// FAQ
// ==========================================
function toggleFaq(el) {
    const item = el.closest('.faq-item');
    const wasActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('active'));
    if (!wasActive) item.classList.add('active');
}

// ==========================================
// FILTER BUTTONS
// ==========================================
function initFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// ==========================================
// CINEMATIC PORTFOLIO — PROJECTS DATA
// ==========================================
const showcaseProjects = [
    {
        name: "Saikrupa<br>Clinic",
        cat: "Clinic Website",
        url: "https://saikrupaclinic.vercel.app/",
        desc: "A modern healthcare platform designed to build trust and streamline patient engagement through clean, professional design.",
        bg: "linear-gradient(135deg, #0a2e1f 0%, #143d2c 50%, #0a1a12 100%)",
        img: "assets/work/saikrupa.png"
    },
    {
        name: "Vidya<br>Academy",
        cat: "Coaching Classes",
        url: "https://vidya-academy.vercel.app/",
        desc: "An immersive educational platform transforming traditional coaching into a digital-first learning experience.",
        bg: "linear-gradient(135deg, #0a1628 0%, #142d4c 50%, #0a1020 100%)",
        img: "assets/work/vidya-academy.png"
    },
    {
        name: "Prestige<br>Bay",
        cat: "Property Website",
        url: "https://prestige-bay.vercel.app/",
        desc: "Luxury real estate reimagined with cinematic visuals and an experience that matches the properties it showcases.",
        bg: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 50%, #0a0f1e 100%)",
        img: "assets/work/prestige.png"
    },
    {
        name: "Dr. Anuja<br>Clinic",
        cat: "Clinic Website",
        url: "https://dr-anuja-clinic.vercel.app/",
        desc: "Healthcare meets modern design — a digital presence that reflects the care and precision of medical practice.",
        bg: "linear-gradient(135deg, #2a1a45 0%, #1a0f30 50%, #0f0820 100%)",
        img: "assets/work/dr.anujaa-clinic.png"
    },
    {
        name: "Urban<br>Glow",
        cat: "Beauty Salon",
        url: "https://urban-glow-seven.vercel.app/",
        desc: "A sultry, editorial beauty experience capturing the essence of self-care and modern aesthetics.",
        bg: "linear-gradient(135deg, #2d1515 0%, #1a0a0a 50%, #0f0505 100%)",
        img: "assets/work/urbanglow.png"
    },
    {
        name: "Dr. Mhatre<br>Dental",
        cat: "Dental Clinic",
        url: "https://dr-mhatre-dental-clinic.vercel.app/",
        desc: "Precision dental care presented through a website that's as polished and meticulous as the practice itself.",
        bg: "linear-gradient(135deg, #0a1a2a 0%, #143050 50%, #081520 100%)",
        img: "assets/work/dr.mhatre-clinic.png"
    },
    {
        name: "Samarth<br>Gavali",
        cat: "Physiotherapy Clinic",
        url: "https://samarth-gavali-clinic.vercel.app/",
        desc: "Movement and recovery brought to life through dynamic design embodying the spirit of physiotherapy.",
        bg: "linear-gradient(135deg, #0a1a0f 0%, #1a3020 50%, #0a1508 100%)",
        img: "assets/work/samarth-clinic.png"
    },
    {
        name: "Road Ready<br>Driving",
        cat: "Driving School",
        url: "https://roadreadydrivingschool.vercel.app/",
        desc: "Bold, confident, and road-ready — a driving school website built to accelerate enrollment and trust.",
        bg: "linear-gradient(135deg, #3d1515 0%, #2a0808 50%, #1a0505 100%)",
        img: "assets/work/road-ready-driving.png"
    },
    {
        name: "Hotel<br>Kashish",
        cat: "Hotel Website",
        url: "https://hotel-kashish.vercel.app/",
        desc: "Warm hospitality translated into pixels — an inviting digital experience for a destination hotel.",
        bg: "linear-gradient(135deg, #2d2200 0%, #1a1400 50%, #0f0a00 100%)",
        img: "assets/work/hotel-kashish.png"
    },
    {
        name: "NexGen<br>Gaming",
        cat: "Gaming Parlour",
        url: "https://nexgen-gaming.vercel.app/",
        desc: "High-energy, neon-fueled gaming aesthetics that capture the thrill and excitement of competitive play.",
        bg: "linear-gradient(135deg, #050510 0%, #0a0a3d 50%, #020210 100%)",
        img: "assets/work/naxgen-gaming.png"
    },
    {
        name: "Spa Li Baan<br>Mumbai",
        cat: "Spa Website",
        url: "https://spa-li-baan-mumbai.vercel.app/",
        desc: "Tranquility meets luxury in this serene spa website designed to calm the mind before the first visit.",
        bg: "linear-gradient(135deg, #0a1a1a 0%, #143535 50%, #081818 100%)",
        img: "assets/work/spa-li-baann.png"
    },
    {
        name: "Smile Dental<br>Clinic",
        cat: "Premium Dental",
        url: "https://smile-dental-clinic-panvel.vercel.app/",
        desc: "Premium dental care deserves a premium digital presence — clean, trustworthy, and conversion-focused.",
        bg: "linear-gradient(135deg, #0a1520 0%, #142840 50%, #081520 100%)",
        img: "assets/work/smile-dental.png"
    }
];

// ==========================================
// CINEMATIC PORTFOLIO — BUILD SHOWCASES
// ==========================================
function buildShowcases() {
    const container = document.getElementById('showcaseContainer');
    if (!container || container.children.length > 0) return;

    showcaseProjects.forEach((p, i) => {
        const num = String(i + 1).padStart(2, '0');
        let hostname;
        try { hostname = new URL(p.url).hostname; } catch(e) { hostname = p.url; }

        // Full screenshot — natural ratio, no crop, scrollable overflow
        const viewportContent = p.img
            ? `<img src="${p.img}" alt="${p.name.replace('<br>', '')} screenshot" loading="lazy"
                style="width:100%;height:auto;display:block;opacity:0.9;" />`
            : `<div style="width:100%;height:300px;background:${p.bg}"></div>`;

        const section = document.createElement('section');
        section.className = 'showcase';
        section.dataset.idx = i + 1;
        section.innerHTML = `
            <div class="showcase__bg" style="background:${p.bg}"></div>
            <div class="showcase__number">${num}</div>
            <div class="showcase__grid">
                <div class="showcase__info">
                    <div class="showcase__meta">
                        <span class="showcase__cat">${p.cat}</span>
                    </div>
                    <h2 class="showcase__title">${p.name}</h2>
                    <p class="showcase__desc">${p.desc}</p>
                    <a href="${p.url}" target="_blank" rel="noopener" class="showcase__cta">
                        <span>View Live Site</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
                    </a>
                </div>
                <div class="showcase__visual">
                    <div class="showcase__browser">
                        <div class="showcase__browser-chrome">
                            <div class="showcase__browser-dots"><i></i><i></i><i></i></div>
                            <div class="showcase__browser-url">${hostname}</div>
                            <a href="${p.url}" target="_blank" rel="noopener" class="showcase__browser-open" title="Open site">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                            </a>
                        </div>
                        <div class="showcase__browser-viewport">
                            ${viewportContent}
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(section);
    });
}

// ==========================================
// CINEMATIC PORTFOLIO — SCROLL ANIMATIONS
// ==========================================
let showcaseObserver = null;

function initShowcase() {
    const showcases = document.querySelectorAll('.showcase');
    const progressFill = document.getElementById('cinemaProgressFill');
    const counterEl = document.getElementById('cinemaCount');
    if (!showcases.length) return;
    if (showcaseObserver) showcaseObserver.disconnect();
    showcaseObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                const idx = parseInt(entry.target.dataset.idx) || 1;
                const total = showcases.length;
                if (counterEl) counterEl.textContent = String(idx).padStart(2,'0') + ' / ' + String(total).padStart(2,'0');
                if (progressFill) progressFill.style.height = ((idx / total) * 100) + '%';
            }
        });
    }, { threshold: 0.2 });
    showcases.forEach(s => { s.classList.remove('in-view'); showcaseObserver.observe(s); });
}

function showcaseScrollHandler() {
    const workPage = document.getElementById('page-work');
    if (!workPage || !workPage.classList.contains('active')) return;
    const progress = document.getElementById('cinemaProgress');
    const showcases = document.querySelectorAll('.showcase');
    if (!showcases.length) return;
    const first = showcases[0].getBoundingClientRect();
    const last = showcases[showcases.length - 1].getBoundingClientRect();
    if (progress) {
        progress.classList.toggle('visible', first.top < window.innerHeight * 0.9 && last.bottom > 0);
    }
    showcases.forEach(s => {
        const rect = s.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) return;
        const offset = rect.top * 0.04;
        const bg = s.querySelector('.showcase__bg');
        const num = s.querySelector('.showcase__number');
        if (bg) bg.style.transform = 'translateY(' + offset + 'px)';
        if (num) num.style.transform = 'translateY(calc(-50% + ' + (offset * 1.5) + 'px))';
    });
}

window.addEventListener('scroll', showcaseScrollHandler, { passive: true });

// ==========================================
// INSTAGRAM REELS INTERACTIVITY
// ==========================================
function toggleReel(card) {
    const videoSrc = card.querySelector('video').getAttribute('src');
    const modal = document.getElementById('reelModal');
    const modalVideo = document.getElementById('reelModalVideo');
    if (!modal || !modalVideo || !videoSrc) return;

    modalVideo.src = videoSrc;
    modal.classList.add('active');
    modalVideo.play().catch(e => console.error("Video play failed:", e));
}

function closeReelModal() {
    const modal = document.getElementById('reelModal');
    const modalVideo = document.getElementById('reelModalVideo');
    if (modal) {
        modal.classList.remove('active');
        if (modalVideo) {
            modalVideo.pause();
            modalVideo.src = '';
        }
    }
}

// ==========================================
// INIT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    createOrbitIcons();
    initReveal();
    initPortfolioSlider();
    initTestimonials();
    initFilters();
});

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) initReveal();
});
