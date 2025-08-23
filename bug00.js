(() => {
  'use strict';

  const TAG = 'IA_BUG_SHA256_HACK_FULL_COMPACT';
  if (window[TAG]) { try { window[TAG].cleanup?.(); } catch{} }

  // ===== CONFIG =====
  const API = 'https://blaze.bet.br/api/singleplayer-originals/originals/roulette_games/recent/1';
  const POLL_MS = 850;
  const BAR_SECONDS = 3;
  const SEQ = ['🔴','⚫️','🔴','🔴','🔴','⚫️','⚫️','🔴','⚫️','🔴'];

  // ===== STYLES (versão compacta) =====
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ia-in { from{transform:translateY(-6px) scale(.98);opacity:0} to{transform:translateY(0) scale(1);opacity:1} }
    @keyframes blink { 50%{opacity:0} }
    @keyframes spin { to{ transform: rotate(360deg) } }
    @keyframes scan { 0%{transform:translateY(-100%)} 100%{transform:translateY(100%)} }
    @keyframes matrixFall { 0% { transform: translateY(-100%) } 100% { transform: translateY(100%) } }

    .ia-wrap{
      position:fixed; right:14px; top:14px; z-index:999999999;
      width:min(95vw,340px);
      border-radius:14px; overflow:hidden; user-select:none;
      background:rgba(0,0,0,.96); /* ↑ mais opaco */
      border:1px solid rgba(0,255,170,.28);
      box-shadow:0 0 22px rgba(0,255,170,.22), inset 0 0 14px rgba(0,255,170,.12);
      font-family:'Courier New', monospace;
      animation: ia-in .25s ease-out both;
    }

    .matrix{
      position:absolute; inset:0; pointer-events:none; opacity:.22; /* ↑ mais visível */
      overflow:hidden;
      mask-image: linear-gradient(to bottom, transparent, black 6%, black 94%, transparent); /* ↑ menos corte */
    }
    .matrix .col{
      position:absolute; top:-120%; width:9px; left:var(--x);
      color:#00ff9c;
      text-shadow:0 0 4px #00ff9c, 0 0 10px #00ff9c; /* ↑ brilho sutil */
      animation: matrixFall var(--d) linear infinite;
      white-space: pre; font-size:11px; line-height:11px; /* ↑ levemente maior */
    }

    .ia-head{
      position:relative; display:flex; align-items:center; gap:8px;
      padding:8px 10px;
      background: linear-gradient(90deg,rgba(16,20,18,.95),rgba(10,14,12,.95)); /* ↑ mais opaco */
      border-bottom:1px solid rgba(0,255,170,.18);
      cursor:grab;
    }
    .ia-head:active{ cursor:grabbing; }
    .spin{
      width:18px; height:18px; border-radius:999px;
      border:2px solid rgba(0,255,170,.2); border-top-color:#00ff9c;
      box-shadow:0 0 10px rgba(0,255,170,.5);
    }
    .spinning{ animation: spin .9s linear infinite; }

    .title{
      flex:1; color:#00ffbf; font-weight:700; font-size:12px;
      text-shadow:0 0 10px rgba(0,255,170,.6);
    }

    .btn{
      width:24px; height:24px; display:grid; place-items:center;
      border-radius:7px; background:rgba(0,255,170,.06);
      border:1px solid rgba(0,255,170,.15); color:#a7ffeb;
      font-size:12px; cursor:pointer; transition:.15s;
    }
    .btn:hover{ background:rgba(0,255,170,.12) }

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
      content:attr(data-text);
      position:absolute; left:0; top:0; width:100%;
      clip-path: inset(0 0 0 0);
      opacity:.8; pointer-events:none;
    }
    .glitch::before{ transform: translate(1px,0); color:#ff2b4d; mix-blend-mode: screen; filter: blur(.3px) }
    .glitch::after{ transform: translate(-1px,0); color:#00ffe1; mix-blend-mode: screen; filter: blur(.3px) }

    .bar-wrap{
      position:relative; height:18px; border-radius:10px; overflow:hidden;
      border:1px solid rgba(0,255,170,.25);
      background:rgba(0,0,0,.85); /* ↑ fundo da barra um pouco mais escuro */
      box-shadow: inset 0 0 8px rgba(0,0,0,.6);
      margin-top:6px;
    }
    .bar{ height:100%; width:0% }
    .bar-red{
      background:linear-gradient(90deg,#ff003c,#ff4b5c,#ff003c);
      box-shadow: inset 0 0 14px rgba(255,45,75,.35), 0 0 16px rgba(255,45,75,.25);
      border-right:1px solid rgba(255,60,90,.85);
    }
    .bar-black{
      background:linear-gradient(90deg, rgba(10,10,12,.55), rgba(20,20,24,.92), rgba(12,12,14,.65));
      box-shadow: inset 0 0 12px rgba(0,0,0,.75), 0 0 12px rgba(0,0,0,.35);
      border-right:1px solid rgba(120,120,130,.45);
    }
    .pct{
      position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
      font-size:11px; font-weight:700; color:#fff; text-shadow:0 1px 2px rgba(0,0,0,.7);
      text-align:center; padding:0 6px;
    }

    .protect{
      margin-top:8px; text-align:center; font-size:10px; color:#00ffe1;
      text-shadow:0 0 8px rgba(0,255,255,.45);
    }
    .access-badge{
      margin-top:4px; text-align:center; font-weight:800;
      color:#00ff6a; font-size:11px; letter-spacing:.55px;
      text-shadow:0 0 8px rgba(0,255,106,.9), 0 0 16px rgba(0,255,106,.5);
    }

    .scanline{
      position:absolute; left:0; right:0; top:0; height:28%;
      background: linear-gradient(to bottom, rgba(0,255,170,.06), transparent);
      animation: scan 2.2s linear infinite;
      pointer-events:none;
    }

    .log{
      margin-top:8px; max-height:70px; overflow:auto;
      background:rgba(0,0,0,.7); /* ↑ caixa de log ligeiramente mais opaca */
      border:1px solid rgba(0,255,170,.18);
      border-radius:8px; padding:5px 6px; font-size:10px; color:#a7ffeb;
    }
    .log b{ color:#00ff9c }
    .log .red{ color:#ff8899 }
    .log .black{ color:#e5e7eb }

    .bar-finished{ box-shadow: inset 0 0 16px rgba(0,255,170,.45), 0 0 16px rgba(0,255,170,.35) !important; }
  `;
  document.head.appendChild(style);

  // ===== UI =====
  const wrap = document.createElement('div');
  wrap.className = 'ia-wrap';
  wrap.innerHTML = `
    <div class="ia-head" id="hdr">
      <div id="spin" class="spin spinning"></div>
      <div id="title" class="title glitch" data-text="I.A Bug sha256 [HACK MODE]">I.A Bug sha256 [HACK MODE]</div>
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
  const matrixEl = wrap.querySelector('#matrix');
  const accessEl = wrap.querySelector('#accessGranted');
  const logEl = wrap.querySelector('#log');

  // matrix (↑ mais colunas e queda um pouco mais rápida)
  (function buildMatrix(){
    const cols = 16, chars = '01Δ¥$#@*&%+=<>|';
    for(let i=0;i<cols;i++){
      const col = document.createElement('div');
      col.className = 'col';
      col.style.setProperty('--x', `${(i/(cols-1))*100}%`);
      col.style.setProperty('--d', `${1.6 + Math.random()*2.6}s`);
      let s=''; for(let k=0;k<38;k++){ s += chars[Math.floor(Math.random()*chars.length)] + '\n'; }
      col.textContent = s;
      matrixEl.appendChild(col);
    }
  })();

  // drag
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

  btnClose.onclick = () => cleanup();
  btnMin.onclick = () => {
    const body = document.querySelector('.ia-body');
    const hide = body.style.display !== 'none';
    body.style.display = hide ? 'none' : '';
    btnMin.textContent = hide ? '▣' : '▁';
  };

  // typing
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

  // log
  function pushLog(sym){
    const isRed = (sym === '🔴');
    const colorWord = isRed ? 'RED' : 'BLACK';
    const row = document.createElement('div');
    row.innerHTML = `<b>[LOG]</b> <span class="${isRed ? 'red' : 'black'}">hash hackeada: ${colorWord}</span>`;
    logEl.appendChild(row);
    logEl.scrollTop = logEl.scrollHeight;
  }

  // ===== LÓGICA =====
  let seqIndex=0, lastGameId=null, pollTimer=null, barTimer=null;
  let stepsDone = 0;
  let finishedUntil = 0;      // controla os 20s da mensagem
  let roundLock = false;      // bloqueia até a barra terminar

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
    finishedUntil = Date.now() + 20000; // 20s
    barEl.classList.add('bar-finished');
    pctEl.textContent = 'BUG EXPLOIT FiNiSHED';
    setTimeout(()=>{ barEl.classList.remove('bar-finished'); }, 20000);
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
        stepsDone++;

        if (stepsDone % SEQ.length === 0) {
          barEl.style.width = '100%';
          if (Date.now() > finishedUntil) pctEl.textContent = '100%';
          showFinishedBadge();
        }
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

      if(gameId && gameId !== lastGameId){
        lastGameId = gameId;                 // fim de rodada
        const next = SEQ[seqIndex];

        setEntry(next);
        setProtection();
        setAccessGranted();
        startBar();

        pushLog(next);

        seqIndex = (seqIndex + 1) % SEQ.length;
      }
    }catch{}
  }

  // inicial
  setAccessGranted();

  pollTimer = setInterval(poll, POLL_MS);
  poll();

  function cleanup(){
    try{ clearInterval(pollTimer);}catch{}
    try{ if(barTimer) clearInterval(barTimer);}catch{}
    try{ style.remove(); }catch{}
    try{ wrap.remove(); }catch{}
    delete window[TAG];
  }
  window[TAG] = { cleanup };
})();
a
