// DANS script.js

const canvas = document.getElementById('roueCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const resultatDiv = document.getElementById('resultat');

// --- DARES (ENGLISH FINAL VERSION) ---
const gages = [
    { text: "Post Comic Sans story\n& justify crime", color: "#FF6347" }, 
    { text: "Change profile pic to a\ndistorted logo (Aspect Ratio)", color: "#6A5ACD" }, 
    { text: "Read 5 lines without breathing\n(Leading critique)", color: "#3A0CA3" }, 
    { text: "Shout 'Help! Contrast!'\n(WCAG Rule)", color: "#4361EE" }, 
    { text: "Walk like a robot\n& explain the grid", color: "#4CC9F0" }, 
    { text: "3 aggressive accessories\n: explain color limit", color: "#F72585" }, 
    { text: "Kerning error message to \nboss/prof\n+ whisper 'The crime is \nperfect.'", color: "#7209B7" }, 
    { text: "Do an ultra-cliched pose\nand critique the design", color: "#3A0CA3" }, 
];
// ---------------------------------------------------

const numGages = gages.length;
const arc = Math.PI / (numGages / 2); 
let angleRotation = 0; 
let isSpinning = false;

// --- FONCTIONS CLÉS ---
function resizeCanvas() {
    const size = canvas.clientWidth; 
    canvas.width = size;
    canvas.height = size;
    drawWheel(); 
}

function drawWheel() {
    const size = canvas.width; // Taille dynamique
    const radius = size / 2; // Rayon dynamique
    // Ajustement de la hauteur de ligne pour compenser la taille de la police
    const line_height = size * 0.035; 

    ctx.clearRect(0, 0, size, size); 
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;

    const startAngleOffset = -(Math.PI / 2); 

    for (let i = 0; i < numGages; i++) {
        const angle = angleRotation + i * arc + startAngleOffset;
        
        ctx.beginPath();
        ctx.arc(radius, radius, radius, angle, angle + arc); 
        ctx.lineTo(radius, radius);
        ctx.closePath();
        
        ctx.fillStyle = gages[i].color; 
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(radius, radius); 
        
        const textAngle = angle + arc / 2;
        ctx.rotate(textAngle);
        
        ctx.textAlign = 'center'; 
        ctx.fillStyle = '#fff';
        
        // Taille de police AUGMENTÉE pour garantir la lisibilité sur mobile
        ctx.font = 'bold ' + (size * 0.030) + 'px Arial'; 
        
        const lines = gages[i].text.split('\n');
        let startY = 0 - (lines.length * line_height / 2) + (line_height / 2); 

        for (let j = 0; j < lines.length; j++) {
            // Utilisation d'un facteur 0.70 pour centrer le texte dans le segment
            ctx.fillText(lines[j], radius * 0.70, startY + (j * line_height));
        }
        
        ctx.restore();
    }
}

function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;
    spinButton.disabled = true;
    resultatDiv.textContent = "The wheel is spinning..."; 

    const randomGageIndex = Math.floor(Math.random() * numGages);
    
    const centerAngleRad = randomGageIndex * arc + arc / 2;

    const randomOffsetRad = (Math.random() - 0.5) * arc * 0.8;
    const targetAngleRadWithRandom = centerAngleRad + randomOffsetRad;

    const targetAngleDegrees = targetAngleRadWithRandom * (180 / Math.PI); 

    const baseAngle = 360 * 5; 
    let totalRotation = baseAngle + targetAngleDegrees;

    canvas.style.transform = `rotate(-${totalRotation}deg)`;

    setTimeout(() => {
        isSpinning = false;
        spinButton.disabled = false;
        
        const winningGage = gages[randomGageIndex];
        resultatDiv.innerHTML = `Bravo. It landed on you.<br>Your dare is: <strong>${winningGage.text.replace(/\n/g, ' ')}</strong> 😬`;

        canvas.style.transition = 'none';
        canvas.style.transform = `rotate(-${targetAngleDegrees}deg)`; 
        setTimeout(() => {
            canvas.style.transition = 'transform 5s cubic-bezier(0.2, 0.8, 0.4, 1)';
        }, 50);

    }, 5000); 
}

// --- INITIALISATION RESPONSIVE ---
window.addEventListener('load', resizeCanvas); 
window.addEventListener('resize', resizeCanvas); 
spinButton.addEventListener('click', spinWheel);