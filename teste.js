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

  setInterval(atualizarResultado, 2000);
  setInterval(atualizarPainelBranco, 4000);

  // HABILITAR MENU ARRASTÁVEL
  let isDragging = false, offsetX = 0, offsetY = 0;
  const startDrag = (x, y) => {
    isDragging = true;
    offsetX = x - menu.offsetLeft;
    offsetY = y - menu.offsetTop;
  };
  const drag = (x, y) => {
    if (!isDragging) return;
    menu.style.left = `${x - offsetX}px`;
    menu.style.top = `${y - offsetY}px`;
  };
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
})();
