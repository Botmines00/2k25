// Chefe 2k25 - Double Black atualizado com Branco e layout fixado
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
      color: ${corData.texto}; margin: 0;
    `;
    tile.textContent = numero;
    return tile;
  }

  function logicaPrevisaoBranco(data) {
    const horario = new Date(data.created_at);
    const minuto = horario.getMinutes();
    const sugestao = document.getElementById('sugestaoBox');

    if (minuto % 10 === 0) {
      sugestao.textContent += '\n⚪ Possível Branco (Minuto termina com 0)';
    }
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
        const sugestao = (d.roll >= 1 && d.roll <= 7) ? '👉 Apostar no Preto' :
                         (d.roll >= 8) ? '👉 Apostar no Vermelho' :
                         '👉 Apostar no Vermelho ou Preto';
        document.getElementById('sugestaoBox').textContent = sugestao;
        logicaPrevisaoBranco(d);
        document.getElementById('resultSmBox').style.backgroundColor = cor.cor;
        sincronizarBarra();
        atualizarUltimos();
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

  const style = document.createElement('style');
  style.textContent = `
    #blazeMenu {
      position: fixed; top: 100px; left: 20px; width: 230px;
      background: #1e1e1e; color: white;
      font-family: sans-serif; border-radius: 10px;
      box-shadow: 0 0 10px #00ff00; padding: 10px;
      z-index: 99999; user-select: none;
      touch-action: none;
    }
    #blazeMenu h3 {
      margin: 0 0 6px; color: #54eb00;
      font-size: 14px; text-align: center;
    }
    .closeBtn {
      position: absolute; right: 8px; top: 5px;
      color: #ff4444; cursor: pointer;
      font-size: 16px; font-weight: bold;
    }
    .minBtn {
      position: absolute; left: 8px; top: 5px;
      color: #ccc; cursor: pointer;
      font-size: 16px; font-weight: bold;
    }
    #resultSmBox {
      width: 32px; height: 32px;
      display: flex; justify-content: center;
      align-items: center; margin: 5px auto;
      border-radius: 6px;
    }
    #resultNumberCircle {
      width: 24px; height: 24px;
      border-radius: 50%; text-align: center;
      display: flex; align-items: center;
      justify-content: center;
      font-weight: bold; font-size: 12px;
    }
    #legendaResultado, #statusRoleta {
      font-size: 12px; text-align: center;
      margin: 2px 0; color: #ccc;
    }
    #barraGiro {
      width: 100%; height: 6px;
      background: #333; border-radius: 4px;
      overflow: hidden;
    }
    #progressoInterno {
      width: 100%; height: 100%;
      background-color: #ff3c59;
      animation: descarregar 15s linear forwards;
    }
    @keyframes descarregar {
      from { width: 100%; }
      to { width: 0%; }
    }
    #sugestaoBox {
      text-align: center; font-size: 13px;
      padding: 6px; margin: 6px 0;
      background: #2c2c2c; border-radius: 4px;
      font-weight: bold; white-space: pre-line;
    }
    #ultimosResultados {
      display: flex;
      flex-direction: row;
      justify-content: center;
      flex-wrap: nowrap;
      gap: 4px;
      margin: 5px 0;
    }
    .statusOnline {
      text-align: center; font-size: 11px;
      margin-top: 4px; color: #00ff00;
    }
    .dotOnline {
      width: 8px; height: 8px;
      background-color: #00ff00;
      border-radius: 50%;
      display: inline-block;
      margin-right: 5px;
      animation: pulse 1.5s infinite;
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
    <span class="minBtn">☰</span>
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

  const corpo = menu.querySelectorAll('h3 ~ div');
  document.querySelector('.closeBtn').addEventListener('click', () => {
    document.getElementById('blazeMenu').style.display = 'none';
  });
  document.querySelector('.minBtn').addEventListener('click', () => {
    corpo.forEach(div => div.style.display = (div.style.display === 'none') ? 'block' : 'none');
  });

  document.addEventListener('dblclick', () => {
    const el = document.getElementById('blazeMenu');
    el.style.display = (el.style.display === 'none') ? 'block' : 'none';
  });

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

  atualizarResultado();
  atualizarUltimos();
  setInterval(atualizarResultado, 2000);
  setInterval(verificarTempoBlaze, 1000);
})();
