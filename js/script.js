/* ==========================================
   初期ロック処理
========================================== */
const pageNum = document.getElementById("pageNum");
const pages = document.querySelectorAll(".page");

/* 進捗合計（%） */
let progressTotal = 0;
const progressPercent = document.getElementById("progressPercent");

/* ロックされたページを非表示 */
pages.forEach(p => {
  if (p.dataset.lock === "true") {
    p.style.display = "none";
  }
});

/* ==========================================
   ノンブル更新
========================================== */
if (pageNum) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(ent => {
        if (ent.isIntersecting) {
          pageNum.textContent = ent.target.dataset.page;
        }
      });
    },
    { threshold: 0.5 }
  );

  pages.forEach(p => observer.observe(p));
}

/* ==========================================
   世界修正率の更新
========================================== */
function updateProgress(pageElement) {
  const add = Number(pageElement.dataset.progress || 0);

  // 初めて解除した時だけ進捗追加したいので "counted" 属性で管理
  if (!pageElement.dataset.counted) {
    progressTotal += add;
    pageElement.dataset.counted = "true";
  }

  // 最大100%で止める（念のため）
  if (progressTotal > 100) progressTotal = 100;

  if (progressPercent) {
    progressPercent.textContent = progressTotal + "%";
  }
}

/* ==========================================
   ページロック解除
========================================== */
function unlockPage(pageNumber) {
  const page = document.querySelector(`.page[data-page="${pageNumber}"]`);
  if (page) {
    page.dataset.lock = "false";
    page.classList.remove("locked");
    page.style.display = "block";

    // ★解除したら進捗を加算
    updateProgress(page);
  }
}

function showPage(pageNumber) {
  const target = document.querySelector(`.page[data-page="${pageNumber}"]`);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/* ==========================================
   小謎1
========================================== */
function checkQ1() {
  const ans = document.getElementById("answer1").value.trim();
  const result = document.getElementById("q1result");

  if (ans === "かき" || ans === "カキ") {
    result.textContent = "正解！";
    unlockPage(3);
    showPage(3);
  } else {
    result.textContent = "違います。";
  }
}

/* ==========================================
   小謎2〜8
========================================== */
function checkSmall(id, nextPage) {
  const input = document.getElementById(id).value.trim();
  const result = document.getElementById(id + "result");

  const answers = {
    q2: "ぶん",
    q3: "よみ",
    q4: "ごじ",
    q5: "よはく",
    q6: "とる",
    q7: "きごう",
    q8: "校閲者"
  };

  if (input === answers[id]) {
    result.textContent = "正解！";
    unlockPage(nextPage);
    showPage(nextPage);
  } else {
    result.textContent = "違います。";
  }
}

/* ==========================================
   大謎1
========================================== */
function checkBig1() {
  const a = document.getElementById("big1a").value.trim();
  const b = document.getElementById("big1b").value.trim();
  const c = document.getElementById("big1c").value.trim();
  const result = document.getElementById("big1result");

  if (a === "こうえつしゃ" && b === "しょうせつ" && c === "なか") {
    result.textContent = "正解！";
    unlockPage(11);

    document.getElementById("headerTitle").classList.remove("locked");

    showPage(11);
  } else {
    result.textContent = "不正解";
  }
}

/* ==========================================
   大謎2（ヘッダークリックで突破）
========================================== */

const header = document.getElementById("headerTitle");

if (header) {
  header.addEventListener("click", () => {
    const page11 = document.querySelector('.page[data-page="11"]');
    const page12 = document.querySelector('.page[data-page="12"]');
    const result = document.getElementById("big2result");

    header.textContent = "校閲世界";
    result.textContent = "正しく修正された。";

    // page11の解除
    if (page11) unlockPage(11);

    // page12の解除＆スクロール
    if (page12) {
      unlockPage(12);
      showPage(12);
    }
  });
}



/* ==========================================
   大謎3
========================================== */
let disablePullRefresh = false;

function checkBig3() {
  const t = document.getElementById("big3a").value.trim();
  const result = document.getElementById("big3result");

  if (t.includes("横") && t.includes("縦")) {
    document.body.style.writingMode = "vertical-rl";
    document.body.style.textOrientation = "upright";
    result.textContent = "世界が縦書きに戻った。";
    unlockPage(12);
    document.getElementById("toClear").classList.remove("hidden");
    showPage(12, 400);

    if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
      disablePullRefresh = true;
    }
  } else {
    result.textContent = "指示が不完全です。";
  }
}

/* プル・トゥ・リフレッシュ無効化 */
let touchStartY = 0;
document.addEventListener("touchstart", (e) => {
  if (disablePullRefresh) {
    touchStartY = e.touches[0].clientY;
  }
});

document.addEventListener("touchmove", (e) => {
  if (disablePullRefresh) {
    const touchY = e.touches[0].clientY;
    const scrollTop = document.scrollingElement.scrollTop || document.body.scrollTop;

    if (scrollTop === 0 && touchY > touchStartY) {
      e.preventDefault();
    }
  }
}, { passive: false });

/* ==========================================
   Enterキーで謎を送信
========================================== */
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const active = document.activeElement;

    if (active && active.tagName === "INPUT") {
      e.preventDefault();

      const id = active.id;

      if (id === "answer1") { checkQ1(); return; }

      if (["q2","q3","q4","q5","q6","q7","q8"].includes(id)) {
        const nextPageMap = { q2:4, q3:5, q4:6, q5:7, q6:8, q7:9, q8:10 };
        checkSmall(id,nextPageMap[id]);
        return;
      }

      if (["big1a","big1b","big1c"].includes(id)) { checkBig1(); return; }

      if (id === "big3a") { checkBig3(); return; }
    }
  }
});

/* ==========================================
   X投稿ボタン
========================================== */
document.addEventListener("DOMContentLoaded", () => {
  const tweetBtn = document.getElementById("tweetBtn");
  if (!tweetBtn) return;

  tweetBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const text = "You rewrote the distorted 『検閲世界』！（あなたは『検閲世界』の歪みを修正した！） #検閲世界 #Web謎 @kotohano_nano";
    const url  = "https://nano-k.github.io/rewrite/";

    const tweetURL =
      "https://twitter.com/intent/tweet?text=" +
      encodeURIComponent(text) +
      "&url=" +
      encodeURIComponent(url);

    window.open(tweetURL, "_blank");
  });
});
