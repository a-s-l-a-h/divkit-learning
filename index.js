import '@divkitframework/divkit/dist/client.css';
import { render } from '@divkitframework/divkit/dist/client';
import appData from './pages/app.json';

// Just render once - navigation handled by DivKit states
render({
    id: 'divkit-app',
    target: document.getElementById('app'),
    json: appData
});