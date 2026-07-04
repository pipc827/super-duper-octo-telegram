let wheelData = [];
let isSpinning = false;
let spinCount = 0;

const jsonInput = document.getElementById('jsonInput');
const spinButton = document.getElementById('spinButton');
const wheelCanvas = document.getElementById('wheelCanvas');
const resultDiv = document.getElementById('result');
const errorMessage = document.getElementById('errorMessage');
const uploadBox = document.querySelector('.upload-box');
const wheelSection = document.getElementById('wheelSection');

function resizeCanvas() {
    const rect = wheelCanvas.parentElement.getBoundingClientRect();
    const size = Math.min(500, rect.width - 20);
    wheelCanvas.width = size;
    wheelCanvas.height = size;
}

const colors = [
    '#00d9ff', '#0099cc', '#ff006e', '#00ff88', '#ffaa00',
    '#ff3366', '#00ccff', '#ff0099', '#66ff00', '#ff6600'
];

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

            if (!Array.isArray(wheelData)) {
                throw new Error('JSON must be an array');
            }

            if (wheelData.length === 0) {
                throw new Error('Array cannot be empty');
            }

            wheelData = wheelData.map(item => String(item));

            showError('');
            spinButton.disabled = false;
            resultDiv.textContent = '🚀 Ready to spin';
            wheelSection.style.display = 'block';
            spinCount = 0;
            resizeCanvas();
            drawWheel();
            updateStats();
        } catch (error) {
            showError('Invalid JSON format');
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

    wheelData.forEach((item, index) => {
        const startAngle = sliceAngle * index + rotation;
        const endAngle = startAngle + sliceAngle;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();
        ctx.strokeStyle = '#0a0e27';
        ctx.lineWidth = 3;
        ctx.stroke();

        const textAngle = startAngle + sliceAngle / 2;
        const textX = centerX + Math.cos(textAngle) * (radius * 0.65);
        const textY = centerY + Math.sin(textAngle) * (radius * 0.65);

        ctx.save();
        ctx.translate(textX, textY);
        ctx.rotate(textAngle + Math.PI / 2);

        ctx.fillStyle = '#0a0e27';
        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 217, 255, 0.5)';
        ctx.shadowBlur = 4;

        ctx.fillText(item, 0, 0);
        ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(centerX, centerY, 22, 0, 2 * Math.PI);
    ctx.fillStyle = '#0a0e27';
    ctx.fill();
    ctx.strokeStyle = '#00d9ff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ff006e';
    ctx.beginPath();
    ctx.moveTo(centerX, 8);
    ctx.lineTo(centerX - 10, 30);
    ctx.lineTo(centerX + 10, 30);
    ctx.closePath();
    ctx.fill();
}

spinButton.addEventListener('click', spinWheel);

function spinWheel() {
    if (isSpinning || wheelData.length === 0) return;

    isSpinning = true;
    spinButton.disabled = true;
    spinCount++;

    const rotations = 5 + Math.random() * 3;
    const randomStop = Math.random() * (2 * Math.PI);
    const totalRotation = rotations * 2 * Math.PI + randomStop;

    const spinDuration = 4000;
    const startTime = Date.now();

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);

        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentRotation = totalRotation * easeProgress;

        drawWheel(currentRotation);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            spinButton.disabled = false;

            const winningIndex = Math.floor(
                (wheelData.length - (randomStop / ((2 * Math.PI) / wheelData.length))) % wheelData.length
            );
            const winner = wheelData[winningIndex];
            resultDiv.textContent = `✨ ${winner.toUpperCase()} ✨`;
            updateStats();
        }
    }

    animate();
}

function updateStats() {
    document.getElementById('itemCount').textContent = wheelData.length;
    document.getElementById('spinCount').textContent = spinCount;
}

window.addEventListener('resize', () => {
    if (wheelData.length > 0) {
        resizeCanvas();
        drawWheel();
    }
});

resizeCanvas();