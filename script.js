document.addEventListener('DOMContentLoaded', function() {
    let userName = null;
    let level = 0;
    let lifes = 3;
    let gameBoard = document.getElementById('gameBoard');
    let colorArray = ['#1abc9c', '#D54720', '#FF61F4', '#A57F37', '#16a085', '#27ae60', '#2ecc71', '#2980b9', '#3498db', '#8e44ad', '#9b59b6', '#2c3e50', '#34495e', '#f1c40f', '#f39c12', '#e67e22', '#e74c3c', '#c0392b'];

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function showMessage(msg) {
        const message = document.getElementById('message');
        message.textContent = msg;
        message.classList.remove('hidden');
        setTimeout(() => {
            message.classList.add('hidden');
        }, 3000);
    }

    function getLuminanceByLevel(level) {
        let minLum = 0.05;
        let maxLum = 0.5;
        let step = (maxLum - minLum) / 19;
        return maxLum - (step * (level - 1));
    }

    function ColorLuminance(hex, lum) {
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        lum = lum || 0;
        let rgb = "#", c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00" + c).substr(c.length);
        }
        return rgb;
    }

    function Board() {
        this.nOptions = 9;
        this.selectedOption = randomInt(0, this.nOptions);
        this.selectedColor = randomInt(0, colorArray.length);

        this.primaryColor = colorArray[this.selectedColor];
        let luminanceDifference = getLuminanceByLevel(level);
        this.secondaryColor = ColorLuminance(this.primaryColor, luminanceDifference);
    }

    function updateStats() {
        document.getElementById('lifes').textContent = lifes;
        document.getElementById('level').textContent = level;
        if (lifes === 0) {
            gameOver();
        }
    }

    function saveScore(name, score) {
        let scores = JSON.parse(localStorage.getItem('scores')) || [];
        scores.push({ name, score });
        scores.sort((a, b) => b.score - a.score);
        localStorage.setItem('scores', JSON.stringify(scores));
    }

    function showScoreboard() {
        const scores = JSON.parse(localStorage.getItem('scores')) || [];
        const scoreList = document.getElementById('scoreList');
        scoreList.innerHTML = '';

        if (scores.length === 0) {
            scoreList.textContent = 'Er zijn nog geen scores!';
        } else {
            scores.forEach((entry, index) => {
                const scoreEntry = document.createElement('div');
                scoreEntry.innerHTML = `<strong>${index + 1}. ${entry.name}</strong>: ⭐ ${entry.score}`;
                scoreList.appendChild(scoreEntry);
            });
        }

        document.getElementById('scoreboard').classList.remove('hidden');
    }

    function resetScoreboard() {
        localStorage.removeItem('scores');
        showScoreboard();
    }

    

    function gameOver() {
        document.getElementById('gameScreen').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.remove('hidden');
        document.getElementById('score').innerHTML = `<span>${userName}</span> <span>⭐ ${level}</span>`;

        let resultMessage = '';

        if (level >= 0 && level < 10) {
            resultMessage = 'Je staat aan het begin van je reis! Het kleurenpalet heeft nog wat geheimen voor je, maar met oefening en doorzettingsvermogen kun je al snel beter worden. Blijf je ogen trainen, het pad naar een Front-End Developer begint hier!';
        } else if (level >= 10 && level < 20) {
            resultMessage = 'Geweldig bezig! Je hebt al een scherp oog voor kleuren, en je bent goed op weg om een echte Front-End Developer te worden. Houd dat enthousiasme vast, je toekomst in de techwereld ziet er veelbelovend uit!';
        } else if (level >= 20 && level < 25) {
            resultMessage = 'Wauw! Je hebt nu echt een scherp oog voor detail. Dit is precies het soort visuele precisie dat nodig is om te slagen als Front-End Developer. Je bouwt al aan een indrukwekkende skillset!';
        } else if (level >= 25) {
            resultMessage = 'Ongelooflijk! Je kleurinzicht is van topniveau. Dit is wat het betekent om een ware meester te zijn in visuele herkenning, een cruciale vaardigheid voor elke succesvolle Front-End Developer. Je hebt het helemaal in je!';
        }

        document.getElementById('result').innerHTML = resultMessage;

        saveScore(userName, level);
        showScoreboard();
    }

    function updateBoard(board) {
        gameBoard.innerHTML = '';
        for (let i = 0; i < board.nOptions; i++) {
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('width', '72');
            rect.setAttribute('height', '72');
            rect.setAttribute('x', (i % 3) * 80);
            rect.setAttribute('y', Math.floor(i / 3) * 80);
            rect.setAttribute('fill', i === board.selectedOption ? board.secondaryColor : board.primaryColor);
            rect.addEventListener('click', function() {
                if (i === board.selectedOption) {
                    confetti({
                        particleCount: 50,
                        gravity: 1.5,
                        decay: 0.9,
                        spread: 40,
                        origin: { y: 0.6 }
                    });
                    level++;
                } else {
                    lifes--;
                }
                newBoard();
            });
            gameBoard.appendChild(rect);
        }
    }

    function newBoard() {
        updateStats();
        if (lifes > 0) {
            const currentBoard = new Board();
            updateBoard(currentBoard);
        }
    }

    function startGame() {
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('gameScreen').classList.remove('hidden');
        userName = document.getElementById('name').value || 'Player';
        lifes = 3;
        level = 0;
        document.querySelector('.user-name').textContent = userName;
        newBoard();
    }

    document.getElementById('playNow').addEventListener('click', function() {
        startGame();
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            startGame();
        }
    });

    document.getElementById('replay').addEventListener('click', function() {
        document.getElementById('gameOverScreen').classList.add('hidden');
        document.getElementById('startScreen').classList.remove('hidden');
    });

    showScoreboard();
});
