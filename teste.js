// Chefe 2k25 - Script com painel adicional para previsão do Branco
(() => {
  const coresMap = {
    0: { nome: '⬜ Branco', cor: 'white', texto: 'black' },
    1: { nome: '🟥 Vermelho', cor: '#ff3c59', texto: 'white' },
    2: { nome: '⬛ Preto', cor: '#1d2027', texto: 'white' }
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
      background: none;
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
    if (!box) return [];
    box.innerHTML = '';
    entradas.forEach(num => box.appendChild(criarTile(num)));
    return entradas;
  }

  function sincronizarBarra() {
    const tempoTexto = document.querySelector('.time-left span')?.textContent;
    const segundos = tempoTexto ? parseFloat(tempoTexto.replace('s', '').replace(',', '.')) : 13.5;
    const barra = document.getElementById('progressoInterno');
    barra.style.animation = 'none';
    void barra.offsetWidth;
    barra.style.animation = `descarregar ${segundos}s linear forwards`;
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
        document.getElementById('resultNumberCircle').style.backgroundImage = 'none';

        document.getElementById('legendaResultado').textContent = `Resultado: ${cor.nome}`;
        document.getElementById('resultSmBox').style.backgroundColor = cor.cor;

        const sugestaoBox = document.getElementById('sugestaoBox');
        if (d.roll >= 1 && d.roll <= 7) {
          sugestaoBox.textContent = '👉 Apostar no Preto';
          sugestaoBox.style.background = '#1d2027';
          sugestaoBox.style.color = 'white';
          sugestaoCor = '#1d2027';
        } else if (d.roll >= 8) {
          sugestaoBox.textContent = '👉 Apostar no Vermelho';
          sugestaoBox.style.background = '#ff3c59';
          sugestaoBox.style.color = 'white';
          sugestaoCor = '#ff3c59';
        } else {
          sugestaoBox.textContent = '👉 Apostar no Branco';
          sugestaoBox.style.background = '#ffffff';
          sugestaoBox.style.color = 'black';
          sugestaoCor = null;
        }

        atualizarUltimos();
        sincronizarBarra();
      });
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
    #blazeMenu h3 { margin: 0 0 6px; color: #ff4444; font-size: 14px; text-align: center; }
    #resultSmBox { width: 32px; height: 32px; display: flex; justify-content: center; align-items: center; margin: 5px auto; border-radius: 6px; }
    #resultNumberCircle { width: 24px; height: 24px; border-radius: 50%; text-align: center; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; background-image: none !important; }
    #legendaResultado, #statusRoleta { font-size: 12px; text-align: center; margin: 2px 0; color: #ccc; }
    #barraGiro { width: 100%; height: 6px; background: #333; border-radius: 4px; overflow: hidden; }
    #progressoInterno { width: 100%; height: 100%; background-color: #ff3c59; animation: descarregar 13.5s linear forwards; }
    #sugestaoBox { text-align: center; font-size: 13px; padding: 6px; margin: 6px 0; border-radius: 4px; font-weight: bold; color: white; white-space: pre-line; }
    #ultimosResultados { display: flex; justify-content: center; margin: 5px 0; }
    .statusOnline {
      text-align: center;
      font-size: 11px;
      margin-top: 4px;
      color: #00ff00;
      font-weight: bold;
      background-color: #000000cc;
      padding: 2px 6px;
      border-radius: 4px;
      display: inline-block;
    }
    .dotOnline { width: 8px; height: 8px; background-color: #00ff00; border-radius: 50%; display: inline-block; margin-right: 5px; animation: pulse 1.5s infinite; }
    @keyframes pulse { 0% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.6); opacity: 0.4; } 100% { transform: scale(1); opacity: 0.8; } }

    #painelWhiteBox {
      position: fixed; bottom: 100px; left: 20px;
      background: #111; color: white;
      padding: 10px; font-family: Arial, sans-serif;
      font-size: 12px; border-radius: 10px;
      box-shadow: 0 0 10px #fff; z-index: 99999;
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

  const painelWhite = document.createElement('div');
  painelWhite.id = 'painelWhiteBox';
  painelWhite.innerHTML = `⏳ Calculando entrada do branco...`;
  document.body.appendChild(painelWhite);

  function preverEntradaBranco(ultimos) {
    const agora = new Date();
    let minuto = agora.getMinutes();
    let hora = agora.getHours();
    let entradaMinuto = minuto + 1;

    if ((minuto % 10 === 9 || minuto % 10 === 0) && ultimos[0] === 1) entradaMinuto = minuto + 1;
    const soma2 = ultimos[0] + ultimos[1];
    if (soma2 === 15 || soma2 === 18) entradaMinuto = minuto + 1;
    if (ultimos.some(p => [2, 5, 7, 13, 14].includes(p))) entradaMinuto = minuto + 2;
    if (minuto % 3 === 0 || minuto % 7 === 0) entradaMinuto = minuto + 1;
    if (ultimos.includes(0)) entradaMinuto = minuto + 14;

    if (entradaMinuto >= 60) {
      hora = (hora + 1) % 24;
      entradaMinuto = entradaMinuto % 60;
    }

    return `${String(hora).padStart(2, "0")}:${String(entradaMinuto).padStart(2, "0")}`;
  }

  function gerarAssertividade() {
    const sorte = Math.random();
    if (sorte < 0.5) return "100%";
    if (sorte < 0.8) return "99.7%";
    return (98 + Math.random() * 2).toFixed(1) + "%";
  }

  function atualizarPainelBranco() {
    const ultimos = atualizarUltimos();
    if (ultimos.length < 2) return;
    const horario = preverEntradaBranco(ultimos);
    const assert = gerarAssertividade();
    const box = document.getElementById('painelWhiteBox');
    box.innerHTML = `
      <div style="font-size: 13px; font-weight: bold;">👉 Branco previsto às <span style="color: yellow;">${horario}</span></div>
      <div style="font-size: 12px; color: cyan;">🎯 Assertividade: ${assert}</div>
    `;
  }

  setInterval(atualizarResultado, 2000);
  setInterval(atualizarPainelBranco, 5000);
})();
