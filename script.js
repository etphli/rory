// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const header = document.querySelector('header');
    const policyItems = document.querySelectorAll('.policy-item');
    const prevButton = document.querySelector('.prev-policy');
    const nextButton = document.querySelector('.next-policy');
    const ctaButton = document.querySelector('.cta-button');
    const sections = document.querySelectorAll('section');
    const logo = document.getElementById('animated-logo');
    
    // Variables
    let currentPolicyIndex = 0;
    let isAnimating = false;
    
    // Initialize
    initAnimations();
    
    // Scroll event for header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Check for elements to animate on scroll
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionElements = section.querySelectorAll('.animate-on-scroll');
            
            if (sectionTop < window.innerHeight - 100) {
                sectionElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('visible');
                    }, index * 100);
                });
            }
        });
    });
    
    // Click event for CTA button
    ctaButton.addEventListener('click', () => {
        const policySection = document.getElementById('policies');
        policySection.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Click events for policy navigation
    prevButton.addEventListener('click', () => {
        if (isAnimating) return;
        navigatePolicy('prev');
    });
    
    nextButton.addEventListener('click', () => {
        if (isAnimating) return;
        navigatePolicy('next');
    });
    
    // Form submission
    const contactForm = document.querySelector('.contact-form form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simple animation for form submission
        const formElements = contactForm.querySelectorAll('input, textarea, button');
        formElements.forEach(el => {
            el.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            el.style.transform = 'translateY(-10px)';
            el.style.opacity = '0';
        });
        
        setTimeout(() => {
            contactForm.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <h3>Thank you!</h3>
                    <p>Your message has been sent to Rory.</p>
                </div>
            `;
            
            const successMessage = contactForm.querySelector('.success-message');
            successMessage.style.opacity = '0';
            successMessage.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                successMessage.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
                successMessage.style.transform = 'translateY(0)';
                successMessage.style.opacity = '1';
            }, 10);
        }, 500);
    });
    
    // Add animated elements class
    function initAnimations() {
        // Add animate-on-scroll class to various elements
        const elementsToAnimate = [
            ...document.querySelectorAll('.section-title'),
            ...document.querySelectorAll('.about-content > *'),
            ...document.querySelectorAll('.contact-content > *'),
            ...document.querySelectorAll('.policy-navigation')
        ];
        
        elementsToAnimate.forEach(el => {
            el.classList.add('animate-on-scroll');
        });
        
        // Add animate-text class to h1, h2, h3 elements
        const textElements = document.querySelectorAll('h1:not(.animate-text), h2:not(.animate-text), h3:not(.animate-text), p:not(.animate-text)');
        textElements.forEach(el => {
            if (!el.closest('.hero') && !el.closest('.policy-item')) {
                el.classList.add('animate-on-scroll');
            }
        });
        
        // Add smooth hover animations to all buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (!button.classList.contains('prev-policy') && !button.classList.contains('next-policy')) {
                button.addEventListener('mouseover', createRippleEffect);
            }
        });
        
        // Initialize the first policy with a special entry animation
        policyItems.forEach((item, index) => {
            if (index === 0) {
                setTimeout(() => {
                    item.style.visibility = 'visible';
                    item.classList.add('active');
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, 500);
            }
        });
        
        // Auto rotate policies
        startPolicyAutoRotation();
        
        // Add animated letter effect to logo
        animateLetters(logo);
        
        // Create dynamic background elements
        createDynamicBackground();
    }
    
    // Navigate between policies
    function navigatePolicy(direction) {
        isAnimating = true;
        
        // Hide current policy with animation
        const currentPolicy = policyItems[currentPolicyIndex];
        currentPolicy.style.opacity = '0';
        currentPolicy.style.transform = direction === 'next' ? 'translateX(-100%)' : 'translateX(100%)';
        
        // Remove active class after animation
        setTimeout(() => {
            currentPolicy.classList.remove('active');
            currentPolicy.style.visibility = 'hidden';
            
            // Update index
            if (direction === 'next') {
                currentPolicyIndex = (currentPolicyIndex + 1) % policyItems.length;
            } else {
                currentPolicyIndex = (currentPolicyIndex - 1 + policyItems.length) % policyItems.length;
            }
            
            // Show new policy
            showPolicy(currentPolicyIndex);
        }, 300);
    }
    
    // Show specific policy
    function showPolicy(index) {
        // Make sure all other policies are hidden
        policyItems.forEach((item, i) => {
            if (i !== index) {
                item.classList.remove('active');
                item.style.opacity = '0';
                item.style.transform = 'translateX(100%)';
                item.style.visibility = 'hidden'; // Make sure it's hidden
            }
        });
        
        // Show target policy with animation
        const targetPolicy = policyItems[index];
        targetPolicy.style.visibility = 'visible';
        targetPolicy.classList.add('active');
        
        // Add a slight delay for better visual effect
        setTimeout(() => {
            targetPolicy.style.opacity = '1';
            targetPolicy.style.transform = 'translateX(0)';
            isAnimating = false;
            
            // Animate the policy icon with an extra bounce
            const icon = targetPolicy.querySelector('.policy-icon');
            icon.style.animation = 'none';
            setTimeout(() => {
                icon.style.animation = 'float 3s ease-in-out infinite, bounce 0.5s ease';
            }, 10);
        }, 50);
    }
    
    // Auto rotate policies
    function startPolicyAutoRotation() {
        setInterval(() => {
            if (!isAnimating && !document.hidden) {
                navigatePolicy('next');
            }
        }, 5000);
    }
    
    // Create ripple effect for buttons
    function createRippleEffect(e) {
        const button = e.currentTarget;
        
        // Remove any existing ripple elements
        const ripples = button.querySelectorAll('.ripple');
        ripples.forEach(ripple => ripple.remove());
        
        // Create ripple element
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        button.appendChild(ripple);
        
        // Position the ripple
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        ripple.classList.add('active');
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 1000);
    }
    
    // Create floating particles in the background
    createParticles();
    function createParticles() {
        const particles = document.createElement('div');
        particles.classList.add('particles');
        document.body.appendChild(particles);
        
        for (let i = 0; i < 70; i++) { // Increased particle count
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particles.appendChild(particle);
            
            // Random position
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            
            // Random size
            const size = Math.random() * 15 + 5;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random opacity
            particle.style.opacity = Math.random() * 0.5;
            
            // Random animation delay and duration
            const delay = Math.random() * 5;
            const duration = Math.random() * 20 + 10;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            
            // Use school colors
            if (Math.random() > 0.5) {
                particle.style.backgroundColor = 'rgba(128, 0, 0, 0.2)';
            } else {
                particle.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
            }
        }
    }
    
    // Add parallax effect
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        // Only animate background elements, not text or content
        const backgroundCircles = document.querySelectorAll('.bg-circle');
        
        if (backgroundCircles.length > 0) {
            backgroundCircles.forEach(circle => {
                const speed = 10 + Math.random() * 10;
                const x = (0.5 - mouseX) * speed;
                const y = (0.5 - mouseY) * speed;
                
                circle.style.transform = `translate(${x}px, ${y}px)`;
            });
        }
    });
    
    // Animate letters in text
    function animateLetters(element) {
        if (!element) return;
        
        const text = element.innerText;
        element.innerHTML = '';
        
        // Create spans for each letter
        for (let i = 0; i < text.length; i++) {
            const letter = document.createElement('span');
            letter.textContent = text[i] === ' ' ? '\u00A0' : text[i]; // Replace space with non-breaking space
            letter.style.display = 'inline-block';
            letter.style.margin = '0 2px'; // Add spacing between letters
            letter.style.transition = 'transform 0.3s ease, color 0.3s ease';
            letter.style.transitionDelay = `${i * 0.03}s`;
            
            // Add event listeners for hover animation
            element.addEventListener('mouseenter', () => {
                setTimeout(() => {
                    letter.style.color = '#a52a2a';
                    letter.style.transform = `translateY(-5px) rotate(${Math.random() * 10 - 5}deg)`;
                }, i * 30);
            });
            
            element.addEventListener('mouseleave', () => {
                setTimeout(() => {
                    letter.style.color = '';
                    letter.style.transform = '';
                }, i * 20);
            });
            
            element.appendChild(letter);
        }
    }
    
    // Create dynamic background elements
    function createDynamicBackground() {
        const hero = document.querySelector('.hero');
        
        // Create animated circles
        for (let i = 0; i < 5; i++) {
            const circle = document.createElement('div');
            circle.classList.add('bg-circle');
            
            // Random position
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            
            // Random size
            const size = Math.random() * 200 + 100;
            
            // Random animation
            const delay = Math.random() * 5;
            const duration = Math.random() * 10 + 15;
            
            circle.style.left = `${posX}%`;
            circle.style.top = `${posY}%`;
            circle.style.width = `${size}px`;
            circle.style.height = `${size}px`;
            circle.style.animationDelay = `${delay}s`;
            circle.style.animationDuration = `${duration}s`;
            
            hero.appendChild(circle);
        }
    }
    
    // Add scroll reveal animations
    window.addEventListener('scroll', revealOnScroll);
    function revealOnScroll() {
        const revealElements = document.querySelectorAll('.about, .policies, .contact');
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.transition = 'transform 1s ease, opacity 1s ease';
                element.style.transform = 'translateY(0)';
                element.style.opacity = '1';
            } else {
                element.style.transform = 'translateY(50px)';
                element.style.opacity = '0';
            }
        });
    }
    revealOnScroll(); // Call once on load
    
    // Add CSS for particles and ripple effect
    addExtraStyles();
    function addExtraStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .particles {
                position: fixed;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                z-index: -1;
                overflow: hidden;
                pointer-events: none;
            }
            
            .particle {
                position: absolute;
                border-radius: 50%;
                animation: float linear infinite;
                pointer-events: none;
            }
            
            @keyframes float {
                0% {
                    transform: translateY(0) translateX(0) rotate(0deg);
                }
                33% {
                    transform: translateY(-100px) translateX(100px) rotate(120deg);
                }
                66% {
                    transform: translateY(100px) translateX(200px) rotate(240deg);
                }
                100% {
                    transform: translateY(0) translateX(0) rotate(360deg);
                }
            }
            
            @keyframes bounce {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
            
            .ripple {
                position: absolute;
                border-radius: 50%;
                background-color: rgba(255, 255, 255, 0.7);
                transform: scale(0);
                animation: ripple 1s linear;
                pointer-events: none;
            }
            
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            .bg-circle {
                position: absolute;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(128, 0, 0, 0.05) 0%, transparent 70%);
                opacity: 0.3;
                z-index: 0;
                pointer-events: none;
                animation: pulse-fade 20s ease-in-out infinite alternate;
            }
            
            @keyframes pulse-fade {
                0% {
                    transform: scale(0.8) rotate(0deg);
                    opacity: 0.2;
                }
                50% {
                    transform: scale(1.2) rotate(180deg);
                    opacity: 0.4;
                }
                100% {
                    transform: scale(0.9) rotate(360deg);
                    opacity: 0.3;
                }
            }
            
            /* New loading animation for buttons */
            .policy-navigation button:active::before {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                animation: pulse 0.5s ease;
            }
            
            @keyframes pulse {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(1.5);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styleElement);
    }
}); 