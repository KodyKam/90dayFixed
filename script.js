// DOM Elements
const currentDateEl = document.getElementById('currentDate');
const currentTimeEl = document.getElementById('currentTime');
const localBtn = document.getElementById('localBtn');
const provinceBtn = document.getElementById('provinceBtn');
const shippingTypeLabel = document.getElementById('shippingTypeLabel');
const daysLabel = document.getElementById('daysLabel');
const resultDateEl = document.getElementById('resultDate');
const resultNoteEl = document.getElementById('resultNote');
const copyBtn = document.getElementById('copyBtn');
const copyStatusEl = document.getElementById('copyStatus');

// Suggestion elements
const suggestionInput = document.getElementById('suggestionInput');
const submitSuggestionBtn = document.getElementById('submitSuggestion');
const suggestionInputMobile = document.getElementById('suggestionInputMobile');
const submitSuggestionMobileBtn = document.getElementById('submitSuggestionMobile');

// Configuration
const CONFIG = {
    LOCAL: {
        days: 90,
        label: 'Local Shipping',
        color: '#2ecc71',
        note: 'Products must have at least 90 days until expiry for local shipments.'
    },
    PROVINCE: {
        days: 100,
        label: 'Out-of-Province Shipping',
        color: '#e74c3c',
        note: 'Products must have at least 100 days until expiry for out-of-province shipments.'
    }
};

// Initialize suggestion functionality
function initSuggestionBoxes() {
    // Desktop suggestion box
    if (submitSuggestionBtn && suggestionInput) {
        submitSuggestionBtn.addEventListener('click', () => handleSuggestionSubmit(suggestionInput));
        
        suggestionInput.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                handleSuggestionSubmit(suggestionInput);
            }
        });
    }
    
    // Mobile suggestion box
    if (submitSuggestionMobileBtn && suggestionInputMobile) {
        submitSuggestionMobileBtn.addEventListener('click', () => handleSuggestionSubmit(suggestionInputMobile));
        
        suggestionInputMobile.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                handleSuggestionSubmit(suggestionInputMobile);
            }
        });
    }
}

// Show suggestion status
function showSuggestionStatus(message, isSuccess) {
    // Try to find the suggestion note near the active textarea
    const activeTextarea = document.activeElement;
    let suggestionNote = null;
    
    if (activeTextarea && activeTextarea.closest('.suggestion-card')) {
        suggestionNote = activeTextarea.closest('.suggestion-card').querySelector('.suggestion-note');
    }
    
    // Fallback to first suggestion note
    if (!suggestionNote) {
        suggestionNote = document.querySelector('.suggestion-note');
    }
    
    if (!suggestionNote) return;
    
    suggestionNote.textContent = message;
    suggestionNote.style.color = isSuccess ? '#27ae60' : '#e74c3c';
    suggestionNote.style.transition = 'all 0.3s ease';
    suggestionNote.style.opacity = '1';
}

// Handle suggestion submission
async function handleSuggestionSubmit(textareaElement) {
    if (!textareaElement) return;
    
    const suggestion = textareaElement.value.trim();
    
    if (!suggestion) {
        showSuggestionStatus('Please enter a suggestion!', false);
        return;
    }
    
    if (suggestion.length < 10) {
        showSuggestionStatus('Please provide more details', false);
        return;
    }
    
    // Find the submit button associated with this textarea
    const submitBtn = textareaElement.closest('.suggestion-form').querySelector('.suggestion-btn');
    
    // Show loading state
    showSuggestionStatus('Sending suggestion...', true);
    const originalButtonText = submitBtn.innerHTML;
    const originalButtonBg = submitBtn.style.background;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
        // Prepare form data for FormSubmit.co
        const formData = new FormData();
        formData.append('_subject', 'New Suggestion for Expiry Date Calculator');
        formData.append('message', `Suggestion: ${suggestion}\n\nPage: ${window.location.href}\nTime: ${new Date().toLocaleString()}`);
        formData.append('_honey', ''); // Honeypot field
        formData.append('_captcha', 'false');
        formData.append('_template', 'table'); // Optional: table or basic
        
        // Submit via fetch API (AJAX)
        const response = await fetch('https://formsubmit.co/ajax/8ef9f53b6febcb9bfb22b917a29c9a58', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        const result = await response.json();
        
        if (result.success === 'true') {
            // Show success toast
            showSuccessToast('Suggestion submitted successfully! Thank you!');
            
            // Show success status
            showSuggestionStatus('Thank you! Suggestion submitted successfully.', true);
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Submitted!';
            submitBtn.style.background = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';
            
            // Clear input
            textareaElement.value = '';
            
            // Clear both textareas if they exist
            if (suggestionInput) suggestionInput.value = '';
            if (suggestionInputMobile) suggestionInputMobile.value = '';
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalButtonText;
                submitBtn.disabled = false;
                submitBtn.style.background = originalButtonBg;
                
                // Reset suggestion note text
                const suggestionNote = textareaElement.closest('.suggestion-card').querySelector('.suggestion-note');
                if (suggestionNote) {
                    suggestionNote.textContent = 'Your ideas help shape future improvements!';
                    suggestionNote.style.color = '#888';
                }
            }, 3000);
        } else {
            throw new Error('Form submission failed');
        }
        
    } catch (error) {
        console.error('Failed to submit suggestion:', error);
        
        // Show error toast
        showErrorToast('Failed to send suggestion. Please try again.');
        
        showSuggestionStatus('Failed to send suggestion. Please try again.', false);
        submitBtn.innerHTML = originalButtonText;
        submitBtn.disabled = false;
        submitBtn.style.background = originalButtonBg;
    }
}

// Toast notification functions
function showSuccessToast(message) {
    showToast(message, 'success');
}

function showErrorToast(message) {
    showToast(message, 'error');
}

function showToast(message, type = 'info') {
    // Remove existing toast if present
    const existingToast = document.getElementById('custom-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.id = 'custom-toast';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 300px;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
        animation-fill-mode: forwards;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    // Add icon based on type
    const icon = type === 'success' ? 'fa-check-circle' : 
                type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    
    toast.innerHTML = `
        <i class="fas ${icon}" style="font-size: 1.2em;"></i>
        <span>${message}</span>
    `;
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
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
        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(toast);
    
    // Remove toast after animation completes
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
        if (style.parentNode) {
            style.remove();
        }
    }, 3000);
}

// Update current date and time
function updateCurrentDateTime() {
    const now = new Date();
    
    // Format date
    const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    currentDateEl.textContent = now.toLocaleDateString('en-CA', dateOptions);
    
    // Format time
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
    };
    currentTimeEl.textContent = now.toLocaleTimeString('en-CA', timeOptions);
}

// Calculate future date
function calculateDate(type) {
    const config = CONFIG[type];
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + config.days);
    
    // Format result
    const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const formattedDate = futureDate.toLocaleDateString('en-CA', dateOptions);
    
    // Update display
    shippingTypeLabel.textContent = config.label;
    shippingTypeLabel.style.color = config.color;
    daysLabel.textContent = `${config.days} days`;
    daysLabel.style.backgroundColor = config.color;
    resultDateEl.textContent = formattedDate;
    resultNoteEl.textContent = config.note;
    
    // Enable copy button
    copyBtn.disabled = false;
    copyBtn.style.backgroundColor = config.color;
    copyStatusEl.textContent = '';
    
    // Visual feedback
    highlightActiveButton(type);
    
    // Store for copy functionality
    resultDateEl.dataset.dateValue = formattedDate;
}

// Reset result display
function resetResultDisplay() {
    shippingTypeLabel.textContent = 'No selection yet';
    shippingTypeLabel.style.color = '#666';
    daysLabel.textContent = '- days';
    daysLabel.style.backgroundColor = '#95a5a6';
    resultDateEl.textContent = 'Please select a shipping type above';
    resultNoteEl.textContent = '';
    copyBtn.disabled = true;
    copyBtn.style.backgroundColor = '#2c3e50';
    
    // Reset button styles
    localBtn.style.opacity = '1';
    provinceBtn.style.opacity = '1';
    localBtn.style.transform = 'scale(1)';
    provinceBtn.style.transform = 'scale(1)';
}

// Highlight active button
function highlightActiveButton(activeType) {
    // Reset both buttons
    localBtn.style.opacity = activeType === 'LOCAL' ? '1' : '0.7';
    provinceBtn.style.opacity = activeType === 'PROVINCE' ? '1' : '0.7';
    
    localBtn.style.transform = activeType === 'LOCAL' ? 'scale(1.05)' : 'scale(1)';
    provinceBtn.style.transform = activeType === 'PROVINCE' ? 'scale(1.05)' : 'scale(1)';
}

// Copy result to clipboard
function copyResultToClipboard() {
    const dateToCopy = resultDateEl.dataset.dateValue;
    
    if (!dateToCopy || dateToCopy === 'Please select a shipping type above') {
        copyStatusEl.textContent = 'No date to copy';
        copyStatusEl.style.color = '#e74c3c';
        return;
    }
    
    navigator.clipboard.writeText(dateToCopy)
        .then(() => {
            copyStatusEl.textContent = 'Date copied to clipboard!';
            copyStatusEl.style.color = '#27ae60';
            
            // Reset status after 3 seconds
            setTimeout(() => {
                copyStatusEl.textContent = '';
            }, 3000);
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            copyStatusEl.textContent = 'Failed to copy';
            copyStatusEl.style.color = '#e74c3c';
        });
}

// Initialize
function init() {
    updateCurrentDateTime();
    setInterval(updateCurrentDateTime, 1000);
    
    // Event Listeners
    localBtn.addEventListener('click', () => calculateDate('LOCAL'));
    provinceBtn.addEventListener('click', () => calculateDate('PROVINCE'));
    copyBtn.addEventListener('click', copyResultToClipboard);
    
    // Initialize suggestion boxes (both desktop and mobile)
    initSuggestionBoxes();
    
    // Initialize with no selection
    resetResultDisplay();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
