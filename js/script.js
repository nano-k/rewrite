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
  const offsetY = 17;
  const offsetX = -15;

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

  if (ans === "かき") {
    result.textContent = "勢い良く扉が開いた。";
    unlockPage(3);
    showPage(3);
  } else {
    result.textContent = "何かが違うようだ。";
  }
}

/* ==========================================
   小謎2〜8
========================================== */
function checkSmall(id, nextPage) {
  const input = document.getElementById(id).value.trim();
  const result = document.getElementById(id + "result");

  const answers = {
    q2: ["ぶん", "ブン", "BUN", "bun"],
    q3: "よみ",
    q4: "ごじ",
    q5: "よはく",
    q6: "とる",
    q7: "きごう",
    q8: "校閲者"
  };

  const correct = answers[id];

  if (
    Array.isArray(correct)
      ? correct.includes(input)
      : input === correct
  ) {
    result.textContent = "勢い良く扉が開いた。";
    unlockPage(nextPage);
    showPage(nextPage);
  } else {
    result.textContent = "何かが違うようだ。";
  }
}




function checkRewriteQ2() {
  const before = document.getElementById("q2Before").value;
  const after  = document.getElementById("q2After").value;

  const result = document.getElementById("q2RewriteResult");
  const inputArea = document.getElementById("q2InputArea");

  // 両方未選択
  if (!before && !after) {
    result.textContent = "";
    inputArea.style.display = "none";
    return;
  }

  // 片方だけ選択（まだ途中なので誤り扱いしない）
  if (!before || !after) {
    result.textContent = "";
    inputArea.style.display = "none";
    return;
  }

  // 両方選択 → 正誤判定
  if (before === "red" && after === "blue") {
    result.textContent = "　修正箇所をタップすると、赤が青に変化し、タブレットに解答が入力できるようになった。";
    inputArea.style.display = "block";
  } else {
    result.textContent = "何かが違うようだ。";
    inputArea.style.display = "none";
  }
}


function checkRewriteQ3() {
  const a = document.getElementById("q3_1").value;
  const b = document.getElementById("q3_2").value;
  const c = document.getElementById("q3_3").value;
  const d = document.getElementById("q3_4").value;

  const result = document.getElementById("q3RewriteResult");   // 表示用
  const inputArea = document.getElementById("q3InputArea"); // 次に進むUI等

  // 全部未選択
  if (!a && !b && !c && !d) {
    result.textContent = "";
    inputArea.style.display = "none";
    return;
  }

  // 途中（1つでも未選択）
  if (!a || !b || !c || !d) {
    result.textContent = "";
    inputArea.style.display = "none";
    return;
  }

  // 全部選択 → 正誤判定
  const isCorrect =
    a === "ai" &&
    b === "teiru" &&
    c === "tobira" &&
    d === "shime";

  if (isCorrect) {
    result.textContent = "　開いている扉をよく見ると『ー』の記号を見つけた。扉を閉めると、『＜』『ー』が組み合わさり、左向きの矢印になった。『ひも』の隣の空白をタップすると左向きの矢印が表示された。";
    inputArea.style.display = "block";
　
    // 必要ならここで解放
    // unlockPage(○○);
  } else {
    result.textContent = "何かが違うようだ。";
    inputArea.style.display = "none";
  }
}


/* ==========================================
   大謎1
========================================== */
function checkBig1() {
  const a = document.getElementById("big1a").value.trim();
  const b = document.getElementById("big1b").value.trim();
  const result = document.getElementById("big1result");

  if (a === "しょうせつ" && b === "なか") {
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

const targetChar = document.querySelector("#headerTitle .target-char");

if (targetChar) {
  targetChar.addEventListener("click", () => {
    const page11 = document.querySelector('.page[data-page="11"]');
    const page12 = document.querySelector('.page[data-page="12"]');
    const result = document.getElementById("big2result");

    // クリック後に文字を変える
    targetChar.textContent = "校";

    // 結果表示
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
   大謎3（完全版）
========================================== */

let disablePullRefresh = false;

/* ------------------------------
   正解ワード定義
------------------------------ */
const YOKO_WORDS = ["横", "よこ", "ヨコ", "横書き"];
const TATE_WORDS = ["縦", "たて", "タテ", "縦書き"];

/* ------------------------------
   入力正規化
   ・前後空白削除
   ・カタカナ → ひらがな
------------------------------ */
function normalizeText(str) {
  return str
    .trim()
    .replace(/[ァ-ン]/g, ch =>
      String.fromCharCode(ch.charCodeAt(0) - 0x60)
    );
}

/* ------------------------------
   大謎3 判定
------------------------------ */
function checkBig3() {
  const yokoInput = normalizeText(
    document.getElementById("big3a_1").value
  );
  const tateInput = normalizeText(
    document.getElementById("big3a_2").value
  );

  const result = document.getElementById("big3result");

  const isYoko = YOKO_WORDS.some(word =>
    normalizeText(word) === yokoInput
  );
  const isTate = TATE_WORDS.some(word =>
    normalizeText(word) === tateInput
  );

  if (isYoko && isTate) {
    document.body.style.writingMode = "vertical-rl";
    document.body.style.textOrientation = "mixed";

    result.textContent = "世界が縦書きに書き換えられた。";

    unlockPage(12);
    document.getElementById("toClear").classList.remove("hidden");
    showPage(12, 400);

    if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
      disablePullRefresh = true;
    }
  } else {
    result.textContent = "何かが違うようだ。";
  }
}

/* ------------------------------
   プル・トゥ・リフレッシュ無効化
------------------------------ */
let touchStartY = 0;

document.addEventListener("touchstart", (e) => {
  if (disablePullRefresh) {
    touchStartY = e.touches[0].clientY;
  }
});

document.addEventListener(
  "touchmove",
  (e) => {
    if (disablePullRefresh) {
      const touchY = e.touches[0].clientY;
      const scrollTop =
        document.scrollingElement.scrollTop || document.body.scrollTop;

      if (scrollTop === 0 && touchY > touchStartY) {
        e.preventDefault();
      }
    }
  },
  { passive: false }
);

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

      if (["big1a","big1b"].includes(id)) { checkBig1(); return; }

     if (["big3a_1", "big3a_2"].includes(id)) {
    checkBig3();
    return;
  }
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


/* ==========================================
   endpage
========================================== */
window.addEventListener('load', () => {
  if (document.body.classList.contains('end-page')) {
    const tateWrap = document.querySelector('.tate-wrap');
    if (tateWrap) {
      tateWrap.scrollLeft = tateWrap.scrollWidth; // 右端に固定
    }
  }
});

