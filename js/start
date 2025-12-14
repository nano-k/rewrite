// =======================================
// 検 の文字にランダムモザイク
// =======================================
function createMosaic() {
  const ken = document.getElementById("charKen");
  const rect = ken.getBoundingClientRect();

  const tileSize = 14;
  const cols = Math.ceil(rect.width / tileSize);
  const rows = Math.ceil(rect.height / tileSize);
  const offsetY = 4;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const tile = document.createElement("div");
      tile.classList.add("mosaic-tile");

      tile.style.left = `${x * tileSize}px`;
      tile.style.top = `${y * tileSize + offsetY}px`;
      tile.style.animationDelay = `${Math.random() * 0.28}s`;

      ken.appendChild(tile);
    }
  }
}

createMosaic();

// =======================================
// タイトル消失 → 真っ白 → 本文表示
// =======================================
setTimeout(() => {

  // タイトルを消す
  document.getElementById("censorTitleWrapper").style.opacity = 0;

  // 白画面キープ
  setTimeout(() => {

    // header + 本文を同時フェードイン
    document.querySelectorAll(".fade-target").forEach(el => {
      el.classList.add("show-content");
    });

    document.body.style.overflow = "auto";

  }, 800);

}, 650);
