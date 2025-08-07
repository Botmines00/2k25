// Chefe 2k25 - Script com Instagram slide e fundo escuro no título
(() => {
  'use strict';

  // Mapeamento de cores
  const coresMap = {
    0: { nome: '⬜ Branco', cor: 'white', texto: 'black' },
    1: { nome: '🟥 Vermelho', cor: '#ff3c59', texto: 'white' },
    2: { nome: '⬛ Preto', cor: '#1d2027', texto: 'white' },
  };

  const getCorPorNumero = (num) => {
    if (num === 0) return coresMap[0];
    return num >= 1 && num <= 7 ? coresMap[1] : coresMap[2];
  };

  const state = {
    ultimoId: null,
    sugestaoCor: null,
  };

  // Funções de criação de elementos
  const criarTile = (numero) => {
    const corData = getCorPorNumero(numero);
    const tile = document.createElement('div');
    tile.className = 'tile-wrapper';
    tile.style.cssText = `
      width: 28px; height: 28px; border-radius: 6px;
      background-color: ${corData.cor}; display: flex;
      justify-content: center; align-items: center;
      font-size: 14px; font-weight: bold;
      color: ${corData.texto}; margin: 0 3px;
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

  const sincronizarBarra = () => {
    const tempoElemento = document.querySelector('.time-left span');
    const tempoTexto = tempoElemento?.textContent || '13.5s';
    const segundos = parseFloat(tempoTexto.replace(/[^0-9,.]/g, '').replace(',', '.')) || 13.5;

    const barra = document.getElementById('progressoInterno');
    if (!barra) return;
    barra.style.animation = 'none';
    void barra.offsetWidth; // Recria a animação
    barra.style.animation = `descarregar ${segundos}s linear forwards`;

    const status = document.getElementById('statusRoleta');
    if (status) status.textContent = `🕒 Girando em: ${segundos.toFixed(1)}s`;
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

      const legendaResultado = document.getElementById('legendaResultado');
      if (legendaResultado) legendaResultado.textContent = `Resultado: ${cor.nome}`;

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
      sincronizarBarra();
    } catch (error) {
      console.error("Erro ao buscar dados da roleta:", error);
    }
  };

  // Injeção de CSS e HTML
  const setupUI = () => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fall { to { transform: translateY(100vh); opacity: 0; } }
      @keyframes descarregar { from { width: 100%; } to { width: 0%; } }
      @keyframes slide { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
      /* A keyframe 'gradient-animation' foi removida temporariamente para depuração */

      #blazeMenu {
        position: fixed; top: 100px; left: 20px; width: 230px;
        background-color: #1a1a1a; /* Fundo sólido para teste */
        color: white;
        font-family: sans-serif; /* Simplificado para teste */
        border-radius: 10px; /* Revertido para o que funcionava antes */
        box-shadow: 0 0 10px rgba(255, 0, 0, 0.5); /* Sombra mais simples */
        padding: 15px; /* Mantendo o padding aumentado */
        z-index: 99999;
        box-sizing: border-box;
      }
      .instagramHeader {
        font-size: 13px; text-align: center; font-weight: 600;
        background-color: rgba(0, 0, 0, 0.7);
        padding: 6px 10px; border-radius: 6px; margin-bottom: 12px;
      }
      .usernameSlider {
        width: 100%; overflow: hidden; white-space: nowrap; box-sizing: border-box;
      }
      .usernameSlider span {
        display: inline-block; color: #00ff00; font-weight: bold;
        font-size: 15px;
        padding-left: 100%; animation: slide 10s linear infinite;
      }
      #resultSmBox {
        width: 70px; height: 70px;
        display: flex; justify-content: center; align-items: center;
        margin: 15px auto;
        border-radius: 50%;
        box-shadow: 0 0 20px rgba(255, 60, 89, 0.8);
      }
      #resultNumberCircle {
        width: 60px; height: 60px;
        border-radius: 50%; display: flex; align-items: center; justify-content: center;
        font-weight: 800; font-size: 30px;
        color: white;
      }
      #legendaResultado, #statusRoleta {
        font-size: 14px; text-align: center; margin: 6px 0;
        color: #ddd;
      }
      #barraGiro {
        width: 100%; height: 10px;
        background: #333; border-radius: 5px; overflow: hidden;
        margin: 15px 0;
        box-shadow: inset 0 1px 3px rgba(0,0,0,0.5);
      }
      #progressoInterno {
        width: 100%; height: 100%;
        background-color: #ff3c59; /* Fundo sólido para teste */
        animation: descarregar 13.5s linear forwards; /* Apenas uma animação */
        /* A animação 'gradient-animation' foi removida temporariamente para depuração */
      }
      #sugestaoBox {
        text-align: center; font-size: 16px; padding: 10px;
        margin: 15px 0;
        border-radius: 8px; font-weight: bold; color: white;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
        cursor: pointer;
        transition: transform 0.2s ease;
      }
      #sugestaoBox:active {
        transform: scale(0.98);
      }
      #ultimosResultados {
        display: flex; justify-content: center; margin: 15px 0 0;
        padding-top: 10px;
        border-top: 1px solid rgba(255, 255, 255, 0.15);
      }
      .statusOnline {
        text-align: center; font-size: 12px; margin-top: 12px;
        color: #00ff00; font-weight: bold;
        background-color: rgba(0, 0, 0, 0.7);
        padding: 4px 8px; border-radius: 6px; display: inline-block;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      }
      .dotOnline {
        width: 9px; height: 9px; background-color: #00ff00;
        border-radius: 50%; display: inline-block;
        margin-right: 6px; animation: pulse 1.5s infinite;
      }
      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.6); opacity: 0.4; }
        100% { transform: scale(1); opacity: 0.8; }
      }
    `;
    document.head.appendChild(style);

    const menuExistente = document.getElementById('blazeMenu');
    if (menuExistente) menuExistente.remove();

    const menu = document.createElement('div');
    menu.id = 'blazeMenu';
    menu.innerHTML = `
      <div class="instagramHeader">📲 Instagram Oficial</div>
      <div class="usernameSlider"><span>@i.adouble00</span></div>
      <div id="resultSmBox"><div id="resultNumberCircle"></div></div>
      <div id="legendaResultado">Resultado: ...</div>
      <div id="statusRoleta">🕒 Girando em: ...</div>
      <div id="barraGiro"><div id="progressoInterno"></div></div>
      <div id="sugestaoBox">👉 Aguardando...</div>
      <div id="ultimosResultados"></div>
      <div class="statusOnline"><span class="dotOnline"></span>Online</div>
    `;
    document.body.appendChild(menu);

    // Lógica para arrastar o menu
    let isDragging = false, offsetX = 0, offsetY = 0;
    const startDrag = (x, y) => { isDragging = true; offsetX = x - menu.offsetLeft; offsetY = y - menu.offsetTop; };
    const drag = (x, y) => { if (!isDragging) return; menu.style.left = `${x - offsetX}px`; menu.style.top = `${y - offsetY}px`; };
    
    menu.addEventListener('mousedown', e => startDrag(e.clientX, e.clientY));
    document.addEventListener('mousemove', e => drag(e.clientX, e.clientY));
    document.addEventListener('mouseup', () => isDragging = false);

    menu.addEventListener('touchstart', e => {
      const touch = e.touches[0];
      startDrag(touch.clientX, touch.clientY);
      e.preventDefault();
    }, { passive: false });
    document.addEventListener('touchmove', e => {
      const touch = e.touches[0];
      drag(touch.clientX, touch.clientY);
    }, { passive: false });
    document.addEventListener('touchend', () => isDragging = false);
  };

  // Inicialização
  setupUI();
  setInterval(atualizarResultado, 2000);
})();
