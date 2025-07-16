(function() {
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
        <h2 style="text-align:center; font-size: 18px; font-weight: bold; animation: brilhoTitulo 2s infinite alternate; color:#ff0000;">I.A WHITE14x</h2>
        <button id="hackearBtn" style="background-color: #ff3c59; color: white; width: 100%; padding: 10px; font-size: 16px; cursor: pointer; border: none; border-radius: 5px;">Hackear 14x</button>
        <p id="resultado" style="text-align:center; font-size: 16px; color: green;">100% SEM GALE</p>
        <h3>Últimos 6 Resultados:</h3>
        <div id="resultados" style="font-size: 14px; color: #00ff00;"></div>
        <div style="text-align:center; font-size: 14px; color: #f1f1f1;">Siga no Instagram: <span style="color: #ff3c59;">@doubleeblack00</span></div>
    `;
    document.body.appendChild(painel);

    const hackearBtn = document.getElementById("hackearBtn");
    hackearBtn.addEventListener("click", function() {
        document.getElementById("resultado").innerText = "Hackeando... Aguarde!";
        setTimeout(function() {
            // Simulando um novo valor de resultado
            let resultado = (Math.random() * 10).toFixed(2);
            document.getElementById("resultado").innerText = `Resultado: ${resultado}x`;
        }, 2000); // Simula um atraso de 2 segundos
    });

    // Função para criar o efeito do Matrix
    const matrixEffect = () => {
        let canvas = document.getElementById("matrixCanvas");
        let ctx = canvas.getContext("2d");
        let cols = canvas.width = window.innerWidth;
        let rows = canvas.height = window.innerHeight;

        let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*()";
        let font_size = 10;
        let columns = cols / font_size; 
        let drops = [];
        
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }
        
        function draw() {
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            ctx.fillRect(0, 0, cols, rows);

            ctx.fillStyle = "#0F0";
            ctx.font = font_size + "px monospace";

            for (let i = 0; i < drops.length; i++) {
                let text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * font_size, drops[i] * font_size);
                if (drops[i] * font_size > rows && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        setInterval(draw, 33);  // Atualiza o efeito a cada 33ms
    };

    matrixEffect();
})();
