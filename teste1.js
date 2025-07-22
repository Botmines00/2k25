(async function () {
  if (document.getElementById("doubleBlackMenu")) return;

  const apiURL = 'https://blaze.bet.br/api/roulette_games/recent';
  let ultimoID = null;

  function criarMenu() {
    const menu = document.createElement('div');
    menu.id = 'doubleBlackMenu';
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
      cursor: 'move',
      display: 'block'
    });

    menu.innerHTML = `
      <div style="display: flex; align-items: center;">
          <img src="https://i.ibb.co/y0LXzcQ/IMG-20241017-WA0216.jpg" style="width: 80px; height: 80px; border-radius: 50%; border: 2px solid #00FF00; margin-right: 10px;">
          <div style="flex-grow: 1; text-align: center;">
              <h3 style='margin: 0; font-size: 18px; color: white;'>Double Black</h3>
              <div style='font-size: 12px; color: #00FF00; margin-top: 3px; display: flex; align-items: center; justify-content: center;'>
                  <i class="fab fa-instagram" style="margin-right: 5px; color: #00FF00;"></i>
                  doubleeblack00
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

    return menu;
  }

  function tornarArrastavel(menu) {
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
  }

  async function atualizarResultados() {
    try {
      const res = await fetch(apiURL);
      const dados = await res.json();
      if (!dados || dados.length === 0) return;

      if (dados[0].id === ultimoID) return;
      ultimoID = dados[0].id;

      const ultimos = dados.slice(0, 6);
      const container = document.getElementById('ultimosResultados');
      container.innerHTML = '';

      ultimos.forEach(result => {
        const colorCode =
          result.roll === 0 ? '#ffffff' :
          result.roll <= 7 ? '#ff0000' :
          '#000000';

        const textColor = result.roll === 0 ? '#000' : '#fff';

        const box = document.createElement('div');
        box.style.width = '30px';
        box.style.height = '30px';
        box.style.borderRadius = '6px';
        box.style.display = 'flex';
        box.style.alignItems = 'center';
        box.style.justifyContent = 'center';
        box.style.backgroundColor = colorCode;
        box.style.color = textColor;
        box.style.fontWeight = 'bold';
        box.style.fontSize = '14px';
        box.textContent = result.roll;
        container.appendChild(box);
      });

      const corAtual = ultimos[0].roll;
      document.getElementById('corPrevista').innerText =
        corAtual === 0 ? '⚪️' : corAtual <= 7 ? '🔴' : '⚫️';
    } catch (erro) {
      console.error("Erro ao obter resultados:", erro);
    }
  }

  if (document.readyState !== "loading") {
    const menu = criarMenu();
    document.body.appendChild(menu);
    tornarArrastavel(menu);
    document.getElementById('closeMenu').onclick = () => menu.remove();
    await atualizarResultados();
    setInterval(atualizarResultados, 6000);
  } else {
    document.addEventListener("DOMContentLoaded", async () => {
      const menu = criarMenu();
      document.body.appendChild(menu);
      tornarArrastavel(menu);
      document.getElementById('closeMenu').onclick = () => menu.remove();
      await atualizarResultados();
      setInterval(atualizarResultados, 6000);
    });
  }
})();
