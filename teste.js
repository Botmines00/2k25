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

  let historico = [];
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

  function verificarChanceBranco(lista) {
    const box = document.getElementById('sugestaoBox');
    const ultimos = lista.slice(-6);
    const semBranco = ultimos.every(n => n !== 0);
    const soma2 = ultimos.slice(-2).reduce((a, b) => a + b, 0);
    const ultCor = getCorPorNumero(ultimos[ultimos.length - 1]).nome;
    const repeticoes = ultimos.filter(n => getCorPorNumero(n).nome === ultCor).length;

    if ((semBranco && ultimos.length >= 6) || [6, 9, 22].includes(soma2) || repeticoes >= 3) {
      box.textContent = '🔍 POSSÍVEL BRANCO ⚪️';
      box.style.background = 'white';
      box.style.color = 'black';
    }
  }

  function atualizarResultado() {
    fetch("https://blaze.bet.br/api/singleplayer-originals/originals/roulette_games/recent/1")
      .then(r => r.json())
      .then(data => {
        const d = data[0];
        if (!d || d.id === ultimoId) return;
        ultimoId = d.id;
        historico.push(d.roll);
        if (historico.length > 10) historico.shift();

        const cor = getCorPorNumero(d.roll);
        document.getElementById('resultNumberCircle').textContent = d.roll;
        document.getElementById('resultNumberCircle').style.background = cor.cor;
        document.getElementById('resultNumberCircle').style.color = cor.texto;
        document.getElementById('legendaResultado').textContent = `Resultado: ${cor.nome}`;
        document.getElementById('resultSmBox').style.backgroundColor = cor.cor;

        const ultimosBox = document.getElementById('ultimosResultados');
        ultimosBox.innerHTML = '';
        historico.slice().reverse().forEach(n => ultimosBox.appendChild(criarTile(n)));

        verificarChanceBranco(historico);
        sincronizarBarra();
      })
      .catch(() => {
        document.getElementById('sugestaoBox').textContent = '⚠️ Erro na API';
      });
  }

  function sincronizarBarra() {
    const b = document.getElementById('progressoInterno');
    if (!b) return;
    b.style.animation = 'none';
    void b.offsetWidth;
    b.style.animation = 'descarregar 15s linear forwards';
  }

  // === Estilos do menu ===
  const style = document.createElement('style');
  style.textContent = `
    #blazeMenu {
      position: fixed; top: 100px; left: 20px; width: 230px;
      background: #1e1e1e; color: white;
      font-family: sans-serif; border-radius: 10px;
      box-shadow: 0 0 10px #00ff00; padding: 10px;
      z-index: 99999; user-select: none;
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
    #legendaResultado {
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
      font-weight: bold;
    }
    #ultimosResultados {
      display: flex;
      justify-content: center;
      margin: 5px 0;
    }
  `;
  document.head.appendChild(style);

  if (document.getElementById('blazeMenu')) document.getElementById('blazeMenu').remove();

  const menu = document.createElement('div');
  menu.id = 'blazeMenu';
  menu.innerHTML = `
    <h3>🤖 Chefe Branco 2k25 <span class="closeBtn">×</span></h3>
    <div id="resultSmBox"><div id="resultNumberCircle"></div></div>
    <div id="legendaResultado">Resultado: ...</div>
    <div id="barraGiro"><div id="progressoInterno"></div></div>
    <div id="sugestaoBox">👉 Aguardando...</div>
    <div id="ultimosResultados"></div>
  `;
  document.body.appendChild(menu);

  document.querySelector('.closeBtn').addEventListener('click', () => {
    document.getElementById('blazeMenu').remove();
  });

  setInterval(atualizarResultado, 2000);
})();
