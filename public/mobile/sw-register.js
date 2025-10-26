// Safe Service Worker registration for FWF
export function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const reg = await navigator.serviceWorker.register('/service-worker.js', { scope: '/' });
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker?.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('FWF app has an update. Refresh to get the latest.');
            }
          });
        });
        console.log('SW registered', reg.scope);
      } catch (err) {
        console.warn('SW registration failed', err);
      }
    });
  }
}