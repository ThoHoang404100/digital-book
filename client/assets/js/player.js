/*
 * Thanh phát audio cố định, dùng chung cho mọi mục nghe thử
 * (Sách nói, Podcast). Chỉ 1 phiên phát tại một thời điểm.
 */

const AudioPlayer = (() => {
  let audioEl = null;
  let barEl = null;
  let titleEl = null;
  let subtitleEl = null;
  let playBtn = null;
  let seekEl = null;
  let currentTimeEl = null;
  let durationEl = null;
  let activeCardEl = null;
  let currentId = null;

  function formatTime(seconds) {
    if (!isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  }

  function setPlayIcon(isPlaying) {
    playBtn.innerHTML = isPlaying
      ? '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M8 5v14l11-7z"/></svg>';
  }

  function init() {
    audioEl = document.getElementById("player-audio");
    barEl = document.getElementById("player-bar");
    titleEl = document.getElementById("player-title");
    subtitleEl = document.getElementById("player-subtitle");
    playBtn = document.getElementById("player-play");
    seekEl = document.getElementById("player-seek");
    currentTimeEl = document.getElementById("player-current");
    durationEl = document.getElementById("player-duration");

    if (!audioEl) return;

    playBtn.addEventListener("click", togglePlay);

    seekEl.addEventListener("input", () => {
      if (!audioEl.duration) return;
      audioEl.currentTime = (seekEl.value / 100) * audioEl.duration;
    });

    audioEl.addEventListener("timeupdate", () => {
      if (!audioEl.duration) return;
      seekEl.value = (audioEl.currentTime / audioEl.duration) * 100;
      currentTimeEl.textContent = formatTime(audioEl.currentTime);
    });

    audioEl.addEventListener("loadedmetadata", () => {
      durationEl.textContent = formatTime(audioEl.duration);
    });

    audioEl.addEventListener("play", () => setPlayIcon(true));
    audioEl.addEventListener("pause", () => setPlayIcon(false));

    audioEl.addEventListener("ended", () => {
      setPlayIcon(false);
      seekEl.value = 0;
    });

    document.getElementById("player-close").addEventListener("click", close);
  }

  function togglePlay() {
    if (!audioEl.src) return;
    if (audioEl.paused) {
      audioEl.play();
    } else {
      audioEl.pause();
    }
  }

  function markCard(cardEl) {
    if (activeCardEl && activeCardEl !== cardEl) {
      activeCardEl.classList.remove("is-playing");
    }
    activeCardEl = cardEl || null;
    if (activeCardEl) {
      activeCardEl.classList.add("is-playing");
    }
  }

  function play(item, cardEl) {
    if (!audioEl) return;

    if (currentId === item.id) {
      togglePlay();
      return;
    }

    currentId = item.id;
    audioEl.src = item.src;
    titleEl.textContent = item.title;
    subtitleEl.textContent = item.voice
      ? `Giọng đọc: ${item.voice}`
      : "Đang phát";

    barEl.classList.add("is-active");
    markCard(cardEl);

    audioEl.play().catch(() => {
      /* autoplay có thể bị chặn, chờ tương tác người dùng */
    });
  }

  function close() {
    if (!audioEl) return;
    audioEl.pause();
    audioEl.removeAttribute("src");
    audioEl.load();
    currentId = null;
    barEl.classList.remove("is-active");
    markCard(null);
  }

  return { init, play };
})();

document.addEventListener("DOMContentLoaded", () => AudioPlayer.init());
