(async function() {
    const apiUrls = {
        current: 'https://blaze1.space/api/singleplayer-originals/originals/roulette_games/current/1',
        recent: 'https://blaze1.space/api/singleplayer-originals/originals/roulette_games/recent/1'
    };

    const menu = createMenu();
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
    document.head.appendChild(link);
    document.body.appendChild(menu);

    // Tornar arrastável
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

    document.addEventListener('dblclick', (e) => toggleMenu(menu, e.clientY, e.clientX));

    function createMenu() {
        const m = document.createElement('div');
        Object.assign(m.style, {
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

        m.innerHTML = `
            <div style="display: flex; align-items: center;">
                <img src="https://i.ibb.co/y0LXzcQ/IMG-20241017-WA0216.jpg" style="width: 80px; height: 80px; border-radius: 50%; border: 2px solid #00FF00; margin-right: 10px;">
                <div style="flex-grow: 1; text-align: center;">
                    <h3 style='margin: 0; font-size: 18px; color: white;'>Double Black</h3>
                    <div style='font-size: 12px; color: #00FF00; margin-top: 3px; display: flex; align-items: center; justify-content: center;'>
                        <i class="fab fa-instagram" style="margin-right: 5px; color: #00FF00;"></i>
                        bot00blaze
                    </div>
                    <div id="hackingMessage" style="font-size: 14px; color: #00FF00; margin-top: 10px;">Bem-vindo ao Double Black</div>
                </div>
                <span id='closeMenu' style="cursor: pointer; font-size: 14px; color: white;">❌</span>
            </div>
            <div id="messageArea" style="margin-top: 10px; padding: 5px; background-color: #333; border-radius: 5px;">
                <p id="messageText" style="margin: 0; font-size: 14px;">Nenhuma mensagem no momento</p>
            </div>
            <div style="margin-top: 10px; text-align: center;">
                <div style="display: flex; align-items: center; gap: 5px;">
                    <span class="chance" style="color: #00FF00; font-weight: bold;">Chance: 99.99%</span>
                </div>
                <div style="display: flex; align-items: center; gap: 5px;">
                    Entrar no: <span class="colorIndicator">🔴</span>
                </div>
                <div style="margin-top: 10px; font-size: 12px; color: #00FF00;">
                    <div style="background-color: rgba(255, 255, 255, 0.1); padding: 3px 5px; border-radius: 5px; display: inline-block;">
                        SHA256 | Versão: 4.0
                    </div>
                </div>
            </div>
            <div style="margin-top: 20px;">
                <div style="height: 100px; width: 100%; background-color: #333; border-radius: 10px; position: relative;">
                    <div id="redBar" style="position: absolute; bottom: 0; left: 0; width: 33%; height: 0; background-color: red; border-radius: 10px;"></div>
                    <div id="whiteBar" style="position: absolute; bottom: 0; left: 33%; width: 33%; height: 0; background-color: white; border-radius: 10px;"></div>
                    <div id="blackBar" style="position: absolute; bottom: 0; left: 66%; width: 33%; height: 0; background-color: black; border-radius: 10px;"></div>
                </div>
            </div>
            <div id="history" style="margin-top: 15px; display: flex; justify-content: space-between;"></div>
        `;
        return m;
    }

    function toggleMenu(menu, y, x) {
        menu.style.top = `${y}px`;
        menu.style.left = `${x}px`;
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    }

    document.getElementById('closeMenu').addEventListener('click', () => menu.style.display = 'none');

    function showMessage(message) {
        document.getElementById('messageText').textContent = message;
    }

    function processResult(colorSymbol) {
        let redHeight = 0, whiteHeight = 0, blackHeight = 0;
        if (colorSymbol === 0) whiteHeight = 100;
        else if (colorSymbol >= 1 && colorSymbol <= 7) redHeight = 100;
        else if (colorSymbol >= 8 && colorSymbol <= 14) blackHeight = 100;

        document.getElementById('redBar').style.height = `${redHeight}%`;
        document.getElementById('whiteBar').style.height = `${whiteHeight}%`;
        document.getElementById('blackBar').style.height = `${blackHeight}%`;
        document.querySelector(".colorIndicator").innerText = colorSymbol === 0 ? '⚪️' : colorSymbol <= 7 ? '🔴' : '⚫️';
    }

    async function updateHistory() {
        try {
            const res = await fetch(apiUrls.recent);
            const data = await res.json();
            const historyContainer = document.getElementById('history');
            historyContainer.innerHTML = data.slice(0, 6).map(game => {
                const color = game.color === 0 ? '⚪️' : game.color <= 7 ? '🔴' : '⚫️';
                return `<div style="font-size: 20px;">${color}</div>`;
            }).join('');
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
        }
    }

    async function fetchColorPrediction() {
        try {
            const response = await fetch(apiUrls.current);
            const data = await response.json();
            return data.color;
        } catch (error) {
            console.error("Erro ao buscar dados da API:", error);
            return Math.floor(Math.random() * 15);
        }
    }

    async function updateLoop() {
        const colorPrediction = await fetchColorPrediction();
        processResult(colorPrediction);
        updateHistory();
    }

    setInterval(updateLoop, 13000);
    updateLoop();
    showMessage('Bem-vindo ao Double Black!');
})();
