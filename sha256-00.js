(() => {
  const usersUrl = 'https://raw.githubusercontent.com/Botmines00/2k25/main/users.json';
  const scriptUrl = 'https://raw.githubusercontent.com/Botmines00/2k25/refs/heads/main/sha256-01.js';

  function criarTelaLogin() {
    if (document.getElementById('loginTela')) return;

    const style = document.createElement('style');
    style.textContent = `
      #loginTela {
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0, 0, 0, 0.9); display: flex;
        align-items: center; justify-content: center; z-index: 9999999;
        font-family: sans-serif;
      }
      #loginBox {
        background: #111; padding: 20px; border-radius: 10px;
        box-shadow: 0 0 15px #00ff00; width: 280px; color: white;
        display: flex; flex-direction: column; align-items: center;
      }
      #loginBox h2 { color: #00ff00; margin-bottom: 15px; }
      #loginBox input {
        margin: 5px 0; padding: 10px; width: 100%;
        border-radius: 5px; border: none; outline: none;
      }
      #loginBox button {
        background: #00ff00; border: none; padding: 10px;
        margin-top: 10px; width: 100%; font-weight: bold;
        border-radius: 5px; cursor: pointer;
      }
    `;
    document.head.appendChild(style);

    const tela = document.createElement('div');
    tela.id = 'loginTela';
    tela.innerHTML = `
      <div id="loginBox">
        <h2>🧠 Chefe 2k25 - Login</h2>
        <input id="user" type="text" placeholder="Usuário" />
        <input id="pass" type="password" placeholder="Senha" />
        <button id="entrarBtn">Entrar</button>
      </div>
    `;
    document.body.appendChild(tela);

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
    // Carrega o conteúdo do script e executa
    fetch(scriptUrl)
      .then(res => res.text())
      .then(js => {
        console.log("✅ Script carregado. Executando...");
        eval(js); // Executa o JavaScript do Doubleblack1.js
      })
      .catch(() => alert("❌ Erro ao carregar o script Chefe 2k25."));
  }

  criarTelaLogin();
})();
