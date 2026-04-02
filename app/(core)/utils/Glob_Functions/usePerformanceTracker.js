import { useEffect } from 'react';

export default function usePerformanceTracker({ onComplete } = {}) {
    useEffect(() => {
        const startTime = performance.now();

        const onLoad = () => {
            const pageLoadTime = performance.now() - startTime;

            const images = Array.from(document.images);
            let loadedCount = 0;
            const imageStartTime = performance.now();

            if (images.length === 0) {
                const imageLoadTime = 0;
                logResults(pageLoadTime, imageLoadTime);
                return;
            }

            const checkIfAllImagesLoaded = () => {
                loadedCount++;
                if (loadedCount === images.length) {
                    const imageLoadTime = performance.now() - imageStartTime;
                    logResults(pageLoadTime, imageLoadTime);
                }
            };

            images.forEach((img) => {
                if (img.complete && img.naturalHeight !== 0) {
                    checkIfAllImagesLoaded();
                } else {
                    img.addEventListener('load', checkIfAllImagesLoaded);
                    img.addEventListener('error', checkIfAllImagesLoaded);
                }
            });
        };

        if (document.readyState === 'complete') {
            // Page already loaded
            onLoad();
        } else {
            // Wait for it to load
            window.addEventListener('load', onLoad);
            // Clean up
            return () => window.removeEventListener('load', onLoad);
        }

        function logResults(pageLoadTime, imageLoadTime) {
            const totalTime = pageLoadTime + imageLoadTime;
            if (onComplete && typeof onComplete === 'function') {
                onComplete({
                    pageLoadTime,
                    imageLoadTime,
                    totalTime,
                });
            }
        }
    }, [onComplete]);
}
