(async function () {
  const apiURL = 'https://blaze.bet.br/api/singleplayer-originals/originals/roulette_games/recent/1';

  const menu = document.createElement('div');
  Object.assign(menu.style, {
    position: 'fixed',
    top: '100px',
    left: '20px',
    width: '290px',
    background: '#1e1e1e',
    color: '#fff',
    padding: '10px',
    borderRadius: '8px',
    border: '2px solid #00FF00',
    boxShadow: '0 0 10px rgba(0,0,0,0.5)',
    zIndex: '9999',
    cursor: 'move'
  });

  menu.innerHTML = `
    <div style="display: flex; align-items: center;">
        <img src="https://i.ibb.co/y0LXzcQ/IMG-20241017-WA0216.jpg" style="width: 80px; height: 80px; border-radius: 50%; border: 2px solid #00FF00; margin-right: 10px;">
        <div style="flex-grow: 1; text-align: center;">
            <h3 style='margin: 0; font-size: 18px; color: white;'>Double Black</h3>
            <div style='font-size: 12px; color: #00FF00; margin-top: 3px; display: flex; align-items: center; justify-content: center;'>
                <i class="fab fa-instagram" style="margin-right: 5px; color: #00FF00;"></i>
                bot00blaze
            </div>
            <div style="font-size: 14px; color: #00FF00; margin-top: 10px;">Bem-vindo ao Double Black</div>
        </div>
        <span id='closeMenu' style="cursor: pointer; font-size: 14px; color: white;">❌</span>
    </div>

    <div id="messageArea" style="margin-top: 10px; padding: 5px; background-color: #333; border-radius: 5px;">
        <p style="margin: 0; font-size: 14px;">Chance: <span style="color:#00FF00;font-weight:bold;">99.99%</span></p>
        <p style="margin: 0; font-size: 14px;">Entrar no: <span id="corPrevista">🔴</span></p>
    </div>

    <div style="margin-top: 10px; font-size: 12px; color: #00FF00;">
      <div style="background-color: rgba(255, 255, 255, 0.1); padding: 3px 5px; border-radius: 5px; display: inline-block;">
          SHA256 | Versão: 4.0
      </div>
    </div>

    <div id="ultimosResultados" style="margin-top: 15px; display: flex; gap: 5px; justify-content: center;"></div>
  `;

  document.body.appendChild(menu);

  // Fechar menu
  document.getElementById('closeMenu').onclick = () => menu.remove();

  // Arrastar no PC e celular
  let isDragging = false, offsetX, offsetY;
  menu.addEventListener('mousedown', startDrag);
  menu.addEventListener('touchstart', startDrag);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchmove', drag);
  document.addEventListener('touchend', stopDrag);

  function startDrag(e) {
    isDragging = true;
    const rect = menu.getBoundingClientRect();
    offsetX = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    offsetY = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
  }

  function drag(e) {
    if (!isDragging) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - offsetX;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - offsetY;
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
  }

  function stopDrag() {
    isDragging = false;
  }

  // Buscar dados reais da Blaze
  async function atualizarResultados() {
    try {
      const res = await fetch(apiURL);
      const dados = await res.json();

      const ultimos = dados.slice(0, 6); // Últimos 6 resultados
      const container = document.getElementById('ultimosResultados');
      container.innerHTML = '';

      ultimos.forEach(result => {
        const cor = result.color === 0 ? '#ffffff' : result.color <= 7 ? '#ff0000' : '#000000';
        const box = document.createElement('div');
        box.style.width = '25px';
        box.style.height = '25px';
        box.style.borderRadius = '4px';
        box.style.backgroundColor = cor;
        box.style.border = '1px solid #888';
        container.appendChild(box);
      });

      // Definir a cor sugerida com base no último
      const corAtual = ultimos[0].color;
      document.getElementById('corPrevista').innerText = corAtual === 0 ? '⚪️' : corAtual <= 7 ? '🔴' : '⚫️';
    } catch (erro) {
      console.error("Erro ao obter resultados:", erro);
    }
  }

  setInterval(atualizarResultados, 5000);
  atualizarResultados();
})();
