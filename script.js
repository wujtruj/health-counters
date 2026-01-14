// Health Counters JavaScript
// Handles counter calculations, language switching, and dynamic content updates

// Configuration - These will be replaced by server-side templating
const CONFIG = {
    personName: '{{PERSON_NAME}}',
    healthyStartDate: '{{HEALTHY_START_DATE}}',
    doctorStartDate: '{{DOCTOR_START_DATE}}',
    currentYear: '{{CURRENT_YEAR}}'
};

// Language definitions
const LANGUAGES = {
    en: {
        code: 'en',
        name: 'English',
        flag: '🇺🇸'
    },
    pl: {
        code: 'pl',
        name: 'Polski',
        flag: '🇵🇱'
    }
};

// Current language state
let currentLanguage = 'en';

// DOM elements
const elements = {
    healthyCounter: null,
    doctorCounter: null,
    langToggle: null,
    langFlag: null,
    langText: null
};

/**
 * Initialize the dashboard when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    detectBrowserLanguage();
    updateCounters();
    setupLanguageToggle();
    setupPeriodicUpdates();
    
    console.log('Health Counters initialized successfully');
});

/**
 * Initialize DOM element references
 */
function initializeElements() {
    elements.healthyCounter = document.getElementById('healthy-counter');
    elements.doctorCounter = document.getElementById('doctor-counter');
    elements.langToggle = document.getElementById('lang-toggle');
    elements.langFlag = elements.langToggle.querySelector('.lang-flag');
    elements.langText = elements.langToggle.querySelector('.lang-text');
}

/**
 * Detect user's browser language and set default
 */
function detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.toLowerCase().startsWith('pl') ? 'pl' : 'en';
    
    currentLanguage = langCode;
    updateLanguageDisplay();
    console.log(`Detected browser language: ${browserLang}, using: ${currentLanguage}`);
}

/**
 * Calculate days between two dates
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {Date} endDate - End date (default: today)
 * @returns {number} Number of days
 */
function calculateDaysDifference(startDate, endDate = new Date()) {
    try {
        const start = new Date(startDate + 'T00:00:00');
        const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
        
        if (isNaN(start.getTime())) {
            console.error(`Invalid start date: ${startDate}`);
            return 0;
        }
        
        const diffTime = end - start;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        return Math.max(0, diffDays);
    } catch (error) {
        console.error('Error calculating date difference:', error);
        return 0;
    }
}

/**
 * Update counter values with animation
 */
function updateCounters() {
    const now = new Date();
    
    // Calculate days since healthy
    const healthyDays = calculateDaysDifference(CONFIG.healthyStartDate, now);
    updateCounterValue(elements.healthyCounter, healthyDays);
    
    // Calculate days since doctor visit
    const doctorDays = calculateDaysDifference(CONFIG.doctorStartDate, now);
    updateCounterValue(elements.doctorCounter, doctorDays);
    
    console.log(`Counters updated - Healthy: ${healthyDays} days, Doctor: ${doctorDays} days`);
}

/**
 * Update individual counter with animation
 * @param {HTMLElement} element - Counter element
 * @param {number} value - New counter value
 */
function updateCounterValue(element, value) {
    if (!element) return;
    
    const currentValue = parseInt(element.textContent) || 0;
    
    if (currentValue !== value) {
        element.classList.add('counter-update');
        element.textContent = value.toLocaleString();
        
        setTimeout(() => {
            element.classList.remove('counter-update');
        }, 600);
    }
}

/**
 * Setup language toggle functionality
 */
function setupLanguageToggle() {
    if (elements.langToggle) {
        elements.langToggle.addEventListener('click', toggleLanguage);
    }
}

/**
 * Toggle between English and Spanish
 */
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'pl' : 'en';
    updateLanguageDisplay();
    console.log(`Language switched to: ${currentLanguage}`);
}

/**
 * Update language display and all translatable content
 */
function updateLanguageDisplay() {
    // Update language toggle button
    const nextLang = currentLanguage === 'en' ? 'pl' : 'en';
    if (elements.langFlag) {
        elements.langFlag.textContent = LANGUAGES[nextLang].flag;
    }
    if (elements.langText) {
        elements.langText.textContent = LANGUAGES[nextLang].name;
    }
    
    // Update all elements with data attributes
    const translatableElements = document.querySelectorAll(`[data-${currentLanguage}]`);
    translatableElements.forEach(element => {
        const translation = element.getAttribute(`data-${currentLanguage}`);
        if (translation) {
            element.textContent = translation;
        }
    });
    
    // Update page title
    const titleElement = document.querySelector('title');
    if (titleElement) {
        const titleTranslation = titleElement.getAttribute(`data-${currentLanguage}`);
        if (titleTranslation) {
            document.title = titleTranslation;
        }
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLanguage;
}

/**
 * Setup periodic updates (every minute)
 */
function setupPeriodicUpdates() {
    // Update counters every minute
    setInterval(updateCounters, 60000);
    
    // Update at midnight to ensure daily accuracy
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    setTimeout(() => {
        updateCounters();
        // Then update every 24 hours
        setInterval(updateCounters, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);
    
    console.log(`Next midnight update in ${Math.round(msUntilMidnight / 1000 / 60)} minutes`);
}

/**
 * Format date for display
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    try {
        const date = new Date(dateString + 'T00:00:00');
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        };
        
        return date.toLocaleDateString(
            currentLanguage === 'pl' ? 'pl-PL' : 'en-US', 
            options
        );
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

// Error handling for uncaught errors
window.addEventListener('error', function(event) {
    console.error('Dashboard error:', event.error);
});

// Handle visibility change to update counters when page becomes visible
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        updateCounters();
        console.log('Page became visible, updating counters');
    }
});