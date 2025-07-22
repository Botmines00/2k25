(function () {
  if (document.getElementById("doubleBlackPainel")) return;

  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes glow {
      0% { box-shadow: 0 0 10px #00ff00; }
      50% { box-shadow: 0 0 20px #00ff00; }
      100% { box-shadow: 0 0 10px #00ff00; }
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
    padding: 15px;
    border-radius: 20px;
    font-family: monospace;
    font-size: 16px;
    z-index: 999999;
    box-shadow: 0 0 20px #00ff00;
    animation: glow 2s infinite;
    text-align: center;
  `;

  painel.innerHTML = `
    <div style="color:#00ff00;font-weight:bold;">@doubleeblack00</div>
    <h2 style="margin: 10px 0;">Double Black</h2>
    <div id="previsao" style="margin: 8px 0; font-size: 22px;">...</div>
    <div id="corSugestao" style="font-size: 32px;">🔴</div>
    <div id="ultimos" style="margin-top:10px;display:flex;justify-content:center;gap:4px;"></div>
  `;

  document.body.appendChild(painel);

  // Função para buscar resultados da API oficial
  async function buscarResultados() {
    try {
      const res = await fetch('https://blaze.bet.br/api/singleplayer-originals/originals/roulette_games/recent/1');
      const data = await res.json();
      return data.slice(0, 6);
    } catch (e) {
      console.error("Erro ao buscar resultados:", e);
      return [];
    }
  }

  // Lógica Chefe 2k25
  function preverProximaCor(ultimo) {
    if (ultimo.color === 'white') return '🔴';
    if (ultimo.color === 'red') return '⚫️';
    if (ultimo.color === 'black') return '🔴';
    return '🔴';
  }

  function getCorEmoji(cor) {
    if (cor === 'red') return '🔴';
    if (cor === 'black') return '⚫️';
    if (cor === 'white') return '⚪️';
    return '❓';
  }

  async function atualizarPainel() {
    const resultados = await buscarResultados();
    if (resultados.length === 0) return;

    const ultimo = resultados[0];
    const sugestao = preverProximaCor(ultimo);

    document.getElementById("previsao").innerText = "Sugestão:";
    document.getElementById("corSugestao").innerText = sugestao;

    const ultimos = document.getElementById("ultimos");
    ultimos.innerHTML = '';
    resultados.slice(0, 6).reverse().forEach(res => {
      const span = document.createElement("span");
      span.innerText = getCorEmoji(res.color);
      span.style.padding = "5px 8px";
      span.style.borderRadius = "6px";
      span.style.background = res.color === "red" ? "#ff0000" : res.color === "black" ? "#444" : "#fff";
      span.style.color = res.color === "white" ? "#000" : "#fff";
      ultimos.appendChild(span);
    });
  }

  // Atualiza o painel a cada 5 segundos
  atualizarPainel();
  setInterval(atualizarPainel, 5000);
})();
