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
function handleSuggestionSubmit() {
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
    submitSuggestionBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitSuggestionBtn.disabled = true;
    
    try {
        // Create a hidden form for FormSubmit.co
        const form = document.createElement('form');
        form.style.display = 'none';
        form.method = 'POST';
        form.action = 'https://formsubmit.co/kamara.alleyne@gmail.com';
        
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
        
        // Add reply-to field (optional - user's email if you want them to be able to reply)
        // const replyToField = document.createElement('input');
        // replyToField.type = 'hidden';
        // replyToField.name = '_replyto';
        // replyToField.value = 'user@example.com'; // You could add an email input field
        // form.appendChild(replyToField);
        
        // Add next field for custom thank you page (optional)
        const nextField = document.createElement('input');
        nextField.type = 'hidden';
        nextField.name = '_next';
        nextField.value = window.location.href + '?suggestion=success'; // Stay on same page
        form.appendChild(nextField);
        
        // Add honeypot field (anti-spam)
        const honeypot = document.createElement('input');
        honeypot.type = 'text';
        honeypot.name = '_honey';
        honeypot.style.display = 'none';
        form.appendChild(honeypot);
        
        // Disable captcha (optional)
        const captcha = document.createElement('input');
        captcha.type = 'hidden';
        captcha.name = '_captcha';
        captcha.value = 'false';
        form.appendChild(captcha);
        
        // Append form to body and submit
        document.body.appendChild(form);
        form.submit();
        
        // Show success status immediately (form submission happens in background)
        showSuggestionStatus('Thank you! Suggestion submitted successfully.', true);
        submitSuggestionBtn.innerHTML = '<i class="fas fa-check"></i> Submitted!';
        submitSuggestionBtn.style.background = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';
        
        // Clear input
        suggestionInput.value = '';
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitSuggestionBtn.innerHTML = originalButtonText;
            submitSuggestionBtn.disabled = false;
            submitSuggestionBtn.style.background = '';
            const suggestionNote = document.querySelector('.suggestion-note');
            if (suggestionNote) {
                suggestionNote.textContent = 'Have an idea to improve this tool? Share it!';
                suggestionNote.style.color = '#666';
            }
        }, 3000);
        
        // Remove the form after submission
        setTimeout(() => {
            if (document.body.contains(form)) {
                document.body.removeChild(form);
            }
        }, 1000);
        
    } catch (error) {
        console.error('Failed to submit suggestion:', error);
        showSuggestionStatus('Failed to send suggestion. Please try again.', false);
        submitSuggestionBtn.innerHTML = originalButtonText;
        submitSuggestionBtn.disabled = false;
        submitSuggestionBtn.style.background = '';
    }
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
    
    // Initialize suggestion box
    initSuggestionBox();
    
    // Initialize with no selection
    resetResultDisplay();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
