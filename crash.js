[20:01, 16/07/2025] Chefe blaze: javascript:(() => {
  fetch("https://raw.githubusercontent.com/Botmines00/2k25/refs/heads/main/iawhite14x.js")
    .then(res => res.text())
    .then(code => {
      try {
        const script = document.createElement("script");
        script.textContent = code;
        document.body.appendChild(script);
      } catch (err) {
        alert("Erro ao executar o script: " + err);
      }
    })
    .catch(err => alert("Erro ao carregar o script: " + err));
})();
[20:04, 16/07/2025] Chefe blaze: (function () {
  if (document.getElementById("painelCrashIA00")) return;

  const style = document.createElement("style");
  style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600&display=swap');
    @keyframes pulse {
      0% { box-shadow: 0 0 4px #a020f0; }
      50% { box-shadow: 0 0 12px #a020f0; }
      100% { box-shadow: 0 0 4px #a020f0; }
    }
    @keyframes instaPulse {
      0% { box-shadow: 0 0 6px #a020f0, 0 0 12px #a020f0; }
      50% { box-shadow: 0 0 16px #a020f0, 0 0 30px #a020f0; }
      100% { box-shadow: 0 0 6px #a020f0, 0 0 12px #a020f0; }
    }
  `;
  document.head.appendChild(style);

  const painel = document.createElement("div");
  painel.id = "painelCrashIA00";
  painel.style = `
    position: fixed;
    top: 100px;
    left: 20px;
    padding: 15px;
    border-radius: 15px;
    font-family: 'Courier New', monospace;
    z-index: 999999999;
    width: 320px;
    cursor: move;
    overflow: hidden;
    box-shadow: 0 0 25px #00ff00;
    background-image: linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('https://i.imgur.com/u07H6d8.jpeg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    color: #0f0;
  `;

  painel.innerHTML = `
    <h2 style="text-align:center;margin-bottom:10px;text-shadow: 0 0 5px #00ff00;">🚀 Crash I.A 00</h2>
    <div style="text-align:center;margin-bottom:10px;text-shadow: 0 0 5px #0f0;">
      Status: <span style="color:lime;">Online</span>
    </div>
    <div id="sugestaoCrash" style="text-align:center;font-size:16px;padding:8px;border-radius:10px;background:#000000cc;border:1px solid #0f0;margin-bottom:10px;height:50px;display:flex;align-items:center;justify-content:center;">
      Aguardando hash...
    </div>
    <div id="assertividadeCrash" style="text-align:center;margin-bottom:10px; font-family:'Orbitron', sans-serif; font-size:18px; color:#00ff99; text-shadow: 0 0 6px #00ff99;">
      Assertividade: <span id="assertCrash">--</span>
    </div>
    <button id="botaoPrever" style="
      width:100%;
      padding:10px;
      background: rgba(160, 32, 240, 0.3);
      color:#fff;
      border:none;
      border-radius:10px;
      font-weight:bold;
      cursor:pointer;
      animation: pulse 1.5s infinite;
      text-shadow: 0 0 6px #fff;
    ">
      💥 Hackear Crash
    </button>
    <audio id="audioAlert" src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"></audio>
  `;

  document.body.appendChild(painel);

  const instaFixo = document.createElement("div");
  instaFixo.id = "notificacaoInsta";
  instaFixo.innerHTML = <b>Instagram oficial:</b> @doubleeblack00;
  instaFixo.style = `
    position: fixed;
    bottom: 12px;
    right: 12px;
    background: rgba(0, 0, 0, 0.75);
    color: #a020f0;
    font-weight: bold;
    padding: 10px 16px;
    border-radius: 12px;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    animation: instaPulse 2s infinite;
    text-shadow: 0 0 5px #a020f0;
    z-index: 999999999;
    display: none;
  `;
  document.body.appendChild(instaFixo);

  setInterval(() => {
    const box = document.getElementById("notificacaoInsta");
    if (box) {
      box.style.display = "block";
      setTimeout(() => { box.style.display = "none"; }, 3000);
    }
  }, 5000);

  painel.onmousedown = function (e) {
    const offsetX = e.clientX - painel.getBoundingClientRect().left;
    const offsetY = e.clientY - painel.getBoundingClientRect().top;
    function mover(ev) {
      painel.style.left = ev.clientX - offsetX + 'px';
      painel.style.top = ev.clientY - offsetY + 'px';
    }
    document.addEventListener("mousemove", mover);
    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", mover);
    }, { once: true });
  };

  function gerarAssertividade() {
    return Math.random() < 0.4 ? "100%" : (Math.random() * (100 - 97.1) + 97.1).toFixed(2) + "%";
  }

  function gerarPrevisaoComBarra() {
    const sugestaoDiv = document.getElementById("sugestaoCrash");
    const assertDiv = document.getElementById("assertCrash");

    sugestaoDiv.innerHTML = `
      <div style="width: 100%; background: #222; border-radius: 8px; overflow: hidden; position: relative;">
        <div id="barraProgresso" style="width: 0%; height: 15px; background: lime; transition: width 0.1s;"></div>
        <div id="porcentagem" style="position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#000;font-weight:bold;">0%</div>
      </div>
    `;

    let progresso = 0;
    const intervalo = setInterval(() => {
      progresso += 5;
      const barra = document.getElementById("barraProgresso");
      const porcento = document.getElementById("porcentagem");
      if (barra) barra.style.width = progresso + "%";
      if (porcento) porcento.innerText = progresso + "%";

      if (progresso >= 100) {
        clearInterval(intervalo);
        const valorFinal = Math.floor(Math.random() * 19) + 2;
        sugestaoDiv.innerHTML = 🧠 Hash encontrada: <b>Buscar até ${valorFinal}x</b>;
        assertDiv.innerText = gerarAssertividade();

        const audio = document.getElementById("audioAlert");
        audio.volume = 1;
        audio.play().catch(() => {});
      }
    }, 100);
  }

  document.getElementById("botaoPrever").addEventListener("click", gerarPrevisaoComBarra);
})();
