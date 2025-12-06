/* --- ページロック機能 --- */
const pages = document.querySelectorAll(".page");

// ページロック：次のページを見えなくする
function updatePageLocks() {
  pages.forEach((page, idx) => {
    const locked = page.dataset.lock === "true";
    const next = pages[idx + 1];
    if (!next) return;

    if (locked) {
      next.style.display = "none";
    } else {
      next.style.display = "block";
    }
  });
}
updatePageLocks();

/* --- ノンブル変更 --- */
const pageNum = document.getElementById("pageNum");

if (pageNum) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(ent => {
      // ロックされたページはページ番号にならない
      if (ent.isIntersecting && ent.target.dataset.lock === "false") {
        pageNum.textContent = ent.target.dataset.page;
      }
    });
  }, { threshold: 0.5 });

  pages.forEach(p => observer.observe(p));
}

/* ------------------------
   小謎1〜8（共通判定）
------------------------ */

// 小謎1専用
function checkQ1() {
  const ans = document.getElementById("answer1").value;
  if (ans === "かき") {
    document.getElementById("q1result").textContent = "正解！";

    // 小謎2 のロック解除
    document.querySelector('[data-page="3"]').dataset.lock = "false";
    updatePageLocks();
  } else {
    document.getElementById("q1result").textContent = "不正解";
  }
}

/* ---- 小謎2〜8 の仮答え ---- */
/* すべて answer = こたえ で正解とする */

function checkSmall(id, nextPage) {
  const box = document.getElementById(id);
  const result = document.getElementById(id + "result");

  if (box.value === "こたえ") {
    result.textContent = "正解！";
    document.querySelector(`[data-page="${nextPage}"]`).dataset.lock = "false";
    updatePageLocks();
  } else {
    result.textContent = "不正解";
  }
}

/* --- 大謎1 --- */
function checkBig1() {
  const a = document.getElementById("big1a").value;
  const b = document.getElementById("big1b").value;
  const c = document.getElementById("big1c").value;

  if (a === "こうえつしゃ" && b === "しょうせつ" && c === "なか") {
    document.getElementById("big1result").textContent = "正解！";
    document.getElementById("headerTitle").classList.remove("locked");

    // 大謎2 のロック解除
    document.querySelector('[data-page="11"]').dataset.lock = "false";
    updatePageLocks();
  } else {
    document.getElementById("big1result").textContent = "不正解";
  }
}

/* --- 大謎2：ヘッダー修正 --- */
const header = document.getElementById("headerTitle");
if (header) {
  header.addEventListener("click", () => {
    if (!header.classList.contains("locked")) {
      header.textContent = "校閲世界";
      document.getElementById("big2result").textContent = "正しく修正された。";

      // 大謎3 のロック解除
      document.querySelector('[data-page="12"]').dataset.lock = "false";
      updatePageLocks();
    }
  });
}

/* --- 大謎3：横から縦へ --- */
function checkBig3() {
  const t = document.getElementById("big3a").value;
  if (t.includes("横") && t.includes("縦")) {
    document.body.style.writingMode = "vertical-rl";
    document.body.style.textOrientation = "upright";

    document.getElementById("big3result").textContent = "世界が縦書きに戻った。";
    document.getElementById("toClear").classList.remove("hidden");
  } else {
    document.getElementById("big3result").textContent = "指示が不完全です。";
  }
}
