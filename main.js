document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname.toLowerCase();
    const sidebarItems = document.querySelectorAll(".sidebar-item");

    sidebarItems.forEach(item => {
        const text = item.querySelector("span")?.textContent.trim().toLowerCase();

        item.classList.remove("active");

        if (path.includes("beranda") && text === "beranda") item.classList.add("active");
        if (path.includes("library") && text === "your library") item.classList.add("active");
        if (path.includes("liked_songs") && text === "liked songs") item.classList.add("active");
        if (path.includes("playlist") && text === "playlist") item.classList.add("active");
    });
});

document.addEventListener("keydown", (e) => {
    if (!window.musicPlayer) return;

    if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
    }

    switch (e.code) {
        case "Space":
            window.musicPlayer.playPause();
            break;

        case "ArrowRight":
            window.musicPlayer.next();
            break;

        case "ArrowLeft":
            window.musicPlayer.previous();
            break;
    }
});

document.addEventListener("DOMContentLoaded", () => {
    if (!window.musicPlayer) return;

    const savedVolume = localStorage.getItem("harmonystream-volume");

    if (savedVolume !== null) {
        window.musicPlayer.audio.volume = parseFloat(savedVolume);
    }

    window.musicPlayer.audio.addEventListener("volumechange", () => {
        localStorage.setItem("harmonystream-volume", window.musicPlayer.audio.volume);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    if (!window.musicPlayer) return;

    const lastTrackIndex = localStorage.getItem("harmonystream-lastTrack");
    const lastTime = localStorage.getItem("harmonystream-lastTime");

    if (lastTrackIndex !== null) {
        window.musicPlayer.loadTrack(parseInt(lastTrackIndex));
    }

    if (lastTime !== null) {
        window.musicPlayer.audio.currentTime = parseFloat(lastTime);
    }

    window.musicPlayer.audio.addEventListener("timeupdate", () => {
        localStorage.setItem("harmonystream-lastTrack", window.musicPlayer.currentTrackIndex);
        localStorage.setItem("harmonystream-lastTime", window.musicPlayer.audio.currentTime);
    });
});

function softFadeIn(audio) {
    audio.volume = 0;
    const targetVol = window.musicPlayer ? window.musicPlayer.volume : 0.5;
    const fade = setInterval(() => {
        if (audio.volume < targetVol) {
            audio.volume += 0.02;
        } else {
            clearInterval(fade);
        }
    }, 60);
}

document.addEventListener("DOMContentLoaded", () => {
    if (!window.musicPlayer) return;

    const origPlay = window.musicPlayer.audio.play.bind(window.musicPlayer.audio);

    window.musicPlayer.audio.play = (...args) => {
        softFadeIn(window.musicPlayer.audio);
        return origPlay(...args);
    };
});