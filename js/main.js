/**
 * Intersection Observer for scroll animations
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Optional: Stop observing once animated in
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Grab all elements to animate
    const animatedElements = document.querySelectorAll('.fade-up');
    animatedElements.forEach(el => observer.observe(el));

    // 2. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Adjust for fixed navbar
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Cursor tracking for reactive borders
    document.querySelectorAll('.card, .game-block, .timeline-item').forEach(el => {
        el.addEventListener('mousemove', e => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            el.style.setProperty('--mouse-x', `${x}px`);
            el.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 5. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside the menu panel
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });
    }
    
    // 6. Expertise Section Hover Backgrounds
    const body = document.body;
    const expertiseSection = document.getElementById('expertise');
    const layers = [
        document.getElementById('expertise-overlay-1'),
        document.getElementById('expertise-overlay-2')
    ];
    const expertiseCards = document.querySelectorAll('#expertise .card');
    
    let gifInterval;
    let activeLayer = 0;
    
    function switchBackground(imageUrl) {
        const nextLayer = 1 - activeLayer;
        
        // Prepare next layer
        layers[nextLayer].style.backgroundImage = `url('${imageUrl}')`;
        
        // Crossfade
        layers[nextLayer].classList.add('active');
        layers[activeLayer].classList.remove('active');
        
        activeLayer = nextLayer;
    }
    
    expertiseCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const bgData = card.getAttribute('data-bg');
            if (!bgData) return;
            
            const images = bgData.split(',');
            expertiseSection.classList.add('bg-active');
            body.classList.add('expertise-mode');
            
            if (images.length > 1) {
                let currentIndex = 0;
                switchBackground(images[currentIndex]);
                
                clearInterval(gifInterval);
                gifInterval = setInterval(() => {
                    currentIndex = (currentIndex + 1) % images.length;
                    
                    // Preload next image for smooth transition
                    const tempImg = new Image();
                    tempImg.src = images[currentIndex];
                    tempImg.onload = () => {
                        switchBackground(images[currentIndex]);
                    };
                }, 4000); // 4 seconds for a slower, more premium feel
            } else {
                switchBackground(images[0]);
                clearInterval(gifInterval);
            }
        });
        
        card.addEventListener('mouseleave', () => {
            expertiseSection.classList.remove('bg-active');
            body.classList.remove('expertise-mode');
            layers.forEach(layer => layer.classList.remove('active'));
            clearInterval(gifInterval);
        });
    });

    // 7. Image Lightbox
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.querySelector('.modal-close');

    if (modal && modalImg) {
        // Global click listener for images with 'clickable-image' class
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('clickable-image')) {
                modal.classList.add('active');
                modalImg.src = e.target.src;
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        });

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }
});
