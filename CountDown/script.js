const startButton = document.getElementById('startButton');
const historyButton = document.getElementById('historyButton');
const countdownDisplay = document.getElementById('countdownDisplay');
const historyDisplay = document.getElementById('historyDisplay');
const dateInput = document.getElementById('dateInput');
const timeInput = document.getElementById('timeInput');

let countdownInterval;
let history = [];

startButton.addEventListener('click', () => {
    const selectedDate = new Date(`${dateInput.value} ${timeInput.value}`).getTime();

    if (isNaN(selectedDate)) {
        alert('Please select a valid date and time.');
        return;
    }

    clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const timeLeft = selectedDate - now;

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            countdownDisplay.textContent = 'Countdown expired!';
            history.push(`Countdown expired on ${new Date().toLocaleString()}`);
            
            // Notify and play a sound
            if ('Notification' in window) {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        new Notification('Countdown Expired', {
                            body: 'Your countdown has expired.',
                            icon: 'notification-icon.png' // Add your notification icon URL
                        });
                    }
                });
            }
            
            const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3'); // Add your notification sound file URL
            audio.play();

            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        countdownDisplay.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        countdownDisplay.innerHTML += `<br>(${formattedTime})`;
    }, 1000);
});

historyButton.addEventListener('click', () => {
    historyDisplay.innerHTML = '';
    if (history.length === 0) {
        historyDisplay.innerHTML = '<p>No countdown history yet.</p>';
        return;
    }
    const ul = document.createElement('ul');
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
    });
    historyDisplay.appendChild(ul);
});
