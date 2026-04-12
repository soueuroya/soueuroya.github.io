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
            if (targetId === '#') return;

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

    // 8. UFO Cursor Follower
    const ufoContainer = document.createElement('div');
    ufoContainer.id = 'ufo-container';

    const ufoShip = document.createElement('img');
    ufoShip.src = 'Images/UFO_SHIP.png';
    ufoShip.id = 'ufo-ship';

    const ufoLight = document.createElement('img');
    ufoLight.src = 'Images/UFO_LIGHT.png';
    ufoLight.id = 'ufo-light';

    ufoContainer.appendChild(ufoShip);
    ufoContainer.appendChild(ufoLight);
    document.body.appendChild(ufoContainer);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ufoX = window.innerWidth / 2 + 300; 
    let ufoY = window.innerHeight / 2 + 300;
    let ufoVX = 0;
    let ufoVY = 0;
    const maxSpeed = 1; 
    const turnSpeed = 0.05;

    ufoLight.style.opacity = '0'; 

    let ufoState = 'CHASING'; 
    let releaseStartTime = 0;
    const FADE_DURATION = 1500; 

    const cows = [];

    // 8.7 Agricultural Subfooter Setup
    const footer = document.querySelector('.footer');
    if(footer) {
        const barnLeft = document.createElement('img');
        barnLeft.src = 'Images/BarnLeft.png';
        barnLeft.className = 'barn barn-left';
        footer.appendChild(barnLeft);

        const barnRight = document.createElement('img');
        barnRight.src = 'Images/BarnRight.png';
        barnRight.className = 'barn barn-right';
        footer.appendChild(barnRight);

        const cropField = document.createElement('div');
        cropField.className = 'crop-field';
        cropField.style.position = 'relative'; 
        
        const tileSize = 20;
        const columns = Math.ceil(window.innerWidth / 16); 
        const rows = 20; 
        const totalTiles = columns * rows; 
        const cropTiles = [];

        for(let i=0; i<totalTiles; i++) {
            const tile = document.createElement('img');
            tile.src = 'Images/Crop_Up.png';
            tile.className = 'crop-tile';
            cropField.appendChild(tile);
            cropTiles.push({ element: tile, flattened: false });
        }
        footer.appendChild(cropField);
        window.cropTiles = cropTiles;

        // Spread 12 cows over the field
        for(let j=0; j<12; j++) {
            const fieldCow = document.createElement('img');
            fieldCow.src = 'Images/COW1.png';
            fieldCow.className = 'abductable-cow';
            fieldCow.style.left = `${Math.random() * 95}%`;
            fieldCow.style.top = `${Math.random() * 80}%`;
            fieldCow.style.transform = `scale(${0.7 + Math.random() * 0.5})`;
            cropField.appendChild(fieldCow);
            cows.push({ element: fieldCow, abducted: false, levitating: false });
        }
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateUfo() {
        const targetX = mouseX;
        const targetY = mouseY - 20; 
        
        const dx = targetX - ufoX;
        const dy = targetY - ufoY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const time = Date.now() / 200;
        const wobbleX = Math.cos(time) * 0.5;
        const wobbleY = Math.sin(time) * 0.5;
        
        if (ufoState === 'CHASING') {
            if (dist <= 15) {
                ufoState = 'ABDUCTING';
                ufoLight.style.opacity = '1';
            } else {
                const targetVX = (dx / dist) * maxSpeed;
                const targetVY = (dy / dist) * maxSpeed;
                ufoVX += (targetVX - ufoVX) * turnSpeed;
                ufoVY += (targetVY - ufoVY) * turnSpeed;
                ufoX += ufoVX + wobbleX;
                ufoY += ufoVY + wobbleY;
                ufoContainer.style.transform = `translate(-50%, -50%) rotate(${ufoVX * 2}deg)`;
            }
        } else if (ufoState === 'ABDUCTING') {
            ufoVX *= 0.8; ufoVY *= 0.8;
            ufoX += ufoVX; ufoY += ufoVY;
            ufoContainer.style.transform = `translate(-50%, -50%) rotate(0deg)`;

            cows.forEach(cowData => {
                if (cowData.abducted || cowData.levitating) return;
                const cowRect = cowData.element.getBoundingClientRect();
                const cowCX = cowRect.left + cowRect.width / 2;
                const cowCY = cowRect.top + cowRect.height / 2;
                if (Math.sqrt(Math.pow(ufoX - cowCX, 2) + Math.pow(ufoY - cowCY, 2)) < 50) {
                    cowData.levitating = true;
                    cowData.element.classList.add('cow-levitating');
                    const originalRect = cowData.element.getBoundingClientRect();
                    document.body.appendChild(cowData.element);
                    cowData.element.style.position = 'fixed';
                    cowData.element.style.left = `${originalRect.left}px`;
                    cowData.element.style.top = `${originalRect.top}px`;
                    cowData.element.style.margin = '0';
                    setTimeout(() => {
                        cowData.element.style.left = `${ufoX - 20}px`;
                        cowData.element.style.top = `${ufoY - 10}px`;
                        cowData.element.style.transform = 'scale(0.1) rotate(720deg)';
                        cowData.element.style.opacity = '0';
                    }, 50);
                    setTimeout(() => { cowData.abducted = true; cowData.element.remove(); }, 2020);
                }
            });
            
            if (dist > 15) {
                ufoState = 'RELEASING';
                ufoLight.style.opacity = '0';
                releaseStartTime = Date.now();
            }
        } else if (ufoState === 'RELEASING') {
            ufoVX *= 0.8; ufoVY *= 0.8;
            ufoX += ufoVX; ufoY += ufoVY;
            ufoContainer.style.transform = `translate(-50%, -50%) rotate(0deg)`;
            if (Date.now() - releaseStartTime >= FADE_DURATION) ufoState = 'CHASING';
        }
        
        if(window.cropTiles) {
            window.cropTiles.forEach(tileData => {
                if(tileData.flattened) return;
                const rect = tileData.element.getBoundingClientRect();
                if(Math.sqrt(Math.pow(ufoX - (rect.left + rect.width/2), 2) + Math.pow(ufoY - (rect.top + rect.height/2), 2)) < 18) {
                    tileData.flattened = true;
                    tileData.element.src = 'Images/Crop_Down.png';
                }
            });
        }

        ufoContainer.style.left = `${ufoX}px`;
        ufoContainer.style.top = `${ufoY}px`;
        requestAnimationFrame(updateUfo);
    }
    requestAnimationFrame(updateUfo);
});
