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

// NEW: Suggestion elements
const suggestionInput = document.getElementById('suggestionInput');
const submitSuggestionBtn = document.getElementById('submitSuggestion');

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
function initSuggestionBox() {
    if (!submitSuggestionBtn || !suggestionInput) return;
    
    submitSuggestionBtn.addEventListener('click', handleSuggestionSubmit);
    
    // Allow Enter key to submit (with Ctrl/Cmd)
    suggestionInput.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            handleSuggestionSubmit();
        }
    });
}

// Show suggestion status
function showSuggestionStatus(message, isSuccess) {
    const suggestionNote = document.querySelector('.suggestion-note');
    if (!suggestionNote) return;
    
    suggestionNote.textContent = message;
    suggestionNote.style.color = isSuccess ? '#27ae60' : '#e74c3c';
    suggestionNote.style.transition = 'all 0.3s ease';
    suggestionNote.style.opacity = '1';
}

// Handle suggestion submission
// Handle suggestion submission
async function handleSuggestionSubmit() {
    if (!suggestionInput || !submitSuggestionBtn) return;
    
    const suggestion = suggestionInput.value.trim();
    
    if (!suggestion) {
        showSuggestionStatus('Please enter a suggestion!', false);
        return;
    }
    
    if (suggestion.length < 10) {
        showSuggestionStatus('Please provide more details', false);
        return;
    }
    
    // Show loading state
    showSuggestionStatus('Sending suggestion...', true);
    const originalButtonText = submitSuggestionBtn.innerHTML;
    const originalButtonBg = submitSuggestionBtn.style.background;
    submitSuggestionBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitSuggestionBtn.disabled = true;
    
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
            // Show success toast/modal
            showSuccessToast('Suggestion submitted successfully! Thank you!');
            
            // Show success status
            showSuggestionStatus('Thank you! Suggestion submitted successfully.', true);
            submitSuggestionBtn.innerHTML = '<i class="fas fa-check"></i> Submitted!';
            submitSuggestionBtn.style.background = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';
            
            // Clear input
            suggestionInput.value = '';
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitSuggestionBtn.innerHTML = originalButtonText;
                submitSuggestionBtn.disabled = false;
                submitSuggestionBtn.style.background = originalButtonBg;
                const suggestionNote = document.querySelector('.suggestion-note');
                if (suggestionNote) {
                    suggestionNote.textContent = 'Have an idea to improve this tool? Share it!';
                    suggestionNote.style.color = '#666';
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
        submitSuggestionBtn.innerHTML = originalButtonText;
        submitSuggestionBtn.disabled = false;
        submitSuggestionBtn.style.background = originalButtonBg;
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

// Alternative: Simple Modal version (uncomment if you prefer modal over toast)
/*
function showSuccessModal(message) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
    `;
    
    // Create modal content
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 12px;
        text-align: center;
        max-width: 400px;
        width: 90%;
        animation: slideUp 0.3s ease;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    `;
    
    modal.innerHTML = `
        <div style="color: #27ae60; font-size: 48px; margin-bottom: 15px;">
            <i class="fas fa-check-circle"></i>
        </div>
        <h3 style="margin: 0 0 10px 0; color: #2c3e50;">Success!</h3>
        <p style="color: #666; margin-bottom: 20px;">${message}</p>
        <button id="close-modal" style="
            background: #27ae60;
            color: white;
            border: none;
            padding: 10px 30px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: background 0.3s;
        ">
            OK
        </button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from {
                transform: translateY(20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Close modal on button click or overlay click
    const closeModal = () => {
        overlay.remove();
        style.remove();
    };
    
    document.getElementById('close-modal').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    
    // Auto-close after 3 seconds
    setTimeout(closeModal, 3000);
}
*/

// Then replace the success call in handleSuggestionSubmit with:
// showSuccessModal('Suggestion submitted successfully! Thank you!');

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
    
    // Initialize suggestion box
    initSuggestionBox();
    
    // Initialize with no selection
    resetResultDisplay();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
