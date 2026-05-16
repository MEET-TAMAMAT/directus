// TAMAMAT Sales Rep Form JavaScript

// Theme Detection
function initializeTheme() {
    const urlParams = new URLSearchParams(window.location.search);
    const theme = urlParams.get('theme') || 'light';

    document.documentElement.setAttribute('data-theme', theme);
    console.log('Theme initialized:', theme);
}

// Form Validation
function validateField(field) {
    const value = field.value.trim();
    const errorDiv = field.parentElement.querySelector('.error-message');
    let isValid = true;
    let errorMessage = '';

    // Clear previous error
    field.classList.remove('error');
    if (errorDiv) errorDiv.textContent = '';

    // Required field
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'This field is required.';
        isValid = false;
    }

    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Please enter a valid email address.';
            isValid = false;
        }
    }

    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            errorMessage = 'Please enter a valid phone number.';
            isValid = false;
        }
    }

    // Password validation
    if (field.type === 'password' && value && field.name !== 'confirm') {
        if (value.length < 8) {
            errorMessage = 'Password must be at least 8 characters long.';
            isValid = false;
        }
    }

    // Show error
    if (!isValid) {
        field.classList.add('error');
        if (errorDiv) errorDiv.textContent = errorMessage;
    }

    return isValid;
}

// Password Toggle
function setupPasswordToggles() {
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                toggle.textContent = '🙈';
            } else {
                input.type = 'password';
                toggle.textContent = '👁️';
            }
        });
    });
}

// Form Submission
function setupFormSubmission() {
    const form = document.getElementById('salesForm');
    const messages = document.getElementById('messages');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all fields
        const inputs = form.querySelectorAll('input[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            showMessage('Please correct the errors above.', 'error');
            return;
        }

        // Show success (demo mode)
        showMessage('🎉 Form submitted successfully! (Demo mode)', 'success');
    });
}

// Show Messages
function showMessage(message, type) {
    const messages = document.getElementById('messages');
    messages.innerHTML = `<div class="message ${type}">${message}</div>`;

    if (type === 'success') {
        setTimeout(() => {
            messages.innerHTML = '';
        }, 5000);
    }
}

// Setup Real-time Validation
function setupRealtimeValidation() {
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    setupPasswordToggles();
    setupFormSubmission();
    setupRealtimeValidation();
    console.log('TAMAMAT form initialized');
});