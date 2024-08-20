document.addEventListener("DOMContentLoaded", function() {
    const thumbnailLinks = document.querySelectorAll('.transition-thumbnail');
    const portfolioItems = document.querySelectorAll('.portfolio_item');
    const header = document.querySelector('.box-header'); // Select the header

    thumbnailLinks.forEach((thumbnailLink, index) => {
        const transitionImage = thumbnailLink.querySelector('.transition-image');
        const portfolioItemHover = thumbnailLink.querySelector('.portfolio_item_hover');
        let originalPosition, nextPageContent;

        if (thumbnailLink && portfolioItemHover && transitionImage) {
            thumbnailLink.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent immediate navigation

                // Hide the header
                header.style.display = 'none';

                // Set the z-index of the clicked thumbnail to 2
                thumbnailLink.style.zIndex = 2;

                // Apply the reverse hover animation to all portfolio items
                portfolioItems.forEach(item => item.classList.add('clicked'));

                // Wait for the transition to complete
                setTimeout(function() {
                    // Capture the original position and size
                    originalPosition = transitionImage.getBoundingClientRect();

                    // Add the expanding class to start the transition
                    thumbnailLink.classList.add('expanding');

                    // Set initial position and size for the image
                    setCoverPosition(transitionImage, originalPosition);

                    // Animate to full screen
                    scaleCoverToFillWindow(transitionImage, originalPosition);

                    // Preload the next page while the animation is happening
                    preloadNextPage(thumbnailLink.getAttribute('href'));

                    // Navigate to the next page after the zoom animation completes
                    transitionImage.addEventListener('transitionend', function() {
                        window.scrollTo(0, 0); // Force scroll to the top before navigating
                        if (nextPageContent) {
                            // Replace the content with the preloaded page
                            document.body.innerHTML = nextPageContent;
                        }
                        // Navigate to the next page
                        window.location.href = thumbnailLink.getAttribute('href');
                    }, { once: true });
                }, 400); // Adjusted timeout to ensure the unhover effect completes
            });
        }
    });

    function setCoverPosition(transitionImage, position) {
        transitionImage.style.position = 'fixed';
        transitionImage.style.left = position.left + 'px';
        transitionImage.style.top = position.top + 'px';
        transitionImage.style.width = position.width + 'px';
        transitionImage.style.height = position.height + 'px';
    }

    function scaleCoverToFillWindow(transitionImage, position) {
        const scaleX = window.innerWidth / position.width;
        const scaleY = window.innerHeight / position.height;
        const offsetX = (window.innerWidth / 2 - position.width / 2 - position.left) / scaleX;
        const offsetY = (window.innerHeight / 2 - position.height / 2 - position.top) / scaleY;

        transitionImage.style.transform = `scaleX(${scaleX}) scaleY(${scaleY}) translate3d(${offsetX}px, ${offsetY}px, 0px)`;
        transitionImage.style.transition = 'transform 500ms ease-in-out';
    }

    function preloadNextPage(url) {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                // Extract the content of the next page's <body> tag
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                nextPageContent = doc.body.innerHTML;
            })
            .catch(error => {
                console.error('Error preloading next page:', error);
                nextPageContent = null;
            });
    }

    // Add click event listener to elements with the `.squareimage` class
    const squareimages = document.querySelectorAll('.squareimage');
    squareimages.forEach(squareimage => {
        squareimage.addEventListener('click', function() {
            this.classList.toggle('expanding'); // Toggle expanding class on click
        });
    });
});
