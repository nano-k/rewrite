/* =========================
   rewriteworld logic
   - container width: 600px (CSS)
   - 完全ロック方式：bookInner の max-height を増やしてアンロックする
   - q1 の正解は 'かき'（平仮名）。 q2〜q8 は q1 と同じ解答でOK（仕様）
   - big1: 'こうえつしゃ' / 'しょうせつ' / 'なか' を受容
   - big2: '検→校' 指示でヘッダーブロッカー削除＋ヘッダー書換
   - big3: '横→縦' 指示で縦書き化（container に class を付与）
   - ノンブル: IntersectionObserver で現在表示中のセクションの data-page を表示
   ========================= */

/* ---- 共通 DOM ---- */
const bookInner = document.getElementById('bookInner');
const container = document.getElementById('container');
const headerBlocker = document.getElementById('headerBlocker');
const titleText = document.getElementById('titleText');
const pageNumEl = document.getElementById('pageNum');
const progressPct = document.getElementById('progressPct');
const kuryoBtn = document.getElementById('kuryoBtn');

/* ---- セクションリスト ---- */
const sections = Array.from(document.querySelectorAll('.page'));
const unlockOrder = sections.map(s => s.id); // order as in DOM

/* ---- 状態管理 ---- */
let unlockedIndex = 1; // index in unlockOrder: 0=intro unlocked by default, 1 = q1 unlocked etc.
const solved = {}; // id => true

const TOTAL_PUZZLES = 1 + 7 + 3; // q1 + (q2-8) + big1-3 = 11
let solvedCount = 0;

/* ---- 初期: bookInner 高さを intro + q1 まで見えるようにする ---- */
function computeAndSetMaxHeightForIndex(idx) {
  // idx: highest unlocked section index in unlockOrder (inclusive)
  // compute cumulative offsetHeight from top of bookInner to bottom of that section
  let acc = 0;
  for (let i = 0; i <= idx && i < sections.length; i++) {
    acc += sections[i].offsetHeight;
  }
  // add a small margin
  acc += 20;
  bookInner.style.maxHeight = acc + 'px';
}

/* wait for layout */
window.addEventListener('load', () => {
  // ensure sections measured
  computeAndSetMaxHeightForIndex(unlockedIndex);
  updateProgressUI();
});

/* ---- マーク済みにする共通処理 ---- */
function markSolved(id) {
  if (solved[id]) return;
  solved[id] = true;
  solvedCount++;
  // find index of the section and unlock the next one (if any)
  const idx = unlockOrder.indexOf(id);
  if (idx >= 0 && unlockedIndex < idx + 1) {
    unlockedIndex = idx + 1;
  } else {
    // if solved is the currently last unlocked, advance by one
    if (idx === unlockedIndex) unlockedIndex = Math.min(unlockedIndex + 1, sections.length - 1);
  }
  // expand visible area to include next section
  computeAndSetMaxHeightForIndex(unlockedIndex);
  updateProgressUI();

  // If all puzzles solved => reveal 校了 button
  if (solvedCount >= TOTAL_PUZZLES) {
    if (kuryoBtn) kuryoBtn.classList.remove('hidden');
  }
}

/* ---- update progress percentage ---- */
function updateProgressUI(){
  const pct = Math.round((solvedCount / TOTAL_PUZZLES) * 100);
  if (progressPct) progressPct.textContent = pct;
}

/* =========================
   小謎1 判定
   正答: 'かき'（ひらがな）を厳密に受け入れる（大文字/ローマ字も少し寛容）
   ========================= */
const btn1 = document.getElementById('btn1');
if (btn1) {
  btn1.addEventListener('click', () => {
    const v = (document.getElementById('ans1').value || '').trim().replace(/\s+/g,'');
    const ok = ['かき','カキ','kaki','KAKI'];
    if (ok.includes(v)) {
      document.getElementById('res1').textContent = '正解';
      markSolved('q1');
    } else {
      document.getElementById('res1').textContent = '違います';
      setTimeout(()=> document.getElementById('res1').textContent = '', 1400);
    }
  });
}

/* ---- 小謎2〜8: q1 と同じ答えで受け入れる仕様 ---- */
document.querySelectorAll('.check-same').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    const id = e.currentTarget.getAttribute('data-id');
    const input = document.getElementById('ans'+id);
    const res = document.getElementById('res'+id);
    const v = (input.value || '').trim().replace(/\s+/g,'');
    if (v.length > 0) {
      // accept same answers as q1 (simple)
      const ok = ['かき','カキ','kaki','KAKI'];
      if (ok.includes(v)) {
        res.textContent = '正解（仮）';
        markSolved('q'+id);
      } else {
        res.textContent = '違います（このデモは「かき」で通ります）';
        setTimeout(()=> res.textContent = '', 1400);
      }
    } else {
      res.textContent = '入力してください';
      setTimeout(()=> res.textContent = '', 1200);
    }
  });
});

/* =========================
   大謎1 判定（こうえつしゃ / しょうせつ / なか）
   ある程度緩めに判定（包含判定）
   ========================= */
const btnBig1 = document.getElementById('btnBig1');
if (btnBig1) {
  btnBig1.addEventListener('click', ()=>{
    const a = (document.getElementById('big1a').value || '').trim();
    const b = (document.getElementById('big1b').value || '').trim();
    const c = (document.getElementById('big1c').value || '').trim();
    const okA = a.indexOf('こう') !== -1 || a.indexOf('校') !== -1 || a.indexOf('こうえつ') !== -1;
    const okB = b.indexOf('しょう') !== -1 || b.indexOf('小説') !== -1;
    const okC = c.indexOf('なか') !== -1 || c.indexOf('中') !== -1;
    if (okA && okB && okC) {
      document.getElementById('resBig1').textContent = '正解';
      markSolved('big1');
    } else {
      document.getElementById('resBig1').textContent = '違います';
      setTimeout(()=> document.getElementById('resBig1').textContent = '', 1400);
    }
  });
}

/* =========================
   大謎2 判定（ヘッダー修正）
   正答: '検→校' 系。成功で headerBlocker を外しタイトルを書き換える
   ========================= */
const btnBig2 = document.getElementById('btnBig2');
if (btnBig2) {
  btnBig2.addEventListener('click', ()=>{
    const v = (document.getElementById('big2ans').value || '').replace(/\s+/g,'');
    const okForms = ['検→校','検->校','検校','検→校','検→校'];
    if (okForms.includes(v) || v === '検校') {
      // change title
      titleText.textContent = '校閲世界';
      // remove blocker
      if (headerBlocker && headerBlocker.parentNode) headerBlocker.parentNode.removeChild(headerBlocker);
      document.getElementById('resBig2').textContent = 'タイトルを修正しました';
      markSolved('big2');
      // small flourish: animate header
      headerFlash();
    } else {
      document.getElementById('resBig2').textContent = '例：検→校 のように入力';
      setTimeout(()=> document.getElementById('resBig2').textContent = '', 1400);
    }
  });
}

/* ---- ヘッダークリック: 編集プロンプト（大謎2が未解放だとブロッカーがあるのでこちらは no-op until removed） ---- */
titleText && titleText.addEventListener('click', ()=>{
  // only if blocker removed (i.e., no headerBlocker in DOM)
  if (!document.getElementById('headerBlocker')) {
    const now = titleText.textContent;
    const newT = prompt('ヘッダーのタイトル（デモ）。そのままOKで確定します。', now);
    if (newT !== null && newT.trim() !== '') titleText.textContent = newT.trim();
  }
});

/* =========================
   大謎3 判定（横→縦）
   正答: '横→縦' 系。実行で縦書き化（container に class を付与）
   ========================= */
const btnBig3 = document.getElementById('btnBig3');
if (btnBig3) {
  btnBig3.addEventListener('click', ()=>{
    const v = (document.getElementById('big3ans').value || '').replace(/\s+/g,'');
    const ok = ['横→縦','横->縦','横縦','横to縦','横=>縦','横→縦'];
    if (ok.includes(v)) {
      // apply vertical mode
      container.classList.add('vertical-mode');
      // allow full reading (remove max-height limit)
      bookInner.style.maxHeight = 'none';
      document.getElementById('resBig3').textContent = '縦書きにリライトしました';
      markSolved('big3');
      // after short delay, reveal kuryo if all solved
      setTimeout(()=> updateProgressUI(), 300);
    } else {
      document.getElementById('resBig3').textContent = '例：横→縦 と入力';
      setTimeout(()=> document.getElementById('resBig3').textContent = '', 1200);
    }
  });
}

/* =========================
   IntersectionObserver: 現在表示中のセクションでノンブル切替
   bookInner が overflow:hidden なので root を bookInner にする
   ========================= */
(function setupObserver(){
  if (!pageNumEl) return;
  const io = new IntersectionObserver((entries)=>{
    // pick the entry with largest intersectionRatio
    let best = null;
    entries.forEach(en=>{
      if (en.isIntersecting) {
        if (!best || en.intersectionRatio > best.intersectionRatio) best = en;
      }
    });
    if (best && best.target) {
      const page = best.target.getAttribute('data-page');
      pageNumEl.textContent = page;
    }
  }, {
    root: bookInner,
    threshold: [0.45, 0.6, 0.75]
  });
  sections.forEach(s => io.observe(s));
})();

/* =========================
   headerFlash: small flourish
   ========================= */
function headerFlash(){
  const h = document.getElementById('siteHeader');
  if(!h) return;
  h.style.transition = 'transform .35s ease, box-shadow .35s ease';
  h.style.transform = 'translateY(-6px)';
  h.style.boxShadow = '0 12px 30px rgba(31,122,140,0.18)';
  setTimeout(()=>{ h.style.transform='translateY(0)'; h.style.boxShadow='none'; }, 420);
}

/* =========================
   テスト用ショートカット（開発用）
   Shift+U で全解放（デバッグ）
   ========================= */
window.addEventListener('keydown', (e)=>{
  if (e.shiftKey && e.key.toLowerCase() === 'u') {
    // reveal all
    bookInner.style.maxHeight = '10000px';
    container.classList.add('vertical-mode');
    if (kuryoBtn) kuryoBtn.classList.remove('hidden');
  }
});
