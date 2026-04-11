document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    
    const titleElement = document.getElementById('search-title');
    const subtitleElement = document.getElementById('search-subtitle');
    const noResults = document.getElementById('no-results');
    
    if (!query) {
        titleElement.innerText = "No Search Query Given";
        subtitleElement.innerText = "Please enter a keyword to search.";
        noResults.style.display = 'block';
        return;
    }
    
    titleElement.innerText = `Search: "${query}"`;
    subtitleElement.innerText = `Filtering experiences, education, and games...`;
    
    const qLower = query.toLowerCase();
    
    const items = document.querySelectorAll('.searchable-item');
    let totalFound = 0;
    
    items.forEach(item => {
        const content = item.textContent.toLowerCase();
        
        if (content.includes(qLower)) {
            totalFound++;
            
            // Unhide the element
            item.classList.remove('searchable-item');
            
            // Re-apply staggered fade-up animations
            item.classList.remove('delay-1', 'delay-2', 'delay-3');
            item.classList.add(`delay-${(totalFound % 3) + 1}`);
        } else {
            // Keep it hidden, but we actually don't need to do anything since it already has .searchable-item (display: none)
            // Just ensuring it's not visible
            item.style.display = 'none';
        }
    });
    
    if (totalFound === 0) {
        noResults.style.display = 'block';
        subtitleElement.innerText = `Found 0 results for "${query}".`;
    } else {
        subtitleElement.innerText = `Found ${totalFound} result(s) for "${query}".`;
        
        // Hide the grids if they are empty
        const timeline = document.getElementById('search-results-container');
        const grid = document.getElementById('search-results-grid');
        
        let timelineVisible = 0;
        let gridVisible = 0;
        
        timeline.querySelectorAll('.timeline-item').forEach(el => {
            if (!el.classList.contains('searchable-item') && el.style.display !== 'none') timelineVisible++;
        });
        grid.querySelectorAll('.game-block').forEach(el => {
            if (!el.classList.contains('searchable-item') && el.style.display !== 'none') gridVisible++;
        });
        
        if (timelineVisible === 0) timeline.style.display = 'none';
        if (gridVisible === 0) grid.style.display = 'none';
        
        // Trigger scroll animation check for newly unhidden elements
        if (typeof window.checkFadeElements === 'function') {
            window.checkFadeElements();
        } else {
            // Fallback direct reveal
            document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
        }
        
        // Initialise lightbox click handlers for newly injected timeline images if any
        if (typeof window.initLightbox === 'function') {
            window.initLightbox();
        } else {
            const images = document.querySelectorAll('.clickable-image');
            const modal = document.getElementById('image-modal');
            const modalImg = document.getElementById('modal-img');
            if (images.length > 0 && modal && modalImg) {
                 images.forEach(img => {
                     img.addEventListener('click', function() {
                         modal.style.display = "block";
                         modalImg.src = this.src;
                     });
                });
            }
        }
    }
});
