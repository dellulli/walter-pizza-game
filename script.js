document.addEventListener('DOMContentLoaded', () => {
    const walter = document.getElementById('walter');
    const skyler = document.getElementById('skyler');
    const walterSound = new Audio('walter.mp3');
    const backgroundMusic = new Audio('brba.mp3');
    const timerElement = document.getElementById('timer');
    const scoreElement = document.getElementById('score');
    const messageElement = document.getElementById('message');
    const retryButton = document.getElementById('retry');
    const startButton = document.getElementById('start');
    
    let score = 0;
    let timer = 25;
    let gameInterval;
    let timerInterval;
    let skylerTimeout;

    let walterX = 0;
    let walterY = 0;
    const stepSize = 100; // Larger step size for faster movement

    function spawnSkyler() {
        const roof = document.querySelector('.roof');
        const roofRect = roof.getBoundingClientRect();
        const skylerRect = skyler.getBoundingClientRect();
        
        const x = Math.random() * (roofRect.width - skylerRect.width);
        const y = Math.random() * (roofRect.height - skylerRect.height);
        
        skyler.style.left = `${x}px`;
        skyler.style.top = `${y}px`;
        skyler.style.display = 'block';

        // Remove existing timeout
        if (skylerTimeout) {
            clearTimeout(skylerTimeout);
        }

        // Set timeout for Skyler to disappear
        skylerTimeout = setTimeout(() => {
            skyler.style.display = 'none'; 
            // Make sure a new Skyler appears immediately after disappearing
            spawnSkyler();
        }, 4000); // Skyler visible for 4 seconds
    }

    function moveWalter(deltaX, deltaY) {
        const roof = document.querySelector('.roof');
        const roofRect = roof.getBoundingClientRect();
        const walterRect = walter.getBoundingClientRect();
        
        walterX += deltaX;
        walterY += deltaY;

        if (walterX < 0) walterX = 0;
        if (walterX > roofRect.width - walterRect.width) walterX = roofRect.width - walterRect.width;
        if (walterY < 0) walterY = 0;
        if (walterY > roofRect.height - walterRect.height) walterY = roofRect.height - walterRect.height;

        walter.style.left = `${walterX}px`;
        walter.style.top = `${walterY}px`;
    }

    function checkCollision() {
        const walterRect = walter.getBoundingClientRect();
        const skylerRect = skyler.getBoundingClientRect();
        
        if (
            walterRect.left < skylerRect.left + skylerRect.width &&
            walterRect.left + walterRect.width > skylerRect.left &&
            walterRect.top < skylerRect.top + skylerRect.height &&
            walterRect.top + walterRect.height > skylerRect.top
        ) {
            score += 1;
            scoreElement.textContent = `Caught Skylers: ${score}/20`;
            walterSound.play(); // Play sound on collision
            skyler.style.display = 'none'; 
            spawnSkyler(); 

            if (score >= 20) {
                endGame(true); // End the game early if goal is reached
            }
        }
    }

    function endGame(win = false) {
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        clearTimeout(skylerTimeout);
        skyler.style.display = 'none';
        backgroundMusic.pause(); // Stop background music
        
        if (win) {
            messageElement.textContent = 'Good job! Walter would share his pizza with you.';
        } else {
            messageElement.textContent = "Game Over! You're the next one on Walter's kill list.";
        }
        retryButton.style.display = 'block'; 
    }

    function startGame() {
        score = 0;
        timer = 25; 
        scoreElement.textContent = `Caught Skylers: ${score}/20`;
        timerElement.textContent = `Time: ${timer}`;
        messageElement.textContent = '';
        retryButton.style.display = 'none'; 
        startButton.style.display = 'none'; 

        walterX = 0;
        walterY = 0;
        walter.style.left = `${walterX}px`;
        walter.style.top = `${walterY}px`;

        spawnSkyler(); 

        backgroundMusic.loop = true; // Loop background music
        backgroundMusic.play(); // Start background music

        gameInterval = setInterval(checkCollision, 100);
        timerInterval = setInterval(() => {
            timer -= 1;
            timerElement.textContent = `Time: ${timer}`;
            if (timer <= 0 && score < 20) {
                endGame(); // End game if time runs out
            }
        }, 1000);
    }

    document.addEventListener('keydown', (event) => {
        event.preventDefault(); // Prevent page scrolling with arrow keys
        if (event.key === 'ArrowLeft') {
            moveWalter(-stepSize, 0);
        } else if (event.key === 'ArrowRight') {
            moveWalter(stepSize, 0);
        } else if (event.key === 'ArrowUp') {
            moveWalter(0, -stepSize);
        } else if (event.key === 'ArrowDown') {
            moveWalter(0, stepSize);
        }
    });

    retryButton.addEventListener('click', () => {
        startGame();
    });

    startButton.addEventListener('click', () => {
        startGame();
    });

    startButton.style.display = 'block';
});
