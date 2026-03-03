// main.js - Core functionality

document.addEventListener('DOMContentLoaded', function() {
    // ===== MOBILE MENU TOGGLE =====
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar') && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const icon = document.querySelector('.hamburger i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
    
    // ===== NEWSLETTER FORM =====
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (isValidEmail(email)) {
                showNotification('Thanks for subscribing! Check your email for confirmation.', 'success');
                this.reset();
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
    
    // ===== TIP MODAL =====
    window.openTipModal = function() {
        const modal = document.getElementById('tipModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }
    
    window.closeTipModal = function() {
        const modal = document.getElementById('tipModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
    
    window.submitTip = function() {
        const tipInput = document.getElementById('tipInput');
        const tip = tipInput ? tipInput.value.trim() : '';
        
        if (tip) {
            const tips = JSON.parse(localStorage.getItem('userTips') || '[]');
            tips.push({
                text: tip,
                date: new Date().toISOString(),
                user: 'Guest User'
            });
            localStorage.setItem('userTips', JSON.stringify(tips));
            
            showNotification('Thanks for sharing your tip! +5 Green Credits', 'success');
            if (tipInput) tipInput.value = '';
            closeTipModal();
            
            // Award credits
            if (typeof earnCredits === 'function') {
                earnCredits(5);
            }
        } else {
            showNotification('Please enter a tip before submitting.', 'error');
        }
    }
    
    // Close modal when clicking on X or outside
    const modal = document.getElementById('tipModal');
    if (modal) {
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeTipModal);
        }
        
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeTipModal();
            }
        });
    }
    
    // ===== GREEN CREDITS SYSTEM =====
    window.userCredits = parseInt(localStorage.getItem('userCredits') || '0');
    
    window.earnCredits = function(amount) {
        userCredits += amount;
        updateCreditsDisplay();
        localStorage.setItem('userCredits', userCredits);
        showNotification(`Earned ${amount} Green Credits! Total: ${userCredits}`, 'success');
    }
    
    function updateCreditsDisplay() {
        let creditsDisplay = document.querySelector('.credits-display');
        if (!creditsDisplay) {
            creditsDisplay = document.createElement('div');
            creditsDisplay.className = 'credits-display';
            creditsDisplay.innerHTML = `
                <i class="fas fa-star" style="color: gold;"></i>
                <span>${userCredits}</span>
            `;
            creditsDisplay.style.cssText = `
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                background: rgba(46, 204, 113, 0.1);
                padding: 0.5rem 1rem;
                border-radius: 50px;
                margin-left: 1rem;
            `;
            
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu) {
                navMenu.appendChild(creditsDisplay);
            }
        } else {
            const span = creditsDisplay.querySelector('span');
            if (span) span.textContent = userCredits;
        }
    }
    
    // Initialize credits display
    updateCreditsDisplay();
    
    // ===== UTILITY FUNCTIONS =====
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    window.showNotification = function(message, type = 'info') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
    
    // Add notification animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // ===== ACTIVE PAGE HIGHLIGHTING =====
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    setActiveNavLink();
    
    // ===== LOAD USER TIPS =====
    window.loadUserTips = function() {
        const tipsContainer = document.getElementById('user-tips-container');
        if (!tipsContainer) return;
        
        const tips = JSON.parse(localStorage.getItem('userTips') || '[]');
        
        if (tips.length === 0) {
            tipsContainer.innerHTML = '<p class="no-tips">No tips shared yet. Be the first!</p>';
            return;
        }
        
        tips.reverse().forEach(tip => {
            const tipElement = document.createElement('div');
            tipElement.className = 'tip-card';
            tipElement.innerHTML = `
                <div class="tip-header">
                    <i class="fas fa-user-circle"></i>
                    <span class="tip-user">${tip.user}</span>
                    <span class="tip-date">${new Date(tip.date).toLocaleDateString()}</span>
                </div>
                <p class="tip-text">"${tip.text}"</p>
                <button class="btn-like" onclick="likeTip(this)">
                    <i class="far fa-heart"></i> <span>0</span>
                </button>
            `;
            tipsContainer.appendChild(tipElement);
        });
    }
    
    window.likeTip = function(button) {
        const likeCount = button.querySelector('span');
        const currentLikes = parseInt(likeCount.textContent);
        likeCount.textContent = currentLikes + 1;
        
        const heart = button.querySelector('i');
        heart.classList.remove('far');
        heart.classList.add('fas');
        heart.style.color = '#e74c3c';
        
        button.disabled = true;
    }
});

// Save credits when leaving page
window.addEventListener('beforeunload', function() {
    localStorage.setItem('userCredits', window.userCredits || '0');
});