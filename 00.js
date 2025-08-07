(() => {
  'use strict';

  const coresMap = {
    0: { nome: '⬜ Branco', cor: 'white', texto: 'black' },
    1: { nome: '🟥 Vermelho', cor: '#ff3c59', texto: 'white' },
    2: { nome: '⬛ Preto', cor: '#1d2027', texto: 'white' },
  };

  const getCorPorNumero = (num) => {
    if (num === 0) return coresMap[0];
    return num >= 1 && num <= 7 ? coresMap[1] : coresMap[2];
  };

  const state = { ultimoId: null, sugestaoCor: null };

  const criarTile = (numero) => {
    const corData = getCorPorNumero(numero);
    const tile = document.createElement('div');
    tile.className = 'tile-wrapper';
    tile.style.cssText = `
      width: 28px; height: 28px; border-radius: 6px;
      background-color: ${corData.cor}; display: flex;
      justify-content: center; align-items: center;
      font-size: 14px; font-weight: bold;
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
      position: fixed; top: 0; left: 0;
      width: 100vw; height: 100vh;
      pointer-events: none; z-index: 999998;
    `;
    for (let i = 0; i < 50; i++) {
      const el = document.createElement('div');
      el.textContent = '💸';
      el.style.cssText = `
        position: absolute;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        font-size: ${12 + Math.random() * 16}px;
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

      if (d.roll >= 1 && d.roll <= 7) {
        sugestaoBox.textContent = '👉 Apostar no Preto';
        sugestaoBox.style.background = '#1d2027';
        state.sugestaoCor = '#1d2027';
      } else if (d.roll >= 8) {
        sugestaoBox.textContent = '👉 Apostar no Vermelho';
        sugestaoBox.style.background = '#ff3c59';
        state.sugestaoCor = '#ff3c59';
      } else {
        const entradas = atualizarUltimos();
        if (entradas && entradas.length >= 2) {
          const corAnterior = getCorPorNumero(entradas[1]);
          if (corAnterior.nome.includes('Vermelho')) {
            sugestaoBox.textContent = '👉 Apostar no Preto';
            sugestaoBox.style.background = '#1d2027';
            state.sugestaoCor = '#1d2027';
          } else if (corAnterior.nome.includes('Preto')) {
            sugestaoBox.textContent = '👉 Apostar no Vermelho';
            sugestaoBox.style.background = '#ff3c59';
            state.sugestaoCor = '#ff3c59';
          } else {
            sugestaoBox.textContent = '👉 Sem sugestão';
            sugestaoBox.style.background = '#444';
            state.sugestaoCor = null;
          }
        } else {
          sugestaoBox.textContent = '👉 Sem dados suficientes';
          sugestaoBox.style.background = '#444';
          state.sugestaoCor = null;
        }
      }

      atualizarUltimos();
    } catch (error) {
      console.error("Erro ao buscar dados da roleta:", error);
    }
  };

  const setupUI = () => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fall { to { transform: translateY(100vh); opacity: 0; } }
      @keyframes slide { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }

      #blazeMenu {
        position: fixed; top: 100px; left: 50%; transform: translateX(-50%);
        width: 250px; background-color: rgba(29, 32, 39, 0.95);
        color: white; font-family: 'Inter', sans-serif;
        border-radius: 12px; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.7);
        padding: 20px; z-index: 99999; box-sizing: border-box;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .instagramHeader {
        font-size: 14px; text-align: center; font-weight: 600;
        background-color: rgba(0, 0, 0, 0.6);
        padding: 8px 12px; border-radius: 8px; margin-bottom: 15px;
      }
      .usernameSlider {
        width: 100%; overflow: hidden; white-space: nowrap; box-sizing: border-box;
      }
      .usernameSlider span {
        display: inline-block; color: #00ff00; font-weight: bold;
        font-size: 16px; padding-left: 100%;
        animation: slide 10s linear infinite;
      }
      #resultSmBox {
        width: 80px; height: 80px; display: flex; justify-content: center; align-items: center;
        margin: 20px auto; border-radius: 50%;
        box-shadow: 0 0 25px rgba(255, 60, 89, 0.9);
      }
      #resultNumberCircle {
        width: 70px; height: 70px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-weight: 900; font-size: 36px; color: white;
      }
      #sugestaoBox {
        text-align: center; font-size: 18px; padding: 12px;
        margin: 20px 0; border-radius: 10px; font-weight: bold; color: white;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      #sugestaoBox:active {
        transform: scale(0.98);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
      }
      #ultimosResultados {
        display: flex; justify-content: center; margin: 20px 0 0;
        padding-top: 15px;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
      }
      .statusOnline {
        text-align: center; font-size: 13px; margin-top: 15px;
        color: #00ff00; font-weight: bold;
        background-color: rgba(0, 0, 0, 0.6);
        padding: 5px 10px; border-radius: 8px; display: inline-block;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
      }
      .dotOnline {
        width: 10px; height: 10px; background-color: #00ff00;
        border-radius: 50%; display: inline-block;
        margin-right: 8px; animation: pulse 1.5s infinite;
      }
      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.6); opacity: 0.4; }
        100% { transform: scale(1); opacity: 0.8; }
      }
    `;
    document.head.appendChild(style);

    const menu = document.createElement('div');
    menu.id = 'blazeMenu';
    menu.innerHTML = `
      <div class="instagramHeader">📲 I.a Double 00</div>
      <div class="usernameSlider"><span>@i.adouble00</span></div>
      <div id="resultSmBox"><div id="resultNumberCircle"></div></div>
      <div id="sugestaoBox">👉 Aguardando...</div>
      <div id="ultimosResultados"></div>
      <div class="statusOnline"><span class="dotOnline"></span>Online</div>
    `;
    document.body.appendChild(menu);

    // Drag
    let isDragging = false, offsetX = 0, offsetY = 0;
    const startDrag = (x, y) => { isDragging = true; offsetX = x - menu.offsetLeft; offsetY = y - menu.offsetTop; };
    const drag = (x, y) => { if (!isDragging) return; menu.style.left = `${x - offsetX}px`; menu.style.top = `${y - offsetY}px`; };
    menu.addEventListener('mousedown', e => startDrag(e.clientX, e.clientY));
    document.addEventListener('mousemove', e => drag(e.clientX, e.clientY));
    document.addEventListener('mouseup', () => isDragging = false);
    menu.addEventListener('touchstart', e => { const t = e.touches[0]; startDrag(t.clientX, t.clientY); e.preventDefault(); }, { passive: false });
    document.addEventListener('touchmove', e => { const t = e.touches[0]; drag(t.clientX, t.clientY); }, { passive: false });
    document.addEventListener('touchend', () => isDragging = false);
  };

  setupUI();
  setInterval(atualizarResultado, 2000);
})();
