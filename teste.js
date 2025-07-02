// Chefe 2k25 - Double Black com lógica do Branco
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

  function atualizarUltimos() {
    const entradas = Array.from(document.querySelectorAll('#roulette-recent .entry .roulette-tile'))
      .slice(0, 5).reverse()
      .map(tile => parseInt(tile.innerText.trim()))
      .filter(n => !isNaN(n));

    const box = document.getElementById('ultimosResultados');
    if (!box) return;
    box.innerHTML = '';
    entradas.forEach(num => box.appendChild(criarTile(num)));
  }

  // 🔍 Lógica de previsão do branco
  let historico = [];

  function verificarChanceBranco(lista) {
    const sugestaoBox = document.getElementById('sugestaoBox');
    const ultimos = lista.slice(-6);

    const semBranco = ultimos.every(n => n !== 0);
    const soma2 = ultimos.slice(-2).reduce((a, b) => a + b, 0);
    const ultCor = getCorPorNumero(ultimos[ultimos.length - 1]).nome;
    const repeticoes = ultimos.filter(n => getCorPorNumero(n).nome === ultCor).length;

    if (
      (semBranco && ultimos.length >= 6) ||
      [6, 9, 22].includes(soma2) ||
      repeticoes >= 3
    ) {
      sugestaoBox.textContent = '🔍 POSSÍVEL BRANCO! ⚪️';
      sugestaoBox.style.background = 'white';
      sugestaoBox.style.color = 'black';
    }
  }

  function atualizarResultado() {
    fetch("https://blaze.bet.br/api/singleplayer-originals/originals/roulette_games/recent/1")
      .then(r => r.json())
      .then(data => {
        const d = data[0];
        if (!d || d.id === ultimoId) return;
        ultimoId = d.id;

        const cor = getCorPorNumero(d.roll);
        document.getElementById('resultNumberCircle').textContent = d.roll;
        document.getElementById('resultNumberCircle').style.background = cor.cor;
        document.getElementById('resultNumberCircle').style.color = cor.texto;
        document.getElementById('legendaResultado').textContent = `Resultado: ${cor.nome}`;

        historico.push(d.roll);
        if (historico.length > 10) historico.shift();

        document.getElementById('sugestaoBox').textContent =
          (d.roll >= 1 && d.roll <= 7) ? '👉 Apostar no Preto' :
          (d.roll >= 8) ? '👉 Apostar no Vermelho' :
          '👉 Apostar no Vermelho ou Preto';

        document.getElementById('resultSmBox').style.backgroundColor = cor.cor;
        sincronizarBarra();
        atualizarUltimos();
        verificarChanceBranco(historico);
      })
      .catch(() => {
        document.getElementById('sugestaoBox').textContent = '⚠️ Erro na API';
      });
  }

  function sincronizarBarra() {
    const b = document.getElementById('progressoInterno');
    b.style.animation = 'none';
    void b.offsetWidth;
    b.style.animation = 'descarregar 15s linear forwards';
  }

  let tempoAnterior = '';
  function verificarTempoBlaze() {
    const tempo = document.querySelector('.time-left span')?.textContent?.trim();
    if (!tempo || tempo === tempoAnterior) return;
    tempoAnterior = tempo;
    const t = document.getElementById('statusRoleta');
    if (t) t.textContent = `🕒 Girando em: ${tempo}`;
  }

  // CSS e Menu continuam os mesmos...
  // (Use o resto do código igual ao seu original, sem mudanças)

  // Insere o menu
  if (document.getElementById('blazeMenu')) document.getElementById('blazeMenu').remove();
  const menu = document.createElement('div');
  menu.id = 'blazeMenu';
  menu.innerHTML = `
    <h3>🤖 Double Black - 2k25 <span class="closeBtn">×</span></h3>
    <div id="resultSmBox"><div id="resultNumberCircle"></div></div>
    <div id="legendaResultado">Resultado: ...</div>
    <div id="statusRoleta">🕒 Girando em: ...</div>
    <div id="barraGiro"><div id="progressoInterno"></div></div>
    <div id="sugestaoBox">👉 Aguardando...</div>
    <div id="ultimosResultados"></div>
    <div class="statusOnline"><span class="dotOnline"></span>Online</div>
  `;
  document.body.appendChild(menu);

  // Arrastar e ocultar menu
  let isDragging = false, offsetX, offsetY;
  menu.addEventListener('mousedown', e => {
    isDragging = true;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
  });
  document.addEventListener('mouseup', () => isDragging = false);
  document.addEventListener('mousemove', e => {
    if (isDragging) {
      menu.style.left = `${e.clientX - offsetX}px`;
      menu.style.top = `${e.clientY - offsetY}px`;
    }
  });
  menu.addEventListener('touchstart', e => {
    isDragging = true;
    const touch = e.touches[0];
    offsetX = touch.clientX - menu.getBoundingClientRect().left;
    offsetY = touch.clientY - menu.getBoundingClientRect().top;
  });
  document.addEventListener('touchend', () => isDragging = false);
  document.addEventListener('touchmove', e => {
    if (isDragging) {
      const touch = e.touches[0];
      menu.style.left = `${touch.clientX - offsetX}px`;
      menu.style.top = `${touch.clientY - offsetY}px`;
    }
  });

  document.querySelector('.closeBtn').addEventListener('click', () => {
    document.getElementById('blazeMenu').style.display = 'none';
  });

  document.addEventListener('dblclick', () => {
    const el = document.getElementById('blazeMenu');
    el.style.display = (el.style.display === 'none') ? 'block' : 'none';
  });

  atualizarResultado();
  atualizarUltimos();
  setInterval(atualizarResultado, 2000);
  setInterval(verificarTempoBlaze, 1000);
})();
