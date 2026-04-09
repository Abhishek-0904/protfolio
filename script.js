// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');

const scrollReveal = () => {
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('active');
        }
    });
};

window.addEventListener('scroll', scrollReveal);
window.addEventListener('load', scrollReveal);

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mouse Glow Effect & Blob Parallax
const mouseGlow = document.getElementById('mouse-glow');
document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    
    // Update glow position
    if (mouseGlow) {
        mouseGlow.style.left = `${clientX}px`;
        mouseGlow.style.top = `${clientY}px`;
    }

    const blobs = document.querySelectorAll('.blob');
    const x = clientX / window.innerWidth;
    const y = clientY / window.innerHeight;
    
    blobs.forEach((blob, index) => {
        const speed = (index + 1) * 30;
        const bx = (x - 0.5) * speed;
        const by = (y - 0.5) * speed;
        blob.style.transform = `translate(${bx}px, ${by}px)`;
    });
});

// Smooth Scroll for Nav Links
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

// Typing Effect for Hero (Simple implementation)
const heroTitle = document.querySelector('.hero h1');

// Update Scroll Dots Active State
const sections = document.querySelectorAll('section, footer');
const dots = document.querySelectorAll('.dot');

const observerOptions = {
    threshold: 0.5
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            dots.forEach(dot => {
                dot.classList.remove('active');
                if (dot.getAttribute('href') === `#${entry.target.id}`) {
                    dot.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));
