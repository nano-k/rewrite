// ==========================================
// ページ移動
// ==========================================
function showPage(page) {
  document.querySelectorAll(".page").forEach(sec => {
    sec.style.display = (sec.dataset.page == page) ? "block" : "none";
  });

  document.getElementById("pageNum").textContent = page;
}

// 初期表示（小謎1 = page2）
showPage(2);

// ==========================================
// 小謎1
// ==========================================
function checkQ1() {
  const ans = document.getElementById("answer1").value.trim();
  const result = document.getElementById("q1result");

  if (ans === "かき" || ans === "カキ") {
    result.textContent = "正解！";
    document.querySelector("header").classList.remove("locked");
    showPage(3); // 小謎2（ただしロックされたページとして表示）
  } else {
    result.textContent = "違います。";
  }
}

// ==========================================
// 小謎2〜8 の正解セット（ここを変えればOK）
// ==========================================
const smallAnswers = {
  q2: "こ",
  q3: "た",
  q4: "え",
  q5: "は",
  q6: "あ",
  q7: "ん",
  q8: "さー"
};

// 小謎ごとの次ページ（固定）
const nextPageOf = {
  q2: 4, // 小謎3
  q3: 5, // 小謎4
  q4: 6, // 小謎5
  q5: 7, // 小謎6
  q6: 8, // 小謎7
  q7: 9, // 小謎8
  q8: 10 // 大謎1
};

// ==========================================
// 小謎2〜8 共通処理
// ==========================================
function checkSmall(id, nextPage) {
  const input = document.getElementById(id).value.trim();
  const result = document.getElementById(id + "result");
  const correct = smallAnswers[id];

  if (input === correct) {
    result.textContent = "正解！";
    showPage(nextPageOf[id]);
  } else {
    result.textContent = "違います。";
  }
}

// ==========================================
// 大謎1
// ==========================================
function checkBig1() {
  const a = document.getElementById("big1a").value.trim();
  const b = document.getElementById("big1b").value.trim();
  const c = document.getElementById("big1c").value.trim();

  const result = document.getElementById("big1result");

  if (a === "はこうえつしゃ" && b === "しょうせつ" && c === "なか") {
    result.textContent = "正解！";
    showPage(11);
  } else {
    result.textContent = "違います。";
  }
}

// ==========================================
// 大謎2 → 自動で内容を表示して次へ
// ==========================================
function checkBig2() {
  document.getElementById("big2result").textContent = "世界の正体を理解した…！";
  showPage(12);
}

// ==========================================
// 大謎3
// ==========================================
function checkBig3() {
  const ans = document.getElementById("big3a").value.trim();
  const result = document.getElementById("big3result");

  if (ans === "校閲" || ans === "こうえつ") {
    result.textContent = "正解！";
    document.getElementById("toClear").classList.remove("hidden");
  } else {
    result.textContent = "違います。";
  }
}
