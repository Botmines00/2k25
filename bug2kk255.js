(() => {
  'use strict';

  const TAG = 'IA_BUG_SHA256_HACK_COMPACT_V2';
  if (window[TAG]) { try { window[TAG].cleanup?.(); } catch {} }

  // ===== CONFIG =====
  const API = 'https://blaze.bet.br/api/singleplayer-originals/originals/roulette_games/recent/1';
  const POLL_MS = 850;
  const BAR_SECONDS = 3;
  const SEQ = ['🔴','⚫️','🔴','⚫️','🔴']; // sequência pedida
  const CONFIRM_READS = 2;

  // ===== THEMES (sem color-mix) =====
  const THEMES = [
    { // Neon Emerald
      pri:'#00ffbf', acc:'#00ffe1', glow:'rgba(0,255,170,.65)',
      border:'rgba(0,255,170,.28)', panel1:'rgba(0,0,0,.96)', panel2:'rgba(16,20,18,.95)',
      matrix:'#00ff9c', text:'#eafff8',
      barRedGrad:'linear-gradient(90deg,#ff003c,#ff4b5c,#ff003c)',
      barBlackGrad:'linear-gradient(90deg,#0a0a0d,#14141b,#0f0f14)',
      btnBg:'rgba(0,255,191,.10)', btnBgH:'rgba(0,255,191,.20)', btnBd:'rgba(0,255,191,.25)'
    },
    { // Cyber Purple
      pri:'#c77dff', acc:'#7b2cbf', glow:'rgba(199,125,255,.65)',
      border:'rgba(199,125,255,.28)', panel1:'rgba(6,2,10,.96)', panel2:'rgba(14,6,20,.95)',
      matrix:'#b5179e', text:'#f3eaff',
      barRedGrad:'linear-gradient(90deg,#ff1b6b,#ff5f6d,#ff1b6b)',
      barBlackGrad:'linear-gradient(90deg,#1a1326,#281a3a,#1f1530)',
      btnBg:'rgba(199,125,255,.10)', btnBgH:'rgba(199,125,255,.20)', btnBd:'rgba(199,125,255,.25)'
    },
    { // Ice Blue
      pri:'#6ee7ff', acc:'#93c5fd', glow:'rgba(147,197,253,.65)',
      border:'rgba(147,197,253,.28)', panel1:'rgba(3,8,18,.96)', panel2:'rgba(6,12,26,.95)',
      matrix:'#60a5fa', text:'#eaf6ff',
      barRedGrad:'linear-gradient(90deg,#ff3355,#ff7a7a,#ff3355)',
      barBlackGrad:'linear-gradient(90deg,#0b1220,#111a2e,#0e1726)',
      btnBg:'rgba(110,231,255,.10)', btnBgH:'rgba(110,231,255,.20)', btnBd:'rgba(110,231,255,.25)'
    },
    { // Inferno Red
      pri:'#ff6b6b', acc:'#ffd166', glow:'rgba(255,107,107,.65)',
      border:'rgba(255,107,107,.28)', panel1:'rgba(12,0,0,.96)', panel2:'rgba(22,2,2,.95)',
      matrix:'#ff6b6b', text:'#fff2f2',
      barRedGrad:'linear-gradient(90deg,#ff2d2d,#ff8f5a,#ff2d2d)',
      barBlackGrad:'linear-gradient(90deg,#1a0b0b,#2a1515,#1f1010)',
      btnBg:'rgba(255,107,107,.10)', btnBgH:'rgba(255,107,107,.20)', btnBd:'rgba(255,107,107,.25)'
    },
    { // Vermelho Neon (novo)
      pri:'#ff1744', acc:'#ff8a80', glow:'rgba(255,23,68,.65)',
      border:'rgba(255,23,68,.28)', panel1:'rgba(14,0,2,.96)', panel2:'rgba(28,2,6,.95)',
      matrix:'#ff2d55', text:'#fff5f7',
      barRedGrad:'linear-gradient(90deg,#ff1744,#ff5252,#ff1744)',
      barBlackGrad:'linear-gradient(90deg,#1a0b0b,#2a1515,#1f1010)',
      btnBg:'rgba(255,23,68,.10)', btnBgH:'rgba(255,23,68,.20)', btnBd:'rgba(255,23,68,.25)'
    }
  ];
  let themeIdx = 0;

  // ===== STYLES =====
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ia-in { from{transform:translateY(-6px) scale(.98);opacity:0} to{transform:translateY(0) scale(1);opacity:1} }
    @keyframes blink { 50%{opacity:0} }
    @keyframes spin { to{ transform: rotate(360deg) } }
    @keyframes scan { 0%{transform:translateY(-100%)} 100%{transform:translateY(100%)} }
    @keyframes matrixFall { 0% { transform: translateY(-100%) } 100% { transform: translateY(100%) } }

    .ia-wrap{
      --pri:#00ffbf; --acc:#00ffe1; --glow:rgba(0,255,170,.65);
      --border:rgba(0,255,170,.28); --panel1:rgba(0,0,0,.96); --panel2:rgba(16,20,18,.95);
      --txt:#eafff8; --matrix:#00ff9c;
      --bar-red-grad: linear-gradient(90deg,#ff003c,#ff4b5c,#ff003c);
      --bar-black-grad: linear-gradient(90deg,#0a0a0d,#14141b,#0f0f14);
      --btn-bg: rgba(0,255,191,.10);
      --btn-bgh: rgba(0,255,191,.20);
      --btn-bd: rgba(0,255,191,.25);

      position:fixed; right:14px; top:14px; z-index:2147483647;
      width:min(95vw,340px);
      border-radius:14px; overflow:hidden; user-select:none;
      background:var(--panel1);
      border:1px solid var(--border);
      box-shadow:0 0 22px var(--glow), inset 0 0 14px rgba(255,255,255,.06);
      font-family:'Courier New', monospace;
      color:var(--txt);
      animation: ia-in .25s ease-out both;
      backdrop-filter: blur(4px);
    }

    .matrix{ position:absolute; inset:0; pointer-events:none; opacity:.22; overflow:hidden;
      mask-image: linear-gradient(to bottom, transparent, black 6%, black 94%, transparent); }
    .matrix .col{
      position:absolute; top:-120%; width:9px; left:var(--x);
      color:var(--matrix);
      text-shadow:0 0 4px var(--matrix), 0 0 10px var(--matrix);
      animation: matrixFall var(--d) linear infinite;
      white-space: pre; font-size:11px; line-height:11px;
    }

    .ia-head{
      position:relative; display:flex; align-items:center; gap:8px;
      padding:8px 10px;
      background: linear-gradient(90deg,var(--panel2), rgba(10,14,12,.95));
      border-bottom:1px solid var(--border);
      cursor:grab;
    }
    .ia-head:active{ cursor:grabbing; }
    .spin{
      width:18px; height:18px; border-radius:999px;
      border:2px solid rgba(255,255,255,.12); border-top-color:var(--pri);
      box-shadow:0 0 10px var(--glow);
    }
    .spinning{ animation: spin .9s linear infinite; }

    .title{
      flex:1; color:var(--pri); font-weight:700; font-size:12px;
      text-shadow:0 0 10px var(--glow);
    }

    .btn{
      width:24px; height:24px; display:grid; place-items:center;
      border-radius:7px; background:var(--btn-bg);
      border:1px solid var(--btn-bd); color:var(--acc);
      font-size:12px; cursor:pointer; transition:.15s;
    }
    .btn:hover{ background:var(--btn-bgh) }

    .ia-body{ position:relative; padding:12px }

    .line{
      position:relative; margin-bottom:8px; text-align:center; min-height:22px;
      font-weight:700; letter-spacing:.35px; font-size:12px;
    }
    .typing::after{ content:"_"; animation: blink .8s infinite; }

    .txt-red{ color:#ff2b4d; text-shadow:0 0 10px rgba(255,40,60,.8), 0 0 20px rgba(255,40,60,.35) }
    .txt-black{ color:#e5e7eb; text-shadow:0 0 8px rgba(255,255,255,.14) }

    .glitch{ position:relative; display:inline-block }
    .glitch::before, .glitch::after{
      content:attr(data-text); position:absolute; left:0; top:0; width:100%; opacity:.8; pointer-events:none;
    }
    .glitch::before{ transform: translate(1px,0); color:#ff2b4d; filter: blur(.3px) }
    .glitch::after{ transform: translate(-1px,0); color:var(--acc); filter: blur(.3px) }

    .bar-wrap{
      position:relative; height:18px; border-radius:10px; overflow:hidden;
      border:1px solid var(--btn-bd);
      background:rgba(0,0,0,.85);
      box-shadow: inset 0 0 8px rgba(0,0,0,.6);
      margin-top:6px;
    }
    .bar{ height:100%; width:0% }
    .bar-red{   background:var(--bar-red-grad);   box-shadow: inset 0 0 14px rgba(255,45,75,.35), 0 0 16px rgba(255,45,75,.25); border-right:1px solid rgba(255,60,90,.85); }
    .bar-black{ background:var(--bar-black-grad); box-shadow: inset 0 0 12px rgba(0,0,0,.75), 0 0 12px rgba(0,0,0,.35); border-right:1px solid rgba(120,120,130,.45); }

    .pct{
      position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
      font-size:11px; font-weight:700; color:#fff; text-shadow:0 1px 2px rgba(0,0,0,.7);
      text-align:center; padding:0 6px;
    }

    .protect{
      margin-top:8px; text-align:center; font-size:10px; color:var(--acc);
      text-shadow:0 0 8px rgba(0,0,0,.35);
    }
    .access-badge{
      margin-top:4px; text-align:center; font-weight:800;
      color:var(--pri); font-size:11px; letter-spacing:.55px;
      text-shadow:0 0 8px var(--glow), 0 0 16px rgba(0,0,0,.35);
    }

    .scanline{
      position:absolute; left:0; right:0; top:0; height:28%;
      background: linear-gradient(to bottom, rgba(255,255,255,.06), transparent);
      animation: scan 2.2s linear infinite;
      pointer-events:none;
    }

    .log{
      margin-top:8px; max-height:70px; overflow:auto;
      background:rgba(0,0,0,.7);
      border:1px solid var(--btn-bd);
      border-radius:8px; padding:5px 6px; font-size:10px; color:var(--acc);
    }
    .log b{ color:var(--pri) }
    .log .red{ color:#ff8899 }
    .log .black{ color:#e5e7eb }

    .bar-finished{ box-shadow: inset 0 0 16px var(--glow), 0 0 16px rgba(0,0,0,.35) !important; }
  `;
  document.head.appendChild(style);

  // ===== UI =====
  const wrap = document.createElement('div');
  wrap.className = 'ia-wrap';
  wrap.innerHTML = `
    <div class="ia-head" id="hdr">
      <div id="spin" class="spin spinning"></div>
      <div id="title" class="title glitch" data-text="I.A Bug sha256 [HACK MODE]">I.A Bug sha256 [HACK MODE]</div>
      <button id="btnTheme" class="btn" title="Trocar tema (🎨)">🎨</button>
      <button id="btnMin" class="btn" title="Minimizar">▁</button>
      <button id="btnClose" class="btn" title="Fechar">✕</button>
    </div>
    <div class="ia-body" id="body">
      <div class="scanline"></div>
      <div class="matrix" id="matrix"></div>
      <div id="entry" class="line typing"></div>
      <div class="bar-wrap">
        <div id="bar" class="bar"></div>
        <div id="pct" class="pct">0%</div>
      </div>
      <div id="protect" class="protect typing"></div>
      <div id="accessGranted" class="access-badge typing"></div>
      <div id="log" class="log"></div>
    </div>
  `;
  document.body.appendChild(wrap);

  const hdr = wrap.querySelector('#hdr');
  const spin = wrap.querySelector('#spin');
  const entryEl = wrap.querySelector('#entry');
  const barEl = wrap.querySelector('#bar');
  const pctEl = wrap.querySelector('#pct');
  const protectEl = wrap.querySelector('#protect');
  const btnMin = wrap.querySelector('#btnMin');
  const btnClose = wrap.querySelector('#btnClose');
  const btnTheme = wrap.querySelector('#btnTheme');
  const matrixEl = wrap.querySelector('#matrix');
  const accessEl = wrap.querySelector('#accessGranted');
  const logEl = wrap.querySelector('#log');

  // ===== THEME APPLY =====
  function applyTheme(t){
    wrap.style.setProperty('--pri', t.pri);
    wrap.style.setProperty('--acc', t.acc);
    wrap.style.setProperty('--glow', t.glow);
    wrap.style.setProperty('--border', t.border);
    wrap.style.setProperty('--panel1', t.panel1);
    wrap.style.setProperty('--panel2', t.panel2);
    wrap.style.setProperty('--txt', t.text);
    wrap.style.setProperty('--matrix', t.matrix);
    wrap.style.setProperty('--bar-red-grad', t.barRedGrad);
    wrap.style.setProperty('--bar-black-grad', t.barBlackGrad);
    wrap.style.setProperty('--btn-bg', t.btnBg);
    wrap.style.setProperty('--btn-bgh', t.btnBgH);
    wrap.style.setProperty('--btn-bd', t.btnBd);
  }
  applyTheme(THEMES[themeIdx]);
  btnTheme.onclick = () => { themeIdx = (themeIdx + 1) % THEMES.length; applyTheme(THEMES[themeIdx]); };

  // Atalhos: T para trocar, R para Vermelho Neon direto
  function jumpTo(themeName){
    const idx = THEMES.findIndex(t => t.pri === '#ff1744'); // Vermelho Neon anchor
    if (idx >= 0) { themeIdx = idx; applyTheme(THEMES[themeIdx]); }
  }
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 't') { btnTheme.click(); }
    if (e.key.toLowerCase() === 'r') { jumpTo('redNeon'); }
  });

  // ===== MATRIX =====
  (function buildMatrix(){
    const cols = 16, chars = '01Δ¥$#@*&%+=<>|';
    for(let i=0;i<cols;i++){
      const col = document.createElement('div');
      col.className = 'col';
      col.style.setProperty('--x', `${(i/(cols-1))*100}%`);
      col.style.setProperty('--d', `${(1.6 + Math.random()*2.6).toFixed(2)}s`);
      let s=''; for(let k=0;k<38;k++){ s += chars[Math.floor(Math.random()*chars.length)] + '\n'; }
      col.textContent = s;
      matrixEl.appendChild(col);
    }
  })();

  // ===== DRAG =====
  (function drag(){
    let sx=0, sy=0, dragging=false;
    const onDown = (e) => {
      dragging=true; const p=('touches' in e)?e.touches[0]:e;
      sx=p.clientX-wrap.offsetLeft; sy=p.clientY-wrap.offsetTop;
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      document.addEventListener('touchmove', onMove, {passive:false});
      document.addEventListener('touchend', onUp);
    };
    const onMove = (e) => {
      if(!dragging) return;
      const p=('touches' in e)?e.touches[0]:e;
      const x=Math.max(6, p.clientX - sx), y=Math.max(6, p.clientY - sy);
      wrap.style.left = x+'px'; wrap.style.top = y+'px'; wrap.style.right='auto'; e.preventDefault?.();
    };
    const onUp = () => {
      dragging=false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    };
    hdr.addEventListener('mousedown', onDown);
    hdr.addEventListener('touchstart', onDown, {passive:true});
  })();

  // ===== CONTROLES =====
  btnClose.onclick = () => cleanup();
  btnMin.onclick = () => {
    const body = wrap.querySelector('.ia-body');
    const hide = body.style.display !== 'none';
    body.style.display = hide ? 'none' : '';
    btnMin.textContent = hide ? '▣' : '▁';
  };

  // ===== TYPE =====
  function typeWrite(el, text, {speed=12, glitch=true}={}){
    el.classList.add('typing');
    if(glitch){ el.classList.add('glitch'); el.setAttribute('data-text', text); }
    el.textContent = '';
    let i=0;
    const timer = setInterval(()=>{
      el.textContent = text.slice(0, ++i);
      if(i>=text.length){ clearInterval(timer); el.classList.remove('typing'); }
    }, speed);
  }

  // ===== LOG =====
  function pushLog(sym){
    const isRed = (sym === '🔴');
    const colorWord = isRed ? 'RED' : 'BLACK';
    const row = document.createElement('div');
    row.innerHTML = `<b>[LOG]</b> <span class="${isRed ? 'red' : 'black'}">hash hackeada: ${colorWord}</span>`;
    logEl.appendChild(row);
    logEl.scrollTop = logEl.scrollHeight;
  }

  // ===== LÓGICA =====
  let seqIndex=0;
  let lastCommittedId=null;
  let pendingId=null;
  let seenCount=0;
  let pollTimer=null, barTimer=null;
  let stepsDone = 0;
  let finishedUntil = 0;
  let roundLock = false;

  function setEntry(sym){
    if(sym==='🔴'){
      entryEl.className = 'line txt-red';
      typeWrite(entryEl, '⚡ CODE RED – EXECUTAR ATAQUE');
      barEl.className = 'bar bar-red';
    }else{
      entryEl.className = 'line txt-black';
      typeWrite(entryEl, '🕶 DARK MODE – INFILTRAÇÃO');
      barEl.className = 'bar bar-black';
    }
  }

  function setProtection(){
    typeWrite(protectEl, '🔒 Protegido por criptografia Hash SHA-256', {speed:10});
  }

  function setAccessGranted(){
    typeWrite(accessEl, '✔ ACCESS GRANTED – ONLINE', {speed:12, glitch:false});
  }

  function showFinishedBadge(){
    finishedUntil = Date.now() + 60000; // 60s
    barEl.classList.add('bar-finished');
    pctEl.textContent = 'bug expoit finished';
    setTimeout(()=>{ barEl.classList.remove('bar-finished'); }, 60000);
  }

  function startBar(){
    if(barTimer) clearInterval(barTimer);
    roundLock = true;
    spin.classList.add('spinning');

    let elapsed=0, total=BAR_SECONDS*1000, step=40;
    barEl.style.width='0%';
    if (Date.now() > finishedUntil) pctEl.textContent='0%';

    barTimer=setInterval(()=>{
      elapsed+=step;
      const pct = Math.min(100, (elapsed/total)*100);
      barEl.style.width = pct + '%';
      if (Date.now() > finishedUntil) pctEl.textContent = Math.round(pct) + '%';

      if(pct>=100){
        clearInterval(barTimer); barTimer=null;
        spin.classList.remove('spinning');
        roundLock = false;
      }
    }, step);
  }

  async function poll(){
    try{
      if (roundLock) return;

      const res = await fetch(API, {cache:'no-store'});
      const data = await res.json();
      const g = Array.isArray(data) ? data[0] : data; if(!g) return;

      const gameId = g.id ?? g.hash ?? g.created_at ?? JSON.stringify(g).length;
      if (!gameId) return;

      if (gameId === lastCommittedId){
        pendingId = null;
        seenCount = 0;
        return;
      }

      if (pendingId === null || pendingId !== gameId){
        pendingId = gameId;
        seenCount = 1;
        return;
      }

      seenCount += 1;
      if (seenCount >= CONFIRM_READS){
        lastCommittedId = gameId;
        pendingId = null;
        seenCount = 0;

        const next = SEQ[seqIndex];
        setEntry(next);
        setProtection();
        setAccessGranted();
        startBar();
        pushLog(next);

        stepsDone++;
        seqIndex = (seqIndex + 1) % SEQ.length;

        if (stepsDone % SEQ.length === 0) {
          barEl.style.width = '100%';
          if (Date.now() > finishedUntil) pctEl.textContent = '100%';
          showFinishedBadge();
        }
      }
    }catch{
      // silencioso
    }
  }

  // inicial
  setAccessGranted();
  const pollBlink = setInterval(()=>spin.classList.toggle('spinning'), 2200);
  pollTimer = setInterval(poll, POLL_MS);
  poll();

  function cleanup(){
    try{ clearInterval(pollTimer);}catch{}
    try{ if(barTimer) clearInterval(barTimer);}catch{}
    try{ clearInterval(pollBlink);}catch{}
    try{ style.remove(); }catch{}
    try{ wrap.remove(); }catch{}
    delete window[TAG];
  }
  window[TAG] = { cleanup };
})();
