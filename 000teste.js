(() => {
  'use strict';

  // ---------- MAPAS / ESTADO ----------
  const coresMap = {
    0: { nome: '⬜ Branco', cor: 'white', texto: 'black' },
    1: { nome: '🟥 Vermelho', cor: '#ff3c59', texto: 'white' },
    2: { nome: '⬛ Preto', cor: '#1d2027', texto: 'white' },
  };
  const getCorPorNumero = (n) => (n === 0 ? coresMap[0] : (n <= 7 ? coresMap[1] : coresMap[2]));
  const state = { ultimoId: null, sugestaoCor: null, lastSide: null };

  // ---------- STATUS (faixa preta) ----------
  const MENSAGENS = [
    'Invadindo à Api Blaze...',
    'Hackeando algoritmos...',
    'Entrada Hackeada...'
  ];
  let statusTimer = null, statusEl = null, statusCycling = true;
  const setStatus = (msg, ok=false) => {
    if (!statusEl) statusEl = document.getElementById('statusMsg');
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.color = ok ? '#7df7a1' : '#c7f5cf';
  };
  const startStatusCycle = () => {
    stopStatusCycle();
    statusCycling = true;
    let i = 0;
    setStatus(MENSAGENS[i]);
    statusTimer = setInterval(() => {
      if (!statusCycling) return;
      i = (i + 1) % MENSAGENS.length;
      setStatus(MENSAGENS[i]);
    }, 1500);
  };
  const stopStatusCycle = () => { statusCycling = false; clearInterval(statusTimer); };

  // ---------- UI AUX ----------
  const criarTile = (numero) => {
    const corData = getCorPorNumero(numero);
    const tile = document.createElement('div');
    tile.className = 'tile-wrapper';
    tile.style.cssText = `
      width:26px;height:26px;border-radius:6px;background:${corData.cor};
      display:flex;justify-content:center;align-items:center;
      font-size:13px;font-weight:700;color:${corData.texto};margin:0 4px;
      box-shadow:0 2px 5px rgba(0,0,0,.3);
    `;
    tile.textContent = numero;
    return tile;
  };

  const criarConfetti = () => {
    const wrap = document.createElement('div');
    wrap.style.cssText = `position:fixed;inset:0;pointer-events:none;z-index:999998;`;
    for (let i = 0; i < 50; i++) {
      const el = document.createElement('div');
      el.textContent = '💸';
      el.style.cssText = `
        position:absolute;top:${Math.random()*100}%;left:${Math.random()*100}%;
        font-size:${12 + Math.random()*16}px;animation:fall 2.5s linear forwards;
      `;
      wrap.appendChild(el);
    }
    document.body.appendChild(wrap);
    setTimeout(() => wrap.remove(), 3000);
  };

  const mostrarResultadoFinal = (tipo) => {
    const box = document.createElement('div');
    const bg = tipo === 'win' ? '#28a745' : '#dc3545';
    box.textContent = tipo === 'win' ? '✅ GANHOU' : '❌ PERDEU';
    box.style.cssText = `
      position:fixed;top:70px;left:50%;transform:translateX(-50%);
      background:${bg};color:#fff;padding:8px 16px;font-weight:700;border-radius:8px;
      font-family:sans-serif;z-index:999999;box-shadow:0 0 12px ${bg};
    `;
    document.body.appendChild(box);
    if (tipo === 'win') criarConfetti();
    setTimeout(() => box.remove(), 2000);
  };

  const atualizarUltimos = () => {
    const tiles = Array.from(document.querySelectorAll('#roulette-recent .entry .roulette-tile'))
      .slice(0, 6).reverse();
    const entradas = tiles.map(tile => {
      const txt = tile.innerText.trim();
      if (txt === '') return tile.querySelector('svg') ? 0 : null;
      const n = parseInt(txt, 10);
      return Number.isNaN(n) ? null : n;
    }).filter(n => n !== null);

    const box = document.getElementById('ultimosResultados');
    if (!box) return entradas;
    box.innerHTML = '';
    entradas.forEach(num => box.appendChild(criarTile(num)));
    return entradas;
  };

  // ---------- CORE ----------
  const atualizarResultado = async () => {
    try {
      startStatusCycle();
      const resp = await fetch('https://blaze.bet.br/api/singleplayer-originals/originals/roulette_games/recent/1');
      const data = await resp.json();
      const d = data[0];
      if (!d || d.id === state.ultimoId) return;

      const cor = getCorPorNumero(d.roll);
      if (state.sugestaoCor !== null) {
        mostrarResultadoFinal(cor.cor === state.sugestaoCor ? 'win' : 'loss');
      }

      state.ultimoId = d.id;

      const resultNumberCircle = document.getElementById('resultNumberCircle');
      if (resultNumberCircle) {
        resultNumberCircle.textContent = d.roll;
        resultNumberCircle.style.background = cor.cor;
        resultNumberCircle.style.color = cor.texto;
      }
      const resultSmBox = document.getElementById('resultSmBox');
      if (resultSmBox) resultSmBox.style.backgroundColor = cor.cor;

      const entradas = atualizarUltimos();

      // ===== LÓGICA DE SUGESTÃO =====
      const corPorNumero = n => (n === 0 ? 'branco' : (n <= 7 ? 'vermelho' : 'preto'));
      let sugestao = null;
      if (entradas && entradas.length >= 2) {
        const cores = entradas.map(corPorNumero).reverse().join(',');
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
        for (const p of padroes) { if (cores.includes(p.seq)) { sugestao = p.sugestao; break; } }
        if (!sugestao) {
          const anterior = corPorNumero(entradas[0]);
          sugestao = anterior === 'vermelho' ? 'preto' : 'vermelho';
        }
      }

      // ===== ATUALIZA O BOTÃO DIVIDIDO =====
      const entradaHeader = document.getElementById('entradaHeader');
      const red = document.getElementById('btnVermelho');
      const blk = document.getElementById('btnPreto');

      const applySide = (side) => {
        red.classList.remove('active-red','dim');
        blk.classList.remove('active-black','dim');

        if (side === 'vermelho') {
          red.classList.add('active-red');
          blk.classList.add('dim');
          entradaHeader.textContent = 'Entrada: Vermelho';
          state.sugestaoCor = '#ff3c59';
          red.style.setProperty('--accent', '#ff3c59');
        } else if (side === 'preto') {
          blk.classList.add('active-black');
          red.classList.add('dim');
          entradaHeader.textContent = 'Entrada: Preto';
          state.sugestaoCor = '#1d2027';
          blk.style.setProperty('--accent', '#6b7a90'); // realce do preto (cinza azulado)
        } else {
          entradaHeader.textContent = 'Sem entrada';
          state.sugestaoCor = null;
        }

        // vibração sutil ao mudar de lado (mobile)
        if (side && state.lastSide !== side && 'vibrate' in navigator) {
          navigator.vibrate?.(15);
        }
        state.lastSide = side || null;
      };

      if (sugestao === 'vermelho') applySide('vermelho');
      else if (sugestao === 'preto') applySide('preto');
      else applySide(null);

      // feedback nas mensagens
      stopStatusCycle();
      setStatus('Entrada Hackeada...', true);
      setTimeout(() => startStatusCycle(), 2000);

    } catch (e) {
      console.error('Erro ao buscar dados da roleta:', e);
    }
  };

  // ---------- UI / ESTILO ----------
  const setupUI = () => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fall { to { transform: translateY(100vh); opacity:0; } }
      @keyframes slide { 0% { transform:translateX(100%); } 100% { transform:translateX(-100%); } }

      /* Efeitos pro botão profissional */
      @keyframes neonPulse {
        0%,100% { box-shadow: 0 0 0 rgba(0,0,0,0), 0 0 18px var(--accent, #fff); filter: saturate(1); }
        50% { box-shadow: 0 0 0 rgba(0,0,0,0), 0 0 32px var(--accent, #fff); filter: saturate(1.25); }
      }
      @keyframes borderFlow {
        0% { --rot: 0deg; } 100% { --rot: 360deg; }
      }
      @keyframes sheen {
        0% { transform: translateX(-120%); opacity: 0; }
        40% { opacity: .25; }
        100% { transform: translateX(120%); opacity: 0; }
      }

      #blazeMenu{
        position:fixed; top:100px; left:50%; transform:translateX(-50%);
        width:220px; background:rgba(29,32,39,.95); color:#fff;
        font-family:'Inter',sans-serif; border-radius:12px;
        box-shadow:0 8px 25px rgba(0,0,0,.7); padding:16px;
        z-index:99999; box-sizing:border-box; border:1px solid rgba(255,255,255,.1);
      }
      #blazeMenu .closeBtn{
        position:absolute; top:6px; right:8px; width:22px; height:22px; border-radius:50%;
        background:rgba(255,255,255,.12); color:#fff; display:flex; align-items:center; justify-content:center;
        font-size:14px; cursor:pointer; user-select:none; z-index:1;
      }

      /* Faixa preta topo */
      .headerMsg{
        font-size:13px; text-align:center; font-weight:600;
        background:rgba(0,0,0,.6); padding:6px 10px; border-radius:8px; margin-bottom:12px;
        display:flex; align-items:center; justify-content:center;
        white-space:nowrap; overflow:hidden; text-overflow:ellipsis; min-height:28px;
      }
      #statusMsg{ display:inline-block; white-space:nowrap; }

      .usernameSlider{ width:100%; overflow:hidden; white-space:nowrap; box-sizing:border-box; }
      .usernameSlider span{
        display:inline-block; color:#00ff00; font-weight:bold; font-size:15px;
        padding-left:100%; animation:slide 10s linear infinite;
      }

      #resultSmBox{
        width:72px;height:72px;display:flex;justify-content:center;align-items:center;
        margin:16px auto;border-radius:50%;box-shadow:0 0 22px rgba(255,60,89,.9);
      }
      #resultNumberCircle{
        width:62px;height:62px;border-radius:50%;display:flex;align-items:center;justify-content:center;
        font-weight:900;font-size:32px;color:#fff;
      }

      /* ---- Botão dividido PRO ---- */
      #entradaHeader{
        text-align:center; font-size:13px; opacity:.95; margin:10px 0 8px; font-weight:700;
      }
      .splitAction{
        display:flex; gap:10px; align-items:center; justify-content:center;
      }
      .half{
        --accent: #ffffff;
        position:relative; overflow:hidden;
        flex:1; height:44px; border-radius:14px;
        display:flex; align-items:center; justify-content:center;
        font-weight:900; font-size:14px; letter-spacing:.25px;
        border:1px solid rgba(255,255,255,.12);
        background:
          radial-gradient(120% 120% at 50% 0%, rgba(255,255,255,.14), transparent 60%),
          linear-gradient(180deg, rgba(255,255,255,.06), rgba(0,0,0,.12));
        box-shadow:0 6px 18px rgba(0,0,0,.35);
        transition: transform .15s ease, filter .15s ease, box-shadow .15s ease, border-color .15s ease;
        user-select:none; text-transform:capitalize;
      }
      .half:active{ transform: translateY(1px) scale(.99); }

      /* cores base */
      #btnVermelho{ color:#fff; background:
        radial-gradient(140% 100% at 50% -10%, rgba(255,255,255,.20), transparent 55%),
        linear-gradient(180deg, #ff596f, #ff3c59); }
      #btnPreto{ color:#fff; background:
        radial-gradient(140% 100% at 50% -10%, rgba(255,255,255,.15), transparent 55%),
        linear-gradient(180deg, #2c3340, #1d2027); }

      /* estado reduzido */
      .half.dim{ filter: saturate(.85) brightness(.92); opacity:.9; }

      /* estado ativo PRO */
      .half.active-red,
      .half.active-black{
        filter: saturate(1.15) brightness(1.02);
        border-color: rgba(255,255,255,.22);
        animation: neonPulse 1.1s ease-in-out infinite;
      }
      /* anel/borda viva */
      .half.active-red::before,
      .half.active-black::before{
        content:"";
        position:absolute; inset:-1px; border-radius:inherit; pointer-events:none;
        background:
          conic-gradient(from var(--rot,0deg),
            rgba(255,255,255,.0), rgba(255,255,255,.0) 20%,
            var(--accent) 35%, rgba(255,255,255,.0) 55%,
            rgba(255,255,255,.0) 75%, var(--accent) 85%, rgba(255,255,255,.0) 100%);
        -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
        -webkit-mask-composite: xor; mask-composite: exclude;
        padding:1px;
        animation: borderFlow 3s linear infinite;
        opacity:.85;
      }
      /* brilho passando */
      .half.active-red::after,
      .half.active-black::after{
        content:"";
        position:absolute; inset:0; border-radius:inherit; pointer-events:none;
        background: linear-gradient(110deg, transparent 0%, rgba(255,255,255,.35) 10%, transparent 20%);
        transform: translateX(-120%);
        animation: sheen 1.8s ease-in-out infinite;
      }

      #ultimosResultados{
        display:flex;justify-content:center;margin:16px 0 0;padding-top:12px;
        border-top:1px solid rgba(255,255,255,.2);
      }
      .statusOnline{
        text-align:center;font-size:12px;margin-top:12px;color:#00ff00;font-weight:bold;
        background:rgba(0,0,0,.6);padding:5px 10px;border-radius:8px;display:inline-block;
      }
      .dotOnline{ width:9px;height:9px;background:#00ff00;border-radius:50%;display:inline-block;margin-right:8px;animation:pulse 1.5s infinite; }
      @keyframes pulse{0%{transform:scale(1);opacity:.8}50%{transform:scale(1.6);opacity:.4}100%{transform:scale(1);opacity:.8}}
    `;
    document.head.appendChild(style);

    const menu = document.createElement('div');
    menu.id = 'blazeMenu';
    menu.innerHTML = `
      <div class="closeBtn" id="blazeCloseBtn">✕</div>
      <div class="headerMsg"><span id="statusMsg">Invadindo à Api Blaze...</span></div>
      <div class="usernameSlider"><span>@i.adouble00</span></div>
      <div id="resultSmBox"><div id="resultNumberCircle"></div></div>

      <div id="entradaHeader">Sem entrada</div>
      <div class="splitAction">
        <div id="btnVermelho" class="half dim" aria-label="Apostar no Vermelho">Vermelho</div>
        <div id="btnPreto" class="half dim" aria-label="Apostar no Preto">Preto</div>
      </div>

      <div id="ultimosResultados"></div>
      <div class="statusOnline"><span class="dotOnline"></span>Online</div>
    `;
    document.body.appendChild(menu);
    statusEl = document.getElementById('statusMsg');
    startStatusCycle();

    // -------- VISIBILIDADE / TOGGLE ----------
    const isHidden = () => window.getComputedStyle(menu).display === 'none';
    const showMenu = () => { menu.style.display = 'block'; };
    const hideMenu = () => { menu.style.display = 'none'; };
    const toggleMenu = () => { isHidden() ? showMenu() : hideMenu(); };

    // X fecha
    const closeBtn = document.getElementById('blazeCloseBtn');
    const onClose = (e) => { e.preventDefault(); e.stopPropagation(); hideMenu(); };
    closeBtn.addEventListener('click', onClose, { passive:false });
    closeBtn.addEventListener('touchend', onClose, { passive:false });

    // Toggle fora do menu
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (!isTouch) {
      document.addEventListener('dblclick', (e) => {
        if (e.target.closest('#blazeMenu')) return;
        toggleMenu();
      });
    } else {
      let tapCount = 0, tapTimer = null, startX = 0, startY = 0, moved = false;
      document.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) return;
        const t = e.touches[0]; startX = t.clientX; startY = t.clientY; moved = false;
      }, { passive:true });
      document.addEventListener('touchmove', (e) => {
        const t = e.touches[0]; if (!t) return;
        if (Math.abs(t.clientX - startX) + Math.abs(t.clientY - startY) > 12) moved = true;
      }, { passive:true });
      document.addEventListener('touchend', (e) => {
        if (e.target.closest('#blazeMenu')) return;
        if (moved) return;
        tapCount++; clearTimeout(tapTimer);
        tapTimer = setTimeout(() => {
          if (tapCount >= 2) { e.preventDefault(); toggleMenu(); }
          tapCount = 0;
        }, 250);
      }, { passive:false });
    }

    // -------- DRAG ----------
    let isDragging = false, offsetX = 0, offsetY = 0;
    const startDrag = (evt, x, y) => {
      if (evt.target.closest('#blazeCloseBtn')) return;
      isDragging = true; offsetX = x - menu.offsetLeft; offsetY = y - menu.offsetTop;
    };
    const drag = (x, y) => {
      if (!isDragging) return;
      menu.style.left = `${x - offsetX}px`;
      menu.style.top = `${y - offsetY}px`;
      menu.style.transform = 'translateX(0)';
    };
    menu.style.left = '50%';
    menu.style.transform = 'translateX(-50%)';
    menu.addEventListener('mousedown', e => startDrag(e, e.clientX, e.clientY));
    document.addEventListener('mousemove', e => drag(e.clientX, e.clientY));
    document.addEventListener('mouseup', () => isDragging = false);
    menu.addEventListener('touchstart', e => {
      const t = e.touches[0]; if (!t) return;
      if (e.target.closest('#blazeCloseBtn')) return;
      startDrag(e, t.clientX, t.clientY); e.preventDefault();
    }, { passive:false });
    document.addEventListener('touchmove', e => {
      const t = e.touches[0]; if (t) drag(t.clientX, t.clientY);
    }, { passive:false });
    document.addEventListener('touchend', () => { isDragging = false; });
  };

  // ---------- RUN ----------
  setupUI();
  setInterval(atualizarResultado, 2000);
})();
