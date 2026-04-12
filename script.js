// Scroll Progress & Parallax Effect
const scrollProgress = document.getElementById('scroll-progress');
const blobs = document.querySelectorAll('.blob');
const navbar = document.getElementById('navbar');

const scrollReveal = () => {
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('active');
        }
    });
};

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

    // Navbar Scroll Effect
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    scrollReveal();
});

window.addEventListener('load', scrollReveal);

// Advanced Typing Effect
const typeText = (element, text, speed = 100) => {
    let index = 0;
    element.innerHTML = "";
    const timer = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
        } else {
            clearInterval(timer);
        }
    }, speed);
};

window.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.innerText;
        typeText(heroTitle, originalText, 150);
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

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
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
