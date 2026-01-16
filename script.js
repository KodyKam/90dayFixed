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
const suggestionInput = document.getElementById('suggestionInput');
const submitSuggestionBtn = document.getElementById('submitSuggestion');

function initSuggestionBox() {
    submitSuggestionBtn.addEventListener('click', handleSuggestionSubmit);
    
    // Allow Enter key to submit (with Ctrl/Cmd)
    suggestionInput.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            handleSuggestionSubmit();
        }
    });
}

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
    
    // Format the message
    const message = `🎯 *NEW FEATURE SUGGESTION*\n\n${suggestion}\n\n📅 ${new Date().toLocaleString()}\n🌐 ${window.location.href}`;
    
    // Encode for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    
    // Your WhatsApp number (with country code, no + or 0)
    const yourNumber = '6477220548'; // Replace with your actual number
    
    // Create WhatsApp link
    const whatsappLink = `https://wa.me/${6477220548}?text=${encodedMessage}`;
    
    // Open in new tab
    window.open(whatsappLink, '_blank');
    
    // Show success status
    showSuggestionStatus('Thank you! Opening WhatsApp...', true);
    
    // Clear input after a delay
    setTimeout(() => {
        suggestionInput.value = '';
    }, 500);
}
function showSuggestionStatus(message, isSuccess) {
    const suggestionNote = document.querySelector('.suggestion-note');
    
    // Update button to show loading/confirmed state
    if (isSuccess) {
        submitSuggestionBtn.innerHTML = '<i class="fas fa-check"></i> Submitted!';
        submitSuggestionBtn.style.background = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';
        suggestionNote.textContent = message;
        suggestionNote.style.color = '#27ae60';
    } else {
        suggestionNote.textContent = message;
        suggestionNote.style.color = '#e74c3c';
    }
    
    suggestionNote.style.transition = 'all 0.3s ease';
    suggestionNote.style.opacity = '1';
    
    // Disable button temporarily
    submitSuggestionBtn.disabled = true;
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
