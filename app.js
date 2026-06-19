/* ==========================================================================
   FL ENERGY SRLS - CUSTOM INTERACTION SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ---------------------------------------------------------
    // 1. THEME TOGGLE (LIGHT / DARK MODE)
    // ---------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check saved user preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    
    if (themeToggleBtn) {
        const themeIcon = themeToggleBtn.querySelector('i');
        updateThemeIcon(savedTheme);
        
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
        
        function updateThemeIcon(theme) {
            if (themeIcon) {
                if (theme === 'dark') {
                    themeIcon.className = 'fa-solid fa-sun';
                } else {
                    themeIcon.className = 'fa-solid fa-moon';
                }
            }
        }
    }

    // ---------------------------------------------------------
    // 2. MOBILE NAVIGATION MENU
    // ---------------------------------------------------------
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });
        
        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    // ---------------------------------------------------------
    // 3. HEADER SCROLL EFFECT & ACTIVE NAVIGATION INDICATOR
    // ---------------------------------------------------------
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        // Sticky Header effect
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Active navigation link based on scroll position
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // ---------------------------------------------------------
    // 4. INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
    // ---------------------------------------------------------
    const animatableElements = document.querySelectorAll('.scroll-animate');
    
    const scrollObserverOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Trigger stats counter animation if this is a stats card
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber) {
                    animateCounter(statNumber);
                }
                observer.unobserve(entry.target);
            }
        });
    }, scrollObserverOptions);
    
    animatableElements.forEach(element => {
        scrollObserver.observe(element);
    });

    // ---------------------------------------------------------
    // 5. ANIMATING STATS COUNTERS
    // ---------------------------------------------------------
    function animateCounter(element) {
        const targetValue = parseInt(element.getAttribute('data-target'), 10);
        const suffix = element.getAttribute('data-suffix') || '';
        const duration = 1500; // 1.5 seconds
        const stepTime = 15;
        const steps = duration / stepTime;
        const increment = targetValue / steps;
        
        let currentValue = 0;
        let currentStep = 0;
        
        const timer = setInterval(() => {
            currentStep++;
            currentValue += increment;
            
            if (currentStep >= steps) {
                element.textContent = targetValue + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentValue) + suffix;
            }
        }, stepTime);
    }

    // ---------------------------------------------------------
    // 6. INTERACTIVE SECTOR FILTERING
    // ---------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sectorCards = document.querySelectorAll('.sector-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const selectedFilter = button.getAttribute('data-filter');
            
            sectorCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Add fade-out transition, then toggle visibility
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    if (selectedFilter === 'all' || cardCategory === selectedFilter) {
                        card.classList.remove('hidden');
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.classList.add('hidden');
                    }
                }, 300);
            });
        });
    });

    // ---------------------------------------------------------
    // 7. CONTACT FORM SUBMISSION WITH SIMULATED FEEDBACK
    // ---------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('submit-btn');
    
    if (contactForm && formFeedback && submitBtn) {
        const submitBtnText = submitBtn.querySelector('span');
        const submitBtnIcon = submitBtn.querySelector('i');
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Disable submit button and show loader
            submitBtn.disabled = true;
            if (submitBtnText) submitBtnText.textContent = 'Invio in corso...';
            if (submitBtnIcon) submitBtnIcon.className = 'fa-solid fa-circle-notch fa-spin';
            
            // Hide previous feedback
            formFeedback.className = 'form-feedback hidden';
            
            // Simulate Server API Request delay (1.5 seconds)
            setTimeout(() => {
                const formData = new FormData(contactForm);
                const userName = formData.get('name');
                
                // Basic success simulation
                formFeedback.textContent = `Grazie ${userName}, la tua richiesta è stata inviata con successo! Ti risponderemo a breve.`;
                formFeedback.className = 'form-feedback success';
                
                // Reset form fields
                contactForm.reset();
                
                // Restore button state
                submitBtn.disabled = false;
                if (submitBtnText) submitBtnText.textContent = 'Invia Richiesta';
                if (submitBtnIcon) submitBtnIcon.className = 'fa-solid fa-paper-plane';
                
                // Scroll feedback into view
                formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 1500);
        });
    }
});
