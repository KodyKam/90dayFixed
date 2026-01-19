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

// Initialize
function init() {
    updateCurrentDateTime();
    setInterval(updateCurrentDateTime, 1000);
    
    // Event Listeners
    localBtn.addEventListener('click', () => calculateDate('LOCAL'));
    provinceBtn.addEventListener('click', () => calculateDate('PROVINCE'));
    copyBtn.addEventListener('click', copyResultToClipboard);
    
    // Initialize with no selection
    resetResultDisplay();
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

// NEW: Feature Suggestion Functionality
function handleSuggestionSubmit() {
    const suggestion = suggestionInput.value.trim();
    
    if (!suggestion) {
        showSuggestionStatus('Please enter a suggestion!', false);
        return;
    }
    
    if (suggestion.length < 10) {
        showSuggestionStatus('Please provide more details', false);
        return;
    }
    
    // Create a hidden form
    const form = document.createElement('form');
    form.style.display = 'none';
    form.method = 'POST';
    form.action = 'https://formsubmit.co/kamara.alleyne@gmail.com'; // Replace with your email
    form.target = '_blank';
    
    // Add subject field
    const subjectField = document.createElement('input');
    subjectField.type = 'hidden';
    subjectField.name = '_subject';
    subjectField.value = 'New Suggestion for Expiry Date Calculator';
    form.appendChild(subjectField);
    
    // Add message field
    const messageField = document.createElement('input');
    messageField.type = 'hidden';
    messageField.name = 'message';
    messageField.value = `Suggestion: ${suggestion}\n\nPage: ${window.location.href}\nTime: ${new Date().toLocaleString()}`;
    form.appendChild(messageField);
    
    // Add honeypot field (optional anti-spam)
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = '_honey';
    honeypot.style.display = 'none';
    form.appendChild(honeypot);
    
    // Add disable captcha field (optional)
    const captcha = document.createElement('input');
    captcha.type = 'hidden';
    captcha.name = '_captcha';
    captcha.value = 'false';
    form.appendChild(captcha);
    
    // Append form to body and submit
    document.body.appendChild(form);
    form.submit();
    
    // Show success status
    showSuggestionStatus('Thank you! Suggestion submitted.', true);
    submitSuggestionBtn.innerHTML = '<i class="fas fa-check"></i> Submitted!';
    submitSuggestionBtn.style.background = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';
    
    // Clear input after a delay
    setTimeout(() => {
        suggestionInput.value = '';
        // Remove the form
        document.body.removeChild(form);
    }, 500);
}

// Update the init function to include suggestion box
function init() {
    updateCurrentDateTime();
    setInterval(updateCurrentDateTime, 1000);
    
    // Event Listeners
    localBtn.addEventListener('click', () => calculateDate('LOCAL'));
    provinceBtn.addEventListener('click', () => calculateDate('PROVINCE'));
    copyBtn.addEventListener('click', copyResultToClipboard);
    
    // NEW: Initialize suggestion box
    initSuggestionBox();
    
    // Initialize with no selection
    resetResultDisplay();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
