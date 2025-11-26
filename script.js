// Début de script.js

const canvas = document.getElementById('roueCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const resultatDiv = document.getElementById('resultat');

// --- DARES (ENGLISH FINAL VERSION) ---
const gages = [
    { text: "Post Comic Sans story\n& justify the crime", color: "#FF6347" }, 
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

// DANS script.js

function drawWheel() {
    const size = canvas.width;
    const radius = size / 2;
    // L'espacement vertical (line_height) doit être un peu plus petit que la taille de la police
    const line_height = size * 0.030; 

    ctx.clearRect(0, 0, size, size); 
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;

    const startAngleOffset = -(Math.PI / 2); 

    for (let i = 0; i < numGages; i++) {
        const angle = angleRotation + i * arc + startAngleOffset;
        
        // Dessin du segment (Inchangé)
        ctx.beginPath();
        ctx.arc(radius, radius, radius, angle, angle + arc); 
        ctx.lineTo(radius, radius);
        ctx.closePath();
        
        ctx.fillStyle = gages[i].color; 
        ctx.fill();
        ctx.stroke();

        // --- NOUVELLE PRÉSENTATION RADIALE ---
        ctx.save();
        ctx.translate(radius, radius); 
        
        // 1. Rotation pour centrer le segment (et orienter l'axe de lecture)
        const segmentCenterAngle = angle + arc / 2;
        ctx.rotate(segmentCenterAngle);
        
        // 2. Annuler la rotation de 90 degrés pour que le texte soit LU HORIZONTALEMENT 
        //    (aligné avec le rayon, de l'intérieur vers l'extérieur).
        ctx.rotate(Math.PI / 2); 

        // Règle de style
        ctx.textAlign = 'center'; // Centré par rapport à l'axe vertical du segment
        ctx.fillStyle = '#fff';
        ctx.font = 'bold ' + (size * 0.025) + 'px Arial'; 
        
        // Préparation multi-lignes
        const lines = gages[i].text.split('\n');
        
        // Point de départ X (décalage du texte du centre de la roue)
        const startX = radius * 0.35; // Commence à 35% du rayon du centre
        
        // Point de départ Y (pour centrer verticalement le bloc de texte)
        let startY = 0 - (lines.length * line_height / 2); 

        for (let j = 0; j < lines.length; j++) {
            // Dessine chaque ligne horizontalement le long du rayon
            ctx.fillText(lines[j], startX + radius * 0.25, startY + (j * line_height)); 
        }
        
        ctx.restore();
    }
}
// ... (le reste du code JS reste le même) ...

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
// CES LIGNES GARANTISSENT QUE LA ROUE SE DESSINE AU DÉPART ET AU REDIMENSIONNEMENT
window.addEventListener('load', resizeCanvas); 
window.addEventListener('resize', resizeCanvas); 
spinButton.addEventListener('click', spinWheel);