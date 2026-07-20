/*
 * Router + trang chi tiết (SPA bằng hash route) cho Sách nói / Podcast.
 *
 * Route dạng:  #/sach/<id>      -> chi tiết audiobook
 *              #/podcast/<id>   -> chi tiết podcast
 * Mọi hash khác (rỗng, #trang-chu, #sach-noi, ...) đều coi là "trang chủ".
 *
 * Dùng lại các global từ data.js + public.js:
 *   AUDIOBOOKS, PODCASTS, CATEGORIES, el, MOTIFS, ICON, catLabel, formatListens
 * và AudioPlayer từ player.js.
 */

const ROUTE_POOLS = {
  sach: { list: () => AUDIOBOOKS, kicker: "Sách nói", crumb: "Sách nói", anchor: "#sach-noi" },
  podcast: { list: () => PODCASTS, kicker: "Podcast", crumb: "Podcast", anchor: "#podcast" },
};

const ICON_BACK =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="18" height="18"><path d="M15 6l-6 6 6 6"/></svg>';

const BASE_TITLE = document.title;

/* Suy ra "kind" (sach/podcast) từ một item bất kỳ trong pool liên quan */
function kindOf(item) {
  return PODCASTS.includes(item) ? "podcast" : "sach";
}

/* ----------------------------------------------------------------
   Router
   ---------------------------------------------------------------- */

function parseHash() {
  const h = location.hash || "";
  if (!h.startsWith("#/")) return null;

  const parts = h.slice(2).split("/").filter(Boolean);
  if (parts.length < 2) return null;

  return { kind: parts[0], id: decodeURIComponent(parts[1]) };
}

function route() {
  const viewHome = document.getElementById("view-home");
  const viewDetail = document.getElementById("view-detail");
  if (!viewHome || !viewDetail) return;

  const parsed = parseHash();

  if (parsed && ROUTE_POOLS[parsed.kind]) {
    const item = ROUTE_POOLS[parsed.kind].list().find((i) => i.id === parsed.id);
    if (item) {
      showDetail(parsed.kind, item, viewHome, viewDetail);
      return;
    }
  }

  showHome(viewHome, viewDetail);
}

function showDetail(kind, item, viewHome, viewDetail) {
  viewDetail.innerHTML = "";
  viewDetail.appendChild(renderDetail(kind, item));
  viewDetail.hidden = false;
  viewHome.hidden = true;

  document.title = `${item.title} | ${BASE_TITLE}`;
  window.scrollTo({ top: 0, behavior: "auto" });

  const heading = viewDetail.querySelector(".detail-title");
  if (heading) {
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }
}

function showHome(viewHome, viewDetail) {
  viewDetail.hidden = true;
  viewDetail.innerHTML = "";
  viewHome.hidden = false;
  document.title = BASE_TITLE;

  // Nếu là anchor trong trang (vd #sach-noi) thì cuộn tới đúng mục.
  const h = location.hash;
  if (h && !h.startsWith("#/") && h.length > 1) {
    const target = document.getElementById(h.slice(1));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  }
}

/* ----------------------------------------------------------------
   Render trang chi tiết
   ---------------------------------------------------------------- */

function detailStats(item) {
  const stats = [];
  if (item.duration) stats.push({ v: item.duration, l: "Thời lượng" });
  if (item.voice) stats.push({ v: item.voice, l: "Giọng đọc" });
  if (item.type) stats.push({ v: item.type, l: "Thể loại" });
  else if (item.episode) stats.push({ v: item.episode, l: "Số phát" });
  if (item.listens) stats.push({ v: formatListens(item.listens), l: "Lượt nghe" });

  return stats
    .map(
      (s) => `
      <div class="detail-stat">
        <span class="ds-value">${s.v}</span>
        <span class="ds-label">${s.l}</span>
      </div>`,
    )
    .join("");
}

/* Bìa lớn ở hero — dùng lại hệ .book-card/.book-cover */
function detailCoverMarkup(kind, item) {
  const c = item.cover || {};
  const podcast = kind === "podcast";

  const midBlock = podcast
    ? `<div class="cover-wave" aria-hidden="true">${Array.from({ length: 28 })
        .map(() => "<i></i>")
        .join("")}</div>`
    : "";

  const narrator = item.voice
    ? `<span class="cover-narrator">Giọng đọc · ${item.voice}</span>`
    : "";

  return `
    <article class="book-card${podcast ? " is-podcast" : ""} is-detail-cover">
      <div
        class="book-cover"
        style="--g1:${c.g1};--g2:${c.g2};--accent:${c.accent}"
        role="button"
        tabindex="0"
        aria-label="Phát ${item.title}"
      >
        <div class="cover-motif">${MOTIFS[c.motif] || ""}</div>
        <div class="cover-head">
          <span class="cover-kicker">${ROUTE_POOLS[kind].kicker}${
            item.episode ? " · " + item.episode : ""
          }</span>
          <span class="cover-duration">${ICON.clock}${item.duration || ""}</span>
        </div>
        ${midBlock}
        <div class="cover-title-wrap">
          <h3 class="cover-title">${item.title}</h3>
          ${item.subtitle ? `<p class="cover-subtitle">${item.subtitle}</p>` : ""}
          <span class="cover-rule"></span>
          ${narrator}
        </div>
        <span class="cover-eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        <div class="cover-overlay">
          <span class="cover-play">${ICON.play}</span>
        </div>
      </div>
    </article>`;
}

/* Danh sách audio liên quan: gộp cả sách nói + podcast, ưu tiên cùng chủ đề */
function relatedFor(item, limit = 5) {
  const pool = [...AUDIOBOOKS, ...PODCASTS].filter((x) => x.id !== item.id);
  const sameCat = pool.filter((x) => x.category === item.category);
  const others = pool.filter((x) => x.category !== item.category);
  return [...sameCat, ...others].slice(0, limit);
}

function relatedItemMarkup(rel) {
  const c = rel.cover || {};
  const kind = kindOf(rel);
  const meta = [rel.duration, rel.voice].filter(Boolean).join(" · ");

  return `
    <a class="related-item" href="#/${kind}/${rel.id}" data-id="${rel.id}" data-kind="${kind}">
      <span class="related-cover" style="--g1:${c.g1};--g2:${c.g2};--accent:${c.accent}">
        <span class="related-motif">${MOTIFS[c.motif] || ""}</span>
      </span>
      <span class="related-info">
        <span class="related-kicker">${ROUTE_POOLS[kind].kicker}</span>
        <span class="related-title">${rel.title}</span>
        ${meta ? `<span class="related-meta">${ICON.clock}${meta}</span>` : ""}
      </span>
      <button class="related-play" type="button" aria-label="Phát ${rel.title}">${ICON.play}</button>
    </a>`;
}

function renderDetail(kind, item) {
  const related = relatedFor(item);
  const subtitle = item.subtitle
    ? `<p class="detail-subtitle">${item.subtitle}</p>`
    : "";

  const root = el(`
    <div class="detail-view">
      <!-- Hero -->
      <section class="detail-hero">
        <div class="container">
          <nav class="breadcrumb" aria-label="Breadcrumb">
            <a href="#trang-chu">Trang chủ</a>
            <span class="sep">›</span>
            <a href="${ROUTE_POOLS[kind].anchor}">${ROUTE_POOLS[kind].crumb}</a>
            <span class="sep">›</span>
            <span class="current">${item.title}</span>
          </nav>

          <div class="detail-hero-grid">
            <div class="detail-cover">
              ${detailCoverMarkup(kind, item)}
            </div>

            <div class="detail-info">
              <span class="eyebrow">${catLabel(item.category)}</span>
              <h1 class="detail-title">${item.title}</h1>
              ${subtitle}

              <div class="detail-stats">
                ${detailStats(item)}
              </div>

              <p class="detail-desc">${item.description || ""}</p>

              <div class="detail-actions">
                <button class="btn btn-primary" type="button" data-role="play">
                  ${ICON.play}<span>Nghe ngay</span>
                </button>
                <a class="btn btn-ghost" href="${ROUTE_POOLS[kind].anchor}">
                  ${ICON_BACK}<span>Về thư viện</span>
                </a>
              </div>

              <div class="detail-tags">
                <span class="chip-mini">${catLabel(item.category)}</span>
                ${item.type ? `<span class="chip-mini">${item.type}</span>` : ""}
                ${item.episode ? `<span class="chip-mini">${item.episode}</span>` : ""}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Nội dung + liên quan -->
      <section class="detail-body section-alt">
        <div class="container detail-body-grid">
          <div class="detail-main">
            <div class="section-head">
              <span class="eyebrow">Về tài liệu này</span>
              <h2 class="section-title">Giới thiệu</h2>
            </div>
            <p class="detail-longtext">${item.description || ""}</p>
            <div class="detail-note">
              <strong>Sản xuất bằng AI:</strong> bản audio này được tạo tự động từ
              tài liệu gốc qua quy trình đọc toàn văn — tách trang, chuyển PDF sang
              văn bản, chuẩn hoá tiếng Việt bằng LLM và tổng hợp giọng đọc. Nội dung
              chỉ mang tính minh hoạ trong bản demo.
            </div>
          </div>

          <aside class="detail-aside">
            <div class="section-head">
              <span class="eyebrow">Nghe tiếp</span>
              <h3 class="section-title aside-title">Audio liên quan</h3>
            </div>
            <div class="related-list">
              ${related.map(relatedItemMarkup).join("")}
            </div>
          </aside>
        </div>
      </section>
    </div>
  `);

  // Phát tại chỗ: nút "Nghe ngay" + bìa lớn -> highlight thẻ bìa hero.
  const heroCard = root.querySelector(".detail-cover .book-card");
  const heroCover = root.querySelector(".detail-cover .book-cover");
  const playHere = () => AudioPlayer.play(item, heroCard);

  root.querySelector('[data-role="play"]').addEventListener("click", playHere);
  heroCover.addEventListener("click", playHere);
  heroCover.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      playHere();
    }
  });

  // Mỗi mục liên quan: nút play nhỏ -> phát ngay (không điều hướng);
  // click phần còn lại -> đổi hash (thẻ <a>) -> router mở trang chi tiết mới.
  root.querySelectorAll(".related-item").forEach((rowEl) => {
    const rel = related.find((r) => r.id === rowEl.dataset.id);
    const btn = rowEl.querySelector(".related-play");
    if (rel && btn) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        AudioPlayer.play(rel, null);
      });
    }
  });

  return root;
}

/* ----------------------------------------------------------------
   Khởi động
   ---------------------------------------------------------------- */
window.addEventListener("hashchange", route);
document.addEventListener("DOMContentLoaded", route);
