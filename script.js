// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // Image Data - Updated with accurate titles and categories
    const imageData = [
        { src: "images/1.jpg", title: "Golden Sunset", location: "California, USA", date: "2024", category: "nature", dimensions: "1920 x 1080" },
        { src: "images/2.jpg", title: "City Skyline", location: "New York, USA", date: "2024", category: "city", dimensions: "1920 x 1080" },
        { src: "images/3.jpg", title: "Mountain Peak", location: "Swiss Alps", date: "2023", category: "nature", dimensions: "1920 x 1080" },
        { src: "images/4.jpg", title: "Ocean Waves", location: "Hawaii, USA", date: "2024", category: "nature", dimensions: "1920 x 1080" },
        { src: "images/5.jpg", title: "Forest Path", location: "Oregon, USA", date: "2023", category: "nature", dimensions: "1920 x 1080" },
        { src: "images/6.jpg", title: "Desert Dunes", location: "Sahara, Morocco", date: "2024", category: "travel", dimensions: "1920 x 1080" },
        { src: "images/7.jpg", title: "Night City Lights", location: "Tokyo, Japan", date: "2024", category: "city", dimensions: "1920 x 1080" },
        { src: "images/8.jpg", title: "Waterfall", location: "Iceland", date: "2023", category: "nature", dimensions: "1920 x 1080" },
        { src: "images/9.jpg", title: "Northern Lights", location: "Norway", date: "2024", category: "nature", dimensions: "1920 x 1080" }
    ];

    // State
    let currentIndex = 0;
    let favorites = new Set();
    let slideshowInterval = null;
    let slideshowSpeed = 3000;
    let isPlaying = false;
    let activeFilter = 'all';

    // DOM Elements
    const fullImgBox = document.getElementById("fullImgBox");
    const fullImg = document.getElementById("fullImg");
    const galleryItems = document.querySelectorAll(".gallery-item");
    const filterTabs = document.querySelectorAll(".filter-tab");
    const progressBar = document.getElementById("progressBar");
    const toast = document.getElementById("toast");

    // Initialize
    animateGalleryItems();
    updateStats();

    // Gallery Item Animations
    function animateGalleryItems() {
        galleryItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';

            setTimeout(() => {
                item.style.transition = 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Filter Functionality
    filterTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            filterTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            activeFilter = tab.dataset.filter;
            filterGallery();
        });
    });

    function filterGallery() {
        galleryItems.forEach((item, index) => {
            const category = item.dataset.category;

            if (activeFilter === 'all' || category === activeFilter) {
                item.style.display = "block";
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, index * 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = "none";
                }, 300);
            }
        });

        setTimeout(updateStats, 400);
    }

    // Open Full Image - Fix: Add event listener to images specifically
    galleryItems.forEach((item) => {
        const img = item.querySelector('img');
        if (img) {
            img.addEventListener("click", (e) => {
                e.stopPropagation();
                const index = parseInt(item.dataset.index);
                openFullImg(index);
            });
            img.style.cursor = 'pointer';
        }
    });

    // Also handle click on the gallery-item itself (excluding buttons)
    galleryItems.forEach((item) => {
        item.addEventListener("click", (e) => {
            // Allow clicks on the item but not on action buttons
            if (e.target.closest(".item-actions") || e.target.closest(".item-info") || e.target.closest(".category-badge")) {
                // Let the buttons handle their own events
                return;
            }
            const index = parseInt(item.dataset.index);
            openFullImg(index);
        });
    });

    function openFullImg(index) {
        const data = imageData[index];
        fullImg.src = data.src;
        document.getElementById("img-title").textContent = data.title;
        document.getElementById("img-location").textContent = data.location;
        document.getElementById("img-date").textContent = data.date;
        document.getElementById("img-dimensions").textContent = data.dimensions;

        const favBtn = document.getElementById("detail-fav");
        favBtn.classList.toggle("active", favorites.has(index));
        favBtn.innerHTML = favorites.has(index) ? '<span>&#9829;</span> Remove from Favorites' : '<span>&#9829;</span> Add to Favorites';

        fullImgBox.classList.add("active");
        document.body.style.overflow = "hidden";

        // Progress bar animation
        progressBar.style.width = '0%';
        setTimeout(() => progressBar.style.width = '100%', 100);
    }

    function closeFullImg() {
        fullImgBox.classList.remove("active");
        document.body.style.overflow = "auto";
        progressBar.style.width = '0%';
    }

    // Make closeFullImg globally accessible
    window.closeFullImg = closeFullImg;

    function navigateImage(direction) {
        const filteredItems = getFilteredItems();
        currentIndex = (currentIndex + direction + filteredItems.length) % filteredItems.length;

        const item = filteredItems[currentIndex];
        const index = parseInt(item.dataset.index);

        const data = imageData[index];
        fullImg.src = data.src;
        document.getElementById("img-title").textContent = data.title;
        document.getElementById("img-location").textContent = data.location;
        document.getElementById("img-date").textContent = data.date;
        document.getElementById("img-dimensions").textContent = data.dimensions;

        const favBtn = document.getElementById("detail-fav");
        favBtn.classList.toggle("active", favorites.has(index));
        favBtn.innerHTML = favorites.has(index) ? '<span>&#9829;</span> Remove from Favorites' : '<span>&#9829;</span> Add to Favorites';

        // Animation
        fullImg.style.animation = 'none';
        setTimeout(() => fullImg.style.animation = 'scaleIn 0.4s ease', 10);
    }

    // Make navigateImage globally accessible
    window.navigateImage = navigateImage;

    function getFilteredItems() {
        if (activeFilter === 'all') return galleryItems;
        return Array.from(galleryItems).filter(item => item.dataset.category === activeFilter);
    }

    // Click outside to close
    fullImgBox.addEventListener("click", (e) => {
        if (e.target === fullImgBox) {
            closeFullImg();
        }
    });

    // Close button
    document.querySelector('.close-btn').addEventListener('click', closeFullImg);

    // Favorite functionality
    document.querySelectorAll(".favorite").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const item = btn.closest(".gallery-item");
            if (!item) {
                // Detail view favorite button
                const isActive = btn.classList.contains("active");
                const currentImageIndex = parseInt(fullImg.src.match(/\/(\d+)\.jpg/)?.[1] || 1) - 1;
                if (!isActive) {
                    favorites.add(currentImageIndex);
                } else {
                    favorites.delete(currentImageIndex);
                }
                btn.classList.toggle("active");
                btn.innerHTML = btn.classList.contains("active") ? '<span>&#9829;</span> Remove from Favorites' : '<span>&#9829;</span> Add to Favorites';
                updateStats();
                showToast(btn.classList.contains("active") ? "Added to favorites!" : "Removed from favorites");
                return;
            }

            const index = parseInt(item.dataset.index);

            btn.classList.toggle("active");
            favorites.has(index) ? favorites.delete(index) : favorites.add(index);

            showToast(favorites.has(index) ? "Added to favorites!" : "Removed from favorites");
            updateStats();
        });
    });

    // Share functionality
    document.querySelectorAll(".share").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const item = btn.closest(".gallery-item");
            const index = parseInt(item.dataset.index);
            const data = imageData[index];

            if (navigator.share) {
                navigator.share({
                    title: data.title,
                    text: `Check out this image: ${data.title}`,
                    url: data.src
                }).catch(() => {
                    navigator.clipboard.writeText(window.location.origin + '/' + data.src);
                    showToast("Image link copied!");
                });
            } else {
                navigator.clipboard.writeText(window.location.origin + '/' + data.src);
                showToast("Image link copied!");
            }
        });
    });

    // Download functionality
    document.querySelectorAll(".download").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const item = btn.closest(".gallery-item");
            const index = parseInt(item.dataset.index);
            const data = imageData[index];

            const link = document.createElement('a');
            link.href = data.src;
            link.download = data.title + '.jpg';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast("Download started!");
        });
    });

    // Slideshow - Fix: Properly attach event listeners
    const slideshowBtn = document.getElementById("slideshow-btn");
    const slideshowControls = document.getElementById("slideshowControls");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const stopBtn = document.getElementById("stopSlideshow");
    const timerDisplay = document.getElementById("slideTimer");

    function startSlideshow() {
        isPlaying = true;
        slideshowBtn.innerHTML = "&#9208;";
        slideshowControls.classList.add("active");

        if (!fullImgBox.classList.contains("active")) {
            currentIndex = 0;
            const firstItem = getFilteredItems()[0];
            if (firstItem) {
                openFullImg(parseInt(firstItem.dataset.index));
            }
        }

        slideshowInterval = setInterval(() => {
            navigateImage(1);
        }, slideshowSpeed);

        showToast("Slideshow started!");
    }

    function stopSlideshow() {
        isPlaying = false;
        slideshowBtn.innerHTML = "&#9654;";
        clearInterval(slideshowInterval);
        slideshowControls.classList.remove("active");
        showToast("Slideshow stopped!");
    }

    // Slideshow button click
    slideshowBtn.addEventListener("click", function() {
        if (!isPlaying) {
            startSlideshow();
        } else {
            stopSlideshow();
        }
    });

    // Play/Pause button in controls
    playPauseBtn.addEventListener("click", function() {
        if (isPlaying) {
            stopSlideshow();
        } else {
            startSlideshow();
        }
    });

    // Stop button
    stopBtn.addEventListener("click", stopSlideshow);

    // Speed controls
    document.getElementById("increaseSpeed").addEventListener("click", function() {
        slideshowSpeed = Math.max(1000, slideshowSpeed - 500);
        timerDisplay.textContent = (slideshowSpeed / 1000) + 's';
        if (isPlaying) {
            clearInterval(slideshowInterval);
            slideshowInterval = setInterval(() => navigateImage(1), slideshowSpeed);
        }
    });

    document.getElementById("decreaseSpeed").addEventListener("click", function() {
        slideshowSpeed = Math.min(10000, slideshowSpeed + 500);
        timerDisplay.textContent = (slideshowSpeed / 1000) + 's';
        if (isPlaying) {
            clearInterval(slideshowInterval);
            slideshowInterval = setInterval(() => navigateImage(1), slideshowSpeed);
        }
    });

    // Random Image - Fix: Properly attach event listener
    const randomBtn = document.getElementById("random-btn");
    if (randomBtn) {
        randomBtn.addEventListener("click", function() {
            const randomIndex = Math.floor(Math.random() * imageData.length);
            openFullImg(randomIndex);
            showToast("Random image!");
        });
    }

    // Keyboard Navigation
    document.addEventListener("keydown", function(event) {
        if (!fullImgBox.classList.contains("active") && !isPlaying) return;

        if (event.key === "ArrowRight") {
            if (fullImgBox.classList.contains("active")) {
                navigateImage(1);
            }
        } else if (event.key === "ArrowLeft") {
            if (fullImgBox.classList.contains("active")) {
                navigateImage(-1);
            }
        } else if (event.key === "Escape") {
            closeFullImg();
            stopSlideshow();
        } else if (event.key === " " && fullImgBox.classList.contains("active")) {
            event.preventDefault();
            isPlaying ? stopSlideshow() : startSlideshow();
        }
    });

    // Theme Toggle
    const toggleButton = document.getElementById("toggle-theme");
    toggleButton.addEventListener("click", function() {
        document.body.classList.toggle("dark-mode");
        toggleButton.innerText = document.body.classList.contains("dark-mode") ? "&#9728;" : "&#127769;";
        showToast(document.body.classList.contains("dark-mode") ? "Dark mode on" : "Light mode on");
    });

    // Update Stats
    function updateStats() {
        document.getElementById("image-count").textContent = imageData.length + " Images";
        document.getElementById("fav-count").textContent = favorites.size + " Favorites";
    }

    // Toast Notification
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add("show");
        setTimeout(function() {
            toast.classList.remove("show");
        }, 2500);
    }

    // Current Year
    document.getElementById("currentYear").textContent = new Date().getFullYear();

    // Mouse wheel navigation in fullscreen
    fullImgBox.addEventListener("wheel", function(e) {
        if (!fullImgBox.classList.contains("active")) return;
        e.preventDefault();
        navigateImage(e.deltaY > 0 ? 1 : -1);
    }, { passive: false });

    // Image zoom on click
    fullImg.addEventListener("click", function() {
        fullImg.classList.toggle("zoomed");
        if (fullImg.classList.contains("zoomed")) {
            fullImg.style.transform = "scale(1.5)";
            fullImg.style.cursor = "zoom-out";
        } else {
            fullImg.style.transform = "scale(1)";
            fullImg.style.cursor = "zoom-in";
        }
    });

    // Page load animation
    window.addEventListener("load", function() {
        progressBar.style.width = '0%';
    });
});