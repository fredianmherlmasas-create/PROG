
(function() {
    const savedSettings = JSON.parse(localStorage.getItem('systemSettings') || '{}');
    const theme = savedSettings.appearance?.theme || 'light';
    
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else if (theme === 'auto') {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initPageTransitions();
    initNavigation();
    initScrollEffects();
    initCounterAnimation();
    initBackToTop();
    initStarRating();
    initFormValidation();
    initModals();
    initNotifications();
    initAnonymousToggle();
    initCitizensCharterSurvey();
    initSatisfactionRatingTable();
});


function initTheme() {
    // Initialize theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Listen for system theme changes (for auto mode)
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            const savedSettings = JSON.parse(localStorage.getItem('systemSettings') || '{}');
            const theme = savedSettings.appearance?.theme || 'light';
            
            if (theme === 'auto') {
                if (e.matches) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                    document.documentElement.removeAttribute('data-theme');
                }
            }
        });
    }
}

// Toggle theme function
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    if (newTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    
    // Save to localStorage
    const savedSettings = JSON.parse(localStorage.getItem('systemSettings') || '{}');
    if (!savedSettings.appearance) savedSettings.appearance = {};
    savedSettings.appearance.theme = newTheme;
    localStorage.setItem('systemSettings', JSON.stringify(savedSettings));
}

// Global function to set theme (called from settings page)
function setTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
        document.documentElement.removeAttribute('data-theme');
    } else if (theme === 'auto') {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }
}

function initPageTransitions() {
    // Handle internal link clicks for smooth page transitions
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href]');
        if (!link) return;
        
        const href = link.getAttribute('href');
        
        // Skip non-navigating links or empty hrefs
        if (!href || 
            href === '' ||
            href === '#' ||
            href.startsWith('#') || 
            href.startsWith('javascript:') || 
            href.startsWith('mailto:') || 
            href.startsWith('tel:') ||
            href.startsWith('http://') ||
            href.startsWith('https://') ||
            link.target === '_blank' ||
            link.hasAttribute('onclick') ||
            link.hasAttribute('data-no-transition') ||
            e.ctrlKey || e.metaKey) {
            return;
        }
        
        // Only handle .html links for safety
        if (!href.endsWith('.html') && !href.includes('.html')) {
            return;
        }
        
        // Internal navigation with transition
        e.preventDefault();
        document.body.classList.add('page-exit');
        
        setTimeout(() => {
            window.location.href = href;
        }, 150);
    });
}

// ============================================
// Navigation
// ============================================
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
    
    // Active link highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || href.endsWith(currentPage)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ============================================
// Scroll Effects
// ============================================
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });
    
    // Smooth reveal animations on scroll using Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: unobserve after revealing for performance
                // revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Auto-add reveal class to common elements
    const revealSelectors = [
        '.stat-card',
        '.feature-card',
        '.service-card',
        '.testimonial-card',
        '.section-header',
        '.contact-card',
        '.faq-item',
        '.team-card',
        '.service-full-card',
        '.info-card'
    ];
    
    revealSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${index * 0.1}s`;
            revealObserver.observe(el);
        });
    });
    
    // Also observe any elements that already have .reveal class
    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });
}


function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    if (counters.length === 0) return;
    
    const animateCounter = (counter) => {
        const target = parseFloat(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const isDecimal = target % 1 !== 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
            }
        };
        
        updateCounter();
    };
    
    // Intersection Observer for counter animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}


function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    if (!backToTop) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


function initStarRating() {
    const starRatings = document.querySelectorAll('.star-rating');
    
    starRatings.forEach(rating => {
        const stars = rating.querySelectorAll('.star');
        const input = rating.querySelector('input[type="hidden"]') || 
                      document.querySelector(`input[name="${rating.dataset.input}"]`);
        
        stars.forEach((star, index) => {
            star.addEventListener('mouseenter', () => {
                highlightStars(stars, index);
            });
            
            star.addEventListener('mouseleave', () => {
                const currentRating = input ? parseInt(input.value) || 0 : 0;
                highlightStars(stars, currentRating - 1, true);
            });
            
            star.addEventListener('click', () => {
                const value = index + 1;
                if (input) input.value = value;
                highlightStars(stars, index, true);
                rating.dispatchEvent(new CustomEvent('ratingChanged', { detail: { value } }));
            });
        });
    });
}

function highlightStars(stars, activeIndex, permanent = false) {
    stars.forEach((star, index) => {
        star.classList.remove('active', 'hover');
        if (index <= activeIndex) {
            star.classList.add(permanent ? 'active' : 'hover');
        }
    });
}

// ============================================
// Form Validation
// ============================================
function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(form)) {
                handleFormSubmit(form);
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const name = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Required validation
    if (field.required && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (isValid && type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (isValid && (type === 'tel' || name === 'phone') && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // Min length validation
    if (isValid && field.minLength && value.length < field.minLength) {
        isValid = false;
        errorMessage = `Minimum ${field.minLength} characters required`;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentElement.querySelector('.form-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        field.parentElement.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentElement.querySelector('.form-error');
    if (errorElement) {
        errorElement.remove();
    }
}


function handleFormSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const formType = form.dataset.type || 'default';
    
    // Show loading state
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    
    // Simulate API call
    setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        // Store feedback in localStorage (simulating database)
        if (formType === 'feedback') {
            saveFeedback(data);
            showNotification('Thank you! Your feedback has been submitted successfully.', 'success');
            form.reset();
            
            // Reset star ratings
            const starRatings = form.querySelectorAll('.star-rating');
            starRatings.forEach(rating => {
                const stars = rating.querySelectorAll('.star');
                stars.forEach(star => star.classList.remove('active', 'hover'));
            });
            
            // Reset satisfaction rating table
            const satisfactionCells = form.querySelectorAll('.satisfaction-table .rating-cell');
            satisfactionCells.forEach(cell => {
                cell.classList.remove('active');
            });
            
            // Reset other form states
            initAnonymousToggle();
            initCitizensCharterSurvey();
            initSatisfactionRatingTable();
        } else if (formType === 'contact') {
            saveContactMessage(data);
            showNotification('Your message has been sent. We will get back to you soon!', 'success');
            form.reset();
        } else if (formType === 'login') {
            handleLogin(data);
        }
    }, 1500);
}


function saveFeedback(data) {
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    const feedback = {
        id: Date.now(),
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    feedbacks.unshift(feedback);
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    updateStats();
}

function getFeedbacks() {
    return JSON.parse(localStorage.getItem('feedbacks') || '[]');
}

function updateFeedbackStatus(id, status) {
    const feedbacks = getFeedbacks();
    const index = feedbacks.findIndex(f => f.id === id);
    if (index !== -1) {
        feedbacks[index].status = status;
        feedbacks[index].updatedAt = new Date().toISOString();
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    }
}

function deleteFeedback(id) {
    const feedbacks = getFeedbacks();
    const filtered = feedbacks.filter(f => f.id !== id);
    localStorage.setItem('feedbacks', JSON.stringify(filtered));
}

function saveContactMessage(data) {
    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    const message = {
        id: Date.now(),
        ...data,
        read: false,
        createdAt: new Date().toISOString()
    };
    messages.unshift(message);
    localStorage.setItem('contactMessages', JSON.stringify(messages));
}

function updateStats() {
    const feedbacks = getFeedbacks();
    const stats = {
        total: feedbacks.length,
        averageRating: calculateAverageRating(feedbacks),
        pending: feedbacks.filter(f => f.status === 'pending').length,
        resolved: feedbacks.filter(f => f.status === 'resolved').length
    };
    localStorage.setItem('feedbackStats', JSON.stringify(stats));
}

function calculateAverageRating(feedbacks) {
    if (feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, f) => acc + (parseInt(f.rating) || 0), 0);
    return (sum / feedbacks.length).toFixed(1);
}


function handleLogin(data) {
    const { username, password } = data;
    
    // Default admin credentials (in real app, this would be server-side)
    const validCredentials = [
        { username: 'admin', password: 'admin123', role: 'admin' },
        { username: 'staff', password: 'staff123', role: 'staff' }
    ];
    
    const user = validCredentials.find(
        u => u.username === username && u.password === password
    );
    
    if (user) {
        sessionStorage.setItem('currentUser', JSON.stringify({
            username: user.username,
            role: user.role,
            loginTime: new Date().toISOString()
        }));
        showNotification('Login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'admin-dashboard.html';
        }, 1500);
    } else {
        showNotification('Invalid username or password', 'error');
    }
}

function isLoggedIn() {
    return sessionStorage.getItem('currentUser') !== null;
}

function getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('currentUser') || 'null');
}

function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'admin-login.html';
}

function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'admin-login.html';
        return false;
    }
    return true;
}


function initModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modalCloses = document.querySelectorAll('.modal-close, [data-modal-close]');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.dataset.modal;
            openModal(modalId);
        });
    });
    
    modalCloses.forEach(close => {
        close.addEventListener('click', () => {
            const modal = close.closest('.modal-overlay');
            if (modal) closeModal(modal.id);
        });
    });
    
    // Close modal on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay.id);
            }
        });
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) closeModal(activeModal.id);
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}


let notificationContainer = null;

function initNotifications() {
    // Create notification container if it doesn't exist
    if (!document.getElementById('notification-container')) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(notificationContainer);
    } else {
        notificationContainer = document.getElementById('notification-container');
    }
}

function showNotification(message, type = 'info', duration = 5000) {
    if (!notificationContainer) initNotifications();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        padding: 16px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 350px;
        animation: slideIn 0.3s ease;
    `;
    
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#d4a528',
        info: '#17a2b8'
    };
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    notification.style.background = colors[type] || colors.info;
    if (type === 'warning') notification.style.color = '#333';
    
    notification.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
        <button style="background: none; border: none; color: inherit; cursor: pointer; margin-left: auto; font-size: 18px;" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notificationContainer.appendChild(notification);
    
    // Auto remove after duration
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Add animation styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
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
document.head.appendChild(notificationStyles);


function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatDateShort(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

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

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Handle Anonymous Feedback Toggle
function initAnonymousToggle() {
    const anonymousCheckbox = document.getElementById('anonymousCheckbox');
    const personalInfoSection = document.getElementById('personalInfoSection');
    
    if (anonymousCheckbox && personalInfoSection) {
        anonymousCheckbox.addEventListener('change', () => {
            if (anonymousCheckbox.checked) {
                // Hide personal info when anonymous is checked
                personalInfoSection.style.display = 'none';
                // Remove required attribute from personal info fields
                const nameField = personalInfoSection.querySelector('input[name="name"]');
                const emailField = personalInfoSection.querySelector('input[name="email"]');
                const phoneField = personalInfoSection.querySelector('input[name="phone"]');
                if (nameField) nameField.removeAttribute('required');
                if (emailField) emailField.removeAttribute('required');
                if (phoneField) phoneField.removeAttribute('required');
            } else {
                // Show personal info when anonymous is unchecked
                personalInfoSection.style.display = 'block';
                // Add required attribute back to personal info fields
                const nameField = personalInfoSection.querySelector('input[name="name"]');
                const emailField = personalInfoSection.querySelector('input[name="email"]');
                const phoneField = personalInfoSection.querySelector('input[name="phone"]');
                if (nameField) nameField.setAttribute('required', 'required');
                if (emailField) emailField.setAttribute('required', 'required');
                if (phoneField) phoneField.setAttribute('required', 'required');
            }
        });
    }
}

// Handle Citizen's Charter Survey Logic
function initCitizensCharterSurvey() {
    const cc1Radios = document.querySelectorAll('input[name="cc1_awareness"]');
    const cc2Group = document.getElementById('cc2Group');
    const cc3Group = document.getElementById('cc3Group');
    const cc2AnswerDiv = document.querySelector('.cc2-answer');
    const cc2NaDiv = document.querySelector('.cc2-na');
    const cc3AnswerDiv = document.querySelector('.cc3-answer');
    const cc3NaDiv = document.querySelector('.cc3-na');
    const cc2Radios = document.querySelectorAll('input[name="cc2_visibility"]');
    const cc3Radios = document.querySelectorAll('input[name="cc3_helpfulness"]');
    
    if (!cc1Radios.length || !cc2Group || !cc3Group) return;
    
    function updateCCState() {
        const cc1Selected = document.querySelector('input[name="cc1_awareness"]:checked');
        
        if (cc1Selected && cc1Selected.value === '4') {
            // CC1 is "I do not know what a CC is..." - disable CC2 and CC3
            cc2Group.style.display = 'block';
            cc3Group.style.display = 'block';
            
            // Show only N/A options and hide regular options
            cc2AnswerDiv.style.display = 'none';
            cc2NaDiv.style.display = 'block';
            cc3AnswerDiv.style.display = 'none';
            cc3NaDiv.style.display = 'block';
            
            // Disable regular options for CC2 and CC3
            cc2Radios.forEach(radio => {
                if (radio.value !== '5') radio.disabled = true;
            });
            cc3Radios.forEach(radio => {
                if (radio.value !== '4') radio.disabled = true;
            });
            
            // Auto-select N/A for CC2 and CC3
            const cc2NaRadio = document.querySelector('input[name="cc2_visibility"][value="5"]');
            const cc3NaRadio = document.querySelector('input[name="cc3_helpfulness"][value="4"]');
            if (cc2NaRadio) cc2NaRadio.checked = true;
            if (cc3NaRadio) cc3NaRadio.checked = true;
        } else if (cc1Selected && ['1', '2', '3'].includes(cc1Selected.value)) {
            // CC1 is options 1-3 - enable CC2 and CC3
            cc2Group.style.display = 'block';
            cc3Group.style.display = 'block';
            
            // Show regular options and hide N/A options
            cc2AnswerDiv.style.display = 'block';
            cc2NaDiv.style.display = 'none';
            cc3AnswerDiv.style.display = 'block';
            cc3NaDiv.style.display = 'none';
            
            // Enable all regular options for CC2 and CC3
            cc2Radios.forEach(radio => {
                if (radio.value !== '5') radio.disabled = false;
            });
            cc3Radios.forEach(radio => {
                if (radio.value !== '4') radio.disabled = false;
            });
            
            // Uncheck N/A options
            const cc2NaRadio = document.querySelector('input[name="cc2_visibility"][value="5"]');
            const cc3NaRadio = document.querySelector('input[name="cc3_helpfulness"][value="4"]');
            if (cc2NaRadio) cc2NaRadio.checked = false;
            if (cc3NaRadio) cc3NaRadio.checked = false;
        } else {
            // No selection yet - hide CC2 and CC3
            cc2Group.style.display = 'none';
            cc3Group.style.display = 'none';
        }
    }
    
    // Add event listeners to CC1 radios
    cc1Radios.forEach(radio => {
        radio.addEventListener('change', updateCCState);
    });
    
    // Initial state
    updateCCState();
}

// Handle Satisfaction Rating Table
function initSatisfactionRatingTable() {
    const satisfactionRadios = document.querySelectorAll('.satisfaction-table input[type="radio"]');
    
    if (!satisfactionRadios.length) return;
    
    // Add visual feedback when radio is selected
    satisfactionRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const row = this.closest('.satisfaction-row');
            if (row) {
                // Remove active state from all cells in this row
                row.querySelectorAll('.rating-cell').forEach(cell => {
                    cell.classList.remove('active');
                });
                // Add active state to the selected cell
                this.closest('.rating-cell').classList.add('active');
            }
        });
    });
}

// Get Satisfaction Ratings as JSON Object
function getSatisfactionRatings() {
    const ratings = {};
    const dimensions = [
        'sat_responsiveness',
        'sat_reliability',
        'sat_access',
        'sat_communication',
        'sat_costs',
        'sat_integrity',
        'sat_assurance',
        'sat_outcome'
    ];
    
    dimensions.forEach(dimension => {
        const selectedRadio = document.querySelector(`input[name="${dimension}"]:checked`);
        if (selectedRadio) {
            ratings[dimension] = parseInt(selectedRadio.value);
        }
    });
    
    return ratings;
}

// Export Functions for Global Use

window.FeedbackSystem = {
    showNotification,
    openModal,
    closeModal,
    getFeedbacks,
    saveFeedback,
    updateFeedbackStatus,
    deleteFeedback,
    isLoggedIn,
    getCurrentUser,
    logout,
    requireAuth,
    formatDate,
    formatDateShort
};
