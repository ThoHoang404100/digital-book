/*
 * Logic trang public: mobile nav, render danh mục sách nói/podcast/video,
 * bộ lọc chủ đề và tìm kiếm.
 */

/* Motif watermark vẽ trên mỗi bìa sách nói (SVG nét, dùng currentColor) */
const MOTIFS = {
  lighthouse:
    '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M27 27h10l2 26H25z"/><path d="M25 27h14"/><path d="M28 27l1.5-9h5L36 27"/><rect x="28.5" y="10" width="7" height="8" rx="1"/><path d="M32 5v5"/><path d="M39 13l11-4M39 16l12 2M25 15L14 11M25 18l-12 2"/><path d="M18 53h28"/><path d="M12 58h40"/></svg>',
  pages:
    '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M32 18C25 13 15 13 9 15v34c6-2 16-2 23 3 7-5 17-5 23-3V15c-6-2-16-2-23 3z"/><path d="M32 18v37"/><path d="M15 24h10M15 31h10M39 24h10M39 31h10"/></svg>',
  column:
    '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 15h32M14 20h36"/><path d="M23 20v25M32 20v25M41 20v25"/><path d="M18 45h28M14 51h36"/></svg>',
  mic:
    '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="25" y="10" width="14" height="28" rx="7"/><path d="M18 32a14 14 0 0 0 28 0"/><path d="M32 46v8M24 54h16"/></svg>',
  star:
    '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M32 8l6.9 14 15.4 2.2-11.1 10.9 2.6 15.3L32 43.1 18.2 50.4l2.6-15.3L9.7 24.2 25.1 22z"/></svg>',
};

const ICON = {
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
  clock:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  headphones:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/></svg>',
};

function el(html) {
  const div = document.createElement("div");
  div.innerHTML = html.trim();
  return div.firstElementChild;
}

function catLabel(id) {
  const found = CATEGORIES.find((c) => c.id === id);
  return found ? found.label : id;
}

function formatListens(n) {
  if (!n) return "";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + "k";
  return String(n);
}

function renderChips(container, onSelect) {
  container.innerHTML = "";
  CATEGORIES.forEach((cat, index) => {
    const chip = el(
      `<button class="chip${index === 0 ? " is-active" : ""}" data-cat="${cat.id}">${cat.label}</button>`,
    );
    chip.addEventListener("click", () => {
      container
        .querySelectorAll(".chip")
        .forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      onSelect(cat.id);
    });
    container.appendChild(chip);
  });
}

function audiobookCard(item) {
  const c = item.cover || {};
  const card = el(`
    <article class="book-card" data-cat="${item.category}">
      <div
        class="book-cover"
        style="--g1:${c.g1};--g2:${c.g2};--accent:${c.accent}"
        role="button"
        tabindex="0"
        aria-label="Nghe thử ${item.title}"
      >
        <div class="cover-motif">${MOTIFS[c.motif] || ""}</div>
        <div class="cover-head">
          <span class="cover-kicker">Sách nói</span>
          <span class="cover-duration">${ICON.clock}${item.duration}</span>
        </div>
        <div class="cover-title-wrap">
          <h3 class="cover-title">${item.title}</h3>
          ${item.subtitle ? `<p class="cover-subtitle">${item.subtitle}</p>` : ""}
          <span class="cover-rule"></span>
          <span class="cover-narrator">Giọng đọc · ${item.voice}</span>
        </div>
        <span class="cover-eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        <div class="cover-overlay">
          <span class="cover-play">${ICON.play}</span>
        </div>
      </div>
      <div class="book-body">
        <div class="book-meta-row">
          <span class="chip-mini">${catLabel(item.category)}</span>
          <span class="listens">${ICON.headphones}${formatListens(item.listens)}</span>
        </div>
        <p class="book-desc">${item.description}</p>
      </div>
    </article>
  `);

  const cover = card.querySelector(".book-cover");
  const trigger = () => AudioPlayer.play(item, card);
  cover.addEventListener("click", trigger);
  cover.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      trigger();
    }
  });

  return card;
}

function podcastCard(item) {
  const c = item.cover || {};
  const card = el(`
    <article class="book-card is-podcast" data-cat="${item.category}">
      <div
        class="book-cover"
        style="--g1:${c.g1};--g2:${c.g2};--accent:${c.accent}"
        role="button"
        tabindex="0"
        aria-label="Nghe thử ${item.title}"
      >
        <div class="cover-motif">${MOTIFS[c.motif] || ""}</div>
        <div class="cover-head">
          <span class="cover-kicker">Podcast${item.episode ? " · " + item.episode : ""}</span>
          <span class="cover-duration">${ICON.clock}${item.duration}</span>
        </div>
        <div class="cover-wave" aria-hidden="true">
          ${Array.from({ length: 28 }).map(() => "<i></i>").join("")}
        </div>
        <div class="cover-title-wrap">
          <h3 class="cover-title">${item.title}</h3>
        </div>
        <span class="cover-eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        <div class="cover-overlay">
          <span class="cover-play">${ICON.play}</span>
        </div>
      </div>
      <div class="book-body">
        <div class="book-meta-row">
          <span class="chip-mini">${catLabel(item.category)}</span>
          <span class="listens">${ICON.headphones}${formatListens(item.listens)}</span>
        </div>
        <p class="book-desc">${item.description}</p>
      </div>
    </article>
  `);

  const cover = card.querySelector(".book-cover");
  const trigger = () => AudioPlayer.play(item, card);
  cover.addEventListener("click", trigger);
  cover.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      trigger();
    }
  });

  return card;
}

function videoCard(item) {
  const c = item.cover || {};
  return el(`
    <article class="video-card" data-cat="${item.category}">
      <div
        class="video-poster"
        style="--g1:${c.g1};--g2:${c.g2};--accent:${c.accent}"
      >
        <div class="cover-motif">${MOTIFS[c.motif] || ""}</div>
        <div class="video-top">
          <span class="cover-kicker">Video · ${item.kind}</span>
          ${item.status ? `<span class="video-badge">${item.status}</span>` : ""}
        </div>
        <div class="video-play">${ICON.play}</div>
      </div>
      <div class="book-body">
        <div class="book-meta-row">
          <span class="chip-mini">${catLabel(item.category)}</span>
          <span class="video-note">${item.note}</span>
        </div>
        <h3 class="video-title">${item.title}</h3>
      </div>
    </article>
  `);
}

function renderList(container, items, cardFn, activeCat) {
  container.innerHTML = "";
  const filtered = items.filter(
    (i) => activeCat === "all" || i.category === activeCat,
  );

  if (filtered.length === 0) {
    container.appendChild(
      el(
        `<div class="empty-note">Chưa có nội dung cho chủ đề này trong bản demo.</div>`,
      ),
    );
    return;
  }

  filtered.forEach((item) => container.appendChild(cardFn(item)));
}

function setupLibrary() {
  const grid = document.getElementById("library-grid");
  const chips = document.getElementById("library-chips");
  const searchInput = document.getElementById("library-search");
  if (!grid) return;

  let activeCat = "all";
  let query = "";

  function refresh() {
    const q = query.trim().toLowerCase();
    const items = AUDIOBOOKS.filter(
      (i) => !q || i.title.toLowerCase().includes(q),
    );
    renderList(grid, items, audiobookCard, activeCat);
  }

  renderChips(chips, (cat) => {
    activeCat = cat;
    refresh();
  });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      query = e.target.value;
      refresh();
    });
  }

  refresh();
}

function setupPodcasts() {
  const grid = document.getElementById("podcast-grid");
  if (!grid) return;
  renderList(grid, PODCASTS, podcastCard, "all");
}

function setupVideos() {
  const grid = document.getElementById("video-grid");
  if (!grid) return;
  renderList(grid, VIDEOS, videoCard, "all");
}

function setupHeroSearch() {
  const heroInput = document.getElementById("hero-search");
  if (!heroInput) return;

  heroInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const target = document.getElementById("library-search");
    document
      .getElementById("sach-noi")
      .scrollIntoView({ behavior: "smooth" });
    if (target) {
      target.value = heroInput.value;
      target.dispatchEvent(new Event("input"));
    }
  });
}

function setupNav() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("is-open"));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupNav();
  setupLibrary();
  setupPodcasts();
  setupVideos();
  setupHeroSearch();
});
