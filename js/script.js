/* ==========================================
   ノンブル更新：IntersectionObserver
========================================== */
const pageNum = document.getElementById("pageNum");
const pages = document.querySelectorAll(".page");

if (pageNum) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((ent) => {
        if (ent.isIntersecting) {
          pageNum.textContent = ent.target.dataset.page;
        }
      });
    },
    { threshold: 0.5 }
  );

  pages.forEach((p) => observer.observe(p));
}

/* ==========================================
   ページロック制御
========================================== */

// ページをアンロック
function unlockPage(pageNumber) {
  const page = document.querySelector(`.page[data-page="${pageNumber}"]`);
  if (page) {
    page.setAttribute("data-lock", "false");
    page.classList.remove("locked");
  }
}

// 指定ページへスクロール
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

    unlockPage(2); // 小謎1
    unlockPage(3); // 小謎2

    showPage(3);
  } else {
    result.textContent = "違います。";
  }
}

/* ==========================================
   小謎2～8 共通処理
========================================== */
function checkSmall(id, nextPage) {
  const input = document.getElementById(id).value.trim();
  const result = document.getElementById(id + "result");

  // 小謎の答え一覧
  const answers = {
    q2: "こ",
    q3: "た",
    q4: "え",
    q5: "は",
    q6: "あ",
    q7: "ん",
    q8: "さー",
  };

  if (input === answers[id]) {
    result.textContent = "正解！";

    // 今のページ番号を取得
    const currentPage = parseInt(
      document.getElementById(id).closest(".page").dataset.page,
      10
    );

    unlockPage(currentPage); // 今のページ
    unlockPage(nextPage);     // 次のページ

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

    unlockPage(10); // 大謎1
    unlockPage(11); // 大謎2

    // ヘッダー解放（大謎2用）
    document.getElementById("headerTitle").classList.remove("locked");

    showPage(11);
  } else {
    result.textContent = "不正解";
  }
}

/* ==========================================
   大謎2（ヘッダー修正）
========================================== */
const header = document.getElementById("headerTitle");
if (header) {
  header.addEventListener("click", () => {
    if (!header.classList.contains("locked")) {
      header.textContent = "校閲世界";
      document.getElementById("big2result").textContent =
        "正しく修正された。";

      unlockPage(11); // 大謎2
      unlockPage(12); // 大謎3

      showPage(12);
    }
  });
}

/* ==========================================
   大謎3（横 → 縦）
========================================== */
function checkBig3() {
  const t = document.getElementById("big3a").value.trim();
  const result = document.getElementById("big3result");

  if (t.includes("横") && t.includes("縦")) {
    document.body.style.writingMode = "vertical-rl";
    document.body.style.textOrientation = "upright";

    result.textContent = "世界が縦書きに戻った。";

    unlockPage(12);

    document.getElementById("toClear").classList.remove("hidden");
  } else {
    result.textContent = "指示が不完全です。";
  }
}
