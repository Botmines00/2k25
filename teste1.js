(function () {
  if (document.getElementById("doubleblack00")) return;

  const painel = document.createElement("div");
  painel.id = "doubleblack00";
  painel.style = `
    position: fixed;
    top: 100px;
    left: 20px;
    background: black;
    color: white;
    padding: 15px;
    border-radius: 15px;
    font-family: 'Courier New', monospace;
    z-index: 999999;
    width: 280px;
    box-shadow: 0 0 15px #00ff00;
    cursor: move;
    overflow: hidden;
  `;

  painel.innerHTML = `
    <div style="text-align:center; font-size:14px; color:#00ff00;">@doubleeblack00</div>
    <h2 style="text-align:center; font-size:18px;">Double Black</h2>
    <div id="status" style="text-align:center; font-size:14px; margin:6px 0;">...</div>
    <div style="text-align:center; font-size:16px; font-weight:bold;" id="corPrevista">Carregando...</div>
    <div id="ultimosResultados" style="margin-top:8px; display:flex; justify-content:center; gap:4px;"></div>
  `;

  document.body.appendChild(painel);

  // Função para movimentar o painel (PC e celular)
  let offsetX, offsetY, isDragging = false;

  painel.addEventListener('mousedown', e => {
    isDragging = true;
    offsetX = e.clientX - painel.offsetLeft;
    offsetY = e.clientY - painel.offsetTop;
  });
  document.addEventListener('mousemove', e => {
    if (isDragging) {
      painel.style.left = `${e.clientX - offsetX}px`;
      painel.style.top = `${e.clientY - offsetY}px`;
    }
  });
  document.addEventListener('mouseup', () => isDragging = false);

  painel.addEventListener('touchstart', e => {
    isDragging = true;
    offsetX = e.touches[0].clientX - painel.offsetLeft;
    offsetY = e.touches[0].clientY - painel.offsetTop;
  }, { passive: false });
  document.addEventListener('touchmove', e => {
    if (isDragging) {
      painel.style.left = `${e.touches[0].clientX - offsetX}px`;
      painel.style.top = `${e.touches[0].clientY - offsetY}px`;
    }
  }, { passive: false });
  document.addEventListener('touchend', () => isDragging = false);

  // Lógica da previsão (Chefe 2k25)
  function getCorPorNumero(numero) {
    if (numero === 0) return { nome: 'Branco', cor: 'white' };
    if (numero >= 1 && numero <= 7) return { nome: 'Vermelho', cor: '#ff3c59' };
    return { nome: 'Preto', cor: '#1d2027' };
  }

  let ultimoId = null;

  function atualizarPrevisao() {
    fetch("https://blaze.bet.br/api/singleplayer-originals/originals/roulette_games/recent/1")
      .then(res => res.json())
      .then(data => {
        const ultimo = data[0];
        if (!ultimo || ultimo.id === ultimoId) return;
        ultimoId = ultimo.id;

        const cor = getCorPorNumero(ultimo.roll);
        const span = document.getElementById("corPrevista");
        const ultimos = document.getElementById("ultimosResultados");

        // Atualiza últimos 6 resultados
        if (ultimos) {
          ultimos.innerHTML = "";
          data.slice(0, 6).reverse().forEach(d => {
            const c = getCorPorNumero(d.roll);
            const e = document.createElement("div");
            e.textContent = d.roll;
            e.style = `
              background: ${c.cor};
              width: 20px; height: 20px;
              border-radius: 4px;
              color: black;
              text-align: center;
              font-size: 12px;
              font-weight: bold;
            `;
            ultimos.appendChild(e);
          });
        }

        // Sugestão
        if (ultimo.roll === 0) {
          span.textContent = '⬜';
          span.style.color = 'white';
        } else if (ultimo.roll >= 1 && ultimo.roll <= 7) {
          span.textContent = '⚫️';
          span.style.color = '#1d2027';
        } else {
          span.textContent = '🔴';
          span.style.color = '#ff3c59';
        }
      })
      .catch(err => {
        const span = document.getElementById("corPrevista");
        span.textContent = "Erro";
        span.style.color = "orange";
      });
  }

  setInterval(atualizarPrevisao, 2000);
})();
