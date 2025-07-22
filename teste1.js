(function () {
  if (document.getElementById("doubleBlackPainel")) return;

  const style = document.createElement("style");
  style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600&display=swap');
    @keyframes neonGlow {
      0% { box-shadow: 0 0 5px #00ff00; }
      50% { box-shadow: 0 0 20px #00ff00; }
      100% { box-shadow: 0 0 5px #00ff00; }
    }
  `;
  document.head.appendChild(style);

  const painel = document.createElement("div");
  painel.id = "doubleBlackPainel";
  painel.style = `
    position: fixed;
    top: 100px;
    left: 20px;
    background: black;
    color: white;
    padding: 20px;
    border-radius: 15px;
    font-family: 'Orbitron', sans-serif;
    z-index: 999999;
    width: 300px;
    animation: neonGlow 2s infinite;
    box-shadow: 0 0 20px #00ff00;
    text-align: center;
  `;

  painel.innerHTML = `
    <img src="https://i.imgur.com/GaB6N3m.png" style="width: 80px; height: 80px; margin-bottom: 10px; border-radius: 10px;" />
    <div style="color:#00ff00; font-size: 14px;">@doubleeblack00</div>
    <h2 style="margin: 10px 0; font-size: 20px;">Double Black</h2>
    <div style="margin: 10px 0;">
      <strong style="color: white;">Chance:</strong> <span style="color: #00ff00;">99.99%</span>
    </div>
    <div id="corSugestao" style="font-size: 30px; margin-bottom: 10px;">...</div>
    <div id="ultimos" style="display:flex;justify-content:center;gap:5px;"></div>
  `;

  document.body.appendChild(painel);

  function getEmoji(cor) {
    if (cor === 'red') return '🔴';
    if (cor === 'black') return '⚫️';
    if (cor === 'white') return '⚪️';
    return '❓';
  }

  async function getResultados() {
    try {
      const res = await fetch('https://blaze.bet.br/api/singleplayer-originals/originals/roulette_games/recent/1');
      return await res.json();
    } catch {
      return [];
    }
  }

  function prever(cor) {
    if (cor === 'white') return '🔴';
    if (cor === 'red') return '⚫️';
    if (cor === 'black') return '🔴';
    return '🔴';
  }

  async function atualizar() {
    const resultados = await getResultados();
    if (!resultados || resultados.length === 0) return;
    const ultima = resultados[0];
    const sugestao = prever(ultima.color);
    document.getElementById("corSugestao").innerText = sugestao;

    const ultimos = document.getElementById("ultimos");
    ultimos.innerHTML = '';
    resultados.slice(0, 6).reverse().forEach(res => {
      const box = document.createElement("div");
      box.textContent = getEmoji(res.color);
      box.style = `
        padding: 6px 10px;
        border-radius: 6px;
        font-size: 18px;
        background: ${res.color === 'red' ? '#ff0000' : res.color === 'black' ? '#333' : '#fff'};
        color: ${res.color === 'white' ? '#000' : '#fff'};
      `;
      ultimos.appendChild(box);
    });
  }

  atualizar();
  setInterval(atualizar, 5000);
})();
