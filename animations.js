// animations.js - All animation effects

class AnimationManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Only run heavy animations on desktop
        if (window.innerWidth > 768) {
            this.createFloatingLeaves();
            this.createParticles();
        }
        this.initScrollReveal();
        this.initTypingEffect();
        this.initParallax();
        this.initHoverEffects();
        this.initCounters();
        this.initProgressBars();
        this.addRippleEffect();
    }
    
    createFloatingLeaves() {
        const leavesContainer = document.createElement('div');
        leavesContainer.className = 'floating-leaves';
        document.body.appendChild(leavesContainer);
        
        const leafIcons = ['🍃', '🌿', '🍂', '🌱', '🍀'];
        
        for (let i = 0; i < 15; i++) {
            const leaf = document.createElement('div');
            leaf.className = 'leaf';
            leaf.innerHTML = leafIcons[Math.floor(Math.random() * leafIcons.length)];
            leaf.style.left = Math.random() * 100 + '%';
            leaf.style.animationDuration = (Math.random() * 10 + 15) + 's';
            leaf.style.animationDelay = Math.random() * 5 + 's';
            leaf.style.fontSize = (Math.random() * 20 + 15) + 'px';
            leavesContainer.appendChild(leaf);
        }
    }
    
    createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        document.body.appendChild(particlesContainer);
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.width = (Math.random() * 8 + 3) + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
            particle.style.animationDelay = Math.random() * 5 + 's';
            particle.style.backgroundColor = `hsl(${Math.random() * 60 + 100}, 70%, 50%)`;
            particlesContainer.appendChild(particle);
        }
    }
    
    initScrollReveal() {
        // Add reveal class to elements
        document.querySelectorAll('.feature-card, .action-card, .challenge-card, .data-card, .section-title').forEach(el => {
            if (!el.classList.contains('reveal')) {
                el.classList.add('reveal', 'fade-bottom');
            }
        });
        
        const revealElements = document.querySelectorAll('.reveal');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    // Add bounce effect when revealed
                    entry.target.style.animation = 'bounceIn 0.8s ease';
                    setTimeout(() => {
                        entry.target.style.animation = '';
                    }, 800);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px'
        });
        
        revealElements.forEach(el => observer.observe(el));
    }
    
    initTypingEffect() {
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle && window.innerWidth > 768 && !heroTitle.classList.contains('typing-done')) {
            const originalText = heroTitle.textContent;
            heroTitle.innerHTML = '';
            heroTitle.classList.add('typing-effect');
            
            let i = 0;
            const type = () => {
                if (i < originalText.length) {
                    heroTitle.innerHTML += originalText.charAt(i);
                    i++;
                    setTimeout(type, 100);
                } else {
                    heroTitle.classList.add('typing-done');
                    heroTitle.style.borderRight = 'none';
                }
            };
            
            // Start typing when hero is in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        type();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(heroTitle);
        }
    }
    
    initParallax() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            hero.style.backgroundPositionY = -(scrolled * 0.3) + 'px';
        });
    }
    
    initHoverEffects() {
        // 3D tilt effect on cards (desktop only)
        if (window.innerWidth > 768) {
            const cards = document.querySelectorAll('.feature-card, .action-card, .challenge-card, .data-card');
            
            cards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = (y - centerY) / 20;
                    const rotateY = (centerX - x) / 20;
                    
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
                });
            });
        }
    }
    
    initCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            // Store the target number if not already set
            if (!stat.hasAttribute('data-target')) {
                const target = parseInt(stat.textContent.replace(/,/g, ''));
                stat.setAttribute('data-target', target);
                stat.textContent = '0';
            }
            
            // Start count when in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateNumber(stat);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(stat);
        });
    }
    
    animateNumber(element) {
        const start = 0;
        const end = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        let startTimestamp = null;
        
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.innerText = Math.floor(progress * (end - start) + start).toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        
        window.requestAnimationFrame(step);
    }
    
    initProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        progressBars.forEach(bar => {
            const fill = bar.querySelector('.progress-fill');
            if (!fill) return;
            
            // Store target width
            const targetWidth = fill.style.width || '0%';
            fill.style.width = '0%';
            
            // Animate when in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            fill.style.width = targetWidth;
                        }, 200);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(bar);
        });
    }
    
    addRippleEffect() {
        const buttons = document.querySelectorAll('.btn, .btn-action, .join-btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                ripple.className = 'ripple-effect';
                
                const rect = btn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    background: rgba(255, 255, 255, 0.5);
                    border-radius: 50%;
                    left: ${e.clientX - rect.left - size/2}px;
                    top: ${e.clientY - rect.top - size/2}px;
                    transform: scale(0);
                    animation: ripple-animation 0.6s ease-out;
                    pointer-events: none;
                    z-index: 10;
                `;
                
                btn.style.position = 'relative';
                btn.style.overflow = 'hidden';
                btn.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
}

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.animations = new AnimationManager();
    
    // Add floating animation to icons
    document.querySelectorAll('.feature-icon i, .stat-card i').forEach(icon => {
        icon.style.animation = 'float 6s ease-in-out infinite';
    });
    
    // Add heartbeat to special elements
    document.querySelectorAll('.highlight').forEach(el => {
        el.classList.add('heartbeat');
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        // Remove heavy animations on mobile
        document.querySelectorAll('.floating-leaves, .particles').forEach(el => {
            if (el) el.style.display = 'none';
        });
    }
});