(function () {
  if (document.getElementById("painelWhite14x")) return;

  const painel = document.createElement("div");
  painel.id = "painelWhite14x";
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
    box-shadow: 0 0 15px #ff0000;
    cursor: move;
    overflow: hidden;
  `;

  painel.innerHTML = `
    <canvas id="matrixCanvas" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:-1;opacity:0.5;"></canvas>
    <h2 style="text-align:center; font-size: 18px; font-weight: bold; animation: brilhoTitulo 2s infinite alternate; color:#ff0000;">🧠 I.A WHITE14x 🧠</h2>
    <button id="hackWhite" style="padding: 10px 15px; background: rgba(255,255,255,0.2); color: black; border: none; font-weight: bold; border-radius: 10px; cursor: pointer; width: 100%;">🎯 Hackear 14x</button>

    <div id="progressBar" style="margin-top:10px; height: 22px; background: #111; border-radius: 10px; overflow: hidden; border: 2px solid #00f; box-shadow: 0 0 10px #00f, 0 0 20px #00f; display: none;">
      <div id="progressInner" style="height: 100%; width: 0%; background: #00ff00; text-align:center; font-weight:bold; color:#000; line-height: 22px; text-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00;"></div>
    </div>

    <div id="horaBranco" style="margin-top: 12px; font-size: 18px; text-align: center; font-weight: bold; color: #ff0000; text-shadow: 0 0 5px #ff0000, 0 0 10px #ff0000, 0 0 15px #ff0000; animation: neonRed 1s infinite alternate;"></div>
    <div id="assertividade" style="text-align:center; font-weight:bold; font-size:15px; margin-top: 4px; color:#00ffff;"></div>
    <div style="text-align:center; margin: 8px 0; font-weight:bold; color: #00ff00; animation: piscar 1s infinite;">100% SEM GALE</div>
    <div style="font-size: 13px; margin-top: 10px;">📌 <b>Últimos 6 Resultados:</b></div>
    <div id="ultimosResultados" style="display: flex; gap: 4px; margin-top: 6px; justify-content: center;"></div>

    <style>
      @keyframes piscar { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      @keyframes brilhoTitulo { 0% { text-shadow: 0 0 5px #ff0000; } 100% { text-shadow: 0 0 15px #ff0000; } }
      @keyframes neonRed {
        from { text-shadow: 0 0 5px #ff0000, 0 0 10px #ff0000, 0 0 15px #ff0000; }
        to   { text-shadow: 0 0 10px #ff3333, 0 0 20px #ff3333, 0 0 30px #ff3333; }
      }
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(20px); }
        10%, 90% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(20px); }
      }
    </style>
  `;
  document.body.appendChild(painel);

  const canvas = document.getElementById("matrixCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = painel.clientWidth;
  canvas.height = painel.clientHeight;
  const letters = Array(256).join("0").split("");
  setInterval(() => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ff1a1a";
    letters.forEach((y_pos, index) => {
      const text = String.fromCharCode(3e4 + Math.random() * 33);
      const x = index * 10;
      ctx.fillText(text, x, y_pos);
      letters[index] = y_pos > canvas.height + Math.random() * 1e4 ? 0 : parseFloat(y_pos) + 10;
    });
  }, 40);

  // Arraste no PC e Celular
  function iniciarArraste(e) {
    e.preventDefault();
    const isTouch = e.type === "touchstart";
    const startX = isTouch ? e.touches[0].clientX : e.clientX;
    const startY = isTouch ? e.touches[0].clientY : e.clientY;
    const rect = painel.getBoundingClientRect();
    const offsetX = startX - rect.left;
    const offsetY = startY - rect.top;

    function mover(eMove) {
      const moveX = isTouch ? eMove.touches[0].clientX : eMove.clientX;
      const moveY = isTouch ? eMove.touches[0].clientY : eMove.clientY;
      painel.style.left = `${moveX - offsetX}px`;
      painel.style.top = `${moveY - offsetY}px`;
    }

    function parar() {
      document.removeEventListener(isTouch ? "touchmove" : "mousemove", mover);
      document.removeEventListener(isTouch ? "touchend" : "mouseup", parar);
    }

    document.addEventListener(isTouch ? "touchmove" : "mousemove", mover);
    document.addEventListener(isTouch ? "touchend" : "mouseup", parar);
  }
  painel.addEventListener("mousedown", iniciarArraste);
  painel.addEventListener("touchstart", iniciarArraste);

  // Últimos resultados fake (pode adaptar)
  function atualizarResultadosDOM() {
    const container = document.getElementById("ultimosResultados");
    container.innerHTML = "";
    for (let i = 0; i < 6; i++) {
      const bola = document.createElement("div");
      const cores = ["white", "red", "black"];
      const cor = cores[Math.floor(Math.random() * 3)];
      bola.style = `
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        border-radius: 50%;
        font-size: 14px;
        background: ${cor};
        color: ${cor === "white" ? "#000" : "#fff"};
      `;
      bola.innerText = cor === "white" ? "0" : Math.floor(Math.random() * 14 + 1);
      container.appendChild(bola);
    }
  }

  // Botão Hackear
  document.getElementById("hackWhite").onclick = () => {
    const btn = document.getElementById("hackWhite");
    const bar = document.getElementById("progressBar");
    const inner = document.getElementById("progressInner");
    const horaEl = document.getElementById("horaBranco");
    const assertEl = document.getElementById("assertividade");

    btn.disabled = true;
    btn.innerText = "⏳ Processando...";
    bar.style.display = "block";
    let p = 0;
    const interval = setInterval(() => {
      p += 2;
      inner.style.width = `${p}%`;
      inner.innerText = `${p}%`;
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          bar.style.display = "none";
          inner.style.width = "0%";
          inner.innerText = "";
          btn.disabled = false;
          btn.innerText = "🎯 Hackear 14x";
        }, 400);

        atualizarResultadosDOM();
        const agora = new Date();
        let h = agora.getHours();
        let m = agora.getMinutes() + 1;
        if (m >= 60) { m = 0; h = (h + 1) % 24; }
        const horaFinal = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        horaEl.innerText = `Entrada Hackeada: ${horaFinal}`;
        assertEl.innerText = `🎯 Assertividade: ${Math.random() < 0.6 ? "100%" : (99 + Math.random()).toFixed(2) + "%"}`;

        const verificador = setInterval(() => {
          const now = new Date();
          if (now.getHours() > h || (now.getHours() === h && now.getMinutes() >= m)) {
            horaEl.innerText = "";
            clearInterval(verificador);
          }
        }, 5000);
      }
    }, 100);
  };

  setInterval(atualizarResultadosDOM, 8000);
  atualizarResultadosDOM();

  // Instagram
  function mostrarNotificacaoInstagram() {
    if (document.getElementById("notificacaoInsta")) return;
    const notif = document.createElement("div");
    notif.id = "notificacaoInsta";
    notif.innerHTML = `📢 Siga no Instagram:<br><b style="color:#00ffcc;">@doubleeblack00</b>`;
    notif.style = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #000;
      color: white;
      padding: 10px 15px;
      font-weight: bold;
      font-family: 'Courier New', monospace;
      border: 2px solid #00ffcc;
      border-radius: 8px;
      box-shadow: 0 0 10px #00ffcc, 0 0 20px #00ffcc;
      z-index: 999999;
      animation: fadeInOut 3s ease-in-out;
      text-align: center;
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
  }
  setInterval(mostrarNotificacaoInstagram, 10000);
})();
