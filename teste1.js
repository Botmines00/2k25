(() => {
  const coresMap = {
    0: { nome: '⚪ Branco', cor: 'white', texto: 'black' },
    1: { nome: '🔴 Vermelho', cor: '#ff3c59', texto: 'white' },
    2: { nome: '⚫ Preto', cor: '#1d2027', texto: 'white' },
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
    tile.style = `
      width: 26px; height: 26px; border-radius: 5px;
      background-color: ${corData.cor}; color: ${corData.texto};
      font-size: 12px; font-weight: bold;
      display: flex; justify-content: center; align-items: center;
      margin: 0 2px;
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
    box.textContent = tipo === 'win' ? '✅ WIN' : '❌ LOSS';
    box.style = `
      position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
      background: ${tipo === 'win' ? '#28a745' : '#dc3545'};
      color: white; padding: 6px 12px; font-weight: bold;
      border-radius: 6px; font-family: sans-serif; z-index: 999999;
      box-shadow: 0 0 10px ${tipo === 'win' ? '#28a745' : '#dc3545'};
    `;
    document.body.appendChild(box);
    if (tipo === 'win') criarConfetti();
    setTimeout(() => box.remove(), 2500);
  }

  function atualizarUltimos(lista) {
    const box = document.getElementById('ultimosResultados');
    if (!box || !lista) return;
    box.innerHTML = '';
    lista.slice(0, 6).forEach(num => box.appendChild(criarTile(num)));
  }

  async function atualizarResultado() {
    try {
      const res = await fetch("https://blaze.bet.br/api/roulette_games/recent");
      const data = await res.json();
      if (!data || data.length === 0) return;

      const entradaAtual = data[0];
      if (entradaAtual.id === ultimoId) return;
      ultimoId = entradaAtual.id;

      const cor = getCorPorNumero(entradaAtual.roll);
      atualizarUltimos(data.map(d => d.roll));

      document.getElementById('corPrevista').textContent = cor.nome;
      document.getElementById('corPrevista').style.background = cor.cor;
      document.getElementById('corPrevista').style.color = cor.texto;

      // Lógica da sugestão
      const sugestaoBox = document.getElementById('sugestaoBox');
      if (entradaAtual.roll >= 1 && entradaAtual.roll <= 7) {
        sugestaoBox.textContent = '👉 Apostar no Preto';
        sugestaoBox.style.background = '#1d2027';
        sugestaoCor = '#1d2027';
      } else if (entradaAtual.roll >= 8) {
        sugestaoBox.textContent = '👉 Apostar no Vermelho';
        sugestaoBox.style.background = '#ff3c59';
        sugestaoCor = '#ff3c59';
      } else {
        sugestaoBox.textContent = '👉 Forçar Branco';
        sugestaoBox.style.background = 'white';
        sugestaoBox.style.color = 'black';
        sugestaoCor = 'white';
      }

      // Validar WIN/LOSS
      if (sugestaoCor !== null) {
        if (cor.cor === sugestaoCor) {
          mostrarResultadoFinal('win');
        } else {
          mostrarResultadoFinal('loss');
        }
      }

    } catch (e) {
      console.error("Erro na API:", e);
    }
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes fall { to { transform: translateY(100vh); opacity: 0; } }
    #menuDB { position: fixed; top: 100px; left: 20px; background: #111; color: white; font-family: sans-serif; border-radius: 10px; box-shadow: 0 0 20px #00ff00; padding: 12px; z-index: 99999; width: 240px; }
    #menuDB h2 { margin: 0 0 5px; font-size: 16px; text-align: center; }
    #corPrevista { padding: 5px; font-weight: bold; border-radius: 4px; text-align: center; margin: 5px 0; }
    #sugestaoBox { padding: 6px; border-radius: 4px; font-weight: bold; margin-top: 5px; text-align: center; background: #333; }
    #ultimosResultados { display: flex; justify-content: center; margin-top: 5px; gap: 3px; }
    #instagramNome { color: #00ff00; text-align: center; font-size: 13px; margin-bottom: 4px; }
  `;
  document.head.appendChild(style);

  if (document.getElementById('menuDB')) document.getElementById('menuDB').remove();

  const menu = document.createElement('div');
  menu.id = 'menuDB';
  menu.innerHTML = `
    <div id="instagramNome">@doubleeblack00</div>
    <h2>Double Black</h2>
    <div id="corPrevista">...</div>
    <div id="sugestaoBox">Carregando...</div>
    <div id="ultimosResultados"></div>
  `;
  document.body.appendChild(menu);

  // Tornar arrastável
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
