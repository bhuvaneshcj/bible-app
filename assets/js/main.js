// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Fullscreen toggle
const fullscreenBtn = document.getElementById("fullscreenToggle");
const fullscreenIcon = document.getElementById("fullscreenIcon");

function isFullscreen() {
    return document.fullscreenElement !== null;
}

fullscreenBtn.addEventListener("click", () => {
    if (!isFullscreen()) {
        document.documentElement.requestFullscreen();
        fullscreenIcon.textContent = "❌";
    } else {
        document.exitFullscreen();
        fullscreenIcon.textContent = "⛶";
    }
});

// Sync icon if user exits fullscreen via ESC
document.addEventListener("fullscreenchange", () => {
    fullscreenIcon.textContent = isFullscreen() ? "❌" : "⛶";
});
