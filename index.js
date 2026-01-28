import '@divkitframework/divkit/dist/client.css';
import { render } from '@divkitframework/divkit/dist/client';

import homeData from './pages/home.json';
import profileData from './pages/profile.json';
import settingsData from './pages/settings.json';
import sharedVariables from './pages/variables.json';

const pages = {
    home: homeData,
    profile: profileData,
    settings: settingsData
};

// THE MAGIC: Convert variables.json to DivKit format
function convertVariablesToDivKitFormat(variablesObj) {
    return Object.entries(variablesObj).map(([name, value]) => ({
        name: name,
        type: typeof value === 'number' ? 'integer' : 
              typeof value === 'boolean' ? 'boolean' : 'string',
        value: value
    }));
}

// THE KEY: Inject shared variables into page JSON
function injectSharedVariables(pageJson, variables) {
    const pageCopy = JSON.parse(JSON.stringify(pageJson));
    
    // Add variables to card level
    pageCopy.card.variables = convertVariablesToDivKitFormat(variables);
    
    return pageCopy;
}

function loadPage(pageName) {
    const pageTemplate = pages[pageName];

    if (!pageTemplate) {
        console.error("Page not found:", pageName);
        return;
    }

    // MAGIC HAPPENS: Inject current shared variables into page
    const pageWithVariables = injectSharedVariables(pageTemplate, sharedVariables);

    // Clear container
    const container = document.getElementById('app');
    container.innerHTML = '';

    // Render with injected variables
    render({
        id: 'divkit-root',
        target: container,
        json: pageWithVariables,
        
        onCustomAction: (action) => {
            try {
                const url = new URL(action.url);
                
                if (url.protocol === 'app:') {
                    if (url.hostname === 'navigate') {
                        const nextPage = url.searchParams.get('page');
                        console.log("Navigating to:", nextPage);
                        loadPage(nextPage);
                    }
                }
            } catch (e) {
                console.error("Error parsing action:", e);
            }
        }
    });
}

// UPDATE SHARED VARIABLES - Changes reflect everywhere!
function updateSharedVariable(variableName, newValue) {
    console.log(`Updating ${variableName} to:`, newValue);
    
    // Update the shared source
    sharedVariables[variableName] = newValue;
    
    // Re-render current page with updated variables
    const currentPage = getCurrentPage();
    if (currentPage) {
        loadPage(currentPage);
    }
}

// Helper to track current page
let currentPageName = 'home';
function getCurrentPage() {
    return currentPageName;
}

// Override loadPage to track current page
const originalLoadPage = loadPage;
loadPage = function(pageName) {
    currentPageName = pageName;
    originalLoadPage(pageName);
};

// EXAMPLE 1: Update user name
function updateUserName(newName) {
    updateSharedVariable('user_name', newName);
}

// EXAMPLE 2: Fetch and update from API
async function fetchAndUpdateUserData() {
    try {
        // Simulate API call
        const response = await new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    name: 'Sarah Johnson',
                    email: 'sarah.j@example.com',
                    status: 'Gold Member',
                    avatar: '👑'
                });
            }, 1000);
        });
        
        console.log('Fetched user data:', response);
        
        // Update all variables
        updateSharedVariable('user_name', response.name);
        updateSharedVariable('user_email', response.email);
        updateSharedVariable('membership_status', response.status);
        updateSharedVariable('user_avatar', response.avatar);
        
        console.log('✅ All pages will now show: ' + response.name);
        
    } catch (error) {
        console.error('Failed to fetch:', error);
    }
}

// EXAMPLE 3: Toggle dark mode
function toggleDarkMode() {
    const current = sharedVariables.dark_mode_status;
    const newValue = current === 'Enabled' ? 'Disabled' : 'Enabled';
    updateSharedVariable('dark_mode_status', newValue);
}

// EXAMPLE 4: Toggle notifications
function toggleNotifications() {
    const current = sharedVariables.notification_status;
    const newValue = current === 'Enabled' ? 'Disabled' : 'Enabled';
    updateSharedVariable('notification_status', newValue);
}

// EXAMPLE 5: Batch update
function updateMultipleVariables(updates) {
    Object.entries(updates).forEach(([key, value]) => {
        sharedVariables[key] = value;
    });
    
    // Re-render once after all updates
    loadPage(getCurrentPage());
}

// Export for console testing
window.updateSharedVariable = updateSharedVariable;
window.updateUserName = updateUserName;
window.fetchAndUpdateUserData = fetchAndUpdateUserData;
window.toggleDarkMode = toggleDarkMode;
window.toggleNotifications = toggleNotifications;
window.updateMultipleVariables = updateMultipleVariables;
window.sharedVariables = sharedVariables; // View current values

// Start app
loadPage('home');

// Auto-demo: Update after 2 seconds
setTimeout(() => {
    console.log('🔄 Updating user name...');
    updateUserName('Jane Smith');
    console.log('✅ Name updated! Switch pages to see it persists everywhere!');
}, 2000);