import '@divkitframework/divkit/dist/client.css';
import { 
    render, 
    createVariable, 
    createGlobalVariablesController 
} from '@divkitframework/divkit/dist/client';

import homeData from './pages/home.json';
import profileData from './pages/profile.json';
import settingsData from './pages/settings.json';
import variablesData from './pages/variables.json';

const pages = {
    home: homeData,
    profile: profileData,
    settings: settingsData
};

// THE OFFICIAL DIVKIT WAY: Create global variables controller
const globalController = createGlobalVariablesController();

// Create variables from variables.json and add to controller
Object.entries(variablesData).forEach(([name, value]) => {
    const variable = createVariable(name, 'string', value);
    globalController.setVariable(variable);
});

function loadPage(pageName) {
    const jsonToRender = pages[pageName];

    if (!jsonToRender) {
        console.error("Page not found:", pageName);
        return;
    }

    // Clear container
    const container = document.getElementById('app');
    container.innerHTML = '';

    // Render with global variables controller
    // ALL pages can now access the same variables!
    render({
        id: 'divkit-root',
        target: container,
        json: jsonToRender,
        globalVariablesController: globalController,  // ← OFFICIAL DIVKIT WAY!
        
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

// UPDATE VARIABLES - The DivKit Way
function updateGlobalVariable(name, value) {
    const variable = globalController.getVariable(name);
    if (variable) {
        variable.setValue(value);
        console.log(`✅ Updated ${name} to:`, value);
        // All pages automatically see the new value!
    }
}

// EXAMPLE 1: Update user name
function updateUserName(newName) {
    updateGlobalVariable('user_name', newName);
}

// EXAMPLE 2: Fetch from API
async function fetchAndUpdateUserData() {
    try {
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
        
        console.log('Fetched:', response);
        
        updateGlobalVariable('user_name', response.name);
        updateGlobalVariable('user_email', response.email);
        updateGlobalVariable('membership_status', response.status);
        updateGlobalVariable('user_avatar', response.avatar);
        
        console.log('✅ All pages updated!');
        
    } catch (error) {
        console.error('Failed:', error);
    }
}

// EXAMPLE 3: Toggle dark mode
function toggleDarkMode() {
    const variable = globalController.getVariable('dark_mode_status');
    if (variable) {
        const current = variable.getValue();
        const newValue = current === 'Enabled' ? 'Disabled' : 'Enabled';
        variable.setValue(newValue);
        console.log(`Dark mode: ${newValue}`);
    }
}

// EXAMPLE 4: Toggle notifications
function toggleNotifications() {
    const variable = globalController.getVariable('notification_status');
    if (variable) {
        const current = variable.getValue();
        const newValue = current === 'Enabled' ? 'Disabled' : 'Enabled';
        variable.setValue(newValue);
        console.log(`Notifications: ${newValue}`);
    }
}

// Export for testing
window.updateGlobalVariable = updateGlobalVariable;
window.updateUserName = updateUserName;
window.fetchAndUpdateUserData = fetchAndUpdateUserData;
window.toggleDarkMode = toggleDarkMode;
window.toggleNotifications = toggleNotifications;
window.globalController = globalController;

// Start
loadPage('home');

// Demo: Auto-update after 2 seconds
setTimeout(() => {
    console.log('🔄 Updating user name...');
    updateUserName('Jane Smith');
    console.log('✅ Check: name changed on current page!');
    console.log('✅ Navigate to another page - same name will show!');
}, 2000);