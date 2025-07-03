// Chefe 2k25 - Script Final com título verde e status Online reposicionado
(() => {
  const coresMap = {
    0: { nome: '⬜ Branco', cor: 'white', texto: 'black' },
    1: { nome: '🟥 Vermelho', cor: '#ff3c59', texto: 'white' },
    2: { nome: '⬛ Preto', cor: '#1d2027', texto: 'white' },
  };

  const getCorPorNumero = (num) => {
    if (num === 0) return coresMap[0];
    if (num >= 1 && num <= 7) return coresMap[1];
    return coresMap[2];
  };

  let ultimoId = null;
  let sugestaoCor = null;

  function criarTile(numero) {
    const corData = getCorPorNumero(numero);
    const tile = document.createElement('div');
    tile.className = 'tile-wrapper';
    tile.style = `
      width: 24px; height: 24px; border-radius: 4px;
      background-color: ${corData.cor}; display: flex;
      justify-content: center; align-items: center;
      font-size: 12px; font-weight: bold;
      color: ${corData.texto}; margin: 0 2px;
    `;
    tile.textContent = numero;
    return tile;
  }

  function criarConfetti() {
    const wrapper = document.createElement('div');
    wrapper.id = 'confettiWrapper';
    wrapper.style = `
      position: fixed; top: 0; left: 0;
      width: 100vw; height: 100vh;
      pointer-events: none; z-index: 999998;
    `;
    for (let i = 0; i < 50; i++) {
      const el = document.createElement('div');
      el.textContent = '💸';
      el.style = `
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
  }

  function mostrarResultadoFinal(tipo) {
    const box = document.createElement('div');
    box.id = 'resultadoFinalBox';
    box.textContent = tipo === 'win' ? '✅ GANHOU' : '❌ PERDEU';
    box.style = `
      position: fixed; top: 70px; left: 50%; transform: translateX(-50%);
      background: ${tipo === 'win' ? '#28a745' : '#dc3545'};
      color: white; padding: 6px 12px; font-weight: bold;
      border-radius: 6px; font-family: sans-serif; z-index: 999999;
      box-shadow: 0 0 10px ${tipo === 'win' ? '#28a745' : '#dc3545'};
    `;
    document.body.appendChild(box);
    if (tipo === 'win') criarConfetti();
    setTimeout(() => box.remove(), 3000);
  }

  function atualizarUltimos() {
    const tiles = Array.from(document.querySelectorAll('#roulette-recent .entry .roulette-tile')).slice(0, 6).reverse();
    const entradas = tiles.map(tile => {
      const numero = tile.innerText.trim();
      if (numero === '') {
        const isBranco = tile.querySelector('svg');
        return isBranco ? 0 : null;
      }
      const n = parseInt(numero);
      return isNaN(n) ? null : n;
    }).filter(n => n !== null);

    const box = document.getElementById('ultimosResultados');
    if (!box) return;
    box.innerHTML = '';
    entradas.forEach(num => box.appendChild(criarTile(num)));
    return entradas;
  }

  function atualizarResultado() {
    fetch("https://blaze.bet.br/api/singleplayer-originals/originals/roulette_games/recent/1")
      .then(r => r.json())
      .then(data => {
        const d = data[0];
        if (!d || d.id === ultimoId) return;

        const cor = getCorPorNumero(d.roll);

        if (sugestaoCor !== null) {
          if (cor.cor === sugestaoCor) {
            mostrarResultadoFinal('win');
          } else {
            mostrarResultadoFinal('loss');
          }
        }

        ultimoId = d.id;

        document.getElementById('resultNumberCircle').textContent = d.roll;
        document.getElementById('resultNumberCircle').style.background = cor.cor;
        document.getElementById('resultNumberCircle').style.color = cor.texto;

        document.getElementById('legendaResultado').textContent = `Resultado: ${cor.nome}`;
        document.getElementById('resultSmBox').style.backgroundColor = cor.cor;

        const sugestaoBox = document.getElementById('sugestaoBox');
        if (d.roll >= 1 && d.roll <= 7) {
          sugestaoBox.textContent = '👉 Apostar no Preto';
          sugestaoBox.style.background = '#1d2027';
          sugestaoCor = '#1d2027';
        } else if (d.roll >= 8) {
          sugestaoBox.textContent = '👉 Apostar no Vermelho';
          sugestaoBox.style.background = '#ff3c59';
          sugestaoCor = '#ff3c59';
        } else {
          const entradas = atualizarUltimos();
          if (entradas && entradas.length >= 2) {
            const anterior = entradas[1];
            const corAnterior = getCorPorNumero(anterior);
            if (corAnterior.nome.includes('Vermelho')) {
              sugestaoBox.textContent = '👉 Apostar no Preto';
              sugestaoBox.style.background = '#1d2027';
              sugestaoCor = '#1d2027';
            } else if (corAnterior.nome.includes('Preto')) {
              sugestaoBox.textContent = '👉 Apostar no Vermelho';
              sugestaoBox.style.background = '#ff3c59';
              sugestaoCor = '#ff3c59';
            } else {
              sugestaoBox.textContent = '👉 Sem sugestão';
              sugestaoBox.style.background = '#444';
              sugestaoCor = null;
            }
          } else {
            sugestaoBox.textContent = '👉 Sem dados suficientes';
            sugestaoBox.style.background = '#444';
            sugestaoCor = null;
          }
        }

        atualizarUltimos();
        sincronizarBarra();
      });
  }

  function sincronizarBarra() {
    const tempoElemento = document.querySelector('.time-left span');
    const tempoTexto = tempoElemento ? tempoElemento.textContent : null;

    let segundos = 13.5;
    if (tempoTexto) {
      const match = tempoTexto.match(/[\d,.]+/);
      if (match) {
        segundos = parseFloat(match[0].replace(',', '.')) || 13.5;
      }
    }

    const barra = document.getElementById('progressoInterno');
    if (!barra) return;
    barra.style.animation = 'none';
    void barra.offsetWidth;
    barra.style.animation = `descarregar ${segundos}s linear forwards`;

    const status = document.getElementById('statusRoleta');
    if (status) status.textContent = `🕒 Girando em: ${segundos.toFixed(1)}s`;
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes fall { to { transform: translateY(100vh); opacity: 0; } }
    @keyframes descarregar { from { width: 100%; } to { width: 0%; } }
    #blazeMenu {
      position: fixed; top: 100px; left: 20px; width: 230px;
      background-image: url('https://i.ibb.co/GvnBzT17/f5bbdfad-b92d-4e69-9081-d2740b5ca5c8.jpg');
      background-size: cover; background-position: center;
      color: white; font-family: sans-serif;
      border-radius: 10px; box-shadow: 0 0 20px #ff0000, 0 0 10px #ff0000 inset;
      padding: 10px; z-index: 99999;
    }
    #blazeMenu h3 {
      margin: 0 0 6px;
      font-size: 14px;
      text-align: center;
      color: #00ff00;
    }
    #resultSmBox { width: 32px; height: 32px; display: flex; justify-content: center; align-items: center; margin: 5px auto; border-radius: 6px; }
    #resultNumberCircle { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; }
    #legendaResultado, #statusRoleta { font-size: 12px; text-align: center; margin: 2px 0; color: #ccc; }
    #barraGiro { width: 100%; height: 6px; background: #333; border-radius: 4px; overflow: hidden; }
    #progressoInterno { width: 100%; height: 100%; background-color: #ff3c59; animation: descarregar 13.5s linear forwards; }
    #sugestaoBox { text-align: center; font-size: 13px; padding: 6px; margin: 6px 0; border-radius: 4px; font-weight: bold; color: white; }
    #ultimosResultados { display: flex; justify-content: center; margin: 5px 0; }
    .statusOnline {
      text-align: center; font-size: 11px; margin-top: 4px;
      color: #00ff00; font-weight: bold;
      background-color: #000000cc; padding: 2px 6px;
      border-radius: 4px; display: inline-block;
    }
    .dotOnline {
      width: 8px; height: 8px; background-color: #00ff00;
      border-radius: 50%; display: inline-block;
      margin-right: 5px; animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
      0% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.6); opacity: 0.4; }
      100% { transform: scale(1); opacity: 0.8; }
    }
  `;
  document.head.appendChild(style);

  if (document.getElementById('blazeMenu')) document.getElementById('blazeMenu').remove();

  const menu = document.createElement('div');
  menu.id = 'blazeMenu';
  menu.innerHTML = `
    <h3>🤖 Double Black - 2k25</h3>
    <div id="resultSmBox"><div id="resultNumberCircle"></div></div>
    <div id="legendaResultado">Resultado: ...</div>
    <div id="statusRoleta">🕒 Girando em: ...</div>
    <div id="barraGiro"><div id="progressoInterno"></div></div>
    <div id="sugestaoBox">👉 Aguardando...</div>
    <div id="ultimosResultados"></div>
    <div class="statusOnline"><span class="dotOnline"></span>Online</div>
  `;
  document.body.appendChild(menu);

  // Drag do menu
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

  setInterval(atualizarResultado, 2000);
})();
