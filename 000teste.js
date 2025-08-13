(() => {
  'use strict';

  const coresMap = {
    0: { nome: '⬜ Branco', cor: 'white', texto: 'black' },
    1: { nome: '🟥 Vermelho', cor: '#ff3c59', texto: 'white' },
    2: { nome: '⬛ Preto', cor: '#1d2027', texto: 'white' },
  };
  const getCorPorNumero = (num) => (num === 0 ? coresMap[0] : (num >= 1 && num <= 7 ? coresMap[1] : coresMap[2]));
  const state = { ultimoId: null, sugestaoCor: null };

  // --- UI helpers ---
  const setStatus = (msg, kind='info') => {
    const el = document.getElementById('statusMsg');
    if (!el) return;
    el.textContent = msg;
    el.style.color = kind === 'ok' ? '#00ff88' : '#9fe89f';
  };

  let statusTimer = null;
  const startStatusCycle = () => {
    clearInterval(statusTimer);
    const msgs = ['Aplicando PROX…', 'Localizando padrões…', 'Analisando entradas…'];
    let i = 0;
    setStatus(msgs[i]);
    statusTimer = setInterval(() => { i = (i + 1) % msgs.length; setStatus(msgs[i]); }, 1500);
  };
  const stopStatusCycle = () => clearInterval(statusTimer);

  const criarTile = (numero) => {
    const corData = getCorPorNumero(numero);
    const tile = document.createElement('div');
    tile.className = 'tile-wrapper';
    tile.style.cssText = `
      width: 26px; height: 26px; border-radius: 6px;
      background-color: ${corData.cor}; display: flex;
      justify-content: center; align-items: center;
      font-size: 13px; font-weight: bold;
      color: ${corData.texto}; margin: 0 4px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    `;
    tile.textContent = numero;
    return tile;
  };

  const criarConfetti = () => {
    const wrapper = document.createElement('div');
    wrapper.id = 'confettiWrapper';
    wrapper.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      pointer-events: none; z-index: 999998;
    `;
    for (let i = 0; i < 50; i++) {
      const el = document.createElement('div');
      el.textContent = '💸';
      el.style.cssText = `
        position: absolute; top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%; font-size: ${12 + Math.random() * 16}px;
        animation: fall 2.5s linear forwards;
      `;
      wrapper.appendChild(el);
    }
    document.body.appendChild(wrapper);
    setTimeout(() => wrapper.remove(), 3000);
  };

  const mostrarResultadoFinal = (tipo) => {
    const box = document.createElement('div');
    box.id = 'resultadoFinalBox';
    box.textContent = tipo === 'win' ? '✅ GANHOU' : '❌ PERDEU';
    const bgColor = tipo === 'win' ? '#28a745' : '#dc3545';
    box.style.cssText = `
      position: fixed; top: 70px; left: 50%; transform: translateX(-50%);
      background: ${bgColor}; color: white; padding: 8px 16px; font-weight: bold;
      border-radius: 8px; font-family: sans-serif; z-index: 999999;
      box-shadow: 0 0 12px ${bgColor};
    `;
    document.body.appendChild(box);
    if (tipo === 'win') criarConfetti();
    setTimeout(() => box.remove(), 3000);
  };

  const atualizarUltimos = () => {
    const tiles = Array.from(document.querySelectorAll('#roulette-recent .entry .roulette-tile')).slice(0, 6).reverse();
    const entradas = tiles.map(tile => {
      const numero = tile.innerText.trim();
      if (numero === '') return tile.querySelector('svg') ? 0 : null;
      const n = parseInt(numero);
      return isNaN(n) ? null : n;
    }).filter(n => n !== null);

    const box = document.getElementById('ultimosResultados');
    if (!box) return;
    box.innerHTML = '';
    entradas.forEach(num => box.appendChild(criarTile(num)));
    return entradas;
  };

  const atualizarResultado = async () => {
    try {
      startStatusCycle(); // mostra mensagens enquanto busca/análisa
      const response = await fetch("https://blaze.bet.br/api/singleplayer-originals/originals/roulette_games/recent/1");
      const data = await response.json();
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

      const sugestaoBox = document.getElementById('sugestaoBox');
      if (!sugestaoBox) return;

      const entradas = atualizarUltimos();
      let sugestao = null;

      const corPorNumero = n => (n === 0 ? 'branco' : (n <= 7 ? 'vermelho' : 'preto'));

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
        for (const padrao of padroes) {
          if (cores.includes(padrao.seq)) { sugestao = padrao.sugestao; break; }
        }
        if (!sugestao) {
          const corAnterior = corPorNumero(entradas[0]);
          sugestao = corAnterior === 'vermelho' ? 'preto' : 'vermelho';
        }
      }

      if (sugestao === 'vermelho') {
        sugestaoBox.textContent = '👉 Apostar no Vermelho';
        sugestaoBox.style.background = '#ff3c59';
        state.sugestaoCor = '#ff3c59';
        stopStatusCycle(); setStatus('Padrão encontrado • Apostar no Vermelho', 'ok');
      } else if (sugestao === 'preto') {
        sugestaoBox.textContent = '👉 Apostar no Preto';
        sugestaoBox.style.background = '#1d2027';
        state.sugestaoCor = '#1d2027';
        stopStatusCycle(); setStatus('Padrão encontrado • Apostar no Preto', 'ok');
      } else {
        sugestaoBox.textContent = '👉 Sem dados suficientes';
        sugestaoBox.style.background = '#444';
        state.sugestaoCor = null;
        startStatusCycle();
      }
    } catch (error) {
      console.error("Erro ao buscar dados da roleta:", error);
    }
  };

  const setupUI = () => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fall { to { transform: translateY(100vh); opacity: 0; } }
      @keyframes slide { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }

      #blazeMenu{
        position:fixed; top:100px; left:50%; transform:translateX(-50%);
        width:220px; background-color:rgba(29,32,39,.95); color:#fff;
        font-family:'Inter',sans-serif; border-radius:12px;
        box-shadow:0 8px 25px rgba(0,0,0,.7); padding:16px; z-index:99999;
        box-sizing:border-box; border:1px solid rgba(255,255,255,.1);
      }
      #blazeMenu .closeBtn{
        position:absolute; top:6px; right:8px; width:22px; height:22px; border-radius:50%;
        background:rgba(255,255,255,.12); color:#fff; display:flex; align-items:center; justify-content:center;
        font-size:14px; cursor:pointer; user-select:none; z-index:1;
      }
      .instagramHeader{
        font-size:13px; text-align:center; font-weight:600;
        background:rgba(0,0,0,.6); padding:6px 10px; border-radius:8px; margin-bottom:12px;
        display:flex; align-items:center; justify-content:center; gap:8px;
      }
      .instagramHeader .label { opacity:.9 }
      .instagramHeader #statusMsg { font-weight:700 }
      .usernameSlider{ width:100%; overflow:hidden; white-space:nowrap; box-sizing:border-box; }
      .usernameSlider span{ display:inline-block; color:#00ff00; font-weight:bold; font-size:15px; padding-left:100%; animation:slide 10s linear infinite; }
      #resultSmBox{ width:72px; height:72px; display:flex; justify-content:center; align-items:center; margin:16px auto; border-radius:50%; box-shadow:0 0 22px rgba(255,60,89,.9); }
      #resultNumberCircle{ width:62px; height:62px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:32px; color:#fff; }
      #sugestaoBox{ text-align:center; font-size:16px; padding:10px; margin:16px 0; border-radius:10px; font-weight:bold; color:#fff; box-shadow:0 4px 10px rgba(0,0,0,.5); cursor:pointer; }
      #ultimosResultados{ display:flex; justify-content:center; margin:16px 0 0; padding-top:12px; border-top:1px solid rgba(255,255,255,.2); }
      .statusOnline{ text-align:center; font-size:12px; margin-top:12px; color:#00ff00; font-weight:bold; background:rgba(0,0,0,.6); padding:5px 10px; border-radius:8px; display:inline-block; }
      .dotOnline{ width:9px; height:9px; background:#00ff00; border-radius:50%; display:inline-block; margin-right:8px; animation:pulse 1.5s infinite; }
      @keyframes pulse{0%{transform:scale(1);opacity:.8}50%{transform:scale(1.6);opacity:.4}100%{transform:scale(1);opacity:.8}}
    `;
    document.head.appendChild(style);

    const menu = document.createElement('div');
    menu.id = 'blazeMenu';
    menu.innerHTML = `
      <div class="closeBtn" id="blazeCloseBtn">✕</div>
      <div class="instagramHeader">
        <span class="label">📲 I.a Double 00 •</span>
        <span id="statusMsg">Aplicando PROX…</span>
      </div>
      <div class="usernameSlider"><span>@i.adouble00</span></div>
      <div id="resultSmBox"><div id="resultNumberCircle"></div></div>
      <div id="sugestaoBox">👉 Aguardando...</div>
      <div id="ultimosResultados"></div>
      <div class="statusOnline"><span class="dotOnline"></span>Online</div>
    `;
    document.body.appendChild(menu);
    startStatusCycle();

    // Visibilidade
    const isHidden = () => window.getComputedStyle(menu).display === 'none';
    const showMenu = () => { menu.style.display = 'block'; };
    const hideMenu = () => { menu.style.display = 'none'; };
    const toggleMenu = () => { isHidden() ? showMenu() : hideMenu(); };

    // X fecha
    const closeBtn = document.getElementById('blazeCloseBtn');
    const closeHandler = (e) => { e.preventDefault(); e.stopPropagation(); hideMenu(); };
    closeBtn.addEventListener('click', closeHandler, { passive: false });
    closeBtn.addEventListener('touchend', closeHandler, { passive: false });

    // --- Toggle por duplo clique/toque ---
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (!isTouch) {
      // Desktop: só dblclick
      document.addEventListener('dblclick', (e) => {
        if (e.target.closest('#blazeMenu')) return; // opcional: ignore duplo clique dentro do menu
        toggleMenu();
      });
    } else {
      // Mobile: detector próprio de double-tap (sem dblclick)
      let tapCount = 0, tapTimer = null, startX = 0, startY = 0, moved = false;
      document.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) return;
        const t = e.touches[0];
        startX = t.clientX; startY = t.clientY; moved = false;
      }, { passive: true });

      document.addEventListener('touchmove', (e) => {
        const t = e.touches[0]; if (!t) return;
        if (Math.abs(t.clientX - startX) + Math.abs(t.clientY - startY) > 12) moved = true;
      }, { passive: true });

      document.addEventListener('touchend', (e) => {
        // toque dentro do botão X não conta
        if (e.target && e.target.closest && e.target.closest('#blazeCloseBtn')) return;
        if (moved) return;
        // toque dentro do menu também conta (fecha se estiver aberto)
        tapCount++;
        clearTimeout(tapTimer);
        tapTimer = setTimeout(() => {
          if (tapCount >= 2) {
            e.preventDefault(); // impede emulação de dblclick
            toggleMenu();
          }
          tapCount = 0;
        }, 250);
      }, { passive: false });
    }
    // --- fim toggle ---

    // Drag (não inicia em cima do X)
    let isDragging = false, offsetX = 0, offsetY = 0;
    const startDrag = (evt, x, y) => {
      if (evt.target && evt.target.closest && evt.target.closest('#blazeCloseBtn')) return;
      isDragging = true; offsetX = x - menu.offsetLeft; offsetY = y - menu.offsetTop;
    };
    const drag = (x, y) => {
      if (!isDragging) return;
      menu.style.left = `${x - offsetX}px`; menu.style.top = `${y - offsetY}px`;
      menu.style.transform = 'translateX(0)';
    };
    menu.style.left = '50%'; menu.style.transform = 'translateX(-50%)';

    menu.addEventListener('mousedown', e => startDrag(e, e.clientX, e.clientY));
    document.addEventListener('mousemove', e => drag(e.clientX, e.clientY));
    document.addEventListener('mouseup', () => isDragging = false);

    menu.addEventListener('touchstart', e => {
      const t = e.touches[0]; if (!t) return;
      if (e.target && e.target.closest && e.target.closest('#blazeCloseBtn')) return;
      startDrag(e, t.clientX, t.clientY); e.preventDefault();
    }, { passive: false });
    document.addEventListener('touchmove', e => {
      const t = e.touches[0]; if (t) drag(t.clientX, t.clientY);
    }, { passive: false });
    document.addEventListener('touchend', () => { isDragging = false; });
  };

  setupUI();
  setInterval(atualizarResultado, 2000);
})();
