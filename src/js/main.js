// Initialize function
function initializeApp() {
    try {
        initNavbar();
        initSmoothScrolling();
        initCarousel();
        initModals();
        initScrollAnimations();
        initPositionIndicator();
        initParallax();
        
        // Add CTA button handler
        const ctaButton = document.getElementById('cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', function() {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
        
        // Add video CTA button handler
        const videoCTAButton = document.querySelector('.video-cta-button');
        if (videoCTAButton) {
            videoCTAButton.addEventListener('click', function() {
                // Open a modal or navigate to portfolio section
                const portfolioSection = document.getElementById('portfolio');
                if (portfolioSection) {
                    portfolioSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
        
        // Ensure video plays on page load
        const backgroundVideo = document.querySelector('.video-background');
        if (backgroundVideo) {
            // Remove controls attribute if somehow added
            backgroundVideo.removeAttribute('controls');
            
            // Ensure video settings are correct
            backgroundVideo.muted = true;
            backgroundVideo.loop = true;
            backgroundVideo.autoplay = true;
            backgroundVideo.playsInline = true;
            
            // Force play
            backgroundVideo.play().then(() => {
                console.log('✅ Video is playing successfully');
                console.log('Video source:', backgroundVideo.currentSrc);
                console.log('Video duration:', backgroundVideo.duration);
            }).catch(e => {
                console.log('❌ Video autoplay failed:', e);
                console.log('Attempting to play on user interaction...');
                // Try playing on user interaction
                document.addEventListener('click', () => {
                    backgroundVideo.play().then(() => {
                        console.log('✅ Video started after user interaction');
                    });
                }, { once: true });
            });
            
            // Restart video if it ends (backup for loop)
            backgroundVideo.addEventListener('ended', () => {
                backgroundVideo.currentTime = 0;
                backgroundVideo.play();
            });
            
            // Add event listeners for debugging
            backgroundVideo.addEventListener('loadstart', () => {
                console.log('🔄 Video loading started...');
            });
            
            backgroundVideo.addEventListener('canplay', () => {
                console.log('✅ Video can start playing');
            });
            
            backgroundVideo.addEventListener('error', (e) => {
                console.error('❌ Video error:', e);
                console.error('Error code:', backgroundVideo.error?.code);
                console.error('Error message:', backgroundVideo.error?.message);
            });
        }
    } catch (error) {
        console.error('Error initializing features:', error);
    }
}

// DOM Content Loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM is already ready, but add a small delay to ensure everything is rendered
    setTimeout(initializeApp, 100);
}

// Navbar functionality
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll behavior
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add scrolled class for navbar resizing
        if (scrollTop > 100) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }

        // Update active nav link
        updateActiveNavLink();
    });

    // Update active navigation link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('.section');
        const scrollPosition = window.pageYOffset + navbar.offsetHeight + 10;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });

        // Handle last section specifically
        if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 10) {
            navLinks.forEach(link => link.classList.remove('active'));
            navLinks[navLinks.length - 1].classList.add('active');
        }
    }
}

// Smooth scrolling
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Position Indicator
function initPositionIndicator() {
    const indicatorBar = document.querySelector('.indicator-bar');
    
    if (!indicatorBar) {
        console.error('Position indicator bar not found');
        return;
    }
    
    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        indicatorBar.style.width = scrolled + '%';
    });
}

// Carousel functionality
function initCarousel() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const indicators = carousel.querySelectorAll('.carousel .indicator');

    if (!track || !slides.length) {
        console.error('Carousel missing required elements');
        return;
    }

    let currentSlide = 0;
    const totalSlides = slides.length;

    function updateCarousel() {
        // Update slide position
        track.style.transform = `translateX(-${currentSlide * 100}%)`;

        // Update active states
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });

        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateCarousel();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });

    // Auto-play carousel
    setInterval(nextSlide, 5000);

    // Touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            nextSlide();
        } else if (touchEndX > touchStartX + 50) {
            prevSlide();
        }
    }
}

// Modal functionality
function initModals() {
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const closeButtons = document.querySelectorAll('.close-modal');
    const modals = document.querySelectorAll('.modal');

    // Open modal
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modal
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close modal on outside click
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    const sections = document.querySelectorAll('.section');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Optimize scroll events
window.addEventListener('scroll', throttle(function() {
    // Scroll-based animations can go here
}, 100));

// Window resize handler
window.addEventListener('resize', debounce(function() {
    // Handle responsive adjustments
}, 250));

// Parallax scrolling effect
function initParallax() {
    const parallaxBg = document.querySelector('.parallax-bg');
    const aboutSection = document.querySelector('.about-section');
    
    if (!parallaxBg && !aboutSection) return;
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const speed = 0.5; // Adjust speed of parallax
        
        // Parallax effect for the experience section background
        if (parallaxBg) {
            const yPos = -(scrolled * speed);
            parallaxBg.style.transform = `translateY(${yPos}px)`;
        }
        
        // Subtle effect for about section
        if (aboutSection) {
            const aboutRect = aboutSection.getBoundingClientRect();
            const aboutVisible = aboutRect.top < window.innerHeight && aboutRect.bottom > 0;
            
            if (aboutVisible) {
                const parallaxOffset = scrolled * 0.4;
                aboutSection.style.setProperty('--parallax-offset', `${parallaxOffset}px`);
            }
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}