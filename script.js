// Image Data
const imageData = [
    { src: "images/1.jpg", title: "Mountain Lake", location: "Switzerland", date: "2024", category: "nature", dimensions: "1920 x 1080" },
    { src: "images/2.jpg", title: "Urban Skyline", location: "New York", date: "2024", category: "city", dimensions: "1920 x 1080" },
    { src: "images/3.jpg", title: "Ancient Temple", location: "Thailand", date: "2023", category: "travel", dimensions: "1920 x 1080" },
    { src: "images/4.jpg", title: "Forest Trail", location: "Pacific Northwest", date: "2024", category: "nature", dimensions: "1920 x 1080" },
    { src: "images/5.jpg", title: "Abstract Art", location: "Gallery", date: "2023", category: "art", dimensions: "1920 x 1080" },
    { src: "images/6.jpg", title: "Beach Sunset", location: "Maldives", date: "2024", category: "travel", dimensions: "1920 x 1080" },
    { src: "images/7.jpg", title: "Night Lights", location: "Tokyo", date: "2024", category: "city", dimensions: "1920 x 1080" },
    { src: "images/8.jpg", title: "Desert Dunes", location: "Dubai", date: "2023", category: "nature", dimensions: "1920 x 1080" },
    { src: "images/9.jpg", title: "Starry Night", location: "Cosmos", date: "2024", category: "art", dimensions: "1920 x 1080" }
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
document.addEventListener("DOMContentLoaded", () => {
    animateGalleryItems();
    updateStats();
});

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

// Open Full Image
galleryItems.forEach((item, index) => {
    item.addEventListener("click", (e) => {
        if (!e.target.closest(".item-action-btn")) {
            openFullImg(index);
        }
    });
});

function openFullImg(index) {
    const filteredItems = getFilteredItems();
    currentIndex = filteredItems.findIndex(item => item.dataset.index == index);

    if (currentIndex === -1) currentIndex = 0;

    const data = imageData[index];
    fullImg.src = data.src;
    document.getElementById("img-title").textContent = data.title;
    document.getElementById("img-location").textContent = data.location;
    document.getElementById("img-date").textContent = data.date;
    document.getElementById("img-dimensions").textContent = data.dimensions;

    const favBtn = document.getElementById("detail-fav");
    favBtn.classList.toggle("active", favorites.has(index));
    favBtn.innerHTML = favorites.has(index) ? '<span>♥</span> Remove from Favorites' : '<span>♥</span> Add to Favorites';

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

function getFilteredItems() {
    if (activeFilter === 'all') return galleryItems;
    return Array.from(galleryItems).filter(item => item.dataset.category === activeFilter);
}

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
    favBtn.innerHTML = favorites.has(index) ? '<span>♥</span> Remove from Favorites' : '<span>♥</span> Add to Favorites';

    // Animation
    fullImg.style.animation = 'none';
    setTimeout(() => fullImg.style.animation = 'scaleIn 0.4s ease', 10);
}

// Click outside to close
fullImgBox.addEventListener("click", (e) => {
    if (e.target === fullImgBox || e.target.closest('.close-btn') || e.target.closest('.nav-btn')) {
        if (e.target.closest('.close-btn') || e.target === fullImgBox) {
            closeFullImg();
        }
    }
});

// Favorite functionality
document.querySelectorAll(".favorite").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const item = btn.closest(".gallery-item");
        const index = parseInt(item.dataset.index);

        btn.classList.toggle("active");
        favorites.has(index) ? favorites.delete(index) : favorites.add(index);

        showToast(favorites.has(index) ? "Added to favorites!" : "Removed from favorites");
        updateStats();

        if (fullImgBox.classList.contains("active")) {
            const favBtn = document.getElementById("detail-fav");
            favBtn.classList.toggle("active", favorites.has(index));
            favBtn.innerHTML = favorites.has(index) ? '<span>♥</span> Remove from Favorites' : '<span>♥</span> Add to Favorites';
        }
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
            });
        } else {
            navigator.clipboard.writeText(data.src);
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
        link.download = `${data.title}.jpg`;
        link.click();
        showToast("Download started!");
    });
});

// Slideshow
const slideshowBtn = document.getElementById("slideshow-btn");
const slideshowControls = document.getElementById("slideshowControls");
const playPauseBtn = document.getElementById("playPauseBtn");
const stopBtn = document.getElementById("stopSlideshow");
const timerDisplay = document.getElementById("slideTimer");

slideshowBtn.addEventListener("click", () => {
    if (!isPlaying) {
        startSlideshow();
    } else {
        stopSlideshow();
    }
});

function startSlideshow() {
    isPlaying = true;
    slideshowBtn.textContent = "⏸";
    slideshowControls.classList.add("active");

    if (!fullImgBox.classList.contains("active")) {
        openFullImg(0);
    }

    slideshowInterval = setInterval(() => {
        navigateImage(1);
    }, slideshowSpeed);
}

function stopSlideshow() {
    isPlaying = false;
    slideshowBtn.textContent = "▶";
    clearInterval(slideshowInterval);
    slideshowControls.classList.remove("active");
}

stopBtn.addEventListener("click", stopSlideshow);

document.getElementById("increaseSpeed").addEventListener("click", () => {
    slideshowSpeed = Math.max(1000, slideshowSpeed - 500);
    timerDisplay.textContent = `${slideshowSpeed / 1000}s`;
    if (isPlaying) {
        clearInterval(slideshowInterval);
        slideshowInterval = setInterval(() => navigateImage(1), slideshowSpeed);
    }
});

document.getElementById("decreaseSpeed").addEventListener("click", () => {
    slideshowSpeed = Math.min(10000, slideshowSpeed + 500);
    timerDisplay.textContent = `${slideshowSpeed / 1000}s`;
    if (isPlaying) {
        clearInterval(slideshowInterval);
        slideshowInterval = setInterval(() => navigateImage(1), slideshowSpeed);
    }
});

// Random Image
document.getElementById("random-btn").addEventListener("click", () => {
    const randomIndex = Math.floor(Math.random() * imageData.length);
    openFullImg(randomIndex);
    showToast("Random image!");
});

// Keyboard Navigation
document.addEventListener("keydown", (event) => {
    if (!fullImgBox.classList.contains("active") && !isPlaying) return;

    if (event.key === "ArrowRight") {
        if (isPlaying) {
            navigateImage(1);
        } else if (fullImgBox.classList.contains("active")) {
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
toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    toggleButton.innerText = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
    showToast(document.body.classList.contains("dark-mode") ? "Dark mode on" : "Light mode on");
});

// Update Stats
function updateStats() {
    document.getElementById("image-count").textContent = `${imageData.length} Images`;
    document.getElementById("fav-count").textContent = `${favorites.size} Favorites`;
}

// Toast Notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
}

// Current Year
document.getElementById("currentYear").textContent = new Date().getFullYear();

// Mouse wheel navigation in fullscreen
fullImgBox.addEventListener("wheel", (e) => {
    if (!fullImgBox.classList.contains("active")) return;
    e.preventDefault();
    navigateImage(e.deltaY > 0 ? 1 : -1);
}, { passive: false });

// Image zoom on click
fullImg.addEventListener("click", () => {
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
window.addEventListener("load", () => {
    progressBar.style.width = '0%';
});