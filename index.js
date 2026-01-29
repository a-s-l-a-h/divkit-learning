import '@divkitframework/divkit/dist/client.css';
import { 
    render, 
    createVariable, 
    createGlobalVariablesController 
} from '@divkitframework/divkit/dist/client';

// In-memory cache for pages
const pagesCache = new Map();
let variablesData = {};

// THE OFFICIAL DIVKIT WAY: Create global variables controller
const globalController = createGlobalVariablesController();

/**
 * Fetch all pages and variables at once
 */
async function fetchAllData() {
    try {
        console.log('📥 Fetching all pages...');

        // Fetch all pages in parallel
        const [homeRes, profileRes, settingsRes, varsRes] = await Promise.all([
            fetch('/pages/home.json'),
            fetch('/pages/profile.json'),
            fetch('/pages/settings.json'),
            fetch('/pages/variables.json')
        ]);

        // Parse JSON
        const [home, profile, settings, vars] = await Promise.all([
            homeRes.json(),
            profileRes.json(),
            settingsRes.json(),
            varsRes.json()
        ]);

        // Store in memory cache (Map)
        pagesCache.set('home', home);
        pagesCache.set('profile', profile);
        pagesCache.set('settings', settings);
        variablesData = vars;

        console.log(`✅ Loaded ${pagesCache.size} pages into memory`);

        // Initialize global variables
        Object.entries(variablesData).forEach(([name, value]) => {
            const variable = createVariable(name, 'string', value);
            globalController.setVariable(variable);
        });

        console.log(`✅ Initialized ${Object.keys(variablesData).length} variables`);

        return true;
    } catch (error) {
        console.error('❌ Failed to fetch data:', error);
        throw error;
    }
}

/**
 * Load and render a page from memory cache
 */
function loadPage(pageName) {
    const jsonToRender = pagesCache.get(pageName);

    if (!jsonToRender) {
        console.error("Page not found in cache:", pageName);
        return;
    }

    console.log(`📄 Rendering page: ${pageName} (from memory)`);

    // Clear container
    const container = document.getElementById('app');
    container.innerHTML = '';

    // Render with global variables controller
    render({
        id: 'divkit-root',
        target: container,
        json: jsonToRender,
        globalVariablesController: globalController,
        
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
window.loadPage = loadPage;

// ===== INITIALIZE APP =====
(async () => {
    try {
        console.log('🚀 Starting app...');
        
        // Fetch all data at once
        await fetchAllData();
        
        // Load home page from memory
        loadPage('home');
        
        console.log('✅ App ready!');
        
        // Demo: Auto-update after 2 seconds
        setTimeout(() => {
            console.log('🔄 Updating user name...');
            updateUserName('Jane Smith');
            console.log('✅ Check: name changed on current page!');
            console.log('✅ Navigate to another page - same name will show!');
        }, 2000);
        
    } catch (error) {
        console.error('❌ App failed to start:', error);
        
        // Show error to user
        const container = document.getElementById('app');
        container.innerHTML = `
            <div style="padding: 20px; text-align: center; font-family: sans-serif;">
                <h2 style="color: #e74c3c;">⚠️ Failed to Load</h2>
                <p>Unable to load application data.</p>
                <p style="color: #7f8c8d; font-size: 14px;">${error.message}</p>
                <button onclick="location.reload()" style="
                    padding: 10px 20px;
                    background: #3498db;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-top: 10px;
                ">
                    Retry
                </button>
            </div>
        `;
    }
})();