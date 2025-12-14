// =======================================
// 検 の文字にランダムモザイク
// =======================================
function createMosaic() {
  const ken = document.getElementById("charKen");
  if (!ken) return;

  const rect = ken.getBoundingClientRect();
  const tileSize = 14;
  const cols = Math.ceil(rect.width / tileSize);
  const rows = Math.ceil(rect.height / tileSize);
  const offsetY = 10;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const tile = document.createElement("div");
      tile.className = "mosaic-tile";
      tile.style.left = `${x * tileSize}px`;
      tile.style.top = `${y * tileSize + offsetY}px`;
      tile.style.animationDelay = `${Math.random() * 0.28}s`;
      ken.appendChild(tile);
    }
  }
}

createMosaic();


// =======================================
// タイトル消失 → 完全除去 → 本文表示
// =======================================
setTimeout(() => {

  const wrapper = document.getElementById("censorTitleWrapper");
  if (!wrapper) return;

  // ① フェードアウト
  wrapper.style.opacity = "0";

  // ② フェード完了後、DOMごと削除（最重要）
  setTimeout(() => {
    wrapper.remove();
  }, 400); // CSSの transition(0.35s)より少し長く

  // ③ 本文を表示
  setTimeout(() => {
    document.querySelectorAll(".fade-target").forEach(el => {
      el.classList.add("show-content");
    });
    document.body.style.overflow = "auto";
  }, 800);

}, 650);
