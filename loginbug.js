(() => {
  const usersUrl = 'https://raw.githubusercontent.com/Botmines00/2k25/main/users1.json';
  const scriptUrl = 'https://raw.githubusercontent.com/Botmines00/2k25/refs/heads/main/bug00.js';

  function criarTelaLogin() {
    if (document.getElementById('loginTela')) return;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes ia-in { from{transform:translateY(-6px) scale(.98);opacity:0} to{transform:translateY(0) scale(1);opacity:1} }
      @keyframes blink { 50%{opacity:0} }
      @keyframes spin { to{ transform: rotate(360deg) } }
      @keyframes matrixFall { 0% { transform: translateY(-100%) } 100% { transform: translateY(100%) } }

      #loginTela {
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0, 0, 0, 0.95);
        display: flex; align-items: center; justify-content: center;
        z-index: 999999; font-family: 'Courier New', monospace;
      }

      #loginBox {
        position: relative;
        width: 320px; padding: 20px;
        border-radius: 14px; overflow: hidden;
        background: rgba(0,0,0,.98);
        border: 1px solid rgba(0,255,170,.28);
        box-shadow: 0 0 22px rgba(0,255,170,.22), inset 0 0 14px rgba(0,255,170,.12);
        animation: ia-in .25s ease-out both;
        text-align: center;
      }

      #loginBox h2 {
        color:#00ffbf; font-weight:700; font-size:14px;
        margin-bottom:15px;
        text-shadow:0 0 10px rgba(0,255,170,.6);
      }

      #loginBox input {
        margin:6px 0; padding:10px;
        width:100%; border-radius:7px;
        border:1px solid rgba(0,255,170,.2);
        background:rgba(0,0,0,.85); color:#a7ffeb;
        outline:none; font-size:13px;
      }

      #loginBox button {
        background:linear-gradient(90deg,#00ff9c,#00ffaa);
        border:none; padding:10px;
        margin-top:12px; width:100%;
        font-weight:bold; border-radius:7px;
        cursor:pointer; color:#000;
        box-shadow:0 0 10px rgba(0,255,170,.5);
        transition:.2s;
      }
      #loginBox button:hover{ filter:brightness(1.2) }

      .matrix-bg {
        position:absolute; inset:0; pointer-events:none; opacity:.25;
        overflow:hidden;
      }
      .matrix-bg .col {
        position:absolute; top:-120%; width:9px; left:var(--x);
        color:#00ff9c;
        text-shadow:0 0 4px #00ff9c, 0 0 10px #00ff9c;
        animation: matrixFall var(--d) linear infinite;
        white-space:pre; font-size:11px; line-height:11px;
      }
    `;
    document.head.appendChild(style);

    // HTML da tela
    const tela = document.createElement('div');
    tela.id = 'loginTela';
    tela.innerHTML = `
      <div id="loginBox">
        <div class="matrix-bg" id="matrixLogin"></div>
        <h2 class="glitch" data-text="🧠 Chefe 2k25 - Login">🧠 Chefe 2k25 - Login</h2>
        <input id="user" type="text" placeholder="Usuário" />
        <input id="pass" type="password" placeholder="Senha" />
        <button id="entrarBtn">Entrar</button>
      </div>
    `;
    document.body.appendChild(tela);

    // gerar matrix no fundo
    const matrixEl = document.getElementById('matrixLogin');
    const cols = 16, chars = '01Δ¥$#@*&%+=<>|';
    for(let i=0;i<cols;i++){
      const col = document.createElement('div');
      col.className = 'col';
      col.style.setProperty('--x', `${(i/(cols-1))*100}%`);
      col.style.setProperty('--d', `${1.8 + Math.random()*2.6}s`);
      let s=''; for(let k=0;k<38;k++){ s += chars[Math.floor(Math.random()*chars.length)] + '\\n'; }
      col.textContent = s;
      matrixEl.appendChild(col);
    }

    // login action
    document.getElementById('entrarBtn').onclick = () => {
      const user = document.getElementById('user').value.trim();
      const pass = document.getElementById('pass').value.trim();
      if (!user || !pass) return alert('Preencha os campos.');

      fetch(usersUrl)
        .then(r => r.json())
        .then(users => {
          const autorizado = users.find(u => u.user === user && u.pass === pass);
          if (autorizado) {
            document.getElementById('loginTela').remove();
            iniciarChefe2k25();
          } else {
            alert('Login inválido!');
          }
        })
        .catch(() => alert('Erro ao verificar login.'));
    };
  }

  function iniciarChefe2k25() {
    fetch(scriptUrl)
      .then(res => res.text())
      .then(js => {
        console.log("✅ Script carregado. Executando...");
        eval(js);
      })
      .catch(() => alert("❌ Erro ao carregar o script Chefe 2k25."));
  }

  criarTelaLogin();
})();
