// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
    direction: 'vertical',
    gestureDirection: 'vertical',
    smoothWheel: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    
    // Elite Skew-on-Scroll Logic
    const velocity = lenis.velocity;
    const skew = velocity * 0.008;
    const rotate = velocity * 0.002;
    
    // Apply to main reveal elements and project cards
    const targets = document.querySelectorAll('.reveal, .project-card, .skill-category');
    targets.forEach(el => {
        if (el.classList.contains('active')) {
            el.style.transform = `skewY(${skew}deg) rotateZ(${rotate}deg)`;
        }
    });

    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Scroll Progress & Parallax Effect
const scrollProgress = document.getElementById('scroll-progress');
const blobs = document.querySelectorAll('.blob');
const navbar = document.getElementById('navbar');
const scrollIndicator = document.querySelector('.scroll-indicator');

const animateNumbers = (element) => {
    const text = element.innerText;
    // Extract number and suffix (like "6+" -> 6, "+")
    const match = text.match(/([0-9.]+)(.*)/);
    if (!match) return;
    
    const max = parseFloat(match[1]);
    const suffix = match[2] || '';
    const isFloat = text.includes('.');
    
    let current = 0;
    const increment = isFloat ? 0.1 : Math.max(1, Math.ceil(max / 40));
    const speed = 30; // ms
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= max) {
            element.innerText = (isFloat ? max.toFixed(2) : max) + suffix;
            clearInterval(timer);
        } else {
            element.innerText = (isFloat ? current.toFixed(2) : Math.floor(current)) + suffix;
        }
    }, speed);
};

const scrollReveal = () => {
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        if (elementTop < windowHeight - revealPoint) {
            if (!element.classList.contains('active')) {
                element.classList.add('active');
                
                // Trigger number counter
                const statNumbers = element.querySelectorAll('.stat-number');
                statNumbers.forEach(num => {
                    if (!num.classList.contains('counted')) {
                        num.classList.add('counted');
                        animateNumbers(num);
                    }
                });
            }
        }
    });
};

// Side Bar Parallax
const sideBar = document.querySelector('.side-bar');
const sideDots = document.querySelector('.scroll-dots');

window.addEventListener('scroll', () => {
    // Progress Bar
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.pageYOffset / totalScroll) * 100;
    if (scrollProgress) scrollProgress.style.width = `${progress}%`;

    // Parallax Blobs
    const scrollY = window.pageYOffset;
    blobs.forEach((blob, index) => {
        const speed = (index + 1) * 0.15;
        blob.style.transform = `translateY(${scrollY * speed}px)`;
    });
    
    // Side Element Parallax
    if (sideBar) sideBar.style.transform = `translateY(${scrollY * 0.05}px)`;
    if (sideDots) sideDots.style.transform = `translateY(${-scrollY * 0.03}px) translateX(-50%)`;

    // Existing Navbar Scroll Effect
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        if (scrollIndicator) scrollIndicator.style.opacity = '0';
    } else {
        navbar.classList.remove('scrolled');
        if (scrollIndicator) scrollIndicator.style.opacity = '1';
    }
    
    scrollReveal();
});

// Periodic Glitch Effect for Title
setInterval(() => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && Math.random() < 0.3) { // 30% chance every 10s
        scrambleText(heroTitle, heroTitle.innerText, 800);
    }
}, 10000);

window.addEventListener('load', scrollReveal);

// Advanced Scramble Text Effect (Replacing TypeText)
const scrambleText = (element, targetText, duration = 2000) => {
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    let frame = 0;
    const totalFrames = duration / 16;
    const originalText = targetText;
    
    const tick = () => {
        let currentText = '';
        let complete = 0;
        
        for (let i = 0; i < originalText.length; i++) {
            const charProgress = (frame / totalFrames) * originalText.length;
            if (i < charProgress) {
                currentText += originalText[i];
                complete++;
            } else if (i < charProgress + 3) {
                currentText += chars[Math.floor(Math.random() * chars.length)];
            } else {
                currentText += ' ';
            }
        }
        
        element.innerText = currentText;
        
        if (complete < originalText.length) {
            frame++;
            requestAnimationFrame(tick);
        }
    };
    
    tick();
};

window.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        scrambleText(heroTitle, heroTitle.innerText);
    }
});

// 3D Tilt Effect for Profile Card
const profileCard = document.querySelector('.profile-card');
if (profileCard) {
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = profileCard.getBoundingClientRect();
        
        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;
        
        const tiltX = y * 15;
        const tiltY = x * -15;
        
        profileCard.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    profileCard.addEventListener('mouseleave', () => {
        profileCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        profileCard.style.transition = 'transform 0.5s ease';
    });
    
    profileCard.addEventListener('mouseenter', () => {
        profileCard.style.transition = 'none';
    });
}

// Mouse & Cursor Variables
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let dotX = 0, dotY = 0;

const cursor = document.querySelector('.custom-cursor');
const cursorDot = document.querySelector('.cursor-dot');
const mouseGlow = document.getElementById('mouse-glow');

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Immediate glow update
    if (mouseGlow) {
        mouseGlow.style.left = `${mouseX}px`;
        mouseGlow.style.top = `${mouseY}px`;
    }

    // Update Grid Mask Variables
    document.documentElement.style.setProperty('--mouse-x', `${(mouseX / window.innerWidth) * 100}%`);
    document.documentElement.style.setProperty('--mouse-y', `${(mouseY / window.innerHeight) * 100}%`);
});

// Smooth Cursor Animation Loop
const animateCursor = () => {
    // Smoother interpolation for main cursor
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    
    // Immediate for dot
    dotX = mouseX;
    dotY = mouseY;

    if (cursor) {
        cursor.style.transform = `translate3d(${cursorX - 15}px, ${cursorY - 15}px, 0)`;
    }
    if (cursorDot) {
        cursorDot.style.transform = `translate3d(${dotX - 3}px, ${dotY - 3}px, 0)`;
    }

    requestAnimationFrame(animateCursor);
};
animateCursor();

// Cursor Hover Effects
const setupCursorHover = () => {
    const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .skill-tag, .dot');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor?.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor?.classList.remove('hover'));
    });
};
setupCursorHover();

// Smooth Scroll (Updated for Lenis)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            lenis.scrollTo(targetElement, {
                offset: -80,
                duration: 1.5
            });
        }
    });
});

// Section Observer for Nav Dots
const sections = document.querySelectorAll('section, footer');
const dots = document.querySelectorAll('.dot');
const observerOptions = { threshold: 0.4 };

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            dots.forEach(dot => {
                dot.classList.toggle('active', dot.getAttribute('href') === `#${entry.target.id}`);
            });
        }
    });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinksContainer = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
}

navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    });
});

// Dynamic Liquid "Lake" Background Animation
const lakeCanvas = document.getElementById('lake-canvas');
if (lakeCanvas) {
    const ctx = lakeCanvas.getContext('2d');
    let width, height;

    const resizeLake = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        lakeCanvas.width = width;
        lakeCanvas.height = height;
    };
    
    window.addEventListener('resize', resizeLake);
    resizeLake();

    let step = 0;
    const lines = 5; // Number of overlapping waves

    const drawLake = () => {
        ctx.clearRect(0, 0, width, height);
        step += 0.005;

        // Get Current Accent Color for Canvas
        const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();

        for (let j = 0; j < lines; j++) {
            ctx.beginPath();
            ctx.lineWidth = 2;
            
            // Adjust the wave height start position based on index
            const waveYOffset = height * (0.6 + (j * 0.08)); 
            
            for (let i = 0; i <= width; i += 40) {
                const s = step + j * 0.4;
                const wave1 = Math.sin(i * 0.002 + s) * 50;
                const wave2 = Math.cos(i * 0.004 + s * 1.2) * 30;
                const y = waveYOffset + wave1 + wave2;
                
                if (i === 0) {
                    ctx.moveTo(i, y);
                } else {
                    ctx.lineTo(i, y);
                }
            }
            
            // Use Accent Color
            const isCyan = j % 2 === 0;
            ctx.strokeStyle = isCyan ? `${accentColor}${Math.floor((0.15 - j * 0.02) * 255).toString(16).padStart(2, '0')}` : accentColor;
            ctx.stroke();
            
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();
            
            const gradient = ctx.createLinearGradient(0, waveYOffset - 50, 0, height);
            gradient.addColorStop(0, `${accentColor}${Math.floor((0.05 - j * 0.005) * 255).toString(16).padStart(2, '0')}`);
            gradient.addColorStop(1, 'rgba(5, 5, 5, 0)');
            
            ctx.fillStyle = gradient;
            ctx.fill();
        }
        
        requestAnimationFrame(drawLake);
    };
    
    drawLake();
}

// High-End Neural Network Background Animation
const networkCanvas = document.getElementById('network-canvas');
if (networkCanvas) {
    const ctx = networkCanvas.getContext('2d');
    let particles = [];
    let width, height;

    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        networkCanvas.width = width;
        networkCanvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse interaction (Repulsion)
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 150) {
                const force = (150 - distance) / 150;
                this.x -= (dx / distance) * force * 2;
                this.y -= (dy / distance) * force * 2;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 242, 254, 0.4)';
            ctx.fill();
        }
    }

    const init = () => {
        particles = [];
        const count = Math.floor((width * height) / 15000); // Dynamic count based on screen size
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    };

    const animateNetwork = () => {
        ctx.clearRect(0, 0, width, height);
        
        const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();

        // Rare digital fragment spawn
        if (Math.random() < 0.05) {
            const chars = '01{}<>/;[]';
            const char = chars[Math.floor(Math.random() * chars.length)];
            const x = Math.random() * width;
            const y = height + 20;
            fragments.push({ x, y, char, vy: -Math.random() * 2 - 1, opacity: 0.8 });
        }

        // Draw fragments
        fragments.forEach((f, i) => {
            f.y += f.vy;
            f.opacity -= 0.005;
            ctx.fillStyle = `${accentColor}${Math.floor(f.opacity * 255).toString(16).padStart(2, '0')}`;
            ctx.font = '12px monospace';
            ctx.fillText(f.char, f.x, f.y);
            if (f.opacity <= 0) fragments.splice(i, 1);
        });
        
        particles.forEach((p, index) => {
            p.update();
            p.draw();

            // Check connections
            for (let j = index + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `${accentColor}${Math.floor((0.15 * (1 - distance / 120)) * 255).toString(16).padStart(2, '0')}`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animateNetwork);
    };

    let fragments = [];
    init();
    animateNetwork();
}

// Interactive Project Card Glare
const projectCardsElements = document.querySelectorAll('.project-card');
projectCardsElements.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--x', `${x}%`);
        card.style.setProperty('--y', `${y}%`);

        // Subtle Tilt
        const tiltX = (y - 50) / 10;
        const tiltY = (x - 50) / -10;
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
    });
});

// Magnetic Buttons Effect
const magneticElements = document.querySelectorAll('.btn, .nav-links a, .social-icon');
magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Move element slightly towards cursor
        el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        el.style.transition = 'transform 0.1s ease-out';
    });
    
    el.addEventListener('mouseleave', () => {
        el.style.transform = `translate(0px, 0px)`;
        el.style.transition = 'transform 0.5s elastic';
    });
});
