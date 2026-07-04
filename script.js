let wheelData = [];
let isSpinning = false;

const jsonInput = document.getElementById('jsonInput');
const spinButton = document.getElementById('spinButton');
const wheelCanvas = document.getElementById('wheelCanvas');
const resultDiv = document.getElementById('result');
const errorMessage = document.getElementById('errorMessage');
const uploadBox = document.querySelector('.upload-box');

// Set canvas size based on container
function resizeCanvas() {
    const rect = wheelCanvas.parentElement.getBoundingClientRect();
    wheelCanvas.width = Math.min(500, rect.width - 20);
    wheelCanvas.height = wheelCanvas.width;
}

// Color palette for wheel segments
const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#85C1E2',
    '#E8DAEF', '#D5F4E6', '#FADBD8', '#FCF3CF', '#D6EAF8'
];

// Handle file upload
jsonInput.addEventListener('change', handleFileUpload);
uploadBox.addEventListener('click', () => jsonInput.click());

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            wheelData = JSON.parse(content);

            // Validate data format
            if (!Array.isArray(wheelData)) {
                throw new Error('JSON must be an array');
            }

            if (wheelData.length === 0) {
                throw new Error('Array cannot be empty');
            }

            // Ensure all items are strings
            wheelData = wheelData.map(item => String(item));

            showError('');
            spinButton.disabled = false;
            resultDiv.textContent = 'Ready to spin!';
            resizeCanvas();
            drawWheel();
        } catch (error) {
            showError('Invalid JSON format. Expected: ["Person", "Person2", "Person1"]');
            spinButton.disabled = true;
            wheelData = [];
        }
    };
    reader.readAsText(file);
}

function showError(message) {
    if (message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
    } else {
        errorMessage.classList.remove('show');
        errorMessage.textContent = '';
    }
}

function drawWheel(rotation = 0) {
    const ctx = wheelCanvas.getContext('2d');
    const centerX = wheelCanvas.width / 2;
    const centerY = wheelCanvas.height / 2;
    const radius = Math.min(wheelCanvas.width, wheelCanvas.height) / 2 - 10;

    ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);

    const sliceAngle = (2 * Math.PI) / wheelData.length;

    // Draw segments
    wheelData.forEach((item, index) => {
        const startAngle = sliceAngle * index + rotation;
        const endAngle = startAngle + sliceAngle;

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw text
        const textAngle = startAngle + sliceAngle / 2;
        const textX = centerX + Math.cos(textAngle) * (radius * 0.6);
        const textY = centerY + Math.sin(textAngle) * (radius * 0.6);

        ctx.save();
        ctx.translate(textX, textY);
        ctx.rotate(textAngle + Math.PI / 2);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Add text shadow for better readability
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 3;

        ctx.fillText(item, 0, 0);
        ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw pointer at top
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.moveTo(centerX, 10);
    ctx.lineTo(centerX - 10, 30);
    ctx.lineTo(centerX + 10, 30);
    ctx.closePath();
    ctx.fill();
}

// Spin the wheel
spinButton.addEventListener('click', spinWheel);

function spinWheel() {
    if (isSpinning || wheelData.length === 0) return;

    isSpinning = true;
    spinButton.disabled = true;
    spinButton.classList.add('spinning');

    // Random spins between 5-8 full rotations
    const rotations = 5 + Math.random() * 3;
    const randomStop = Math.random() * (2 * Math.PI);
    const totalRotation = rotations * 2 * Math.PI + randomStop;

    const spinDuration = 4000; // 4 seconds
    const startTime = Date.now();
    let lastRotation = 0;

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);

        // Easing function for smooth deceleration
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentRotation = totalRotation * easeProgress;

        drawWheel(currentRotation);
        lastRotation = currentRotation;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            spinButton.disabled = false;
            spinButton.classList.remove('spinning');

            // Determine winner
            const winningIndex = Math.floor(
                (wheelData.length - (randomStop / ((2 * Math.PI) / wheelData.length))) % wheelData.length
            );
            const winner = wheelData[winningIndex];
            resultDiv.textContent = `🎉 ${winner} wins! 🎉`;
        }
    }

    animate();
}

// Handle window resize
window.addEventListener('resize', () => {
    if (wheelData.length > 0) {
        resizeCanvas();
        drawWheel();
    }
});

// Initial setup
resizeCanvas();