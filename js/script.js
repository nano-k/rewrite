/* --- ノンブル変更 --- */
const pageNum = document.getElementById("pageNum");
const pages = document.querySelectorAll(".page");

if (pageNum) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(ent => {
      if (ent.isIntersecting) {
        pageNum.textContent = ent.target.dataset.page;
      }
    });
  }, { threshold: 0.5 });

  pages.forEach(p => observer.observe(p));
}

/* --- 小謎1 --- */
function checkQ1() {
  const ans = document.getElementById("answer1").value;
  if (ans === "かき") {
    document.getElementById("q1result").textContent = "正解！";
  } else {
    document.getElementById("q1result").textContent = "不正解";
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
