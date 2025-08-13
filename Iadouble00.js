(() => {
  'use strict';
  const BOOT_TAG = 'DB_DRAWER_BOOT_V7';
  if (window[BOOT_TAG]) { try{ window[BOOT_TAG].cleanup?.(); }catch{} }

  // ===== CONFIG =====
  const BG_IMAGE_URL = 'https://i.ibb.co/WWBTZ970/7d95bfc5-10db-4187-b2e8-8517f56904cd.jpg';
  const ENTRY_SECONDS = 5, TICK_MS = 40;
  const SHOW_100_PROB = 0.85;
  const MIN_ASSERT = 99.00;
  const STEP_MS = 120;
  const BLAZE_API = 'https://blaze.bet.br/api/singleplayer-originals/originals/roulette_games/recent/1';
  const LAST_N = 8;

  const HACK_LINES = [
    'Desativando firewall...',
    'Injetando Códigos Maliciosos...',
    'Explorando Injeção SQL...',
    'Quebrando Hash SHA256...'
  ];

  const state = {
    barTimer:null, fetchTimer:null, statusTimer:null, lastId:null,
    vibrateOn:false, audioOn:false,
    sugestaoNome:null, lastSide:null,
    predSide:null,
    isHidden:false,
    drag:{active:false,startX:0,startY:0,origLeft:0,origTop:0}
  };

  // ===== HANDLE =====
  let handleBtn = document.getElementById('db-handle-safe');
  if (!handleBtn) {
    handleBtn = document.createElement('button');
    handleBtn.id = 'db-handle-safe';
    handleBtn.textContent = '☰ Abrir Painel';
    handleBtn.style.cssText = `
      position:fixed; left:12px; bottom:16px; z-index:2147483647;
      background:#0d0f14; color:#fff; border:1px solid rgba(255,255,255,.18);
      border-radius:10px; padding:10px 12px; font-weight:800; cursor:pointer;
      box-shadow:0 8px 24px rgba(0,0,0,.6);
    `;
    document.body.appendChild(handleBtn);
  }

  // ===== CSS =====
  const injectStyles = () => {
    if (document.getElementById('db-style')) return;
    const style = document.createElement('style');
    style.id = 'db-style';
    style.textContent = `
      @keyframes pulse{0%{transform:scale(1);opacity:.8}50%{transform:scale(1.5);opacity:.4}100%{transform:scale(1);opacity:.8}}
      @keyframes pop{0%{transform:scale(.85);opacity:0} 25%{opacity:1} 100%{transform:scale(1);opacity:1}}
      @keyframes floatfade{0%{transform:translateY(0);opacity:.95}100%{transform:translateY(-12px);opacity:0}}
      #db-drawer{
        position:fixed; top:60px; left:12px; width:280px; max-width:90vw;
        background:rgba(29,32,39,.95); color:#fff; z-index:2147483600;
        border:1px solid rgba(255,255,255,.12); border-radius:14px;
        box-shadow:0 10px 30px rgba(0,0,0,.6); overflow:hidden; transform:translateX(0);
        transition:transform .25s ease; touch-action:none;
      }
      #db-drawer.collapsed{ transform:translateX(-260px); }
      #db-drawer::before{
        content:""; position:absolute; inset:0; z-index:0;
        background-image:var(--bg, none); background-size:cover; background-position:center;
        filter:brightness(.55);
      }
      #db-drawer::after{
        content:""; position:absolute; inset:0; z-index:0;
        background:radial-gradient(120% 120% at 50% 0%, rgba(255,255,255,.06), transparent 60%),
                   linear-gradient(180deg, rgba(0,0,0,.15), rgba(0,0,0,.35));
      }
      #db-drawer > *{ position:relative; z-index:1; }
      .db-head{ display:flex; align-items:center; justify-content:space-between; gap:8px; padding:10px 12px; background:rgba(0,0,0,.5); cursor:grab; touch-action:none; }
      .db-head.dragging{ cursor:grabbing; }
      .db-status{ font-size:12px; font-weight:800; color:#ff3c59 }
      .db-section{ padding:10px 12px; }
      .entryLabel{ font-size:12px; font-weight:900; margin:6px 0 }
      .entryBg{ position:relative; width:100%; height:12px; border-radius:999px;
        background:linear-gradient(180deg, rgba(255,255,255,.06), rgba(0,0,0,.24));
        overflow:hidden; box-shadow: inset 0 0 6px rgba(0,0,0,.6); }
      .entryFill{ width:0%; height:100%; border-radius:999px; transition:width .04s linear;
        background: var(--fill,#ff1744); box-shadow: 0 0 16px var(--glow,#ff1744), inset 0 0 8px rgba(255,255,255,.15); }
      .entryFill.burst{ box-shadow: 0 0 26px var(--glow), inset 0 0 10px rgba(255,255,255,.22); }
      .entryPct{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
        font-size:11px; font-weight:900; letter-spacing:.3px; color:#fff; text-shadow:0 0 6px rgba(0,0,0,.8); }
      .quick-grid{ display:grid; grid-template-columns:1fr; gap:8px; margin-top:10px; }
      .qbtn{ background:rgba(0,0,0,.5); border:1px solid rgba(255,255,255,.15); color:#fff;
        border-radius:10px; padding:8px; text-align:center; font-size:12px; font-weight:800; cursor:pointer; user-select:none; }
      .qbtn:active{ transform:scale(.98) }
      #ultimosResultados{ display:grid; grid-template-columns:repeat(8, 26px); gap:6px; margin-top:10px; }
      .tile{ width:26px; height:26px; border-radius:6px; display:flex; align-items:center; justify-content:center;
             font-size:12px; font-weight:800; box-shadow:0 2px 5px rgba(0,0,0,.3) }
      #winloss{
        position:absolute; top:10px; right:10px; z-index:2;
        padding:6px 10px; border-radius:999px; font-weight:900; font-size:12px;
        border:1px solid rgba(255,255,255,.18); animation:pop .18s ease;
        background:rgba(0, 255, 163, .15); color:#00ffa3;
      }
    `;
    document.head.appendChild(style);
  };

  // ===== Drawer UI =====
  const buildDrawer = () => {
    if (document.getElementById('db-drawer')) return;
    const box = document.createElement('div');
    box.id = 'db-drawer';
    box.innerHTML = `
      <div class="db-head" id="db-head">
        <div class="db-status" id="statusMsg">Carregado</div>
        <div style="width:9px;height:9px;background:#00ff00;border-radius:50%;animation:pulse 1.5s infinite;"></div>
      </div>

      <div class="db-section">
        <div class="entryLabel" id="entryLabel">Sem entrada</div>
        <div class="entryBg">
          <div id="entryFill" class="entryFill"></div>
          <div id="entryPct" class="entryPct"></div>
        </div>
      </div>

      <div class="db-section">
        <div class="quick-grid">
          <div class="qbtn" id="btnOpen">Abrir Roleta</div>
        </div>
      </div>

      <div class="db-section">
        <div style="font-size:12px;opacity:.85;margin-bottom:6px;font-weight:700">Últimos resultados</div>
        <div id="ultimosResultados"></div>
      </div>
    `;
    box.style.setProperty('--bg', `url('${BG_IMAGE_URL}')`);
    document.body.appendChild(box);
    return box;
  };

  // ===== Helpers =====
  const fmtBR = (v)=>v.toFixed(2).replace('.', ',');
  const setStatus = (msg) => { const el = document.getElementById('statusMsg'); if (el) el.textContent = msg; };
  const setRandomStatus = () => setStatus(HACK_LINES[Math.floor(Math.random()*HACK_LINES.length)]);
  const corPorNumero = n => (n === 0 ? 'branco' : (n <= 7 ? 'vermelho' : 'preto'));
  const sideFromApi = (d) => {
    if (!d) return null;
    if (typeof d.color === 'string') {
      const c = d.color.toLowerCase();
      if (c.includes('red')) return 'vermelho';
      if (c.includes('black')) return 'preto';
      if (c.includes('white')) return 'branco';
    }
    if (typeof d.color === 'number') return d.color===0?'branco':(d.color===1?'vermelho':'preto');
    const n = Number(d.roll ?? d.number ?? d.result ?? d.value);
    return Number.isFinite(n) ? corPorNumero(n) : null;
  };

  const criarTile = (numero) => {
    const n = Number(numero);
    let cor = '#1d2027', txt='#fff';
    if (n === 0) { cor = 'white'; txt='#000'; }
    else if (n >= 1 && n <= 7) { cor = '#ff3c59'; txt='#fff'; }
    const d = document.createElement('div');
    d.className = 'tile'; d.style.background = cor; d.style.color = txt; d.textContent = isNaN(n)?'':n;
    return d;
  };

  const atualizarUltimos = () => {
    try {
      const tiles = Array.from(document.querySelectorAll('#roulette-recent .entry .roulette-tile'))
        .slice(0, LAST_N).reverse();
      const entradas = tiles.map(tile => {
        const txt = tile.innerText.trim();
        if (txt === '') return tile.querySelector('svg') ? 0 : null;
        const n = parseInt(txt, 10);
        return Number.isNaN(n) ? null : n;
      }).filter(n => n !== null);

      const box = document.getElementById('ultimosResultados');
      if (!box) return entradas;
      box.innerHTML = '';
      entradas.slice(0, LAST_N).forEach(num => box.appendChild(criarTile(num)));
      return entradas;
    } catch{ return []; }
  };

  const stopEntryBar = () => {
    clearInterval(state.barTimer); state.barTimer=null;
    const fill = document.getElementById('entryFill');
    const label = document.getElementById('entryLabel');
    const pct = document.getElementById('entryPct');
    if (fill) fill.style.width = '0%';
    if (pct) pct.textContent = '';
    if (label) label.textContent = 'Sem entrada';
  };

  // ASSERTIVIDADE 99~100 com 85% = 100%
  const startEntryBar = (side) => {
    stopEntryBar();
    const wrap = document.querySelector('.entryBg');
    const fill = document.getElementById('entryFill');
    const label = document.getElementById('entryLabel');
    const pct = document.getElementById('entryPct');
    if (!wrap || !fill || !label || !pct) return;

    const isRed = side === 'vermelho';
    const fillColor = isRed ? '#ff1744' : '#1d2027';
    const glowColor = isRed ? '#ff1744' : '#000000';
    wrap.style.setProperty('--fill', fillColor);
    wrap.style.setProperty('--glow', glowColor);
    label.textContent = `Entrar no ${isRed ? 'Vermelho' : 'Preto'}`;

    const force100 = Math.random() < SHOW_100_PROB;
    let shownVal = force100 ? 100.00 : (99 + Math.random() * (0.999));
    shownVal = +shownVal.toFixed(2);
    let stepAcc = 0, elapsed = 0, total = ENTRY_SECONDS * 1000;

    state.barTimer = setInterval(() => {
      elapsed += TICK_MS;
      const w = Math.min(100, Math.round((elapsed/total)*100));
      fill.style.width = w + '%';

      if (force100) {
        pct.textContent = '100%';
      } else {
        stepAcc += TICK_MS;
        if (stepAcc >= STEP_MS) {
          stepAcc = 0;
          const delta = (Math.random() * 0.06) - 0.03;
          shownVal = Math.min(99.99, Math.max(MIN_ASSERT, +(shownVal + delta).toFixed(2)));
        }
        pct.textContent = `${fmtBR(shownVal)}%`;
      }

      if (w >= 100) {
        clearInterval(state.barTimer);
        fill.classList.add('burst');
        setTimeout(()=>fill.classList.remove('burst'), 350);
        pct.textContent = force100 ? '100%' : pct.textContent;
      }
    }, TICK_MS);
  };

  const applySide = (side) => {
    if (side === 'vermelho') { state.sugestaoNome = 'vermelho'; startEntryBar('vermelho'); }
    else if (side === 'preto') { state.sugestaoNome = 'preto'; startEntryBar('preto'); }
    else { state.sugestaoNome = null; stopEntryBar(); }
    state.lastSide = side || null;
  };

  const showGanhou = () => {
    const root = document.getElementById('db-drawer');
    if (!root) return;
    root.querySelector('#winloss')?.remove();
    const tag = document.createElement('div');
    tag.id = 'winloss';
    tag.textContent = 'GANHOU';
    root.appendChild(tag);
    setTimeout(()=> { tag.style.animation = 'floatfade .9s ease forwards';
      setTimeout(()=>tag.remove(), 900);
    }, 800);
  };

  // ===== FETCH LOOP =====
  const atualizar = async () => {
    try {
      const r = await fetch(BLAZE_API, { cache:'no-store' });
      if (!r.ok) return;
      const data = await r.json();
      const d = data && data[0];
      if (!d || d.id === state.lastId) return;

      const atualSide = sideFromApi(d);
      if (state.predSide && atualSide && (atualSide === state.predSide)) showGanhou();

      atualizarUltimos();

      const entradas = atualizarUltimos();
      const sug = (()=>{
        if (!entradas || entradas.length < 2) return null;
        const cores = entradas.map(n => (n===0?'branco':(n<=7?'vermelho':'preto'))).reverse().join(',');
        const padroes = [
          { seq: 'preto,preto,preto', sugestao: 'preto' },
          { seq: 'vermelho,vermelho,vermelho', sugestao: 'vermelho' },
          { seq: 'vermelho,vermelho,vermelho,vermelho', sugestao: 'vermelho' },
          { seq: 'vermelho,preto,vermelho,preto', sugestao: 'vermelho' },
          { seq: 'preto,vermelho,preto,vermelho', sugestao: 'preto' },
          { seq: 'preto,vermelho', sugestao: 'preto' },
          { seq: 'vermelho,preto', sugestao: 'vermelho' },
          { seq: 'vermelho,vermelho,preto', sugestao: 'preto' },
          { seq: 'preto,preto,vermelho', sugestao: 'vermelho' },
          { seq: 'vermelho,preto,preto,vermelho', sugestao: 'vermelho' },
          { seq: 'preto,vermelho,vermelho,preto', sugestao: 'preto' },
        ];
        for (const p of padroes) if (cores.includes(p.seq)) return p.sugestao;
        const anterior = (entradas[0]===0?'branco':(entradas[0]<=7?'vermelho':'preto'));
        return anterior === 'vermelho' ? 'preto' : 'vermelho';
      })();

      applySide(sug);
      state.predSide = sug;
      state.lastId = d.id;
      setRandomStatus();
    } catch(e){
      setStatus('Falha ao consultar API');
    }
  };

  // ===== Visibilidade com duplo clique / toque =====
  const setHidden = (hide) => {
    state.isHidden = !!hide;
    const drawer = document.getElementById('db-drawer');
    const handle = document.getElementById('db-handle-safe');
    const disp = state.isHidden ? 'none' : '';
    if (drawer) drawer.style.display = disp;
    if (handle) handle.style.display = disp;
  };
  const toggleHidden = () => setHidden(!state.isHidden);

  const setupDoubleToggle = () => {
    // desktop
    document.addEventListener('dblclick', () => { if (!state.drag.active) toggleHidden(); }, {capture:true});
    // mobile (double tap)
    let lastTap = 0;
    document.addEventListener('touchstart', (e) => {
      const now = Date.now();
      if (now - lastTap < 320 && !state.drag.active) {
        toggleHidden();
        lastTap = 0;
      } else {
        lastTap = now;
      }
    }, {passive:true, capture:true});
  };

  // ===== Drag (arrastável) =====
  const clamp = (v,min,max)=>Math.max(min,Math.min(max,v));
  const setupDrag = () => {
    const drawer = document.getElementById('db-drawer');
    const head = document.getElementById('db-head');
    if (!drawer || !head) return;

    const onDown = (e) => {
      state.drag.active = true;
      head.classList.add('dragging');
      const rect = drawer.getBoundingClientRect();
      state.drag.startX = (e.touches?.[0]?.clientX ?? e.clientX);
      state.drag.startY = (e.touches?.[0]?.clientY ?? e.clientY);
      state.drag.origLeft = rect.left;
      state.drag.origTop = rect.top;
      e.preventDefault();
    };
    const onMove = (e) => {
      if (!state.drag.active) return;
      const x = (e.touches?.[0]?.clientX ?? e.clientX);
      const y = (e.touches?.[0]?.clientY ?? e.clientY);
      const dx = x - state.drag.startX;
      const dy = y - state.drag.startY;
      const w = drawer.offsetWidth;
      const h = drawer.offsetHeight;
      const nl = clamp(state.drag.origLeft + dx, 0, window.innerWidth - w);
      const nt = clamp(state.drag.origTop + dy, 0, window.innerHeight - Math.min(h, window.innerHeight));
      drawer.style.left = nl + 'px';
      drawer.style.top = nt + 'px';
    };
    const onUp = () => {
      if (!state.drag.active) return;
      state.drag.active = false;
      head.classList.remove('dragging');
    };

    head.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove, {passive:false});
    window.addEventListener('mouseup', onUp);

    head.addEventListener('touchstart', onDown, {passive:false});
    window.addEventListener('touchmove', onMove, {passive:false});
    window.addEventListener('touchend', onUp, {passive:true});
    window.addEventListener('touchcancel', onUp, {passive:true});
  };

  // ===== Boot =====
  const boot = () => {
    injectStyles();
    const drawer = buildDrawer();
    if (!drawer) return;
    drawer.style.setProperty('--bg', `url('${BG_IMAGE_URL}')`);

    // Botão abrir roleta
    drawer.querySelector('#btnOpen').onclick =
      ()=> window.open('https://blaze.com/pt/games/double','_blank');

    // Botão recolher (segue funcionando)
    handleBtn.onclick = () => {
      drawer.classList.toggle('collapsed');
      handleBtn.textContent = drawer.classList.contains('collapsed') ? '☰ Abrir Painel' : '☰ Recolher';
    };
    if (drawer.classList.contains('collapsed')) drawer.classList.remove('collapsed');
    handleBtn.textContent = '☰ Recolher';

    // Drag + duplo clique/toque
    setupDrag();
    setupDoubleToggle();

    // Loops
    clearInterval(state.fetchTimer);
    state.fetchTimer = setInterval(atualizar, 2000);

    clearInterval(state.statusTimer);
    setRandomStatus();
    state.statusTimer = setInterval(setRandomStatus, 3000);

    // Expor cleanup
    window[BOOT_TAG] = {
      cleanup(){
        try{
          clearInterval(state.fetchTimer);
          clearInterval(state.barTimer);
          clearInterval(state.statusTimer);
          document.getElementById('db-style')?.remove();
          document.getElementById('db-drawer')?.remove();
          document.getElementById('db-handle-safe')?.remove();
        }catch(e){}
      }
    };
  };

  boot();
})();
