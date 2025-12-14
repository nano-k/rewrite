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
  const offsetY = 4; // モザイクを少し下にずらす

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

// =======================================
// 初期実行
// =======================================
createMosaic();

// =======================================
// タイトル消失 → 真っ白 → 本文表示
// =======================================
setTimeout(() => {

  const wrapper = document.getElementById("censorTitleWrapper");
  if (!wrapper) return;

  // ① タイトルをフェードアウト
  wrapper.style.opacity = "0";

  // ② フェード完了後、クリックを通す（重要）
  setTimeout(() => {
    wrapper.style.pointerEvents = "none";
  }, 350); // CSSの transition と合わせる

  // ③ 白画面キープ後、本文を表示
  setTimeout(() => {

    document.querySelectorAll(".fade-target").forEach(el => {
      el.classList.add("show-content");
    });

    // スクロール解放
    document.body.style.overflow = "auto";

  }, 800);

}, 650);
