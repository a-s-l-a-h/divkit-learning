import '@divkitframework/divkit/dist/client.css';
import { render } from '@divkitframework/divkit/dist/client';

import homeData from './pages/home.json';
import profileData from './pages/profile.json';
import settingsData from './pages/settings.json';

const pages = {
    home: homeData,
    profile: profileData,
    settings: settingsData
};

function loadPage(pageName) {
    const jsonToRender = pages[pageName];

    if (!jsonToRender) {
        console.error("Page not found:", pageName);
        return;
    }

    // IMPORTANT: Clear the container before rendering
    const container = document.getElementById('app');
    container.innerHTML = '';

    render({
        id: 'divkit-root',
        target: container,
        json: jsonToRender,
        
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

loadPage('home');