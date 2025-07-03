// Chefe 2k25 - Previsão após branco baseada na cor anterior
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

  // Criar painel
  const painel = document.createElement("div");
  painel.id = "painelChefe2k25";
  painel.style = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #111;
    color: white;
    padding: 15px;
    border-radius: 12px;
    z-index: 999999;
    width: 260px;
    font-family: Arial, sans-serif;
    box-shadow: 0 0 15px red;
  `;

  painel.innerHTML = `
    <div style="text-align:center; font-size: 18px; font-weight: bold; margin-bottom: 10px;">
      🧠 Chefe 2k25
    </div>
    <div id="statusOnline" style="text-align:center; margin-bottom: 10px; font-weight: bold;">
      <span style="background:black; padding:2px 8px; border-radius:5px;">🟢 Online</span>
    </div>
    <div id="resultadoAtual" style="text-align:center; padding: 10px; background: #333; border-radius: 8px; margin-bottom: 10px;">
      Resultado: Aguardando...
    </div>
    <div id="sugestaoCor" style="text-align:center; padding: 10px; background: #444; border-radius: 8px;">
      Sugestão: Aguardando...
    </div>
  `;

  document.body.appendChild(painel);

  const resultadoBox = document.getElementById("resultadoAtual");
  const sugestaoBox = document.getElementById("sugestaoCor");

  // Função principal
  function verificarResultado() {
    fetch("https://blaze.bet.br/api/singleplayer-originals/originals/roulette_games/recent/2")
      .then(res => res.json())
      .then(data => {
        const atual = data[0];
        const anterior = data[1];

        if (atual.id === ultimoId) return;
        ultimoId = atual.id;

        const numAtual = atual.roll;
        const corAtual = getCorPorNumero(numAtual);

        resultadoBox.textContent = `Resultado: ${corAtual.nome}`;
        resultadoBox.style.background = corAtual.cor;
        resultadoBox.style.color = corAtual.texto;

        if (numAtual === 0) {
          const numAnterior = anterior?.roll;

          if (numAnterior >= 1 && numAnterior <= 7) {
            // Anterior foi vermelho, então agora aposta no preto
            sugestaoBox.textContent = "👉 Apostar no Preto";
            sugestaoBox.style.background = '#1d2027';
            sugestaoBox.style.color = 'white';
            sugestaoCor = '#1d2027';
          } else if (numAnterior >= 8 && numAnterior <= 14) {
            // Anterior foi preto, então agora aposta no vermelho
            sugestaoBox.textContent = "👉 Apostar no Vermelho";
            sugestaoBox.style.background = '#ff3c59';
            sugestaoBox.style.color = 'white';
            sugestaoCor = '#ff3c59';
          } else {
            // Caso anterior inválido
            sugestaoBox.textContent = "👉 Apostar no Vermelho ou Preto";
            sugestaoBox.style.background = '#2c2c2c';
            sugestaoBox.style.color = 'white';
            sugestaoCor = null;
          }

        } else {
          // Quando não for branco, nenhuma sugestão especial
          sugestaoBox.textContent = "Aguardando branco...";
          sugestaoBox.style.background = '#444';
          sugestaoBox.style.color = 'white';
          sugestaoCor = null;
        }
      })
      .catch(err => {
        resultadoBox.textContent = "Erro ao buscar resultados";
        resultadoBox.style.background = "#800";
        console.error("Erro:", err);
      });
  }

  setInterval(verificarResultado, 3000);
})();
