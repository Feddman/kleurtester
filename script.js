document.addEventListener('DOMContentLoaded', function() {
    let userName = null;
    let level = 0;
    let lifes = 3;
    let gameBoard = document.getElementById('gameBoard');
    let colorArray = ['#1abc9c', '#16a085', '#27ae60', '#2ecc71', '#2980b9', '#3498db', '#8e44ad', '#9b59b6', '#2c3e50', '#34495e', '#f1c40f', '#f39c12', '#e67e22', '#e74c3c', '#c0392b'];

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
        this.difficulty = randomInt(2, 12) / 100;
        this.primaryColor = colorArray[this.selectedColor];
        this.secondaryColor = ColorLuminance(this.primaryColor, this.difficulty);
    }

    function updateStats() {
        document.getElementById('lifes').textContent = lifes;
        document.getElementById('level').textContent = level;
        if (lifes === 0) {
            gameOver();
        }
    }

    function gameOver() {
        document.getElementById('gameScreen').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.remove('hidden');
        document.getElementById('score').innerHTML = `<span>${userName}</span> <span>⭐ ${level}</span>`;
    
        let resultMessage = '';
    
        if (level >= 0 && level < 5) {
            resultMessage = 'Je staat aan het begin van je reis! Het kleurenpalet heeft nog wat geheimen voor je, maar met oefening en doorzettingsvermogen kun je al snel beter worden. Blijf je ogen trainen, het pad naar een Front-End Developer begint hier! <br> <b> Advies: Inschrijven voor de Front-End Development opleiding! </b>';
        } else if (level >= 5 && level < 10) {
            resultMessage = 'Geweldig bezig! Je hebt al een scherp oog voor kleuren, en je bent goed op weg om een echte Front-End Developer te worden. Houd dat enthousiasme vast, je toekomst in de techwereld ziet er veelbelovend uit! <br> <b> Advies: Inschrijven voor de Front-End Development opleiding! </b>';
        } else if (level >= 10 && level < 15) {
            resultMessage = 'Wauw! Je hebt nu echt een scherp oog voor detail. Dit is precies het soort visuele precisie dat nodig is om te slagen als Front-End Developer. Je bouwt al aan een indrukwekkende skillset! <br> <b> Advies: Inschrijven voor de Front-End Development opleiding! </b>';
        } else if (level >= 15) {
            resultMessage = 'Ongelooflijk! Je kleurinzicht is van topniveau. Dit is wat het betekent om een ware meester te zijn in visuele herkenning, een cruciale vaardigheid voor elke succesvolle Front-End Developer. Je hebt het helemaal in je! <br> <b> Advies: Inschrijven voor de Front-End Development opleiding! </b>';
        }
    
        document.getElementById('result').innerHTML = resultMessage;
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
                        particleCount: 150,
                        spread: 60,
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

  
});
