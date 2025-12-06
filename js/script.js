/* ==========================================
   初期ロック処理
========================================== */
const pageNum = document.getElementById("pageNum");
const pages = document.querySelectorAll(".page");

// ロックされたページを非表示
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
   ページロック解除
========================================== */
function unlockPage(pageNumber) {
  const page = document.querySelector(`.page[data-page="${pageNumber}"]`);
  if (page) {
    page.dataset.lock = "false";
    page.classList.remove("locked");
    page.style.display = "block"; // ← 表示
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
    q2: "こ",
    q3: "た",
    q4: "え",
    q5: "は",
    q6: "あ",
    q7: "ん",
    q8: "さー"
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
   大謎2（ヘッダー）
========================================== */
const header = document.getElementById("headerTitle");
if (header) {
  header.addEventListener("click", () => {
    if (!header.classList.contains("locked")) {
      header.textContent = "校閲世界";
      document.getElementById("big2result").textContent =
        "正しく修正された。";

      unlockPage(12);

      showPage(12);
    }
  });
}

/* ==========================================
   大謎3
========================================== */
function checkBig3() {
  const t = document.getElementById("big3a").value.trim();
  const result = document.getElementById("big3result");

  if (t.includes("横") && t.includes("縦")) {
    document.body.style.writingMode = "vertical-rl";
    document.body.style.textOrientation = "upright";

    result.textContent = "世界が縦書きに戻った。";

    document.getElementById("toClear").classList.remove("hidden");
  } else {
    result.textContent = "指示が不完全です。";
  }
}
